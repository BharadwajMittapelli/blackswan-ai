# app/fast_api_app.py
import uuid
import logging
import time

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

from app.agent import root_agent, InvalidDataError

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logger = logging.getLogger("blackswan_api")
logging.basicConfig(level=logging.INFO)

# ---------------------------------------------------------------------------
# Pydantic request model – strict: rejects any extra / unexpected fields
# ---------------------------------------------------------------------------
class RiskRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    token_address: str

# ---------------------------------------------------------------------------
# ADK Runner (singleton, reused across requests)
# ---------------------------------------------------------------------------
session_service = InMemorySessionService()
runner = Runner(
    agent=root_agent,
    app_name="blackswan_risk_engine",
    session_service=session_service,
)

# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------
fast_app = FastAPI(
    title="BlackSwan AI – Risk Engine API",
    description="Production REST API for the BlackSwan ADK 2.0 crypto risk workflow.",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# Caching
# ---------------------------------------------------------------------------
response_cache = {}
CACHE_TTL = 300

# ---------------------------------------------------------------------------
# CORS – allow all origins for the MVP, but lock methods to POST + OPTIONS
# ---------------------------------------------------------------------------
fast_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Async helper that runs the ADK workflow
# ---------------------------------------------------------------------------
async def _run_workflow_async(token_address: str) -> str:
    """Execute the ADK workflow and return the final report."""
    user_id = f"user_{uuid.uuid4().hex[:8]}"
    session = await session_service.create_session(
        app_name="blackswan_risk_engine",
        user_id=user_id,
    )

    user_message = types.Content(
        role="user",
        parts=[types.Part(text=f"Analyze token: {token_address}")],
    )

    final_response = ""
    async for event in runner.run_async(
        user_id=user_id,
        session_id=session.id,
        new_message=user_message,
    ):
        if event.is_final_response():
            if event.content and event.content.parts:
                for part in event.content.parts:
                    if part.text:
                        final_response += part.text

    return final_response

# ---------------------------------------------------------------------------
# POST /api/v1/analyze – the single entry point
# ---------------------------------------------------------------------------
@fast_app.post("/api/v1/analyze")
async def analyze_token(request: RiskRequest):
    token = request.token_address
    now = time.time()
    
    # Check cache
    if token in response_cache:
        cached_report, timestamp = response_cache[token]
        if now - timestamp < CACHE_TTL:
            return {"status": "success", "report": cached_report, "cached": True}
            
    # Run the actual ADK workflow instead of mocking it
    try:
        report = await _run_workflow_async(token)
    except Exception as e:
        logger.error(f"Error during ADK workflow: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
        
    # Store in cache
    response_cache[token] = (report, now)
    
    return {"status": "success", "report": report}

# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(fast_app, host="0.0.0.0", port=8000)
