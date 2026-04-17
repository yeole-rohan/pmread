import hashlib
import hmac as hmac_module
from datetime import datetime, timezone

from fastapi import APIRouter, Body, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.config import settings
from app.database import get_db
from app.models.user import User

router = APIRouter()


# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────

def _razorpay_client():
    import razorpay
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


def _require_razorpay():
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(
            status_code=503,
            detail={"error": "Razorpay not configured", "code": "NOT_CONFIGURED"},
        )


def _plan_id_for(billing: str) -> str:
    """Return the Razorpay Plan ID for the requested billing period."""
    if billing == "annual":
        if not settings.RAZORPAY_PRO_ANNUAL_PLAN_ID:
            raise HTTPException(
                status_code=503,
                detail={"error": "Annual Razorpay plan not configured", "code": "NOT_CONFIGURED"},
            )
        return settings.RAZORPAY_PRO_ANNUAL_PLAN_ID
    if not settings.RAZORPAY_PRO_PLAN_ID:
        raise HTTPException(
            status_code=503,
            detail={"error": "Monthly Razorpay plan not configured", "code": "NOT_CONFIGURED"},
        )
    return settings.RAZORPAY_PRO_PLAN_ID


# ─────────────────────────────────────────────
# Create subscription
# ─────────────────────────────────────────────

class CreateSubscriptionRequest(BaseModel):
    billing: str = "monthly"   # "monthly" | "annual"


@router.post("/razorpay/create-subscription")
async def razorpay_create_subscription(
    body: CreateSubscriptionRequest = Body(default_factory=CreateSubscriptionRequest),
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """
    Creates a Razorpay subscription and returns subscription_id + key_id.
    The frontend opens the Razorpay checkout widget with these values.
    """
    _require_razorpay()
    plan_id = _plan_id_for(body.billing)
    client = _razorpay_client()

    # total_count: Razorpay requires >= 1.
    # Use 120 for monthly (10 years), 10 for annual (10 years).
    total_count = 10 if body.billing == "annual" else 120

    description = (
        "15 PRDs/month · All exports · Unlimited uploads · Billed annually"
        if body.billing == "annual"
        else "15 PRDs/month · All exports · Unlimited uploads"
    )

    subscription = client.subscription.create({
        "plan_id": plan_id,
        "customer_notify": 1,
        "quantity": 1,
        "total_count": total_count,
        "notes": {
            "pmread_user_id": str(current_user.id),
            "email": current_user.email,
            "billing_period": body.billing,
        },
    })

    return {
        "subscription_id": subscription["id"],
        "key_id": settings.RAZORPAY_KEY_ID,
        "name": "PMRead Pro",
        "description": description,
        "billing": body.billing,
        "prefill": {
            "email": current_user.email,
            "name": current_user.display_name or "",
        },
    }


# ─────────────────────────────────────────────
# Verify payment
# ─────────────────────────────────────────────

class RazorpayVerifyRequest(BaseModel):
    razorpay_payment_id: str
    razorpay_subscription_id: str
    razorpay_signature: str
    billing_period: str = "monthly"   # "monthly" | "annual"


@router.post("/razorpay/verify")
async def razorpay_verify_payment(
    body: RazorpayVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """
    Called by the frontend after the Razorpay widget reports success.
    Verifies HMAC signature, then upgrades the user to Pro.
    """
    if not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(
            status_code=503,
            detail={"error": "Razorpay not configured", "code": "NOT_CONFIGURED"},
        )

    msg = f"{body.razorpay_payment_id}|{body.razorpay_subscription_id}"
    expected = hmac_module.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        msg.encode(),
        hashlib.sha256,
    ).hexdigest()

    if not hmac_module.compare_digest(expected, body.razorpay_signature):
        raise HTTPException(
            status_code=400,
            detail={"error": "Invalid payment signature", "code": "INVALID_SIGNATURE"},
        )

    current_user.plan = "pro"
    current_user.billing_provider = "razorpay"
    current_user.billing_period = body.billing_period
    current_user.razorpay_sub_id = body.razorpay_subscription_id
    current_user.razorpay_payment_id = body.razorpay_payment_id
    current_user.plan_started_at = datetime.now(timezone.utc)
    current_user.plan_expires_at = None
    db.commit()

    return {"success": True}


# ─────────────────────────────────────────────
# Cancel subscription
# ─────────────────────────────────────────────

@router.post("/razorpay/cancel")
async def razorpay_cancel_subscription(
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Cancel the current user's Razorpay subscription at end of billing cycle."""
    if not current_user.razorpay_sub_id:
        raise HTTPException(
            status_code=400,
            detail={"error": "No active Razorpay subscription", "code": "NO_SUBSCRIPTION"},
        )
    _require_razorpay()
    client = _razorpay_client()
    client.subscription.cancel(current_user.razorpay_sub_id, {"cancel_at_cycle_end": 1})
    return {"success": True, "message": "Subscription will cancel at end of billing period"}


# ─────────────────────────────────────────────
# Webhook
# ─────────────────────────────────────────────

@router.post("/webhook/razorpay")
async def razorpay_webhook(request: Request, db: DBSession = Depends(get_db)):
    """Handles subscription lifecycle events pushed from Razorpay dashboard."""
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
        # Determine billing period from notes if available
        notes = entity.get("notes", {})
        billing_period = notes.get("billing_period", "monthly")

        user = db.query(User).filter(User.razorpay_sub_id == sub_id).first()
        if user:
            if payment_id and user.razorpay_payment_id == payment_id:
                return {"received": True}  # idempotent — already processed
            user.plan = "pro"
            user.billing_provider = "razorpay"
            user.billing_period = billing_period
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
            user.billing_period = None
            user.razorpay_sub_id = None
            user.plan_expires_at = (
                datetime.fromtimestamp(ended_at, tz=timezone.utc) if ended_at else None
            )
            db.commit()

    elif event_type == "subscription.halted":
        # Payment failed after retries — downgrade immediately
        entity = event["payload"]["subscription"]["entity"]
        sub_id = entity["id"]
        user = db.query(User).filter(User.razorpay_sub_id == sub_id).first()
        if user:
            user.plan = "free"
            user.billing_provider = None
            user.billing_period = None
            user.razorpay_sub_id = None
            user.plan_expires_at = None
            db.commit()

    return {"received": True}
