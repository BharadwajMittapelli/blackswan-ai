# app/nvidia_llm.py
"""
NVIDIA Nemotron API wrapper using OpenAI-compatible client.
Provides a simple interface for the workflow nodes to call the NVIDIA LLM.
"""
import os
import logging
from openai import OpenAI

logger = logging.getLogger("blackswan_nvidia")

NVIDIA_MODEL = "nvidia/nemotron-3-ultra-550b-a55b"
NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"


def _get_client() -> OpenAI:
    """Create an OpenAI client configured for NVIDIA's API."""
    api_key = os.getenv("NVIDIA_API_KEY")
    if not api_key:
        raise ValueError(
            "NVIDIA_API_KEY is missing. Set it in your .env file."
        )
    return OpenAI(base_url=NVIDIA_BASE_URL, api_key=api_key)


def call_nvidia(system_prompt: str, user_content: str) -> str:
    """
    Send a system + user message to NVIDIA Nemotron and return the
    assistant's text response.
    """
    client = _get_client()
    logger.info("Calling NVIDIA %s ...", NVIDIA_MODEL)

    completion = client.chat.completions.create(
        model=NVIDIA_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content},
        ],
        temperature=1,
        top_p=0.95,
        max_tokens=16384,
        extra_body={"chat_template_kwargs": {"enable_thinking": True}, "reasoning_budget": 16384},
        stream=True
    )

    final_content = []
    
    for chunk in completion:
        if not chunk.choices:
            continue
            
        # We can ignore reasoning content for the final JSON output
        # but the API might send it if we enabled thinking
        
        delta = chunk.choices[0].delta
        if getattr(delta, "content", None) is not None:
            final_content.append(delta.content)

    result = "".join(final_content)
    logger.info("NVIDIA response received (%d chars)", len(result))
    return result
