"""
Submit sitemap URLs to the Google Indexing API.

Requirements:
    pip install google-auth google-auth-httplib2

Setup:
    1. Create a Google Cloud service account and download the JSON key.
    2. Enable "Web Search Indexing API" in the Google Cloud project.
    3. Add the service account email as an Owner in Google Search Console
       (Settings → Users and permissions).
    4. Set GOOGLE_INDEXING_SERVICE_ACCOUNT_FILE in .env to the absolute path
       of the downloaded JSON key.

Rate-limit policy:
    On 429 the script sleeps for Retry-After (or --on-429-wait seconds) then
    moves on to the next batch WITHOUT retrying — preserves daily quota.

Usage:
    cd api
    python scripts/google_index_submit.py
    python scripts/google_index_submit.py --type URL_DELETED
    python scripts/google_index_submit.py --dry-run
    python scripts/google_index_submit.py --all --limit 190
"""

import argparse
import json
import sys
import time
import uuid
import xml.etree.ElementTree as ET
from pathlib import Path

# Allow `from app.config import settings` when run from api/
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import requests

import scripts.submission_tracker as tracker
from app.config import settings

INDEXING_API_SCOPE = "https://www.googleapis.com/auth/indexing"
PUBLISH_URL = "https://indexing.googleapis.com/v3/urlNotifications:publish"
BATCH_URL = "https://indexing.googleapis.com/batch"
BATCH_SIZE = 100
DEFAULT_LIMIT = 190  # Google quota: 200/day — keep a small buffer


# ── Auth ─────────────────────────────────────────────────────────────────────

def _get_access_token(sa_file: str) -> str:
    try:
        from google.auth.transport.requests import Request as GoogleRequest
        from google.oauth2 import service_account
    except ImportError:
        sys.exit(
            "google-auth is not installed. Run: pip install google-auth google-auth-httplib2"
        )
    try:
        credentials = service_account.Credentials.from_service_account_file(
            sa_file, scopes=[INDEXING_API_SCOPE]
        )
        credentials.refresh(GoogleRequest())
        return credentials.token
    except Exception as exc:
        sys.exit(f"Failed to obtain Google access token: {exc}")


def _auth_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# ── Sitemap ───────────────────────────────────────────────────────────────────

def _fetch_sitemap_urls(sitemap_url: str) -> list[str]:
    try:
        resp = requests.get(sitemap_url, timeout=30)
        resp.raise_for_status()
    except Exception as exc:
        sys.exit(f"Error fetching sitemap {sitemap_url}: {exc}")
    return _parse_sitemap(resp.content, sitemap_url)


def _parse_sitemap(content: bytes, source_url: str = "") -> list[str]:
    urls: list[str] = []
    try:
        root = ET.fromstring(content)
        ns = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"}

        for sitemap in root.findall("ns:sitemap", ns):
            loc = sitemap.find("ns:loc", ns)
            if loc is not None and loc.text:
                child_url = loc.text.strip()
                print(f"  -> child sitemap: {child_url}")
                try:
                    child_resp = requests.get(child_url, timeout=30)
                    child_resp.raise_for_status()
                    urls.extend(_parse_sitemap(child_resp.content, child_url))
                except Exception as exc:
                    print(f"  Warning: could not fetch {child_url}: {exc}", file=sys.stderr)

        for url_el in root.findall("ns:url", ns):
            loc = url_el.find("ns:loc", ns)
            if loc is not None and loc.text:
                urls.append(loc.text.strip())
    except ET.ParseError as exc:
        sys.exit(f"Error parsing sitemap XML from {source_url}: {exc}")
    return urls


# ── 429 handling ──────────────────────────────────────────────────────────────

def _wait_on_429(resp: requests.Response, fallback_wait: float) -> None:
    wait = fallback_wait
    retry_after = resp.headers.get("Retry-After", "")
    if retry_after:
        try:
            wait = float(retry_after)
        except ValueError:
            pass
    print(
        f"  429 TOO_MANY_REQUESTS — pausing {wait:.0f}s "
        f"(Retry-After: {retry_after or 'not set'})",
        file=sys.stderr,
    )
    time.sleep(wait)


