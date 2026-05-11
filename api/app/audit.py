"""Thin helper for writing audit log entries.

Usage:
    audit(db, workspace_id=str(project.workspace_id), user_id=str(user.id),
          action="prd_generated", resource_type="analysis", resource_id=str(analysis.id))
"""
from datetime import datetime, timezone

from sqlalchemy.orm import Session as DBSession


def audit(
    db: DBSession,
    *,
    workspace_id: str,
    user_id: str | None = None,
    action: str,
    resource_type: str | None = None,
    resource_id: str | None = None,
    meta: dict | None = None,
) -> None:
    from app.models.audit_log import AuditLog
    entry = AuditLog(
        workspace_id=workspace_id,
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        meta=meta or {},
        created_at=datetime.now(timezone.utc),
    )
    db.add(entry)
