# app/agent.py
import app.config
from google.adk.apps import App
from google.adk.workflow import Workflow, JoinNode
import json
import re
from google.adk.workflow import node
from google.genai import types

from app.tools import fetch_tokenomics_data, fetch_onchain_metrics, fetch_holder_analytics
from google import genai
from google.genai import errors
import tenacity

_genai_client = genai.Client(api_key=app.config.GOOGLE_API_KEY)

@tenacity.retry(
    wait=tenacity.wait_exponential(multiplier=1, min=2, max=10),
    stop=tenacity.stop_after_attempt(5),
    retry=tenacity.retry_if_exception_type(errors.APIError)
)
def call_gemini(system_prompt: str, user_content: str) -> str:
    response = _genai_client.models.generate_content(
        model='gemini-2.5-flash',
        contents=user_content,
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            temperature=0.0,
        ),
    )
    return response.text

class InvalidDataError(Exception):
    """Custom exception raised when workers return malformed or conversational data."""
    pass

# ── Instruction Prompts (preserved from original LlmAgent definitions) ──

TOKENOMICS_INSTRUCTION = (
    "You are a quantitative tokenomics analyst. Your only job is to identify supply threats. "
    "You will be provided with raw JSON data regarding token allocation, vesting schedules, and upcoming unlocks. "
    "You must identify if the team/insiders hold more than 20% of the supply, or if an unlock event exceeding "
    "5% of circulating supply is happening within 30 days. Output your findings strictly as a JSON array of "
    "critical threat strings. Do not invent data.\n\n"
    "CRITICAL: You are an API-bound worker. You must NEVER include conversational filler, preambles, or explanations. "
    "Your entire response must be a valid, parseable JSON array of strings. If no risks are found, return an empty array []. "
    "If you include even one word of conversational text, the system will fail. Output NOTHING except the JSON."
)

ONCHAIN_INSTRUCTION = (
    "You are a forensic blockchain investigator. You analyze live on-chain data focusing on liquidity and wallet concentration. "
    "You will be provided with liquidity metrics and holder distributions. "
    "You must flag if liquidity is NOT locked, if total liquidity is under $50k USD, or if the top 10 wallets "
    "hold more than 30% of the supply. Output your findings strictly as a JSON array of critical threat strings. "
    "Do not invent data.\n\n"
    "CRITICAL: You are an API-bound worker. You must NEVER include conversational filler, preambles, or explanations. "
    "Your entire response must be a valid, parseable JSON array of strings. If no risks are found, return an empty array []. "
    "If you include even one word of conversational text, the system will fail. Output NOTHING except the JSON."
)

FORENSIC_INSTRUCTION = (
    "You are a blockchain forensic analyst. You specialize in Insider Clustering and finding developer bundling. "
    "You will receive JSON data regarding the funding sources of token holders. "
    "You must flag any insider clustering or suspicious funding patterns. "
    "Output your findings strictly as a JSON array of critical threat strings. Do not invent data.\n\n"
    "CRITICAL: You are an API-bound worker. You must NEVER include conversational filler, preambles, or explanations. "
    "Your entire response must be a valid, parseable JSON array of strings. If no risks are found, return an empty array []. "
    "If you include even one word of conversational text, the system will fail. Output NOTHING except the JSON."
)

SYNTHESIS_INSTRUCTION = (
    "You are the Chief Risk Officer. You receive raw threat arrays from the tokenomics, on-chain, and forensic clustering agents. "
    "Your job is to synthesize these findings into a final, professional markdown report called 'BlackSwan Risk Report'. "
    "The report must include an executive summary, a breakdown of tokenomics threats, a breakdown of on-chain threats, "
    "a section explicitly highlighting 'Insider Wallet Clustering & Developer Bundling' based on the forensic data, "
    "and a final 'Risk Score' out of 100 based on the severity of findings.\n\n"
    "CRITICAL: You are a reporting engine. You will receive structured JSON inputs. You must compile this analysis into ONLY a Markdown report. "
    "Leave the final payload organization to the FastAPI gateway layer. Do not output anything outside of the markdown text. "
    "Do not include 'Here is the report' or any introductory/closing text. "
    "Start your response immediately with '# BlackSwan Risk Report'. Ensure the output is strictly formatted markdown."
)

# ── Helpers ──────────────────────────────────────────────────────────────

def _get_text(node_input) -> str:
    """Extract plain text from any node input type."""
    if isinstance(node_input, str):
        return node_input
    if isinstance(node_input, types.Content):
        return "".join(
            part.text for part in (node_input.parts or []) if part and part.text
        )
    return str(node_input)


