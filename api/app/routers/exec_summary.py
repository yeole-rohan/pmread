import json
import secrets
from datetime import datetime, timezone

import anthropic
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.config import settings
from app.database import get_db
from app.models.analysis import Analysis
from app.models.insight import Insight
from app.models.prd_summary import PrdSummary
from app.models.user import User
from app.ai.context import build_insight_context
from app.ai.prompts import EXEC_SUMMARY_SYSTEM_PROMPT, build_exec_summary_user_message
from app.plan_config import require_feature
from app.project_access import get_accessible_analysis, require_editor_role

router = APIRouter()


def _summary_out(s: PrdSummary) -> dict:
    return {
        "id": str(s.id),
        "analysis_id": str(s.analysis_id),
        "content": s.content,
        "generated_at": s.generated_at.isoformat(),
        "is_stale": s.is_stale,
        "share_token": s.share_token,
    }


@router.get("/{analysis_id}/summary")
async def get_summary(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    analysis, _project = get_accessible_analysis(analysis_id, str(current_user.id), db)
    if not analysis:
        raise HTTPException(status_code=404, detail={"error": "PRD not found", "code": "ANALYSIS_NOT_FOUND"})

    summary = db.query(PrdSummary).filter(PrdSummary.analysis_id == analysis_id).first()
    if not summary:
        return None

    return _summary_out(summary)


@router.post("/{analysis_id}/summary")
async def generate_summary(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    require_feature(current_user.plan, "exec_summary", "Executive summary requires Pro or Teams")

    analysis, project = get_accessible_analysis(analysis_id, str(current_user.id), db)
    if not analysis:
        raise HTTPException(status_code=404, detail={"error": "PRD not found", "code": "ANALYSIS_NOT_FOUND"})
    require_editor_role(project, str(current_user.id), db)
    if analysis.status != "complete" or not analysis.brief:
        raise HTTPException(status_code=400, detail={"error": "PRD is not complete yet.", "code": "NOT_COMPLETE"})

    insights = (
        db.query(Insight)
        .filter(Insight.project_id == analysis.project_id)
        .order_by(Insight.frequency.desc())
        .limit(10)
        .all()
    )
    insight_context = build_insight_context(insights) if insights else "No insights available."
    user_message = build_exec_summary_user_message(analysis.brief, insight_context)

    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        system=EXEC_SUMMARY_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )
    raw = message.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[-1].rsplit("```", 1)[0].strip()

    try:
        content = json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail={"error": "Failed to parse AI response", "code": "AI_PARSE_ERROR"})

    now = datetime.now(timezone.utc)
    summary = db.query(PrdSummary).filter(PrdSummary.analysis_id == analysis_id).first()
    if summary:
        summary.content = content
        summary.generated_at = now
        summary.is_stale = False
    else:
        summary = PrdSummary(analysis_id=analysis.id, content=content)
        db.add(summary)
    db.commit()
    db.refresh(summary)

    return _summary_out(summary)


@router.post("/{analysis_id}/summary/share")
async def share_summary(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    analysis, project = get_accessible_analysis(analysis_id, str(current_user.id), db)
    if not analysis:
        raise HTTPException(status_code=404, detail={"error": "PRD not found", "code": "ANALYSIS_NOT_FOUND"})
    require_editor_role(project, str(current_user.id), db)

    summary = db.query(PrdSummary).filter(PrdSummary.analysis_id == analysis_id).first()
    if not summary:
        raise HTTPException(status_code=404, detail={"error": "No summary yet", "code": "SUMMARY_NOT_FOUND"})

    if not summary.share_token:
        summary.share_token = secrets.token_urlsafe(32)
        db.commit()

    return {"share_token": summary.share_token}
