import json
import re
import uuid
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.database import get_db
from app.models.insight import Insight
from app.models.user import User
from app.project_access import get_accessible_project
from app.ai.context import build_insight_context
from app.ai.prompts import (
    build_chat_system_prompt,
    CLARIFY_SYSTEM_PROMPT,
    build_chat_user_message,
    build_clarify_user_message,
)
from app.services.llm_providers import generate_text

router = APIRouter()


def _extract_json(raw: str) -> dict | None:
    """Parse JSON from LLM output that may contain surrounding prose."""
    raw = raw.strip()
    # Strip markdown code fences
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
    # Direct parse
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass
    # Find the first {...} block (handles prose-before-JSON responses)
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass
    return None


class ChatRequest(BaseModel):
    question: str
    use_codebase: bool = False


class ChatResponse(BaseModel):
    answer: str
    quotes: list[str]
    code_refs: list[str] = []


class ClarifyRequest(BaseModel):
    question: str
    insight_types: list[str] | None = None
    starred_only: bool = False
    days_back: int | None = None
    date_from: str | None = None
    date_to: str | None = None


class ClarifyResponse(BaseModel):
    questions: list[str]


@router.post("/{project_id}/chat", response_model=ChatResponse)
async def chat(
    project_id: uuid.UUID,
    body: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    question = body.question.strip()
    if not question:
        raise HTTPException(status_code=422, detail={"error": "Question is required", "code": "EMPTY_QUESTION"})
    if len(question) > 1000:
        raise HTTPException(status_code=422, detail={"error": "Question too long", "code": "QUESTION_TOO_LONG"})

    project = get_accessible_project(str(project_id), str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "NOT_FOUND"})

    insights = db.query(Insight).filter(
        Insight.project_id == project_id,
    ).order_by(Insight.frequency.desc()).all()

    if not insights:
        return ChatResponse(
            answer="This project has no insights yet. Upload some customer interviews or feedback files to get started.",
            quotes=[],
        )

    insight_context = build_insight_context(insights)

    # Codebase context — coming soon
    code_refs: list[str] = []

    user_message = build_chat_user_message(question, insight_context, "")
    system_prompt = build_chat_system_prompt(has_codebase=False)
    # Free → grok-3-mini, Pro → Claude Sonnet
    prefer_provider = "groq" if current_user.plan == "free" else None

    raw = await generate_text(
        system_prompt=system_prompt,
        user_message=user_message,
        max_tokens=1024,
        prefer_provider=prefer_provider,
    )

    parsed = _extract_json(raw)
    if parsed:
        return ChatResponse(
            answer=parsed.get("answer", ""),
            quotes=parsed.get("quotes", []),
            code_refs=code_refs,
        )
    # Fallback — model returned plain prose, use it as-is
    return ChatResponse(answer=raw.strip(), quotes=[], code_refs=code_refs)


@router.post("/{project_id}/clarify", response_model=ClarifyResponse)
async def clarify(
    project_id: uuid.UUID,
    body: ClarifyRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    question = body.question.strip()
    if not question:
        raise HTTPException(status_code=422, detail={"error": "Question is required", "code": "EMPTY_QUESTION"})

    project = get_accessible_project(str(project_id), str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "NOT_FOUND"})

    q = db.query(Insight).filter(Insight.project_id == project_id)

    if body.starred_only:
        q = q.filter(Insight.starred.is_(True))
    elif body.insight_types:
        q = q.filter(Insight.type.in_(body.insight_types))

    if not body.starred_only:
        if body.date_from:
            q = q.filter(Insight.created_at >= datetime.fromisoformat(body.date_from))
        elif body.days_back:
            cutoff = datetime.utcnow() - timedelta(days=body.days_back)
            q = q.filter(Insight.created_at >= cutoff)
        if body.date_to:
            q = q.filter(Insight.created_at <= datetime.fromisoformat(body.date_to).replace(hour=23, minute=59, second=59))

    insights = q.order_by(Insight.frequency.desc()).limit(80).all()

    if not insights:
        return ClarifyResponse(questions=[])

    insight_context = build_insight_context(insights)
    user_message = build_clarify_user_message(question, insight_context)

    # Clarify is lightweight — always use grok to save Claude credits
    raw = await generate_text(
        system_prompt=CLARIFY_SYSTEM_PROMPT,
        user_message=user_message,
        max_tokens=512,
        prefer_provider="groq",
    )

    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[-1].rsplit("```", 1)[0].strip()

    try:
        parsed = json.loads(raw)
        return ClarifyResponse(questions=parsed.get("questions", []))
    except json.JSONDecodeError:
        return ClarifyResponse(questions=[])
