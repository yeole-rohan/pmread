"""
GitHub codebase indexer.

Flow:
  1. Fetch the repo's file tree (main/master branch).
  2. Score files by PM-relevance tier; skip noise; cap at MAX_FILES.
  3. Fetch file contents in parallel batches.
  4. Summarise each file via Groq llama-3.1-8b-instant (PM-targeted prompt).
  5. Chunk each file into ~CHUNK_CHARS-char segments with overlap.
  6. Embed all chunks via VoyageAI voyage-code-3 (→ OpenAI fallback).
  7. Replace old chunks for the project and insert new ones.
  8. Set project.github_index_status = "ready" | "failed".
"""
from __future__ import annotations

import asyncio
import base64
import logging
import random
import threading
from typing import Any

import httpx
import requests as _requests

logger = logging.getLogger(__name__)

# ── tunables ──────────────────────────────────────────────────────────────────

MAX_FILES = 20           # max source files to index — kept low for constrained servers
MAX_FILE_BYTES = 80_000  # skip files larger than this (80 KB)
CHUNK_CHARS = 1_200      # ~300 tokens per chunk
CHUNK_OVERLAP = 150      # chars of overlap between consecutive chunks
SUMMARY_MODEL = "llama-3.1-8b-instant"
SUMMARY_MAX_TOKENS = 120
GROQ_BASE = "https://api.groq.com/openai/v1/chat/completions"

SOURCE_EXTENSIONS = {
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".py", ".go", ".rb", ".java", ".rs", ".swift",
    ".kt", ".cs", ".php", ".vue", ".svelte", ".ex", ".exs",
}

# Directories/path segments to always skip
SKIP_PATH_PARTS = {
    "node_modules", ".git", "dist", "build", "__pycache__",
    ".pytest_cache", "vendor", "coverage", ".next", "out",
    ".nuxt", "target", "bin", "obj", ".venv", "venv", "env",
    "migrations", "fixtures", "mocks", "__mocks__", "stubs",
}

# Skip test files by filename pattern suffixes
SKIP_FILENAME_SUFFIXES = (
    ".test.ts", ".test.tsx", ".test.js", ".test.jsx",
    ".spec.ts", ".spec.tsx", ".spec.js", ".spec.jsx",
    "_test.py", "_test.go",
)

# Tiered priority — lower number = higher priority
# Files matching a higher-priority tier are selected first up to MAX_FILES
TIER_DIRS = [
    (1, {"models", "model", "schema", "schemas", "types", "type",
         "entities", "entity", "interfaces", "interface"}),
    (2, {"routes", "route", "routers", "router", "controllers", "controller",
         "api", "apis", "endpoints", "endpoint"}),
    (3, {"services", "service", "usecases", "usecase", "use_cases",
         "handlers", "handler", "lib", "core", "domain"}),
    (4, {"views", "view", "pages", "page", "screens", "screen",
         "components", "component"}),
    (5, {"config", "configs", "settings", "main", "app", "index"}),
]

GITHUB_API_BASE = "https://api.github.com"


def _gh_headers(token: str) -> dict:
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


def _tier_score(path: str) -> int:
    """Return priority tier for a file path (1 = highest, 99 = unclassified)."""
    parts = {p.lower() for p in path.split("/")}
    filename_stem = path.split("/")[-1].lower().rsplit(".", 1)[0]
    for tier, dirs in TIER_DIRS:
        if parts & dirs or filename_stem in dirs:
            return tier
    return 99


def _should_index(path: str) -> bool:
    """Return True if this file path is worth indexing."""
    parts = path.split("/")
    if any(p in SKIP_PATH_PARTS for p in parts):
        return False
    if any(p.startswith(".") for p in parts):
        return False
    filename = parts[-1].lower()
    if any(filename.endswith(sfx) for sfx in SKIP_FILENAME_SUFFIXES):
        return False
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


