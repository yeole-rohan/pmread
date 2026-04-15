"""
Redis pub/sub for real-time project events.

Celery tasks (extraction, github_index) call publish_project_event() to push
status updates. The FastAPI SSE endpoint subscribes and forwards to the browser.

Channel pattern:  project:{project_id}
Event payload:    JSON string  {"type": "...", ...fields}

Event types:
  extraction    {"type": "extraction", "doc_id": "...", "status": "done"|"failed", "insight_count": N}
  github_index  {"type": "github_index", "status": "indexing"|"ready"|"failed", "chunk_count": N}
"""
from __future__ import annotations

import json
import logging
from typing import AsyncIterator

from app.config import settings

logger = logging.getLogger(__name__)


def _channel(project_id: str) -> str:
    return f"project:{project_id}"


# ── Publish (sync — called from Celery workers) ───────────────────────────────

def publish_project_event(project_id: str, event: dict) -> None:
    """Publish an event from a Celery task (sync context)."""
    try:
        import redis as _redis
        r = _redis.from_url(settings.REDIS_URL, decode_responses=True)
        r.publish(_channel(project_id), json.dumps(event))
        r.close()
    except Exception as e:
        logger.warning("Failed to publish project event for %s: %s", project_id, e)


# ── Subscribe (async — called from FastAPI SSE endpoint) ─────────────────────

async def subscribe_project_events(
    project_id: str,
    timeout_seconds: int = 300,
) -> AsyncIterator[dict]:
    """
    Async generator that yields event dicts published to this project's channel.
    Exits after timeout_seconds of inactivity or when the client disconnects.
    """
    import redis.asyncio as aioredis

    r = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    pubsub = r.pubsub()
    await pubsub.subscribe(_channel(project_id))

    try:
        deadline = timeout_seconds
        while deadline > 0:
            # get_message returns None if nothing arrived within 1 second
            message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
            if message and message.get("type") == "message":
                try:
                    yield json.loads(message["data"])
                except Exception:
                    pass
            else:
                deadline -= 1
    finally:
        await pubsub.unsubscribe(_channel(project_id))
        await r.aclose()
