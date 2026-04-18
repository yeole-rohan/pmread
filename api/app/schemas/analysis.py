"""Pydantic response schemas for analysis/PRD endpoints."""
from datetime import datetime
from pydantic import BaseModel


class AnalysisListItem(BaseModel):
    id: str
    project_id: str
    question: str
    status: str
    brief_summary: str | None
    created_at: datetime
    extension_count: int = 0
    new_insights_count: int = 0


class AnalysisDetail(BaseModel):
    id: str
    project_id: str
    question: str
    status: str
    brief: dict | None
    error_message: str | None
    share_token: str | None
    created_at: datetime


class CreatePRDResponse(BaseModel):
    analysis_id: str
    status: str


class ShareResponse(BaseModel):
    share_token: str
