import os

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response, FileResponse

from app.auth import get_current_user
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.models.analysis import Analysis
from app.services.exporter import generate_pdf
from sqlalchemy.orm import Session as DBSession

router = APIRouter()


def _check_paid(user: User):
    if user.plan == "free":
        raise HTTPException(
            status_code=402,
            detail={"error": "Export requires Pro plan.", "code": "UPGRADE_REQUIRED"},
        )


def _get_complete_analysis(analysis_id: str, user: User, db: DBSession) -> Analysis:
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id, Analysis.user_id == user.id
    ).first()
    if not analysis:
        raise HTTPException(status_code=404, detail={"error": "Analysis not found", "code": "ANALYSIS_NOT_FOUND"})
    if analysis.status != "complete":
        raise HTTPException(status_code=400, detail={"error": "Analysis is not complete yet", "code": "NOT_COMPLETE"})
    return analysis


@router.get("/{analysis_id}/markdown")
async def export_markdown(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    _check_paid(current_user)
    analysis = _get_complete_analysis(analysis_id, current_user, db)

    filename = f"feature-brief-{analysis.created_at.strftime('%Y%m%d')}.md"
    return Response(
        content=analysis.brief_markdown or "",
        media_type="text/plain",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/{analysis_id}/pdf")
async def export_pdf(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    _check_paid(current_user)
    analysis = _get_complete_analysis(analysis_id, current_user, db)

    os.makedirs(settings.EXPORTS_DIR, exist_ok=True)
    cache_path = os.path.join(settings.EXPORTS_DIR, f"{analysis_id}.pdf")

    if not os.path.exists(cache_path):
        try:
            generate_pdf(analysis.brief, cache_path)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail={"error": "PDF generation failed. Try downloading Markdown instead.", "code": "PDF_FAILED"},
            )

    filename = f"feature-brief-{analysis.created_at.strftime('%Y%m%d')}.pdf"
    return FileResponse(cache_path, media_type="application/pdf", filename=filename)