def _extract_token_address(text: str) -> str:
    """Pull a 0x-prefixed Ethereum address or Base58 Solana address out of the input text."""
    # 1. Try EVM (Ethereum) address
    match = re.search(r'0x[a-fA-F0-9]{40}', text)
    if match:
        return match.group(0)
    
    # 2. Try Solana address (Base58, typically 32-44 chars)
    match = re.search(r'[1-9A-HJ-NP-Za-km-z]{32,44}', text)
    if match:
        return match.group(0)

    # 3. Fallback: shorter hex string
    match = re.search(r'0x[a-fA-F0-9]+', text)
    if match:
        return match.group(0)
        
    raise ValueError(f"Could not extract token address from: {text}")


def _extract_json(text: str) -> str:
    """Extract JSON from LLM output that may contain code fences, preamble, or duplicated content."""
    text = text.strip()

    # Strategy 1: Direct parse (best case)
    try:
        json.loads(text)
        return text
    except (json.JSONDecodeError, ValueError):
        pass

    # Strategy 2: Extract from markdown code fence
    fence_pattern = r'```(?:json)?\s*\n?(.*?)\n?\s*```'
    match = re.search(fence_pattern, text, re.DOTALL)
    if match:
        candidate = match.group(1).strip()
        try:
            json.loads(candidate)
            return candidate
        except (json.JSONDecodeError, ValueError):
            pass

    # Strategy 3: Find the first JSON array in the raw text
    bracket_pattern = r'(\[.*?\])'
    match = re.search(bracket_pattern, text, re.DOTALL)
    if match:
        candidate = match.group(1).strip()
        try:
            json.loads(candidate)
            return candidate
        except (json.JSONDecodeError, ValueError):
            pass

    # Fallback: return stripped text and let the caller handle the error
    return text


# ── Workflow Nodes (replacing LlmAgent with NVIDIA calls) ────────────────

@node
def tokenomics_risk_node(node_input) -> str:
    """Fetch tokenomics data and analyze it via NVIDIA Nemotron."""
    text = _get_text(node_input)
    token_address = _extract_token_address(text)

    # Call the tool directly (deterministic, no LLM tool-calling needed)
    tool_result = fetch_tokenomics_data(token_address)

    # Send tool output to Gemini for analysis
    response = call_gemini(
        TOKENOMICS_INSTRUCTION,
        f"Analyze this tokenomics data:\n{json.dumps(tool_result, indent=2)}"
    )
    return response


@node
def onchain_risk_node(node_input) -> str:
    """Fetch on-chain metrics and analyze them via NVIDIA Nemotron."""
    text = _get_text(node_input)
    token_address = _extract_token_address(text)

    # Call the tool directly
    tool_result = fetch_onchain_metrics(token_address)

    # Send tool output to Gemini for analysis
    response = call_gemini(
        ONCHAIN_INSTRUCTION,
        f"Analyze this on-chain data:\n{json.dumps(tool_result, indent=2)}"
    )
    return response


@node
def forensic_clustering_agent(node_input) -> str:
    """Fetch forensic clustering data and analyze it via Gemini."""
    text = _get_text(node_input)
    token_address = _extract_token_address(text)

    # Call the tool directly
    tool_result = fetch_holder_analytics(token_address)

    # Send tool output to Gemini for analysis
    response = call_gemini(
        FORENSIC_INSTRUCTION,
        f"Analyze this holder clustering data:\n{json.dumps(tool_result, indent=2)}"
    )
    return response


@node
def validate_and_synthesize(node_input: dict) -> str:
    """Validate worker outputs and merge them into a single JSON payload."""
    validated_data = {}
    for agent_name, content in node_input.items():
        if isinstance(content, (list, dict)):
            parsed = content
        else:
            if isinstance(content, types.Content):
                text = "".join(part.text for part in content.parts if part and part.text) if content.parts else ""
            else:
                text = str(content)

            text = _extract_json(text)
            try:
                parsed = json.loads(text)
            except json.JSONDecodeError as e:
                raise InvalidDataError(f"Agent {agent_name} returned malformed data or conversational string: {text}") from e

        if not isinstance(parsed, list):
            raise InvalidDataError(f"Agent {agent_name} returned non-array JSON: {parsed}")
        validated_data[agent_name] = parsed
            
    return json.dumps(validated_data, indent=2)


@node
def risk_synthesis_node(node_input) -> types.Content:
    """Synthesize validated risk data into a final markdown report via Gemini."""
    text = _get_text(node_input)
    response = call_gemini(
        SYNTHESIS_INSTRUCTION,
        f"Here are the validated risk findings:\n{text}"
    )
    return types.Content(role="model", parts=[types.Part(text=response)])


# ── Workflow Graph (structure preserved exactly) ─────────────────────────

join = JoinNode(name="merge")

root_agent = Workflow(
    name="blackswan_risk_engine",
    edges=[
        ('START', (tokenomics_risk_node, onchain_risk_node, forensic_clustering_agent)),
        ((tokenomics_risk_node, onchain_risk_node, forensic_clustering_agent), join),
        (join, validate_and_synthesize),
        (validate_and_synthesize, risk_synthesis_node)
    ]
)

app = App(name="app", root_agent=root_agent)