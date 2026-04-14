"""Pydantic response schemas for project endpoints."""
from datetime import datetime
from pydantic import BaseModel


class ProjectOut(BaseModel):
    id: str
    name: str
    created_at: datetime
    updated_at: datetime
    analysis_count: int = 0
    last_analysis_at: datetime | None = None
