"""Slack configuration and channel management per project.

Token is stored in projects.slack_bot_token and never returned to the client after saving.
The fetch endpoint uses the stored token internally to pull Slack messages.
"""
import re
import httpx
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.database import get_db
from app.models.slack_channel import SlackChannel
from app.models.uploaded_doc import UploadedDoc
from app.models.user import User
from app.project_access import get_accessible_project, require_editor_role
from app.worker import extract_insights_task

router = APIRouter()

# M1 fix: only allow valid Slack channel name characters
_CHANNEL_RE = re.compile(r'^[a-z0-9][a-z0-9_-]{0,79}$')


class SaveTokenRequest(BaseModel):
    token: str


class AddChannelRequest(BaseModel):
    channel_name: str


def _require_pro(user: User):
    if user.plan == "free":
        raise HTTPException(status_code=403, detail={"error": "Slack ingestion requires Pro or Teams", "code": "PRO_REQUIRED"})


# ── Token ─────────────────────────────────────────────────────────────────────

@router.put("/{project_id}/slack/token")
async def save_token(
    project_id: str,
    body: SaveTokenRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Save Slack bot token for a project. Token is never returned after this call."""
    _require_pro(current_user)
    token = body.token.strip()
    if not token.startswith("xoxb-"):
        raise HTTPException(
            status_code=422,
            detail={"error": "Invalid token — must start with xoxb-", "code": "INVALID_TOKEN"},
        )
    # M10 fix: verify token with Slack before persisting
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                "https://slack.com/api/auth.test",
                headers={"Authorization": f"Bearer {token}"},
            )
        auth_data = resp.json()
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail={"error": "Slack API timed out", "code": "SLACK_TIMEOUT"})
    if not auth_data.get("ok"):
        raise HTTPException(
            status_code=422,
            detail={"error": f"Slack rejected the token: {auth_data.get('error', 'unknown')}", "code": "INVALID_SLACK_TOKEN"},
        )
    project = get_accessible_project(project_id, str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "NOT_FOUND"})
    require_editor_role(project, str(current_user.id), db)
    project.slack_bot_token = token
    db.commit()
    return {"has_token": True}


@router.delete("/{project_id}/slack/token")
async def delete_token(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Remove saved Slack bot token."""
    project = get_accessible_project(project_id, str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "NOT_FOUND"})
    require_editor_role(project, str(current_user.id), db)
    project.slack_bot_token = None
    db.commit()
    return {"has_token": False}


# ── Channels ──────────────────────────────────────────────────────────────────

@router.get("/{project_id}/slack/channels")
async def get_channels(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """List saved channels for the project. Returns has_token flag but never the token itself."""
    _require_pro(current_user)
    project = get_accessible_project(project_id, str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "NOT_FOUND"})

    channels = (
        db.query(SlackChannel)
        .filter(SlackChannel.project_id == project_id)
        .order_by(SlackChannel.created_at.asc())
        .all()
    )

    return {
        "has_token": bool(project.slack_bot_token),
        "channels": [
            {
                "id": str(c.id),
                "channel_name": c.channel_name,
                "message_count": c.message_count,
                "last_fetched_at": c.last_fetched_at.isoformat() if c.last_fetched_at else None,
            }
            for c in channels
        ],
    }


@router.post("/{project_id}/slack/channels")
async def add_channel(
    project_id: str,
    body: AddChannelRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Add a channel name to the project's Slack channel list."""
    _require_pro(current_user)
    project = get_accessible_project(project_id, str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "NOT_FOUND"})
    require_editor_role(project, str(current_user.id), db)

    channel_name = body.channel_name.strip().lstrip("#").lower()
    if not channel_name or not _CHANNEL_RE.match(channel_name):
        raise HTTPException(status_code=422, detail={"error": "Invalid channel name — use lowercase letters, numbers, hyphens, underscores only", "code": "INVALID_CHANNEL"})

    existing = db.query(SlackChannel).filter(
        SlackChannel.project_id == project.id,
        SlackChannel.channel_name == channel_name,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail={"error": f"#{channel_name} is already in the list", "code": "DUPLICATE_CHANNEL"})

    ch = SlackChannel(project_id=project.id, channel_name=channel_name)
    db.add(ch)
    db.commit()
    db.refresh(ch)

    return {
        "id": str(ch.id),
        "channel_name": ch.channel_name,
        "message_count": None,
        "last_fetched_at": None,
    }


