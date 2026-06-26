# app/schema.py
from pydantic import BaseModel, ConfigDict

class TokenRiskMetrics(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    token_address: str
    liquidity_usd: float
    is_liquidity_locked: bool
    risk_score: int
    critical_findings: list[str]