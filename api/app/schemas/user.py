"""Pydantic response schemas for user/auth endpoints."""
from datetime import datetime
from pydantic import BaseModel


class UserOut(BaseModel):
    id: str
    email: str
    display_name: str | None
    plan: str
    billing_provider: str | None
    plan_started_at: datetime | None
    plan_expires_at: datetime | None
    analyses_used: int
    prds_generated_this_month: int
    prds_reset_at: datetime | None
    email_verified: bool
    digest_enabled: bool
    created_at: datetime

    model_config = {"from_attributes": True}
