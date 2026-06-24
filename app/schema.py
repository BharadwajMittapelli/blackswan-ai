# app/schema.py
from pydantic import BaseModel

class TokenRiskMetrics(BaseModel):
    token_address: str
    liquidity_usd: float
    is_liquidity_locked: bool
    risk_score: int
    critical_findings: list[str]