# app/agent.py
import app.config
from google.adk.agents import LlmAgent
from google.adk.apps import App
from google.adk.workflow import Workflow, JoinNode
import json
from pydantic import BaseModel
from typing import List, Dict, Any
from google.adk.workflow import node
from google.genai import types

from app.tools import fetch_tokenomics_data, fetch_onchain_metrics

class ThreatList(BaseModel):
    critical_threats: List[str]

class InvalidDataError(Exception):
    """Custom exception raised when workers return malformed or conversational data."""
    pass

tokenomics_risk_agent = LlmAgent(
    name="tokenomics_risk_agent",
    model="gemini-2.5-pro",
    instruction=(
        "You are a quantitative tokenomics analyst. Your only job is to identify supply threats. "
        "You will be provided with raw JSON data regarding token allocation, vesting schedules, and upcoming unlocks. "
        "You must identify if the team/insiders hold more than 20% of the supply, or if an unlock event exceeding "
        "5% of circulating supply is happening within 30 days. Output your findings strictly as a JSON array of "
        "critical threat strings. Do not invent data.\n\n"
        "CRITICAL: You are an API-bound worker. You must NEVER include conversational filler, preambles, or explanations. "
        "Your entire response must be a valid, parseable JSON array of strings. If no risks are found, return an empty array []. "
        "If you include even one word of conversational text, the system will fail. Output NOTHING except the JSON."
    ),
    tools=[fetch_tokenomics_data]
)

on_chain_risk_agent = LlmAgent(
    name="on_chain_risk_agent",
    model="gemini-2.5-pro",
    instruction=(
        "You are a forensic blockchain investigator. You analyze live on-chain data focusing on liquidity and wallet concentration. "
        "You will be provided with liquidity metrics and holder distributions. "
        "You must flag if liquidity is NOT locked, if total liquidity is under $50k USD, or if the top 10 wallets "
        "hold more than 30% of the supply. Output your findings strictly as a JSON array of critical threat strings. "
        "Do not invent data.\n\n"
        "CRITICAL: You are an API-bound worker. You must NEVER include conversational filler, preambles, or explanations. "
        "Your entire response must be a valid, parseable JSON array of strings. If no risks are found, return an empty array []. "
        "If you include even one word of conversational text, the system will fail. Output NOTHING except the JSON."
    ),
    tools=[fetch_onchain_metrics]
)

risk_synthesis_llm = LlmAgent(
    name="risk_synthesis_agent",
    model="gemini-2.5-pro",
    instruction=(
        "You are the Chief Risk Officer. You receive raw threat arrays from the tokenomics and on-chain agents. "
        "Your job is to synthesize these findings into a final, professional markdown report called 'BlackSwan Risk Report'. "
        "The report must include an executive summary, a breakdown of tokenomics threats, a breakdown of on-chain threats, "
        "and a final 'Risk Score' out of 100 based on the severity of findings.\n\n"
        "CRITICAL: You are a reporting engine. You will receive structured JSON inputs. You must process these inputs and "
        "output ONLY a Markdown report. Do not include 'Here is the report' or any introductory/closing text. "
        "Start your response immediately with '# BlackSwan Risk Report'. Ensure the output is strictly formatted markdown."
    ),
    tools=[]
)

def _extract_json(text: str) -> str:
    """Extract JSON from LLM output that may contain code fences, preamble, or duplicated content."""
    import re
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

@node
def validate_and_synthesize(node_input: dict) -> str:
    validated_data = {}
    for agent_name, content in node_input.items():
        if isinstance(content, types.Content):
            text = "".join(part.text for part in content.parts if part.text)
        else:
            text = str(content)

        # Strip markdown code fences before parsing
        text = _extract_json(text)
            
        try:
            parsed = json.loads(text)
            if not isinstance(parsed, list):
                raise InvalidDataError(f"Agent {agent_name} returned non-array JSON: {parsed}")
            validated_data[agent_name] = parsed
        except json.JSONDecodeError as e:
            raise InvalidDataError(f"Agent {agent_name} returned malformed data or conversational string: {text}") from e
            
    return json.dumps(validated_data, indent=2)

join = JoinNode(name="merge")

root_agent = Workflow(
    name="blackswan_risk_engine",
    edges=[
        ('START', (tokenomics_risk_agent, on_chain_risk_agent)),
        ((tokenomics_risk_agent, on_chain_risk_agent), join),
        (join, validate_and_synthesize),
        (validate_and_synthesize, risk_synthesis_llm)
    ]
)

app = App(name="app", root_agent=root_agent)