def _summarize_file_sync(
    file_path: str,
    chunk_text: str,
    groq_api_key: str,
    max_retries: int = 4,
) -> str | None:
    """
    Synchronous Groq call for use in background threads.
    Retries on 429 by honouring the Retry-After header + random jitter.
    Returns None on failure — summaries are best-effort.
    """
    if not groq_api_key:
        return None

    # Strip the "// file: …\n" prefix added during chunking, keep first 3000 chars
    snippet = chunk_text.split("\n", 1)[-1][:3000]
    prompt = (
        f"File: {file_path}\n\n"
        f"```\n{snippet}\n```\n\n"
        "You are helping a Product Manager understand a codebase. "
        "In 2-3 sentences describe: what this file does, what data or logic it owns, "
        "and any PM-relevant facts (API endpoints, data models, business rules, feature flags). "
        "Be specific. No preamble."
    )

    for attempt in range(max_retries):
        try:
            resp = _requests.post(
                GROQ_BASE,
                headers={
                    "Authorization": f"Bearer {groq_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": SUMMARY_MODEL,
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": SUMMARY_MAX_TOKENS,
                    "temperature": 0.1,
                },
                timeout=15,
            )
            if resp.status_code == 200:
                return resp.json()["choices"][0]["message"]["content"].strip()

            if resp.status_code == 429:
                retry_after = int(resp.headers.get("retry-after", 60))
                wait = retry_after + random.uniform(0, 15)  # jitter avoids thundering herd
                logger.warning(
                    "Groq 429 for %s — waiting %.0fs (attempt %d/%d)",
                    file_path, wait, attempt + 1, max_retries,
                )
                threading.Event().wait(wait)  # sleep without blocking the GIL entirely
                continue

            logger.warning("Groq summarize %s returned %s", file_path, resp.status_code)
            return None
        except Exception as e:
            logger.warning("Summarization error for %s: %s", file_path, e)
            if attempt < max_retries - 1:
                threading.Event().wait(2 ** attempt + random.uniform(0, 3))

    logger.warning("Summarization gave up for %s after %d retries", file_path, max_retries)
    return None


def _background_summarize(project_id: str, file_chunks: list[tuple[str, str, str]], db_factory) -> None:
    """
    Runs in a daemon thread. Generates summaries for files that don't have one yet,
    writing each result back to the DB as it completes.
    Sequential with a small delay so concurrent jobs share the rate limit gracefully.
    """
    from app.config import settings
    from sqlalchemy import text as sa_text

    groq_key = settings.GROQ_API_KEY
    if not groq_key:
        return

    db = db_factory()
    try:
        for file_path, chunk_text, chunk_id in file_chunks:
            summary = _summarize_file_sync(file_path, chunk_text, groq_key)
            if summary:
                db.execute(
                    sa_text("""
                        UPDATE github_code_chunks
                        SET file_summary = :summary
                        WHERE project_id = CAST(:pid AS uuid)
                          AND file_path = :fp
                          AND file_summary IS NULL
                    """),
                    {"summary": summary, "pid": project_id, "fp": file_path},
                )
                db.commit()
            # Small base delay — workers sharing one key stay well under 30 req/min
            threading.Event().wait(3 + random.uniform(0, 2))
    except Exception as e:
        logger.warning("Background summarization error: %s", e)
    finally:
        db.close()


async def index_github_repo(
    project_id: str,
    repo_full_name: str,
    github_token: str,
    db_factory,
) -> None:
    """
    Background task: index a GitHub repo into github_code_chunks.
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

        # Sort by tier (priority) then size ascending; cap at MAX_FILES
        tree.sort(key=lambda f: (_tier_score(f["path"]), f.get("size", 0)))
        tree = tree[:MAX_FILES]

        logger.info(
            "Indexing %d files from %s (tiers: %s)",
            len(tree),
            repo_full_name,
            [_tier_score(f["path"]) for f in tree],
        )

        # Fetch file contents in parallel batches of 10
        file_contents: dict[str, str] = {}  # path → content
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
                        file_contents[f["path"]] = content

        if not file_contents:
            project.github_index_status = "failed"
            db.commit()
            from app.services.project_events import publish_project_event
            publish_project_event(project_id, {"type": "github_index", "status": "failed", "chunk_count": 0})
            return

        # Abort if the repo was unlinked or changed while we were fetching
        db.refresh(project)
        if project.github_repo != repo_full_name:
            logger.info("Repo changed or unlinked during indexing for project %s — aborting", project_id)
            return

        # Clear old chunks before writing new ones
        db.query(GithubCodeChunk).filter(GithubCodeChunk.project_id == project_id).delete()
        db.commit()

        # Chunk and store one file at a time — no embeddings, FTS handles search.
        total_chunks = 0
        for file_path, content in file_contents.items():
            chunks = _chunk_text(content, file_path)
            if not chunks:
                continue

            for chunk_text in chunks:
                db.add(GithubCodeChunk(
                    project_id=project_id,
                    file_path=file_path,
                    chunk_text=chunk_text,
                    file_summary=None,
                    embedding=None,
                ))
            total_chunks += len(chunks)
            db.flush()
            del chunks, content
            file_contents[file_path] = ""

        db.commit()

        if total_chunks == 0:
            project.github_index_status = "failed"
            db.commit()
            from app.services.project_events import publish_project_event
            publish_project_event(project_id, {"type": "github_index", "status": "failed", "chunk_count": 0})
            return

        project.github_index_status = "ready"
        db.commit()
        logger.info("Indexed %d chunks for project %s (%s)", total_chunks, project_id, repo_full_name)
        from app.services.project_events import publish_project_event
        publish_project_event(project_id, {"type": "github_index", "status": "ready", "chunk_count": total_chunks})

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
    top_k: int = 8,
    db_factory=None,
) -> str:
    """
    Find the top-k most relevant code chunks via FTS, falling back to most-recent.
    Returns a PM-friendly context string: file summary + chunk per file, deduplicated.
    Summaries are generated lazily on first query via a background thread.
    """
    from sqlalchemy import text as sa_text

    try:
        # Primary: full-text search
        rows = db.execute(
            sa_text("""
                SELECT file_path, chunk_text, file_summary,
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

        # Fallback: most recent chunks
        if not rows:
            rows = db.execute(
                sa_text("""
                    SELECT file_path, chunk_text, file_summary
                    FROM github_code_chunks
                    WHERE project_id = CAST(:pid AS uuid)
                    ORDER BY created_at DESC
                    LIMIT :k
                """),
                {"pid": str(project_id), "k": top_k},
            ).fetchall()

        if not rows:
            return ""

        # Deduplicate by file — one entry per file, best chunk wins (first = highest similarity)
        seen: dict[str, dict] = {}
        for row in rows:
            if row.file_path not in seen:
                seen[row.file_path] = {
                    "chunk": row.chunk_text,
                    "summary": getattr(row, "file_summary", None),
                }

        # Fire background summarization for any files missing a summary
        if db_factory:
            unsummarized = [
                (fp, data["chunk"], fp)  # (file_path, chunk_text, used as id key)
                for fp, data in seen.items()
                if not data["summary"]
            ]
            if unsummarized:
                t = threading.Thread(
                    target=_background_summarize,
                    args=(project_id, unsummarized, db_factory),
                    daemon=True,
                )
                t.start()

        sections = []
        for file_path, data in seen.items():
            block = f"### {file_path}"
            if data["summary"]:
                block += f"\n*{data['summary']}*"
            block += f"\n\n```\n{data['chunk']}\n```"
            sections.append(block)

        return "# Relevant Codebase Context\n\n" + "\n\n---\n\n".join(sections)

    except Exception as e:
        logger.warning("Code chunk search failed: %s", e)
        return ""


def search_code_chunk_files(
    project_id: str,
    question: str,
    db,
    top_k: int = 8,
) -> list[str]:
    """Returns deduplicated file paths matching the question via FTS."""
    from sqlalchemy import text as sa_text

    try:
        rows = db.execute(
            sa_text("""
                SELECT DISTINCT file_path
                FROM github_code_chunks
                WHERE project_id = CAST(:pid AS uuid)
                  AND to_tsvector('english', chunk_text) @@ plainto_tsquery('english', :q)
                LIMIT :k
            """),
            {"q": question, "pid": str(project_id), "k": top_k},
        ).fetchall()
        return [row.file_path for row in rows]

    except Exception as e:
        logger.warning("Code chunk file search failed: %s", e)
        return []
