"""add pgvector, github_code_chunks table, github_index_status on projects

Revision ID: 011
Revises: 010
Create Date: 2026-04-15
"""
from alembic import op
import sqlalchemy as sa

revision = "011"
down_revision = "010"
branch_labels = None
depends_on = None


def upgrade():
    # vector extension must be installed by a superuser before running this migration:
    #   sudo -u postgres psql -c "CREATE EXTENSION IF NOT EXISTS vector;" -d pmread

    # github_index_status on projects
    op.add_column("projects", sa.Column("github_index_status", sa.String(), nullable=True))

    # Code chunks table
    op.execute("""
        CREATE TABLE github_code_chunks (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
            file_path TEXT NOT NULL,
            chunk_text TEXT NOT NULL,
            embedding vector(1536),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    """)
    op.execute("CREATE INDEX ix_github_code_chunks_project_id ON github_code_chunks (project_id)")
    # IVFFlat index for fast cosine search (created after data exists — safe to run after first indexing)
    # op.execute("CREATE INDEX ON github_code_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)")


def downgrade():
    op.execute("DROP TABLE IF EXISTS github_code_chunks")
    op.drop_column("projects", "github_index_status")
