"""Claude streaming PRD generator and SSE queue infrastructure."""
import asyncio

import anthropic

from app.config import settings
from app.ai.prompts import (
    PRD_SYSTEM_PROMPT,
    SECTION_STATUS_MESSAGES,
    build_prd_user_message,
)
from app.ai.context import build_insight_context
from app.ai.parser import parse_prd_response, prd_to_markdown

# Per-analysis SSE queues: analysis_id -> asyncio.Queue
# NOTE: in-process only — breaks with multiple workers. See KNOWN_ISSUES.md.
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
) -> None:
    """
    Generate a PRD from project insights, optionally filtered by type and recency.
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

        # Build filtered insight query
        q = db.query(Insight).filter(Insight.project_id == analysis.project_id)

        if insight_types:
            q = q.filter(Insight.type.in_(insight_types))

        if starred_only:
            q = q.filter(Insight.starred == True)  # noqa: E712

        # Custom date range takes priority over days_back
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
        user_message = build_prd_user_message(analysis.question, context)

        await emit_sse(analysis_id, {"type": "status", "message": "Reading your customer evidence..."})

        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        full_response = ""
        current_section = None
        buffer = ""

        with client.messages.stream(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            system=PRD_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        ) as stream:
            for text in stream.text_stream:
                full_response += text
                buffer += text

                section = detect_section(full_response)
                if section and section != current_section:
                    current_section = section
                    msg = SECTION_STATUS_MESSAGES.get(section, "Thinking...")
                    await emit_sse(analysis_id, {"type": "status", "message": msg})

                if len(buffer) >= 50:
                    await emit_sse(analysis_id, {"type": "chunk", "content": buffer})
                    buffer = ""

            if buffer:
                await emit_sse(analysis_id, {"type": "chunk", "content": buffer})

            final_message = stream.get_final_message()
            tokens_used = (final_message.usage.input_tokens or 0) + (final_message.usage.output_tokens or 0)

        brief = parse_prd_response(full_response)
        brief_markdown = prd_to_markdown(brief)

        analysis.status = "complete"
        analysis.brief = brief
        analysis.brief_markdown = brief_markdown
        analysis.tokens_used = tokens_used

        if used_insight_ids:
            db.query(Insight).filter(Insight.id.in_(used_insight_ids)).update(
                {"used_in_prd": True}, synchronize_session=False
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
                analysis.error_message = str(e)
                db.commit()
        except Exception:
            pass
        await emit_sse(analysis_id, {"type": "error", "message": "PRD generation failed. Please try again."})
    finally:
        db.close()
        await asyncio.sleep(60)
        _streams.pop(analysis_id, None)
