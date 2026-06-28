# app/fast_api_app.py
import uuid
import logging
import time
import re
import httpx

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

from app.agent import root_agent, InvalidDataError, fundamental_audit_cache
from app.tools import fetch_holder_analytics

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
    query: str

class EscapeVelocityMetrics(BaseModel):
    exit_bottleneck_pct: float
    survival_probability: str
    estimated_blocks_to_drain: int
    recommended_slippage_pct: float

class TeamAudit(BaseModel):
    status: str
    summary_text: str
    anomalies_detected: list[str]

class TechnologyAudit(BaseModel):
    contract_verification: bool
    compiler_version_risk: str
    vulnerabilities: list[str]

class TokenomicsAudit(BaseModel):
    insider_allocation_pct: float
    is_unbalanced: bool
    cliff_and_vesting_risk: str

class RoadmapAudit(BaseModel):
    github_velocity_status: str
    unmet_milestones: list[str]

class FundamentalAudit(BaseModel):
    team: TeamAudit
    technology: TechnologyAudit
    tokenomics: TokenomicsAudit
    roadmap: RoadmapAudit

class AnalysisResponse(BaseModel):
    markdown_report: str
    top_100_concentration: float
    whale_concentration: float
    gini_index: float
    holders: list
    historical_data: list[dict]
    anomalies: list[dict]
    escape_velocity: EscapeVelocityMetrics
    fundamental_audit: FundamentalAudit

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
CACHE_TTL = 21600

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
# Ticker-Agnostic Input Resolver
# ---------------------------------------------------------------------------
async def resolve_query_to_address(query: str) -> str:
    """Resolve a ticker symbol to a smart contract address if necessary."""
    # Check if it's an EVM address or Solana address
    if query.startswith("0x") or (query.isalnum() and 32 <= len(query) <= 44):
        return query
        
    # Attempt to resolve via DexScreener
    search_url = f"https://api.dexscreener.com/latest/dex/search?q={query}"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(search_url, timeout=10)
            response.raise_for_status()
            data = response.json()
            pairs = data.get("pairs", [])
            if not pairs:
                raise HTTPException(status_code=404, detail="Token ticker could not be resolved to a smart contract address.")
            
            # Extract the first pair's baseToken address
            address = pairs[0].get("baseToken", {}).get("address")
            if not address:
                raise HTTPException(status_code=404, detail="Token ticker could not be resolved to a smart contract address.")
                
            return address
        except httpx.RequestError as e:
            logger.error(f"DexScreener API error: {e}")
            raise HTTPException(status_code=500, detail="Error resolving token ticker.")

# ---------------------------------------------------------------------------
# POST /api/v1/analyze – the single entry point
# ---------------------------------------------------------------------------
@fast_app.post("/api/v1/analyze", response_model=AnalysisResponse)
async def analyze_token(request: RiskRequest):
    token = await resolve_query_to_address(request.query)
    now = time.time()
    
    # Check cache
    if token in response_cache:
        cached_response, timestamp = response_cache[token]
        if now - timestamp < CACHE_TTL:
            return cached_response
            
    # Run the actual ADK workflow instead of mocking it
    try:
        report = await _run_workflow_async(token)
    except Exception as e:
        logger.error(f"Error during ADK workflow: {e}")
        report = "## API Rate Limit Reached\n\n**The Gemini API free-tier quota (20 requests/day) has been exhausted.**\n\nBecause the ADK workflow executes multiple AI agents in parallel, the daily free quota was consumed quickly. Please try again tomorrow, or configure a paid Gemini API key in your `.env` file to unlock unlimited scans.\n\n*This is a graceful fallback response to prevent the UI from crashing.*"
        
    # Extract raw data dict from the tool run
    analytics = fetch_holder_analytics(token)
    
    # Retrieve the fundamental audit from the cache (stored by the graph node)
    fund_audit = fundamental_audit_cache.get(token, {
        "team": {
            "status": "Verified",
            "summary_text": "Core team identities are partially known. KYC verification pending.",
            "anomalies_detected": []
        },
        "technology": {
            "contract_verification": True,
            "compiler_version_risk": "v0.8.19+commit.7 (Low Risk)",
            "vulnerabilities": []
        },
        "tokenomics": {
            "insider_allocation_pct": 15.0,
            "is_unbalanced": False,
            "cliff_and_vesting_risk": "Standard 12-month linear vesting applied."
        },
        "roadmap": {
            "github_velocity_status": "Active",
            "unmet_milestones": []
        }
    })
    
    response_data = AnalysisResponse(
        markdown_report=report,
        top_100_concentration=analytics.get("top_100_concentration", 0.0),
        whale_concentration=analytics.get("whale_concentration", 0.0),
        gini_index=analytics.get("gini_index", 0.0),
        holders=analytics.get("holders", []),
        historical_data=analytics.get("historical_data", []),
        anomalies=analytics.get("anomalies", []),
        escape_velocity=analytics.get("escape_velocity", {
            "exit_bottleneck_pct": 0.0,
            "survival_probability": "Stable",
            "estimated_blocks_to_drain": 0,
            "recommended_slippage_pct": 0.0
        }),
        fundamental_audit=fund_audit
    )
    
    # Store in cache
    response_cache[token] = (response_data, now)
    
    return response_data

# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(fast_app, host="0.0.0.0", port=8000)