# ── Submission ────────────────────────────────────────────────────────────────

def _submit_single(
    url: str, notification_type: str, access_token: str, on_429_wait: float
) -> tuple[int, int, int]:
    payload = json.dumps({"url": url, "type": notification_type})
    try:
        resp = requests.post(
            PUBLISH_URL, data=payload, headers=_auth_headers(access_token), timeout=30
        )
        if resp.ok:
            tracker.record(url, tracker.ENGINE_GOOGLE, "ok")
            print(f"  OK   {url}")
            return 1, 0, 0
        elif resp.status_code == 429:
            tracker.record(url, tracker.ENGINE_GOOGLE, "skip")
            _wait_on_429(resp, on_429_wait)
            print(f"  SKIP {url} — rate-limited, not re-submitted", file=sys.stderr)
            return 0, 0, 1
        else:
            tracker.record(url, tracker.ENGINE_GOOGLE, "fail")
            print(f"  FAIL {url} — HTTP {resp.status_code}: {resp.text[:200]}", file=sys.stderr)
            return 0, 1, 0
    except Exception as exc:
        tracker.record(url, tracker.ENGINE_GOOGLE, "fail")
        print(f"  ERROR {url} — {exc}", file=sys.stderr)
        return 0, 1, 0


def _submit_batch(
    urls: list[str], notification_type: str, access_token: str, on_429_wait: float
) -> tuple[int, int, int]:
    boundary = f"batch_{uuid.uuid4().hex}"
    parts = []
    for url in urls:
        body = json.dumps({"url": url, "type": notification_type})
        parts.append(
            f"--{boundary}\r\n"
            f"Content-Type: application/http\r\n"
            f"Content-ID: <{uuid.uuid4().hex}@pmread.org>\r\n"
            f"\r\n"
            f"POST /v3/urlNotifications:publish HTTP/1.1\r\n"
            f"Content-Type: application/json\r\n"
            f"\r\n"
            f"{body}\r\n"
        )

    raw_body = "".join(parts) + f"--{boundary}--\r\n"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": f"multipart/mixed; boundary={boundary}",
    }

    try:
        resp = requests.post(
            BATCH_URL, data=raw_body.encode("utf-8"), headers=headers, timeout=60
        )
    except Exception as exc:
        print(f"  Batch request error: {exc}", file=sys.stderr)
        return 0, len(urls), 0

    if resp.status_code == 429:
        _wait_on_429(resp, on_429_wait)
        print(f"  SKIP {len(urls)} URL(s) — batch rate-limited", file=sys.stderr)
        return 0, 0, len(urls)

    if not resp.ok:
        print(f"  Batch failed — HTTP {resp.status_code}: {resp.text[:400]}", file=sys.stderr)
        return 0, len(urls), 0

    return _parse_batch_response(resp, urls)


def _parse_batch_response(resp: requests.Response, urls: list[str]) -> tuple[int, int, int]:
    ok = fail = skipped = 0

    content_type = resp.headers.get("Content-Type", "")
    boundary = None
    for part in content_type.split(";"):
        part = part.strip()
        if part.startswith("boundary="):
            boundary = part[len("boundary="):].strip('"')
            break

    if not boundary:
        print("  Warning: couldn't parse batch response boundary.", file=sys.stderr)
        return len(urls), 0, 0

    delimiter = f"--{boundary}"
    segments = resp.text.split(delimiter)

    for i, segment in enumerate(segments):
        if not segment.strip() or segment.strip() == "--":
            continue
        url_label = urls[i - 1] if 0 < i <= len(urls) else "(unknown)"
        for line in segment.splitlines():
            line = line.strip()
            if line.startswith("HTTP/1.1 "):
                status_code = int(line.split()[1])
                if 200 <= status_code < 300:
                    tracker.record(url_label, tracker.ENGINE_GOOGLE, "ok")
                    print(f"  OK   {url_label}")
                    ok += 1
                elif status_code == 429:
                    tracker.record(url_label, tracker.ENGINE_GOOGLE, "skip")
                    print(f"  SKIP {url_label} — 429 in batch", file=sys.stderr)
                    skipped += 1
                else:
                    tracker.record(url_label, tracker.ENGINE_GOOGLE, "fail")
                    print(f"  FAIL {url_label} — HTTP {status_code}", file=sys.stderr)
                    fail += 1
                break

    return ok, fail, skipped


