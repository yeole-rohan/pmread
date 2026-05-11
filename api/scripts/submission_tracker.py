"""
Persistent JSON tracker for URL index submissions.

Log file: $SUBMISSION_LOG_PATH  (default: <api-root>/submission_log.json)

Schema:
{
  "https://pmread.org/tools/": {
    "google":   {"submitted_at": "2026-03-05T10:00:00Z", "status": "ok"},
    "bing":     {"submitted_at": "2026-03-05T10:00:00Z", "status": "ok"},
    "indexnow": {"submitted_at": "2026-03-05T10:00:00Z", "status": "ok"}
  },
  ...
}

status values: "ok", "fail", "skip"
"""

import json
import os
from datetime import datetime, timezone
from pathlib import Path

_LOG_FILE = Path(
    os.environ.get(
        "SUBMISSION_LOG_PATH",
        str(Path(__file__).resolve().parent.parent / "submission_log.json"),
    )
)

ENGINE_GOOGLE = "google"
ENGINE_BING = "bing"
ENGINE_INDEXNOW = "indexnow"
ALL_ENGINES = (ENGINE_GOOGLE, ENGINE_BING, ENGINE_INDEXNOW)


def _load() -> dict:
    if _LOG_FILE.exists():
        try:
            return json.loads(_LOG_FILE.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return {}
    return {}


def _save(data: dict) -> None:
    _LOG_FILE.write_text(
        json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8"
    )


def record(url: str, engine: str, status: str) -> None:
    data = _load()
    if url not in data:
        data[url] = {}
    data[url][engine] = {
        "submitted_at": datetime.now(timezone.utc).isoformat(),
        "status": status,
    }
    _save(data)


def record_batch(urls: list[str], engine: str, status: str) -> None:
    data = _load()
    ts = datetime.now(timezone.utc).isoformat()
    for url in urls:
        if url not in data:
            data[url] = {}
        data[url][engine] = {"submitted_at": ts, "status": status}
    _save(data)


def already_submitted(url: str, engine: str) -> bool:
    return _load().get(url, {}).get(engine, {}).get("status") == "ok"


def filter_unsubmitted(urls: list[str], engine: str) -> list[str]:
    return [u for u in urls if not already_submitted(u, engine)]


def get_status_table() -> list[dict]:
    data = _load()
    rows = []
    for url, engines in sorted(data.items()):
        row = {"url": url}
        for engine in ALL_ENGINES:
            row[engine] = engines.get(engine, {}).get("status", "-")
        rows.append(row)
    return rows


def log_path() -> Path:
    return _LOG_FILE
