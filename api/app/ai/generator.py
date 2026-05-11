"""
PRD generator with multi-model support.

Generation order (configured in llm_providers.GEN_PROVIDERS):
  1. Anthropic Claude Sonnet — best quality
  2. xAI Grok               — fallback on rate-limit / outage

SSE queues are in-process only — breaks with multiple workers (see KNOWN_ISSUES.md).
"""
import asyncio

from app.config import settings
from app.ai.prompts import (
    PRD_SYSTEM_PROMPT,
    SECTION_STATUS_MESSAGES,
    apply_workspace_template,
    build_prd_user_message,
)
from app.ai.context import build_insight_context
from app.ai.parser import parse_prd_response, prd_to_markdown
from app.services.llm_providers import stream_generation

# Per-analysis SSE queues: analysis_id -> asyncio.Queue
_streams: dict[str, asyncio.Queue] = {}


def get_or_create_queue(analysis_id: str) -> asyncio.Queue:
    if analysis_id not in _streams:
        _streams[analysis_id] = asyncio.Queue()
    return _streams[analysis_id]


async def emit_sse(analysis_id: str, data: dict) -> None:
    queue = get_or_create_queue(analysis_id)
    await queue.put(data)


def detect_section(text: str) -> str | None:
    for section in reversed(list(SECTION_STATUS_MESSAGES.keys())):
        if f"<{section}>" in text:
            return section
    return None


async def run_analysis(
    analysis_id: str,
    db_factory,
    insight_types: list[str] | None = None,
    starred_only: bool = False,
    days_back: int | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    user_id: str | None = None,
    user_plan: str = "free",
) -> None:
    """
    Generate a PRD from project insights, optionally filtered by type and recency.
    Free plan uses grok-3-mini; Pro/Team/Studio use Claude Sonnet (grok as fallback).
    Called as a FastAPI background task.
    """
    from datetime import datetime, timezone, timedelta
    from app.models.analysis import Analysis
    from app.models.insight import Insight

    db = db_factory()
    try:
        analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if not analysis:
            return

        analysis.status = "processing"
        db.commit()

        # ── Filter insights ────────────────────────────────────────────────────
        q = db.query(Insight).filter(Insight.project_id == analysis.project_id)

        if insight_types:
            q = q.filter(Insight.type.in_(insight_types))

        if starred_only:
            q = q.filter(Insight.starred == True)  # noqa: E712

        if date_from:
            q = q.filter(Insight.created_at >= datetime.fromisoformat(date_from).replace(tzinfo=timezone.utc))
        if date_to:
            q = q.filter(Insight.created_at <= datetime.fromisoformat(date_to).replace(hour=23, minute=59, second=59, tzinfo=timezone.utc))
        elif days_back and not date_from:
            cutoff = datetime.now(timezone.utc) - timedelta(days=days_back)
            q = q.filter(Insight.created_at >= cutoff)

        insights = q.order_by(Insight.frequency.desc()).all()
        used_insight_ids = [ins.id for ins in insights]

        if not insights:
            analysis.status = "failed"
            if insight_types or days_back or date_from or date_to:
                analysis.error_message = "No insights match the selected filters. Try broadening the type or time window."
            else:
                analysis.error_message = "No insights found in this project. Upload files first."
            db.commit()
            await emit_sse(analysis_id, {"type": "error", "message": analysis.error_message})
            return

        context = build_insight_context(insights)

        # GitHub codebase context — coming soon
        code_context = ""

        user_message = build_prd_user_message(analysis.question, context, code_context)

        # ── Workspace PRD template (Teams+) ───────────────────────────────────
        effective_system_prompt = PRD_SYSTEM_PROMPT
        from app.models.project import Project as _Project
        _proj = db.query(_Project).filter(_Project.id == analysis.project_id).first()
        if _proj and _proj.workspace_id:
            from app.models.workspace_prd_template import WorkspacePRDTemplate
            _tmpl = db.query(WorkspacePRDTemplate).filter(
                WorkspacePRDTemplate.workspace_id == _proj.workspace_id
            ).first()
            if _tmpl and (_tmpl.disabled_sections or _tmpl.section_hints):
                effective_system_prompt = apply_workspace_template(
                    PRD_SYSTEM_PROMPT,
                    _tmpl.disabled_sections or [],
                    _tmpl.section_hints or {},
                )

        await emit_sse(analysis_id, {"type": "status", "message": "Reading your customer evidence..."})

        # ── Streaming generation (Claude → Grok fallback) ─────────────────────
        full_response = ""
        current_section = None

        async def on_chunk(text: str) -> None:
            nonlocal full_response, current_section
            full_response += text

            # Section detection for progress updates
            section = detect_section(full_response)
            if section and section != current_section:
                current_section = section
                msg = SECTION_STATUS_MESSAGES.get(section, "Thinking...")
                await emit_sse(analysis_id, {"type": "status", "message": msg})

            await emit_sse(analysis_id, {"type": "chunk", "content": text})

        result = await stream_generation(
            system_prompt=effective_system_prompt,
            user_message=user_message,
            max_tokens=4096,
            on_chunk=on_chunk,
            prefer_provider="xai" if user_plan == "free" else None,
        )

        # on_chunk already accumulated full_response, but use result.full_text
        # as the canonical copy (handles edge cases where chunks were buffered)
        full_response = result.full_text

        brief = parse_prd_response(full_response)
        brief_markdown = prd_to_markdown(brief)

        analysis.status = "complete"
        analysis.brief = brief
        analysis.brief_markdown = brief_markdown
        analysis.tokens_used = result.tokens_used

        if used_insight_ids:
            db.query(Insight).filter(Insight.id.in_(used_insight_ids)).update(
                {"used_in_prd": True}, synchronize_session=False
            )
        db.commit()

        # Snapshot version on completion
        from app.models.prd_version import PrdVersion
        db.add(PrdVersion(
            prd_id=analysis.id,
            brief=analysis.brief,
            brief_markdown=analysis.brief_markdown,
            trigger="creation",
            triggered_by=analysis.user_id,
        ))

        # Audit log (workspace projects only)
        if _proj and _proj.workspace_id:
            from app.audit import audit
            audit(
                db,
                workspace_id=str(_proj.workspace_id),
                user_id=str(analysis.user_id) if analysis.user_id else None,
                action="prd_generated",
                resource_type="analysis",
                resource_id=str(analysis.id),
            )

        db.commit()

        await emit_sse(analysis_id, {"type": "complete", "analysis_id": analysis_id})

    except Exception as e:
        try:
            if settings.SENTRY_DSN:
                import sentry_sdk
                sentry_sdk.capture_exception(e)
            analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
            if analysis:
                analysis.status = "failed"
                # H10 fix: store full error internally, expose only a generic message to the client
                analysis.error_message = "PRD generation failed. Our team has been notified."
                analysis._internal_error = str(e)  # logged but not returned via API
                db.commit()
        except Exception:
            pass
        await emit_sse(analysis_id, {"type": "error", "message": "PRD generation failed. Please try again."})
    finally:
        db.close()
        await asyncio.sleep(60)
        _streams.pop(analysis_id, None)
