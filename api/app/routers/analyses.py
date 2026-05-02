import json
import secrets
from datetime import datetime, timezone

import anthropic
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.config import settings
from app.database import get_db, SessionLocal
from app.models.analysis import Analysis
from app.models.insight import Insight
from app.models.project import Project
from app.models.user import User
from app.ai.generator import run_analysis, get_or_create_queue
from app.ai.context import build_insight_context
from app.ai.prompts import (
    VALIDATE_SYSTEM_PROMPT, build_validate_user_message,
    DOC_WRITER_PROMPTS, build_doc_writer_message,
    EXTEND_PRD_SYSTEM_PROMPT, build_extend_prd_user_message,
)
from app.ai.utils import extract_project_name
from app.services.prd_service import check_and_increment_prd_limit, try_use_prd_credit, PLAN_PRD_LIMITS
from app.schemas.analysis import AnalysisListItem, AnalysisDetail, CreatePRDResponse, ShareResponse

router = APIRouter()


class CreatePRDRequest(BaseModel):
    project_id: str
    question: str
    insight_types: list[str] | None = None   # None = all types
    starred_only: bool = False               # Use only starred insights
    days_back: int | None = None             # None = all time (ignored when date_from/date_to set)
    date_from: str | None = None             # ISO date "YYYY-MM-DD" custom range start
    date_to: str | None = None               # ISO date "YYYY-MM-DD" custom range end


@router.post("/", response_model=CreatePRDResponse)
async def create_prd(
    body: CreatePRDRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Generate a PRD from all insights in the project. Gated by monthly PRD limit."""
    if not body.question.strip():
        raise HTTPException(status_code=400, detail={"error": "Question is required", "code": "EMPTY_QUESTION"})

    project = db.query(Project).filter(
        Project.id == body.project_id, Project.user_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "PROJECT_NOT_FOUND"})

    # Founding-member credits take priority — never expire, bypass monthly plan limit
    used_credit = try_use_prd_credit(str(current_user.id), db)
    if not used_credit:
        # No credits — fall back to plan monthly limit
        allowed = check_and_increment_prd_limit(str(current_user.id), current_user.plan, db)
        if not allowed:
            limit = PLAN_PRD_LIMITS.get(current_user.plan, 0)
            raise HTTPException(
                status_code=402,
                detail={
                    "error": f"You've used your {limit} {'free ' if current_user.plan == 'free' else ''}PRDs this month. Resets on the 1st.",
                    "code": "PRD_LIMIT_REACHED",
                    "upgrade_url": "/settings?upgrade=true",
                },
            )

    # Auto-name project if still default
    if project.name == "New Project":
        project.name = extract_project_name(body.question)
    project.updated_at = datetime.now(timezone.utc)

    analysis = Analysis(
        project_id=project.id,
        user_id=current_user.id,
        question=body.question.strip(),
        status="pending",
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    # Pre-create SSE queue before background task starts
    get_or_create_queue(str(analysis.id))

    background_tasks.add_task(
        run_analysis,
        str(analysis.id),
        SessionLocal,
        body.insight_types,
        body.starred_only,
        body.days_back,
        body.date_from,
        body.date_to,
        str(current_user.id),
        current_user.plan,
    )

    return CreatePRDResponse(analysis_id=str(analysis.id), status="processing")


@router.get("/", response_model=list[AnalysisListItem])
async def list_prds(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    project = db.query(Project).filter(
        Project.id == project_id, Project.user_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "PROJECT_NOT_FOUND"})

    analyses = (
        db.query(Analysis)
        .filter(Analysis.project_id == project_id)
        .order_by(Analysis.created_at.desc())
        .all()
    )

    # Compute new_insights_count for each PRD without N+1 queries.
    # Fetch all insight timestamps once, then compare in Python.
    insight_dates = [
        row[0]
        for row in db.query(Insight.created_at).filter(Insight.project_id == project_id).all()
    ]

    return [
        AnalysisListItem(
            id=str(a.id),
            project_id=str(a.project_id),
            question=a.question,
            status=a.status,
            brief_summary=(a.brief or {}).get("proposed_feature", "")[:120] if a.brief else None,
            created_at=a.created_at,
            extension_count=a.extension_count,
            new_insights_count=sum(1 for d in insight_dates if d > a.created_at),
        )
        for a in analyses
    ]


@router.get("/{analysis_id}", response_model=AnalysisDetail)
async def get_prd(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id, Analysis.user_id == current_user.id
    ).first()
    if not analysis:
        raise HTTPException(status_code=404, detail={"error": "PRD not found", "code": "ANALYSIS_NOT_FOUND"})

    return AnalysisDetail(
        id=str(analysis.id),
        project_id=str(analysis.project_id),
        question=analysis.question,
        status=analysis.status,
        brief=analysis.brief,
        extensions=analysis.extensions or [],
        error_message=analysis.error_message,
        share_token=analysis.share_token,
        created_at=analysis.created_at,
    )


@router.post("/{analysis_id}/share", response_model=ShareResponse)
async def create_share_link(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Generate a public share token for a completed PRD."""
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id, Analysis.user_id == current_user.id
    ).first()
    if not analysis:
        raise HTTPException(status_code=404, detail={"error": "PRD not found", "code": "ANALYSIS_NOT_FOUND"})
    if analysis.status != "complete":
        raise HTTPException(status_code=400, detail={"error": "PRD is not complete yet.", "code": "NOT_COMPLETE"})

    if not analysis.share_token:
        analysis.share_token = secrets.token_urlsafe(32)
        db.commit()

    return ShareResponse(share_token=analysis.share_token)


