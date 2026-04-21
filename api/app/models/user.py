import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, Integer, DateTime, text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("uuid_generate_v4()")
    )
    email: Mapped[str] = mapped_column(String, nullable=False, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    display_name: Mapped[str | None] = mapped_column(String, nullable=True)
    email_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    verify_token: Mapped[str | None] = mapped_column(String, nullable=True)
    verify_token_exp: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    # plan: 'free' | 'pro'  (team/studio deferred)
    plan: Mapped[str] = mapped_column(String, nullable=False, default="free")
    billing_provider: Mapped[str | None] = mapped_column(String, nullable=True)  # 'stripe' | 'razorpay'
    plan_started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    plan_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    plan_renews_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    # Stripe
    stripe_customer_id: Mapped[str | None] = mapped_column(String, nullable=True, index=True)
    stripe_sub_id: Mapped[str | None] = mapped_column(String, nullable=True)
    # Razorpay
    razorpay_sub_id: Mapped[str | None] = mapped_column(String, nullable=True)
    razorpay_payment_id: Mapped[str | None] = mapped_column(String, nullable=True)  # last successful payment
    billing_period: Mapped[str | None] = mapped_column(String, nullable=True)  # 'monthly' | 'annual'
    analyses_used: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    # Founding member credits — never expire, consumed before monthly plan limit
    prd_credits: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    # Monthly PRD counter — reset on 1st of each month
    prds_generated_this_month: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    prds_reset_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=text("NOW()")
    )
    digest_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    # Password reset
    password_reset_token: Mapped[str | None] = mapped_column(String, nullable=True)
    password_reset_exp: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    # GitHub OAuth
    github_access_token: Mapped[str | None] = mapped_column(String, nullable=True)
