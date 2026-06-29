import json
import asyncio
from google.adk.workflow import node
from google import genai
from google.genai import types
import tenacity
from google.genai import errors

import app.config
from app.schemas import ProjectDiligenceMatrix
from app.tools.static_analyzer import parse_source_code_patterns
from app.core.rag_engine import slice_context

_genai_client = genai.Client(api_key=app.config.GOOGLE_API_KEY)

SYSTEM_PROMPT = """
You are a technical educator and compiler diagnostics engine.
Your task is to analyze isolated code segments and write high-fidelity code breakdowns and refactoring blueprints.
Provide a detailed mechanical explanation of the code syntax pattern and state updates.
Provide step-by-step optimization guidelines to follow standard engineering best practices.
Your output MUST perfectly match the requested JSON schema.
"""

@tenacity.retry(
    wait=tenacity.wait_exponential(multiplier=1, min=2, max=65),
    stop=tenacity.stop_after_attempt(5),
    retry=tenacity.retry_if_exception_type(errors.APIError)
)
def call_gemini_structured(user_content: str) -> str:
    response = _genai_client.models.generate_content(
        model='gemini-2.5-flash',
        contents=user_content,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.0,
            response_mime_type="application/json",
            response_schema=ProjectDiligenceMatrix,
        ),
    )
    return response.text

@node
async def code_annotation_node(node_input) -> str:
    """
    Single-pass execution node for Code Annotation and Structural Documentation.
    Parses source code, slices context, and synthesis documentation via Gemini.
    """
    # Assuming node_input is the raw source code text
    if isinstance(node_input, str):
        contract_code = node_input
    else:
        # Fallback to string extraction if node_input is a Content object
        contract_code = "".join(part.text for part in node_input.parts if part and part.text) if hasattr(node_input, 'parts') else str(node_input)
    
    # 1. Structural Parsing
    parsed_patterns = await parse_source_code_patterns(contract_code)
    
    # 2. Context Slicing
    sliced_segments = slice_context(contract_code, parsed_patterns)
    
    # 3. Text Synthesis Node via Gemini
    user_payload = {
        "instruction": "Analyze the following code segments and generate structural documentation and optimization notes.",
        "segments": sliced_segments
    }
    
    gemini_response = call_gemini_structured(json.dumps(user_payload, indent=2))
    
    return gemini_response
