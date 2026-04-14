from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session as DBSession
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.waitlist import WaitlistEmail

router = APIRouter()


class WaitlistRequest(BaseModel):
    email: EmailStr


@router.post("/")
async def join_waitlist(body: WaitlistRequest, db: DBSession = Depends(get_db)):
    try:
        entry = WaitlistEmail(email=body.email)
        db.add(entry)
        db.commit()
    except IntegrityError:
        db.rollback()
        # Don't leak whether email already exists
    return {"success": True, "message": "You're on the list!"}
