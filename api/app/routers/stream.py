import asyncio
import json

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from app.auth import get_current_user
from app.database import get_db
from app.models.user import User
from app.models.analysis import Analysis
from app.ai.generator import get_or_create_queue
from sqlalchemy.orm import Session as DBSession

router = APIRouter()


@router.get("/{analysis_id}")
async def stream_analysis(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id, Analysis.user_id == current_user.id
    ).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    # If already complete, stream the brief immediately
    if analysis.status == "complete" and analysis.brief:
        async def completed_stream():
            brief = analysis.brief
            yield f"data: {json.dumps({'type': 'section', 'section': 'problem', 'content': brief.get('problem', '')})}\n\n"
            yield f"data: {json.dumps({'type': 'section', 'section': 'proposed_feature', 'content': brief.get('proposed_feature', '')})}\n\n"
            yield f"data: {json.dumps({'type': 'section', 'section': 'why_worth_building', 'content': brief.get('why_worth_building', '')})}\n\n"
            yield f"data: {json.dumps({'type': 'complete', 'analysis_id': analysis_id})}\n\n"

        return StreamingResponse(completed_stream(), media_type="text/event-stream")

    if analysis.status == "failed":
        async def error_stream():
            yield f"data: {json.dumps({'type': 'error', 'message': analysis.error_message or 'Analysis failed'})}\n\n"

        return StreamingResponse(error_stream(), media_type="text/event-stream")

    queue = get_or_create_queue(analysis_id)

    async def event_generator():
        try:
            while True:
                try:
                    event = await asyncio.wait_for(queue.get(), timeout=60.0)
                    yield f"data: {json.dumps(event)}\n\n"

                    if event.get("type") in ("complete", "error"):
                        break
                except asyncio.TimeoutError:
                    # Send keepalive comment
                    yield ": keepalive\n\n"
        except asyncio.CancelledError:
            pass

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