# ── CLI ───────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Submit sitemap URLs to the Google Indexing API"
    )
    parser.add_argument(
        "--type",
        default="URL_UPDATED",
        choices=["URL_UPDATED", "URL_DELETED"],
        help="Notification type (default: URL_UPDATED)",
    )
    parser.add_argument("--dry-run", action="store_true", help="Print URLs without submitting")
    parser.add_argument("--sitemap", default=None, help="Override the sitemap URL")
    parser.add_argument("--all", action="store_true", help="Submit all URLs including already-submitted")
    parser.add_argument(
        "--limit",
        type=int,
        default=DEFAULT_LIMIT,
        help=f"Max URLs per run (default {DEFAULT_LIMIT} — quota 200/day)",
    )
    parser.add_argument(
        "--batch-delay",
        type=float,
        default=1.0,
        metavar="SECONDS",
        help="Seconds to wait between batches (default: 1)",
    )
    parser.add_argument(
        "--on-429-wait",
        type=float,
        default=60.0,
        metavar="SECONDS",
        help="Fallback wait seconds on 429 with no Retry-After header (default: 60)",
    )
    args = parser.parse_args()

    sa_file = settings.GOOGLE_INDEXING_SERVICE_ACCOUNT_FILE
    if not sa_file:
        sys.exit(
            "GOOGLE_INDEXING_SERVICE_ACCOUNT_FILE is not set in .env. "
            "Point it to your Google service account JSON key file."
        )

    sitemap_url = args.sitemap or settings.GOOGLE_INDEXING_SITEMAP_URL
    notification_type = args.type

    print(f"Fetching sitemap: {sitemap_url}")
    all_urls = _fetch_sitemap_urls(sitemap_url)
    if not all_urls:
        print("No URLs found in sitemap. Nothing to submit.", file=sys.stderr)
        return

    if args.all:
        pending = all_urls
    else:
        pending = tracker.filter_unsubmitted(all_urls, tracker.ENGINE_GOOGLE)

    to_submit = pending[: args.limit]
    remaining_after = len(pending) - len(to_submit)

    print(f"Found in sitemap:    {len(all_urls)}")
    print(f"Not yet submitted:   {len(pending)}")
    print(f"Submitting this run: {len(to_submit)}  (limit={args.limit})")
    if remaining_after > 0:
        print(f"  {remaining_after} URLs remain — run again tomorrow (quota resets daily).")

    if not to_submit:
        print("Nothing to submit.")
        return

    if args.dry_run:
        print("Dry-run mode — no requests sent.")
        for u in to_submit:
            print(f"  {u}")
        return

    access_token = _get_access_token(sa_file)

    batches = [to_submit[i: i + BATCH_SIZE] for i in range(0, len(to_submit), BATCH_SIZE)]
    total_ok = total_fail = total_skipped = 0

    for batch_num, batch_urls in enumerate(batches, start=1):
        print(f"Submitting batch {batch_num}/{len(batches)} ({len(batch_urls)} URL(s))...")
        if len(batch_urls) == 1:
            ok, fail, skipped = _submit_single(
                batch_urls[0], notification_type, access_token, args.on_429_wait
            )
        else:
            ok, fail, skipped = _submit_batch(
                batch_urls, notification_type, access_token, args.on_429_wait
            )
        total_ok += ok
        total_fail += fail
        total_skipped += skipped

        if batch_num < len(batches):
            time.sleep(args.batch_delay)

    summary = f"Done. {total_ok} accepted, {total_fail} failed"
    if total_skipped:
        summary += f", {total_skipped} skipped (rate-limited — re-run tomorrow)"
    print(summary + ".")
    print(f"Tracker: {tracker.log_path()}")
    if remaining_after > 0:
        print(f"{remaining_after} URLs still pending — run again tomorrow.")


if __name__ == "__main__":
    main()