@router.post("/{analysis_id}/validate")
async def validate_prd(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Run an LLM coverage check against the project's insights. Caches result in brief."""
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id, Analysis.user_id == current_user.id
    ).first()
    if not analysis:
        raise HTTPException(status_code=404, detail={"error": "PRD not found", "code": "ANALYSIS_NOT_FOUND"})
    if analysis.status != "complete" or not analysis.brief:
        raise HTTPException(status_code=400, detail={"error": "PRD is not complete yet.", "code": "NOT_COMPLETE"})

    # Return cached result if present
    cached = analysis.brief.get("validation") if analysis.brief else None
    if cached:
        return cached

    # Fetch top 60 insights for this project (by frequency)
    insights = (
        db.query(Insight)
        .filter(Insight.project_id == analysis.project_id)
        .order_by(Insight.frequency.desc())
        .limit(60)
        .all()
    )
    if not insights:
        return {"coverage_score": 0, "gaps": [], "strengths": []}

    insight_context = build_insight_context(insights)
    problem = analysis.brief.get("problem", "")
    proposed_feature = analysis.brief.get("proposed_feature", "")
    user_message = build_validate_user_message(problem, proposed_feature, insight_context)

    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        system=VALIDATE_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )
    raw = message.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[-1].rsplit("```", 1)[0].strip()

    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        result = {"coverage_score": 0, "gaps": [], "strengths": []}

    # Cache in brief JSONB so subsequent calls are free
    updated_brief = dict(analysis.brief)
    updated_brief["validation"] = result
    analysis.brief = updated_brief
    db.commit()

    return result


@router.post("/{analysis_id}/write-doc")
async def write_doc(
    analysis_id: str,
    doc_type: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Generate release notes, FAQ, or announcement from a completed PRD."""
    if doc_type not in DOC_WRITER_PROMPTS:
        raise HTTPException(status_code=422, detail={"error": f"Unknown doc_type: {doc_type}", "code": "INVALID_DOC_TYPE"})

    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id, Analysis.user_id == current_user.id
    ).first()
    if not analysis:
        raise HTTPException(status_code=404, detail={"error": "PRD not found", "code": "ANALYSIS_NOT_FOUND"})
    if analysis.status != "complete" or not analysis.brief:
        raise HTTPException(status_code=400, detail={"error": "PRD is not complete yet.", "code": "NOT_COMPLETE"})

    # Return cached result if present
    cache_key = f"doc_{doc_type}"
    cached = analysis.brief.get(cache_key) if analysis.brief else None
    if cached:
        return {"doc_type": doc_type, "content": cached}

    user_message = build_doc_writer_message(doc_type, analysis.brief)
    system_prompt = DOC_WRITER_PROMPTS[doc_type]

    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
    )
    content = message.content[0].text.strip()

    # Cache in brief JSONB
    updated_brief = dict(analysis.brief)
    updated_brief[cache_key] = content
    analysis.brief = updated_brief
    db.commit()

    return {"doc_type": doc_type, "content": content}


@router.get("/{analysis_id}/new-insights")
async def get_new_insights(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Return insights added to the project after this PRD was generated."""
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id, Analysis.user_id == current_user.id
    ).first()
    if not analysis:
        raise HTTPException(status_code=404, detail={"error": "PRD not found", "code": "ANALYSIS_NOT_FOUND"})

    insights = (
        db.query(Insight)
        .filter(
            Insight.project_id == analysis.project_id,
            Insight.created_at > analysis.created_at,
        )
        .order_by(Insight.frequency.desc(), Insight.created_at.desc())
        .all()
    )

    return [
        {
            "id": str(i.id),
            "type": i.type,
            "content": i.content,
            "quote": i.quote,
            "frequency": i.frequency,
            "created_at": i.created_at.isoformat(),
        }
        for i in insights
    ]


