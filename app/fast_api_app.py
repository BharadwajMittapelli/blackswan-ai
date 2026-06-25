# app/fast_api_app.py
import uuid
import logging

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
    # Mocking the AI service to bypass regional free-tier restrictions.
    import asyncio
    await asyncio.sleep(2) # Simulate network delay
    
    mock_report = """# BlackSwan Risk Report
## 🚨 Threat Analysis: 0x4206931337dc273a630d328dA6441786BfaD668f

### 1. Tokenomics Vulnerabilities
- **High Founder Allocation**: The deployer wallet holds 30% of the total supply, presenting a massive dump risk.
- **No Vesting**: There is no locked liquidity or vesting schedule for the team tokens.

### 2. On-Chain Metrics
- **Liquidity Concentration**: The top 3 wallets hold 85% of the available liquidity.
- **Honeypot Risk**: The contract contains a hidden `mint` function which allows the creator to infinitely print new tokens and crash the price.

### Conclusion
**[CRITICAL RISK]** This token has severe centralization and dump risks. Investment is strictly advised against.
"""
    return {"status": "success", "report": mock_report}

# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(fast_app, host="0.0.0.0", port=8000)
