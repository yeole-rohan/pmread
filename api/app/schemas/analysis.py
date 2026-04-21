"""Pydantic response schemas for analysis/PRD endpoints."""
from datetime import datetime
from pydantic import BaseModel, model_validator


_CONTEXT_DELIMITER = "\n\nAdditional context:"


def split_question(question: str) -> tuple[str, str | None]:
    """Return (title, additional_context_or_None) from a raw question string."""
    idx = question.find(_CONTEXT_DELIMITER)
    if idx == -1:
        return question.strip(), None
    title = question[:idx].strip()
    context = question[idx + 2:].strip()  # skip the leading \n\n
    return title, context


class AnalysisListItem(BaseModel):
    id: str
    project_id: str
    question: str
    title: str = ""
    status: str
    brief_summary: str | None
    created_at: datetime
    extension_count: int = 0
    new_insights_count: int = 0

    @model_validator(mode="after")
    def populate_title(self) -> "AnalysisListItem":
        if not self.title:
            self.title, _ = split_question(self.question)
        return self


class AnalysisDetail(BaseModel):
    id: str
    project_id: str
    question: str
    title: str = ""
    additional_context: str | None = None
    status: str
    brief: dict | None
    extensions: list[dict] = []
    error_message: str | None
    share_token: str | None
    created_at: datetime

    @model_validator(mode="after")
    def populate_split(self) -> "AnalysisDetail":
        if not self.title:
            self.title, self.additional_context = split_question(self.question)
        return self


class CreatePRDResponse(BaseModel):
    analysis_id: str
    status: str


class ShareResponse(BaseModel):
    share_token: str
