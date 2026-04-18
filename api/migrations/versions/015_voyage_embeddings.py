"""switch github_code_chunks embedding to voyage-code-3 (1024-dim)

Revision ID: 015
Revises: 014
Create Date: 2026-04-18
"""
from alembic import op

revision = "015"
down_revision = "014"
branch_labels = None
depends_on = None


def upgrade():
    # Drop existing embedding column (was vector(1536), OpenAI dimensions).
    # All existing chunks have embedding=NULL anyway (FTS-only so far), so no data loss.
    op.execute("ALTER TABLE github_code_chunks DROP COLUMN IF EXISTS embedding")

    # Re-add as vector(1024) for VoyageAI voyage-code-3
    op.execute("ALTER TABLE github_code_chunks ADD COLUMN embedding vector(1024)")

    # IVFFlat index for fast cosine similarity search.
    # lists=50 is appropriate for tables up to ~500K rows; increase later if needed.
    # Only useful once rows exist, so harmless to create now.
    op.execute("""
        CREATE INDEX IF NOT EXISTS ix_github_chunks_embedding_cosine
        ON github_code_chunks
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 50)
    """)


def downgrade():
    op.execute("DROP INDEX IF EXISTS ix_github_chunks_embedding_cosine")
    op.execute("ALTER TABLE github_code_chunks DROP COLUMN IF EXISTS embedding")
    op.execute("ALTER TABLE github_code_chunks ADD COLUMN embedding vector(1536)")
