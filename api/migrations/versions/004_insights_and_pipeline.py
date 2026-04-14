"""insights table, uploaded_docs project_id, user PRD counters

Revision ID: 004
Revises: 003
Create Date: 2026-04-11

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── uploaded_docs: add project_id + insight_status, make analysis_id nullable ──
    op.add_column("uploaded_docs", sa.Column(
        "project_id", postgresql.UUID(as_uuid=True), nullable=True
    ))
    op.create_foreign_key(
        "fk_uploaded_docs_project_id", "uploaded_docs",
        "projects", ["project_id"], ["id"], ondelete="CASCADE"
    )
    op.add_column("uploaded_docs", sa.Column(
        "insight_status", sa.String(), nullable=False, server_default="pending"
    ))
    # Make analysis_id nullable — new uploads belong to project directly
    op.alter_column("uploaded_docs", "analysis_id", nullable=True)

    op.create_index("idx_docs_project_id", "uploaded_docs", ["project_id"])

    # ── insights table ──
    op.create_table(
        "insights",
        sa.Column("id", postgresql.UUID(as_uuid=True),
                  server_default=sa.text("uuid_generate_v4()"), nullable=False),
        sa.Column("project_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("source_doc_id", postgresql.UUID(as_uuid=True), nullable=True),
        # pain_point | feature_request | decision | action_item
        sa.Column("type", sa.String(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("quote", sa.Text(), nullable=True),
        sa.Column("frequency", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("content_hash", sa.String(64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True),
                  nullable=False, server_default=sa.text("NOW()")),
        sa.Column("updated_at", sa.DateTime(timezone=True),
                  nullable=False, server_default=sa.text("NOW()")),
        sa.ForeignKeyConstraint(["project_id"], ["projects.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["source_doc_id"], ["uploaded_docs.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        # DB-level dedup guard
        sa.UniqueConstraint("project_id", "content_hash", name="uq_insight_project_hash"),
    )
    op.create_index("idx_insights_project_id", "insights", ["project_id"])
    op.create_index("idx_insights_type", "insights", ["project_id", "type"])
    op.create_index("idx_insights_frequency", "insights", ["project_id", "frequency"])

    # Full-text search index (generated column approach via trigger — use raw SQL)
    op.execute("""
        ALTER TABLE insights
        ADD COLUMN search_vector tsvector
        GENERATED ALWAYS AS (
            to_tsvector('english', content || ' ' || coalesce(quote, ''))
        ) STORED
    """)
    op.execute(
        "CREATE INDEX idx_insights_search ON insights USING GIN(search_vector)"
    )

    # ── users: monthly PRD counter columns ──
    op.add_column("users", sa.Column(
        "prds_generated_this_month", sa.Integer(), nullable=False, server_default="0"
    ))
    op.add_column("users", sa.Column(
        "prds_reset_at", sa.DateTime(timezone=True), nullable=True
    ))


def downgrade() -> None:
    op.drop_column("users", "prds_reset_at")
    op.drop_column("users", "prds_generated_this_month")

    op.drop_index("idx_insights_search", "insights")
    op.drop_index("idx_insights_frequency", "insights")
    op.drop_index("idx_insights_type", "insights")
    op.drop_index("idx_insights_project_id", "insights")
    op.drop_table("insights")

    op.drop_index("idx_docs_project_id", "uploaded_docs")
    op.drop_constraint("fk_uploaded_docs_project_id", "uploaded_docs", type_="foreignkey")
    op.drop_column("uploaded_docs", "insight_status")
    op.drop_column("uploaded_docs", "project_id")
    op.alter_column("uploaded_docs", "analysis_id", nullable=False)