class ExtendPRDRequest(BaseModel):
    insight_ids: list[str]


@router.post("/{analysis_id}/extend")
async def extend_prd(
    analysis_id: str,
    body: ExtendPRDRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """
    Append a new section to an existing PRD using cherry-picked insights.
    Pro only. Max 3 extensions per PRD. Does not decrement monthly PRD counter.
    """
    if current_user.plan != "pro":
        raise HTTPException(
            status_code=402,
            detail={"error": "PRD extension requires Pro", "code": "PRO_REQUIRED"},
        )

    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id, Analysis.user_id == current_user.id
    ).first()
    if not analysis:
        raise HTTPException(status_code=404, detail={"error": "PRD not found", "code": "ANALYSIS_NOT_FOUND"})
    if analysis.status != "complete":
        raise HTTPException(status_code=400, detail={"error": "PRD must be complete to extend", "code": "NOT_COMPLETE"})
    if analysis.extension_count >= 3:
        raise HTTPException(
            status_code=400,
            detail={"error": "Maximum 3 extensions per PRD reached. Generate a new PRD to start fresh.", "code": "EXTENSION_LIMIT_REACHED"},
        )
    if not body.insight_ids:
        raise HTTPException(status_code=400, detail={"error": "Select at least one insight", "code": "NO_INSIGHTS"})

    insights = (
        db.query(Insight)
        .filter(
            Insight.id.in_(body.insight_ids),
            Insight.project_id == analysis.project_id,
        )
        .all()
    )
    if not insights:
        raise HTTPException(status_code=400, detail={"error": "No valid insights found", "code": "NO_INSIGHTS"})

    context = build_insight_context(insights)
    user_message = build_extend_prd_user_message(analysis.brief_markdown or "", context)

    from app.services.llm_providers import generate_text
    result = await generate_text(
        system_prompt=EXTEND_PRD_SYSTEM_PROMPT,
        user_message=user_message,
        max_tokens=1024,
    )

    now = datetime.now(timezone.utc)
    update_label = f"Update {analysis.extension_count + 1}"
    date_str = now.strftime("%b %d, %Y")

    new_extension = {
        "label": update_label,
        "date": date_str,
        "created_at": now.isoformat(),
        "content": result,
        "insight_ids": body.insight_ids,
    }

    current_extensions = list(analysis.extensions or [])
    current_extensions.append(new_extension)
    analysis.extensions = current_extensions
    analysis.extension_count += 1
    analysis.extended_at = now
    db.commit()

    from app.models.prd_version import PrdVersion
    db.add(PrdVersion(
        prd_id=analysis.id,
        brief=analysis.brief,
        brief_markdown=analysis.brief_markdown,
        trigger="extension",
        triggered_by=current_user.id,
    ))
    db.commit()

    return {
        "success": True,
        "extension_count": analysis.extension_count,
        "extensions_remaining": 3 - analysis.extension_count,
        "extension": new_extension,
    }


@router.delete("/{analysis_id}")
async def delete_prd(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id, Analysis.user_id == current_user.id
    ).first()
    if not analysis:
        raise HTTPException(status_code=404, detail={"error": "PRD not found", "code": "ANALYSIS_NOT_FOUND"})

    db.delete(analysis)
    db.commit()
    return {"success": True}
