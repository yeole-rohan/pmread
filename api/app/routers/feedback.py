from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.database import get_db
from app.models.feedback import Feedback
from app.models.user import User

router = APIRouter()

VALID_CATEGORIES = {"bug", "suggestion", "praise"}


class FeedbackRequest(BaseModel):
    category: str
    message: str
    page: str | None = None


@router.post("/")
async def submit_feedback(
    body: FeedbackRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    if body.category not in VALID_CATEGORIES:
        body.category = "suggestion"

    entry = Feedback(
        user_id=current_user.id,
        category=body.category,
        message=body.message.strip()[:2000],
        page=body.page,
    )
    db.add(entry)
    db.commit()

    return {"success": True}
