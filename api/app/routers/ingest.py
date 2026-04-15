"""External source ingestion: Slack, Zoom/Fireflies/Gong call transcripts."""
import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.database import get_db
from app.models.project import Project
from app.models.uploaded_doc import UploadedDoc
from app.models.user import User
from app.worker import extract_insights_task

router = APIRouter()


# ── Slack ─────────────────────────────────────────────────────────────────────

class SlackIngestRequest(BaseModel):
    project_id: str
    bot_token: str        # xoxb-... user provides from their Slack app
    channel: str          # channel name or ID e.g. #customer-feedback
    limit: int = 200      # number of messages to pull (max 1000)


@router.post("/slack")
async def ingest_slack(
    body: SlackIngestRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Pull messages from a Slack channel and run insight extraction."""
    project = db.query(Project).filter(
        Project.id == body.project_id,
        Project.user_id == current_user.id,
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "NOT_FOUND"})

    limit = min(max(body.limit, 10), 1000)
    channel = body.channel.lstrip("#")

    # Resolve channel name → ID if needed
    channel_id = channel
    if not channel.startswith("C"):
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://slack.com/api/conversations.list",
                headers={"Authorization": f"Bearer {body.bot_token}"},
                params={"types": "public_channel,private_channel", "limit": 200},
            )
        data = resp.json()
        if not data.get("ok"):
            raise HTTPException(status_code=400, detail={"error": data.get("error", "Slack API error"), "code": "SLACK_ERROR"})
        found = next((c for c in data.get("channels", []) if c["name"] == channel), None)
        if not found:
            raise HTTPException(status_code=404, detail={"error": f"Channel #{channel} not found or bot not invited", "code": "CHANNEL_NOT_FOUND"})
        channel_id = found["id"]

    # Fetch messages
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://slack.com/api/conversations.history",
            headers={"Authorization": f"Bearer {body.bot_token}"},
            params={"channel": channel_id, "limit": limit},
        )
    data = resp.json()
    if not data.get("ok"):
        raise HTTPException(status_code=400, detail={"error": data.get("error", "Slack API error"), "code": "SLACK_ERROR"})

    messages = [
        m.get("text", "").strip()
        for m in data.get("messages", [])
        if m.get("type") == "message" and m.get("text", "").strip() and not m.get("bot_id")
    ]

    if not messages:
        raise HTTPException(status_code=422, detail={"error": "No user messages found in this channel", "code": "NO_MESSAGES"})

    extracted_text = _format_slack_messages(messages, channel)

    doc = UploadedDoc(
        project_id=project.id,
        user_id=current_user.id,
        original_name=f"#{channel} (Slack · {len(messages)} messages)",
        file_type="slack",
        extracted_text=extracted_text,
        char_count=len(extracted_text),
        insight_status="pending",
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    extract_insights_task.delay(str(doc.id))

    return {
        "id": str(doc.id),
        "name": doc.original_name,
        "message_count": len(messages),
        "insight_status": "pending",
    }


def _format_slack_messages(messages: list[str], channel: str) -> str:
    header = f"Slack channel: #{channel}\n{'='*40}\n\n"
    body = "\n\n---\n\n".join(messages)
    return header + body


# ── Call transcripts (Fireflies / plain text) ─────────────────────────────────

class TranscriptIngestRequest(BaseModel):
    project_id: str
    transcript: str       # raw transcript text, pasted or fetched from Fireflies/Zoom
    source_name: str      # e.g. "Customer call with Acme - 2025-04-10"


@router.post("/transcript")
async def ingest_transcript(
    body: TranscriptIngestRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Ingest a plain-text call transcript (Zoom, Fireflies, Gong copy-paste)."""
    project = db.query(Project).filter(
        Project.id == body.project_id,
        Project.user_id == current_user.id,
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "NOT_FOUND"})

    text = body.transcript.strip()
    if len(text) < 100:
        raise HTTPException(status_code=422, detail={"error": "Transcript too short", "code": "TOO_SHORT"})
    if len(text) > 500_000:
        raise HTTPException(status_code=413, detail={"error": "Transcript exceeds 500k character limit", "code": "TOO_LONG"})

    name = (body.source_name.strip() or "Call transcript")[:200]

    doc = UploadedDoc(
        project_id=project.id,
        user_id=current_user.id,
        original_name=name,
        file_type="transcript",
        extracted_text=text,
        char_count=len(text),
        insight_status="pending",
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    extract_insights_task.delay(str(doc.id))

    return {
        "id": str(doc.id),
        "name": doc.original_name,
        "char_count": doc.char_count,
        "insight_status": "pending",
    }
