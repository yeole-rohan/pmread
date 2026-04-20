from datetime import datetime
from sqlalchemy import String, DateTime, Text, Float
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class CeleryTask(Base):
    """Reflects the celery_taskmeta table that Celery creates automatically."""
    __tablename__ = "celery_taskmeta"

    id: Mapped[int] = mapped_column(primary_key=True)
    task_id: Mapped[str] = mapped_column(String(155), unique=True)
    status: Mapped[str | None] = mapped_column(String(50))
    result: Mapped[str | None] = mapped_column(Text)
    date_done: Mapped[datetime | None] = mapped_column(DateTime)
    traceback: Mapped[str | None] = mapped_column(Text)
    name: Mapped[str | None] = mapped_column(String(155))
    args: Mapped[str | None] = mapped_column(Text)
    kwargs: Mapped[str | None] = mapped_column(Text)
    worker: Mapped[str | None] = mapped_column(String(155))
    retries: Mapped[int | None] = mapped_column()
    queue: Mapped[str | None] = mapped_column(String(155))
