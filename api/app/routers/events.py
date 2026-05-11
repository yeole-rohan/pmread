"""SSE endpoint for real-time project events (extraction, github indexing)."""
import asyncio
import json

from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.database import get_db
from app.models.user import User
from app.project_access import get_accessible_project
from app.services.project_events import subscribe_project_events

router = APIRouter()


@router.get("/{project_id}/events")
async def project_events(
    project_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """
    SSE stream of real-time events for a project.
    Replaces polling for extraction status and GitHub index status.

    Events:
      {"type": "extraction", "doc_id": "...", "status": "done"|"failed", "insight_count": N}
      {"type": "github_index", "status": "indexing"|"ready"|"failed", "chunk_count": N}
      {"type": "ping"}  — keepalive every 15s
    """
    project = get_accessible_project(project_id, str(current_user.id), db)
    if not project:
        return StreamingResponse(
            iter([f"data: {json.dumps({'type': 'error', 'message': 'not found'})}\n\n"]),
            media_type="text/event-stream",
            status_code=404,
        )

    queue: asyncio.Queue = asyncio.Queue()

    async def redis_reader():
        """Pump Redis events into the shared queue."""
        try:
            async for event in subscribe_project_events(project_id, timeout_seconds=300):
                await queue.put(event)
        except Exception:
            pass
        finally:
            await queue.put(None)  # sentinel — stream done

    async def event_stream():
        reader_task = asyncio.create_task(redis_reader())
        try:
            while True:
                if await request.is_disconnected():
                    break
                try:
                    # Wait up to 15s for an event; send ping if nothing arrives
                    event = await asyncio.wait_for(queue.get(), timeout=15.0)
                    if event is None:
                        break  # sentinel — Redis timeout or error
                    yield f"data: {json.dumps(event)}\n\n"
                except asyncio.TimeoutError:
                    yield f"data: {json.dumps({'type': 'ping'})}\n\n"
        finally:
            reader_task.cancel()

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )
