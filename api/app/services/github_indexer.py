"""
GitHub codebase indexer.

Flow:
  1. Fetch the repo's file tree (main/master branch).
  2. Filter to source files only; skip build artefacts & large files.
  3. Fetch up to MAX_FILES file contents in parallel batches.
  4. Chunk each file into ~CHUNK_CHARS-char segments with overlap.
  5. Embed all chunks via llm_providers.embed_batch (xAI → OpenAI priority).
  6. Replace old chunks for the project and insert new ones.
  7. Set project.github_index_status = "ready" | "failed".

Requires at least one embedding API key (XAI_API_KEY or OPENAI_API_KEY).
Falls back to README+issues approach if no key is configured.
"""
from __future__ import annotations

import asyncio
import base64
import logging
from typing import Any

import httpx

logger = logging.getLogger(__name__)

# ── tunables ──────────────────────────────────────────────────────────────────

MAX_FILES = 120          # max source files to embed
MAX_FILE_BYTES = 80_000  # skip files larger than this (80 KB)
CHUNK_CHARS = 1_200      # ~300 tokens per chunk
CHUNK_OVERLAP = 150      # chars of overlap between consecutive chunks
EMBED_BATCH = 100        # OpenAI embedding API batch size

SOURCE_EXTENSIONS = {
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".py", ".go", ".rb", ".java", ".rs", ".swift",
    ".kt", ".cs", ".php", ".vue", ".svelte", ".ex", ".exs",
}

SKIP_PATH_PARTS = {
    "node_modules", ".git", "dist", "build", "__pycache__",
    ".pytest_cache", "vendor", "coverage", ".next", "out",
    ".nuxt", "target", "bin", "obj", ".venv", "venv", "env",
    "migrations",  # skip DB migration files — rarely useful for PRD context
}

GITHUB_API_BASE = "https://api.github.com"


def _gh_headers(token: str) -> dict:
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


def _should_index(path: str) -> bool:
    """Return True if this file path is worth indexing."""
    parts = path.split("/")
    # Skip any path that contains a skip-segment
    if any(p in SKIP_PATH_PARTS for p in parts):
        return False
    # Skip dot-files / dot-dirs
    if any(p.startswith(".") for p in parts):
        return False
    # Extension check (last part)
    filename = parts[-1]
    ext = "." + filename.rsplit(".", 1)[-1] if "." in filename else ""
    return ext in SOURCE_EXTENSIONS


def _chunk_text(text: str, file_path: str) -> list[str]:
    """Split text into overlapping chunks prefixed with the file path."""
    prefix = f"// file: {file_path}\n"
    chunks: list[str] = []
    start = 0
    while start < len(text):
        end = start + CHUNK_CHARS
        chunk = text[start:end]
        # Snap to nearest newline to avoid mid-line splits
        if end < len(text):
            nl = chunk.rfind("\n")
            if nl > CHUNK_CHARS // 2:
                chunk = chunk[:nl]
        chunks.append(prefix + chunk.strip())
        start += len(chunk) - CHUNK_OVERLAP
        if start >= len(text):
            break
    return [c for c in chunks if len(c.strip()) > 50]


async def _fetch_file_content(
    client: httpx.AsyncClient, repo: str, path: str, token: str
) -> str | None:
    """Fetch decoded content of a single file via GitHub contents API."""
    try:
        resp = await client.get(
            f"{GITHUB_API_BASE}/repos/{repo}/contents/{path}",
            headers=_gh_headers(token),
            timeout=10,
        )
        if resp.status_code != 200:
            return None
        data = resp.json()
        if data.get("encoding") == "base64" and data.get("content"):
            raw = base64.b64decode(data["content"]).decode("utf-8", errors="ignore")
            if len(raw) > MAX_FILE_BYTES:
                return None
            return raw
    except Exception:
        pass
    return None


async def _get_default_branch(client: httpx.AsyncClient, repo: str, token: str) -> str:
    try:
        resp = await client.get(
            f"{GITHUB_API_BASE}/repos/{repo}",
            headers=_gh_headers(token),
            timeout=10,
        )
        if resp.status_code == 200:
            return resp.json().get("default_branch", "main")
    except Exception:
        pass
    return "main"


async def _fetch_tree(
    client: httpx.AsyncClient, repo: str, branch: str, token: str
) -> list[dict[str, Any]]:
    """Return list of file entries from the recursive git tree."""
    try:
        resp = await client.get(
            f"{GITHUB_API_BASE}/repos/{repo}/git/trees/{branch}",
            headers=_gh_headers(token),
            params={"recursive": "1"},
            timeout=20,
        )
        if resp.status_code == 200:
            data = resp.json()
            return [
                item for item in data.get("tree", [])
                if item.get("type") == "blob"
                and item.get("size", 0) <= MAX_FILE_BYTES
                and _should_index(item["path"])
            ]
    except Exception:
        pass
    return []




async def index_github_repo(
    project_id: str,
    repo_full_name: str,
    github_token: str,
    db_factory,
) -> None:
    """
    Background task: index a GitHub repo into github_code_chunks.
    Uses PostgreSQL full-text search — no embedding API needed.
    Sets project.github_index_status to 'ready' or 'failed'.
    """
    db = db_factory()
    try:
        from app.models.project import Project
        from app.models.github_chunk import GithubCodeChunk

        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return

        project.github_index_status = "indexing"
        db.commit()

        async with httpx.AsyncClient(timeout=30) as client:
            branch = await _get_default_branch(client, repo_full_name, github_token)
            tree = await _fetch_tree(client, repo_full_name, branch, github_token)

        if not tree:
            project.github_index_status = "failed"
            db.commit()
            from app.services.project_events import publish_project_event
            publish_project_event(project_id, {"type": "github_index", "status": "failed", "chunk_count": 0})
            return

        # Prioritise by size ascending (smallest = densest logic), cap at MAX_FILES
        tree.sort(key=lambda f: f.get("size", 0))
        tree = tree[:MAX_FILES]

        logger.info("Indexing %d files from %s", len(tree), repo_full_name)

        # Fetch file contents in parallel batches of 10
        all_chunks: list[tuple[str, str]] = []  # (file_path, chunk_text)
        FETCH_BATCH = 10

        async with httpx.AsyncClient(timeout=30) as client:
            for i in range(0, len(tree), FETCH_BATCH):
                batch = tree[i: i + FETCH_BATCH]
                results = await asyncio.gather(
                    *[_fetch_file_content(client, repo_full_name, f["path"], github_token) for f in batch],
                    return_exceptions=True,
                )
                for f, content in zip(batch, results):
                    if isinstance(content, str) and content.strip():
                        for chunk in _chunk_text(content, f["path"]):
                            all_chunks.append((f["path"], chunk))

        if not all_chunks:
            project.github_index_status = "failed"
            db.commit()
            from app.services.project_events import publish_project_event
            publish_project_event(project_id, {"type": "github_index", "status": "failed", "chunk_count": 0})
            return

        logger.info("Storing %d chunks from %s (full-text search, no embedding)", len(all_chunks), repo_full_name)

        # Delete old chunks for this project, then bulk-insert new ones
        db.query(GithubCodeChunk).filter(GithubCodeChunk.project_id == project_id).delete()

        for file_path, chunk_text in all_chunks:
            db.add(GithubCodeChunk(
                project_id=project_id,
                file_path=file_path,
                chunk_text=chunk_text,
                # embedding left null — using PostgreSQL FTS instead
            ))

        project.github_index_status = "ready"
        db.commit()
        logger.info("Indexed %d chunks for project %s (%s)", len(all_chunks), project_id, repo_full_name)
        from app.services.project_events import publish_project_event
        publish_project_event(project_id, {"type": "github_index", "status": "ready", "chunk_count": len(all_chunks)})

    except Exception as e:
        logger.exception("Failed to index repo %s: %s", repo_full_name, e)
        try:
            from app.models.project import Project
            project = db.query(Project).filter(Project.id == project_id).first()
            if project:
                project.github_index_status = "failed"
                db.commit()
            from app.services.project_events import publish_project_event
            publish_project_event(project_id, {"type": "github_index", "status": "failed", "chunk_count": 0})
        except Exception:
            pass
    finally:
        db.close()


def search_code_chunks(
    project_id: str,
    question: str,
    db,
    top_k: int = 10,
) -> str:
    """
    Find the top-k most relevant code chunks using PostgreSQL full-text search.
    Falls back to the most-recently indexed chunks if the query matches nothing.
    Returns a formatted context string to inject into the PRD prompt.
    """
    from sqlalchemy import text as sa_text

    try:
        # Full-text search ranked by ts_rank
        rows = db.execute(
            sa_text("""
                SELECT file_path, chunk_text,
                       ts_rank(
                           to_tsvector('english', chunk_text),
                           plainto_tsquery('english', :q)
                       ) AS rank
                FROM github_code_chunks
                WHERE project_id = CAST(:pid AS uuid)
                  AND to_tsvector('english', chunk_text) @@ plainto_tsquery('english', :q)
                ORDER BY rank DESC
                LIMIT :k
            """),
            {"q": question, "pid": str(project_id), "k": top_k},
        ).fetchall()

        # If FTS finds nothing (e.g. question uses terms not in code), return top chunks by insert order
        if not rows:
            rows = db.execute(
                sa_text("""
                    SELECT file_path, chunk_text
                    FROM github_code_chunks
                    WHERE project_id = CAST(:pid AS uuid)
                    ORDER BY created_at DESC
                    LIMIT :k
                """),
                {"pid": str(project_id), "k": top_k},
            ).fetchall()

        if not rows:
            return ""

        sections = [f"```\n{row.chunk_text}\n```" for row in rows]
        return "# Relevant Codebase Context\n\n" + "\n\n---\n\n".join(sections)

    except Exception as e:
        logger.warning("Code chunk search failed: %s", e)
        return ""
