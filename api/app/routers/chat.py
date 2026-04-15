import json
import uuid
from datetime import datetime, timedelta

import anthropic
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.config import settings
from app.database import get_db
from app.models.insight import Insight
from app.models.project import Project
from app.models.user import User
from app.ai.context import build_insight_context
from app.ai.prompts import (
    CHAT_SYSTEM_PROMPT,
    CLARIFY_SYSTEM_PROMPT,
    build_chat_user_message,
    build_clarify_user_message,
)

router = APIRouter()


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str
    quotes: list[str]


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

    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id,
    ).first()
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
    user_message = build_chat_user_message(question, insight_context)

    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=CHAT_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )

    raw = message.content[0].text.strip()

    # Strip markdown code fences if model wraps in ```json
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[-1].rsplit("```", 1)[0].strip()

    try:
        parsed = json.loads(raw)
        return ChatResponse(
            answer=parsed.get("answer", ""),
            quotes=parsed.get("quotes", []),
        )
    except json.JSONDecodeError:
        # Fallback: return raw text as answer with no quotes
        return ChatResponse(answer=raw, quotes=[])


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

    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id,
    ).first()
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

    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        system=CLARIFY_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )

    raw = message.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[-1].rsplit("```", 1)[0].strip()

    try:
        parsed = json.loads(raw)
        return ClarifyResponse(questions=parsed.get("questions", []))
    except json.JSONDecodeError:
        return ClarifyResponse(questions=[])
