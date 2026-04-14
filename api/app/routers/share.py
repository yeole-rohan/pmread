from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as DBSession

from app.database import get_db
from app.models.analysis import Analysis

router = APIRouter()


@router.get("/{token}")
async def get_shared_prd(token: str, db: DBSession = Depends(get_db)):
    """Public endpoint — no auth required. Returns a shared PRD by token."""
    analysis = db.query(Analysis).filter(Analysis.share_token == token).first()
    if not analysis or analysis.status != "complete":
        raise HTTPException(status_code=404, detail={"error": "Shared PRD not found.", "code": "NOT_FOUND"})

    return {
        "question": analysis.question,
        "brief": analysis.brief,
        "created_at": analysis.created_at,
    }
