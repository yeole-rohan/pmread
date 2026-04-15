"""Celery task: index a GitHub repo's codebase into pgvector chunks."""
from app.worker import celery_app


@celery_app.task(bind=True, max_retries=2, default_retry_delay=60, time_limit=600)
def index_github_repo_task(self, project_id: str, repo_full_name: str, github_token: str) -> None:
    """
    Fetch repo source files, chunk them, embed via xAI/OpenAI, store in github_code_chunks.
    Runs in the Celery worker — does not block the API process.
    """
    import asyncio
    from app.services.github_indexer import index_github_repo
    from app.database import SessionLocal

    try:
        asyncio.run(index_github_repo(project_id, repo_full_name, github_token, SessionLocal))
    except Exception as exc:
        raise self.retry(exc=exc)
