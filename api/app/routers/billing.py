import hashlib
import hmac as hmac_module
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.config import settings
from app.database import get_db
from app.models.user import User

router = APIRouter()


# ─────────────────────────────────────────────
# Razorpay
# ─────────────────────────────────────────────

@router.post("/razorpay/create-subscription")
async def razorpay_create_subscription(
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """
    Creates a Razorpay subscription and returns the subscription_id + key_id.
    Frontend opens the Razorpay checkout widget with these values.
    """
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=503, detail={"error": "Razorpay not configured", "code": "NOT_CONFIGURED"})
    if not settings.RAZORPAY_PRO_PLAN_ID:
        raise HTTPException(status_code=503, detail={"error": "Razorpay plan not configured", "code": "NOT_CONFIGURED"})

    import razorpay
    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    subscription = client.subscription.create({
        "plan_id": settings.RAZORPAY_PRO_PLAN_ID,
        "customer_notify": 1,
        "quantity": 1,
        "total_count": 120,  # 120 months (Razorpay requires >= 1; use large number for open-ended)
        "notes": {
            "pmread_user_id": str(current_user.id),
            "email": current_user.email,
        },
    })

    return {
        "subscription_id": subscription["id"],
        "key_id": settings.RAZORPAY_KEY_ID,
        "name": "PMRead Pro",
        "description": "15 PRDs/month · All exports · Unlimited uploads",
        "prefill": {
            "email": current_user.email,
            "name": current_user.display_name or "",
        },
    }


class RazorpayVerifyRequest(BaseModel):
    razorpay_payment_id: str
    razorpay_subscription_id: str
    razorpay_signature: str


@router.post("/razorpay/verify")
async def razorpay_verify_payment(
    body: RazorpayVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """
    Called by the frontend after the Razorpay widget reports success.
    Verifies the HMAC signature, then upgrades the user.
    """
    if not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=503, detail={"error": "Razorpay not configured", "code": "NOT_CONFIGURED"})

    msg = f"{body.razorpay_payment_id}|{body.razorpay_subscription_id}"
    expected = hmac_module.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        msg.encode(),
        hashlib.sha256,
    ).hexdigest()

    if not hmac_module.compare_digest(expected, body.razorpay_signature):
        raise HTTPException(status_code=400, detail={"error": "Invalid payment signature", "code": "INVALID_SIGNATURE"})

    current_user.plan = "pro"
    current_user.billing_provider = "razorpay"
    current_user.razorpay_sub_id = body.razorpay_subscription_id
    current_user.razorpay_payment_id = body.razorpay_payment_id
    current_user.plan_started_at = datetime.now(timezone.utc)
    current_user.plan_expires_at = None
    db.commit()

    return {"success": True}


@router.post("/razorpay/cancel")
async def razorpay_cancel_subscription(
    current_user: User = Depends(get_current_user),
):
    """Cancel the current user's Razorpay subscription at end of billing cycle."""
    if not current_user.razorpay_sub_id:
        raise HTTPException(status_code=400, detail={"error": "No active Razorpay subscription", "code": "NO_SUBSCRIPTION"})
    if not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=503, detail={"error": "Razorpay not configured", "code": "NOT_CONFIGURED"})

    import razorpay
    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    client.subscription.cancel(current_user.razorpay_sub_id, {"cancel_at_cycle_end": 1})

    return {"success": True, "message": "Subscription will cancel at end of billing period"}


@router.post("/webhook/razorpay")
async def razorpay_webhook(request: Request, db: DBSession = Depends(get_db)):
    """Handles subscription lifecycle events from Razorpay dashboard."""
    if not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=503)

    payload = await request.body()
    sig = request.headers.get("x-razorpay-signature", "")

    expected = hmac_module.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        payload,
        hashlib.sha256,
    ).hexdigest()

    if not hmac_module.compare_digest(expected, sig):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    import json
    event = json.loads(payload)
    event_type = event.get("event")

    if event_type == "subscription.charged":
        entity = event["payload"]["subscription"]["entity"]
        payment_entity = event["payload"].get("payment", {}).get("entity", {})
        sub_id = entity["id"]
        payment_id = payment_entity.get("id")
        user = db.query(User).filter(User.razorpay_sub_id == sub_id).first()
        if user:
            if payment_id and user.razorpay_payment_id == payment_id:
                return {"received": True}  # already processed
            user.plan = "pro"
            user.billing_provider = "razorpay"
            user.plan_expires_at = None
            if payment_id:
                user.razorpay_payment_id = payment_id
            db.commit()

    elif event_type in ("subscription.completed", "subscription.cancelled"):
        entity = event["payload"]["subscription"]["entity"]
        sub_id = entity["id"]
        ended_at = entity.get("ended_at") or entity.get("current_end")
        user = db.query(User).filter(User.razorpay_sub_id == sub_id).first()
        if user:
            user.plan = "free"
            user.billing_provider = None
            user.razorpay_sub_id = None
            user.plan_expires_at = (
                datetime.fromtimestamp(ended_at, tz=timezone.utc) if ended_at else None
            )
            db.commit()

    elif event_type == "subscription.halted":
        entity = event["payload"]["subscription"]["entity"]
        sub_id = entity["id"]
        user = db.query(User).filter(User.razorpay_sub_id == sub_id).first()
        if user:
            user.plan = "free"
            user.billing_provider = None
            user.razorpay_sub_id = None
            user.plan_expires_at = None
            db.commit()

    return {"received": True}
