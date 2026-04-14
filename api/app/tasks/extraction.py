"""Celery task: Pipeline A — extract insights from an uploaded document."""
from app.worker import celery_app
from app.config import settings


@celery_app.task(bind=True, max_retries=3, default_retry_delay=30)
def extract_insights_task(self, doc_id: str) -> None:
    """Pipeline A — extract insights from an uploaded doc. Always free, always runs."""
    import anthropic as _anthropic
    from datetime import datetime, timezone
    from app.database import SessionLocal
    from app.models.uploaded_doc import UploadedDoc
    from app.models.insight import Insight
    from app.ai.extractor import EXTRACTION_SYSTEM_PROMPT, parse_extraction
    from app.ai.utils import insight_fingerprint

    db = SessionLocal()
    doc = None
    try:
        doc = db.query(UploadedDoc).filter(UploadedDoc.id == doc_id).first()
        if not doc or not doc.project_id:
            return

        doc.insight_status = "processing"
        db.commit()

        client = _anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        # Truncate to keep costs low — 15k chars ≈ ~4k tokens
        text = doc.extracted_text[:15_000]
        if len(doc.extracted_text) > 15_000:
            text += "\n\n[...truncated...]"

        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=2048,
            system=EXTRACTION_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": f"Document: {doc.original_name}\n\n{text}"}],
        )
        raw = message.content[0].text

        extracted = parse_extraction(raw)

        for item in extracted:
            fingerprint = insight_fingerprint(item["content"])

            existing = db.query(Insight).filter(
                Insight.project_id == doc.project_id,
                Insight.content_hash == fingerprint,
            ).first()

            if existing:
                existing.frequency += 1
                if item.get("quote") and item["quote"] not in (existing.quote or ""):
                    existing.quote = ((existing.quote or "") + "\n\n" + item["quote"]).strip()
                existing.updated_at = datetime.now(timezone.utc)
            else:
                db.add(Insight(
                    project_id=doc.project_id,
                    source_doc_id=doc.id,
                    type=item["type"],
                    content=item["content"],
                    quote=item.get("quote"),
                    content_hash=fingerprint,
                ))

        doc.insight_status = "done"
        db.commit()

    except Exception as exc:
        if doc:
            try:
                doc.insight_status = "failed"
                db.commit()
            except Exception:
                pass
        raise self.retry(exc=exc)
    finally:
        db.close()
