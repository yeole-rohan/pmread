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


_PLAN_ID_MAP: dict[tuple[str, str], tuple[str, str]] = {
    # (plan, billing): (config_attr, human_label)
    ("pro",   "monthly"): ("RAZORPAY_PRO_PLAN_ID",          "Pro monthly"),
    ("pro",   "annual"):  ("RAZORPAY_PRO_ANNUAL_PLAN_ID",   "Pro annual"),
    ("teams", "monthly"): ("RAZORPAY_TEAMS_PLAN_ID",        "Teams monthly"),
    ("teams", "annual"):  ("RAZORPAY_TEAMS_ANNUAL_PLAN_ID", "Teams annual"),
}


def _plan_id_for(plan: str, billing: str) -> str:
    """Return the Razorpay Plan ID for the requested plan + billing period."""
    key = (plan, billing if billing in ("monthly", "annual") else "monthly")
    entry = _PLAN_ID_MAP.get(key)
    if not entry:
        raise HTTPException(
            status_code=400,
            detail={"error": f"Unknown plan/billing combination: {plan}/{billing}", "code": "INVALID_PLAN"},
        )
    attr, label = entry
    plan_id = getattr(settings, attr, "")
    if not plan_id:
        raise HTTPException(
            status_code=503,
            detail={"error": f"Razorpay {label} plan not configured", "code": "NOT_CONFIGURED"},
        )
    return plan_id


def _target_plan_from_razorpay_id(plan_id: str) -> str:
    """Reverse-lookup: given a Razorpay plan_id return 'pro' or 'teams'."""
    teams_ids = {settings.RAZORPAY_TEAMS_PLAN_ID, settings.RAZORPAY_TEAMS_ANNUAL_PLAN_ID} - {""}
    if plan_id in teams_ids:
        return "teams"
    return "pro"  # default fallback


# ─────────────────────────────────────────────
# Create subscription
# ─────────────────────────────────────────────

class CreateSubscriptionRequest(BaseModel):
    billing: str = "monthly"  # "monthly" | "annual"
    plan: str = "pro"         # "pro" | "teams"


@router.post("/razorpay/create-subscription")
async def razorpay_create_subscription(
    body: CreateSubscriptionRequest = Body(default_factory=CreateSubscriptionRequest),
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """
    Creates a Razorpay subscription for Pro or Teams and returns subscription_id + key_id.
    The frontend opens the Razorpay checkout widget with these values.
    """
    if body.plan not in ("pro", "teams"):
        raise HTTPException(status_code=400, detail={"error": "Invalid plan", "code": "INVALID_PLAN"})
    _require_razorpay()
    plan_id = _plan_id_for(body.plan, body.billing)
    client = _razorpay_client()

    total_count = 10 if body.billing == "annual" else 120

    if body.plan == "teams":
        name = "PMRead Teams"
        description = (
            "Unlimited PRDs · Team workspace · Azure DevOps · 3 seats · Billed annually"
            if body.billing == "annual"
            else "Unlimited PRDs · Team workspace · Azure DevOps · 3 seats"
        )
    else:
        name = "PMRead Pro"
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
            "target_plan": body.plan,
        },
    })

    return {
        "subscription_id": subscription["id"],
        "key_id": settings.RAZORPAY_KEY_ID,
        "name": name,
        "description": description,
        "billing": body.billing,
        "target_plan": body.plan,
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
    # billing_period intentionally removed — derived server-side from Razorpay (C4 fix)


@router.post("/razorpay/verify")
async def razorpay_verify_payment(
    body: RazorpayVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """
    Called by the frontend after the Razorpay widget reports success.
    Verifies HMAC signature, then upgrades the user to Pro.
    billing_period is derived from the Razorpay subscription — never trusted from client.
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

    # Derive plan + billing_period server-side — never trust the client body
    client = _razorpay_client()
    try:
        sub = client.subscription.fetch(body.razorpay_subscription_id)
        razorpay_plan_id = sub.get("plan_id", "")
        current_end_ts = sub.get("current_end")
    except Exception:
        razorpay_plan_id = ""
        current_end_ts = None

    target_plan = _target_plan_from_razorpay_id(razorpay_plan_id)
    annual_ids = {settings.RAZORPAY_PRO_ANNUAL_PLAN_ID, settings.RAZORPAY_TEAMS_ANNUAL_PLAN_ID} - {""}
    billing_period = "annual" if razorpay_plan_id in annual_ids else "monthly"

    current_user.plan = target_plan
    current_user.billing_provider = "razorpay"
    current_user.billing_period = billing_period
    current_user.plan_renews_at = (
        datetime.fromtimestamp(current_end_ts, tz=timezone.utc) if current_end_ts else None
    )
    current_user.razorpay_sub_id = body.razorpay_subscription_id
    current_user.razorpay_payment_id = body.razorpay_payment_id
    current_user.plan_started_at = datetime.now(timezone.utc)
    current_user.plan_expires_at = None
    db.commit()

    if target_plan == "teams":
        from app.tasks.email_tasks import send_teams_welcome_email_task
        send_teams_welcome_email_task.delay(current_user.email, current_user.display_name or "")
    else:
        from app.tasks.email_tasks import send_pro_welcome_email_task
        send_pro_welcome_email_task.delay(current_user.email, current_user.display_name or "")

    return {"success": True, "plan": target_plan}


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

    # Fetch subscription to get current billing period end date so the UI
    # can show "Active until <date>" and hide the cancel button immediately.
    try:
        sub = client.subscription.fetch(current_user.razorpay_sub_id)
        current_end = sub.get("current_end")
        if current_end:
            current_user.plan_expires_at = datetime.fromtimestamp(current_end, tz=timezone.utc)
            current_user.plan_renews_at = None
            db.commit()
    except Exception:
        pass  # Non-fatal — webhook will set plan_expires_at when it fires

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
        notes = entity.get("notes", {})
        billing_period = notes.get("billing_period", "monthly")
        razorpay_plan_id = entity.get("plan_id", "")
        target_plan = _target_plan_from_razorpay_id(razorpay_plan_id) if razorpay_plan_id else notes.get("target_plan", "pro")

        user = db.query(User).filter(User.razorpay_sub_id == sub_id).first()
        if user:
            if payment_id and user.razorpay_payment_id == payment_id:
                return {"received": True}  # idempotent — already processed
            prev_plan = user.plan
            user.plan = target_plan
            user.billing_provider = "razorpay"
            user.billing_period = billing_period
            user.plan_expires_at = None
            if payment_id:
                user.razorpay_payment_id = payment_id
            db.commit()
            if prev_plan != target_plan:
                if target_plan == "teams":
                    from app.tasks.email_tasks import send_teams_welcome_email_task
                    send_teams_welcome_email_task.delay(user.email, user.display_name or "")
                elif target_plan == "pro":
                    from app.tasks.email_tasks import send_pro_welcome_email_task
                    send_pro_welcome_email_task.delay(user.email, user.display_name or "")

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