@router.delete("/{project_id}/slack/channels/{channel_name}")
async def delete_channel(
    project_id: str,
    channel_name: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Remove a channel from the project's list."""
    project = get_accessible_project(project_id, str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "NOT_FOUND"})
    require_editor_role(project, str(current_user.id), db)

    ch = db.query(SlackChannel).filter(
        SlackChannel.project_id == project.id,
        SlackChannel.channel_name == channel_name,
    ).first()
    if not ch:
        raise HTTPException(status_code=404, detail={"error": "Channel not found", "code": "NOT_FOUND"})

    db.delete(ch)
    db.commit()
    return {"success": True}


# ── Fetch ─────────────────────────────────────────────────────────────────────

@router.post("/{project_id}/slack/channels/{channel_name}/fetch")
async def fetch_channel(
    project_id: str,
    channel_name: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Fetch messages from a saved Slack channel using the stored bot token."""
    _require_pro(current_user)
    project = get_accessible_project(project_id, str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "NOT_FOUND"})
    require_editor_role(project, str(current_user.id), db)

    if not project.slack_bot_token:
        raise HTTPException(
            status_code=400,
            detail={"error": "No bot token saved. Add a token first.", "code": "NO_TOKEN"},
        )

    ch = db.query(SlackChannel).filter(
        SlackChannel.project_id == project.id,
        SlackChannel.channel_name == channel_name,
    ).first()
    if not ch:
        raise HTTPException(status_code=404, detail={"error": "Channel not found", "code": "NOT_FOUND"})

    token = project.slack_bot_token

    # Resolve channel name → ID (supports both public + private via groups:read)
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                "https://slack.com/api/conversations.list",
                headers={"Authorization": f"Bearer {token}"},
                params={"types": "public_channel,private_channel", "limit": 200},
            )
        data = resp.json()
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail={"error": "Slack API timed out", "code": "SLACK_TIMEOUT"})

    if not data.get("ok"):
        raise HTTPException(
            status_code=400,
            detail={"error": data.get("error", "Slack API error"), "code": "SLACK_ERROR"},
        )

    found = next((c for c in data.get("channels", []) if c["name"] == channel_name), None)
    if not found:
        raise HTTPException(
            status_code=404,
            detail={"error": f"#{channel_name} not found or bot not invited", "code": "CHANNEL_NOT_FOUND"},
        )
    channel_id = found["id"]

    # Pull messages
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                "https://slack.com/api/conversations.history",
                headers={"Authorization": f"Bearer {token}"},
                params={"channel": channel_id, "limit": 200},
            )
        data = resp.json()
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail={"error": "Slack API timed out", "code": "SLACK_TIMEOUT"})

    if not data.get("ok"):
        raise HTTPException(
            status_code=400,
            detail={"error": data.get("error", "Slack API error"), "code": "SLACK_ERROR"},
        )

    messages = [
        m.get("text", "").strip()
        for m in data.get("messages", [])
        if m.get("type") == "message" and m.get("text", "").strip() and not m.get("bot_id")
    ]

    if not messages:
        raise HTTPException(
            status_code=422,
            detail={"error": "No user messages found in this channel", "code": "NO_MESSAGES"},
        )

    extracted_text = f"Slack channel: #{channel_name}\n{'=' * 40}\n\n" + "\n\n---\n\n".join(messages)

    doc = UploadedDoc(
        project_id=project.id,
        user_id=current_user.id,
        original_name=f"#{channel_name} (Slack · {len(messages)} messages)",
        file_type="slack",
        extracted_text=extracted_text,
        char_count=len(extracted_text),
        insight_status="pending",
    )
    db.add(doc)

    ch.message_count = len(messages)
    ch.last_fetched_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(ch)

    extract_insights_task.delay(str(doc.id))

    return {
        "id": str(ch.id),
        "channel_name": ch.channel_name,
        "message_count": ch.message_count,
        "last_fetched_at": ch.last_fetched_at.isoformat(),
    }
