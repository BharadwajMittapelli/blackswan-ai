# app/schemas.py
from pydantic import BaseModel, ConfigDict, Field
from typing import List

class TokenRiskMetrics(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    token_address: str
    liquidity_usd: float
    is_liquidity_locked: bool
    risk_score: int
    critical_findings: list[str]

class CodeSegmentLocation(BaseModel):
    line_start: int
    line_end: int
    function_name: str
    extracted_text_snippet: str

class FunctionalAnnotation(BaseModel):
    annotation_id: str = Field(description='Unique snake_case identifier, e.g., structural_check_one')
    category_label: str = Field(description='The syntax type classification, e.g., State Update Sequence, Access Control Level')
    priority_level: str = Field(description='CRITICAL | HIGH | MEDIUM | LOW')
    location: CodeSegmentLocation
    structural_analysis: str = Field(description='Detailed mechanical explanation of the code syntax pattern and state updates.')
    optimization_guidelines: str = Field(description='Step-by-step instructions on refactoring the code structure to follow standard engineering best practices.')

class ProjectDiligenceMatrix(BaseModel):
    origin_classification_source: str = Field(description='The external funding or creation source category of the source file.')
    is_source_verified: bool
    distribution_ratio_pct: float
    has_extended_features: bool
    syntax_annotations: List[FunctionalAnnotation]

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
    diligence_matrix: ProjectDiligenceMatrix