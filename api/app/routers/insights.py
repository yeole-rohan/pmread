from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import text
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.database import get_db
from app.models.insight import Insight
from app.models.project import Project
from app.models.uploaded_doc import UploadedDoc
from app.models.user import User
from app.project_access import get_accessible_project, require_editor_role

router = APIRouter()

INSIGHT_TYPES = {"pain_point", "feature_request", "decision", "action_item"}


def _insight_dict(ins: Insight, source_name: str | None = None) -> dict:
    return {
        "id": str(ins.id),
        "project_id": str(ins.project_id),
        "source_doc_id": str(ins.source_doc_id) if ins.source_doc_id else None,
        "source_name": source_name,
        "type": ins.type,
        "content": ins.content,
        "quote": ins.quote,
        "frequency": ins.frequency,
        "starred": ins.starred,
        "used_in_prd": ins.used_in_prd,
        "created_at": ins.created_at,
        "updated_at": ins.updated_at,
    }


@router.get("/{project_id}/insights")
async def list_insights(
    project_id: str,
    type: str | None = Query(None, description="Filter by type: pain_point | feature_request | decision | action_item"),
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """
    All insights for a project, grouped by type.
    Sorted by frequency desc — most mentioned first.
    """
    project = get_accessible_project(project_id, str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "PROJECT_NOT_FOUND"})

    if type and type not in INSIGHT_TYPES:
        raise HTTPException(status_code=400, detail={"error": f"Invalid type. Must be one of: {', '.join(INSIGHT_TYPES)}", "code": "INVALID_TYPE"})

    q = db.query(Insight).filter(Insight.project_id == project_id)
    if type:
        q = q.filter(Insight.type == type)
    insights = q.order_by(Insight.frequency.desc(), Insight.created_at.asc()).all()

    # Batch-fetch source doc names for the insights that have one
    doc_ids = {ins.source_doc_id for ins in insights if ins.source_doc_id}
    source_names: dict = {}
    if doc_ids:
        docs = db.query(UploadedDoc.id, UploadedDoc.original_name).filter(
            UploadedDoc.id.in_(doc_ids)
        ).all()
        source_names = {str(d.id): d.original_name for d in docs}

    def to_dict(ins: Insight) -> dict:
        name = source_names.get(str(ins.source_doc_id)) if ins.source_doc_id else None
        return _insight_dict(ins, source_name=name)

    # Group by type when no filter applied
    if not type:
        grouped: dict[str, list] = {t: [] for t in INSIGHT_TYPES}
        for ins in insights:
            grouped[ins.type].append(to_dict(ins))
        return {
            "project_id": project_id,
            "total": len(insights),
            "grouped": grouped,
        }

    return {
        "project_id": project_id,
        "type": type,
        "total": len(insights),
        "insights": [to_dict(ins) for ins in insights],
    }


@router.get("/{project_id}/insights/search")
async def search_insights(
    project_id: str,
    q: str = Query(..., min_length=2, description="Search query"),
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Full-text search across insights for a project using PostgreSQL tsvector."""
    project = get_accessible_project(project_id, str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "PROJECT_NOT_FOUND"})

    rows = db.execute(
        text("""
            SELECT id, project_id, source_doc_id, type, content, quote,
                   frequency, starred, used_in_prd, created_at, updated_at,
                   ts_rank(search_vector, plainto_tsquery('english', :query)) AS rank
            FROM insights
            WHERE project_id = :project_id
              AND search_vector @@ plainto_tsquery('english', :query)
            ORDER BY rank DESC, frequency DESC
            LIMIT 50
        """),
        {"project_id": project_id, "query": q},
    ).fetchall()

    return {
        "project_id": project_id,
        "query": q,
        "total": len(rows),
        "insights": [
            {
                "id": str(row.id),
                "type": row.type,
                "content": row.content,
                "quote": row.quote,
                "frequency": row.frequency,
                "starred": row.starred,
                "used_in_prd": row.used_in_prd,
                "created_at": row.created_at,
            }
            for row in rows
        ],
    }


@router.patch("/{project_id}/insights/{insight_id}/star")
async def toggle_star(
    project_id: str,
    insight_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Toggle the starred flag on an insight."""
    project = get_accessible_project(project_id, str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "PROJECT_NOT_FOUND"})
    require_editor_role(project, str(current_user.id), db)

    insight = db.query(Insight).filter(
        Insight.id == insight_id, Insight.project_id == project_id
    ).first()
    if not insight:
        raise HTTPException(status_code=404, detail={"error": "Insight not found", "code": "INSIGHT_NOT_FOUND"})

    insight.starred = not insight.starred
    db.commit()
    return {"id": str(insight.id), "starred": insight.starred}


@router.delete("/{project_id}/insights/{insight_id}")
async def delete_insight(
    project_id: str,
    insight_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Delete a single insight (e.g. if PM marks it irrelevant)."""
    project = get_accessible_project(project_id, str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "PROJECT_NOT_FOUND"})
    require_editor_role(project, str(current_user.id), db)

    insight = db.query(Insight).filter(
        Insight.id == insight_id, Insight.project_id == project_id
    ).first()
    if not insight:
        raise HTTPException(status_code=404, detail={"error": "Insight not found", "code": "INSIGHT_NOT_FOUND"})

    db.delete(insight)
    db.commit()
    return {"success": True}
