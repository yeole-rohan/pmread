"""
Submit sitemap URLs to Bing IndexNow + Bing Webmaster URL Submission API.

IndexNow  — single batch request, covers Bing + Yandex + DuckDuckGo instantly.
Bing API  — direct Bing Webmaster submission, 10,000 URLs/day limit.

Both engines track submitted URLs — already-OK URLs are skipped by default.

Usage:
    cd api
    python scripts/indexnow_submit.py               # both engines (unsubmitted only)
    python scripts/indexnow_submit.py --indexnow    # IndexNow only
    python scripts/indexnow_submit.py --bing        # Bing API only
    python scripts/indexnow_submit.py --all         # include already-submitted
    python scripts/indexnow_submit.py --dry-run     # print URLs, no submit
    python scripts/indexnow_submit.py --sitemap https://pmread.org/sitemap.xml
"""

import argparse
import sys
import time
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import requests

import scripts.submission_tracker as tracker
from app.config import settings

INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"
BING_SUBMIT_ENDPOINT = "https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch"
SITE_URL = "https://pmread.org"
SITE_HOST = "pmread.org"


# ── Sitemap ───────────────────────────────────────────────────────────────────

def _fetch_sitemap_urls(sitemap_url: str) -> list[str]:
    urls: list[str] = []
    try:
        resp = requests.get(sitemap_url, timeout=30)
        resp.raise_for_status()
    except Exception as exc:
        print(f"Error fetching sitemap {sitemap_url}: {exc}", file=sys.stderr)
        return urls

    try:
        root = ET.fromstring(resp.content)
        ns = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"}

        for sitemap in root.findall("ns:sitemap", ns):
            loc = sitemap.find("ns:loc", ns)
            if loc is not None and loc.text:
                urls.extend(_fetch_sitemap_urls(loc.text.strip()))

        for url_el in root.findall("ns:url", ns):
            loc = url_el.find("ns:loc", ns)
            if loc is not None and loc.text:
                urls.append(loc.text.strip())
    except ET.ParseError as exc:
        print(f"Error parsing sitemap XML from {sitemap_url}: {exc}", file=sys.stderr)

    return urls


# ── Submission ────────────────────────────────────────────────────────────────

def _submit_indexnow(urls: list[str], key: str) -> bool:
    payload = {
        "host": SITE_HOST,
        "key": key,
        "keyLocation": f"{SITE_URL}/{key}.txt",
        "urlList": urls,
    }
    try:
        resp = requests.post(
            INDEXNOW_ENDPOINT,
            json=payload,
            headers={"Content-Type": "application/json; charset=utf-8"},
            timeout=30,
        )
        if resp.status_code in (200, 202):
            tracker.record_batch(urls, tracker.ENGINE_INDEXNOW, "ok")
            print(f"  IndexNow: {len(urls)} URLs — HTTP {resp.status_code} OK")
            return True
        else:
            tracker.record_batch(urls, tracker.ENGINE_INDEXNOW, "fail")
            print(f"  IndexNow FAIL [{resp.status_code}]: {resp.text[:200]}", file=sys.stderr)
            return False
    except requests.RequestException as exc:
        tracker.record_batch(urls, tracker.ENGINE_INDEXNOW, "fail")
        print(f"  IndexNow ERR: {exc}", file=sys.stderr)
        return False


def _submit_bing_api(urls: list[str], api_key: str) -> tuple[int, int]:
    batch_size = 100
    ok = fail = 0
    for i in range(0, len(urls), batch_size):
        batch = urls[i: i + batch_size]
        payload = {"siteUrl": SITE_URL, "urlList": batch}
        try:
            resp = requests.post(
                f"{BING_SUBMIT_ENDPOINT}?apikey={api_key}",
                json=payload,
                headers={"Content-Type": "application/json; charset=utf-8"},
                timeout=30,
            )
            if resp.status_code == 200:
                ok += len(batch)
                tracker.record_batch(batch, tracker.ENGINE_BING, "ok")
                print(f"  Bing batch {i // batch_size + 1}: {len(batch)} URLs — OK")
            else:
                fail += len(batch)
                tracker.record_batch(batch, tracker.ENGINE_BING, "fail")
                print(
                    f"  Bing batch {i // batch_size + 1} FAIL [{resp.status_code}]: {resp.text[:200]}",
                    file=sys.stderr,
                )
        except requests.RequestException as exc:
            fail += len(batch)
            tracker.record_batch(batch, tracker.ENGINE_BING, "fail")
            print(f"  Bing batch {i // batch_size + 1} ERR: {exc}", file=sys.stderr)
        time.sleep(0.5)
    return ok, fail


# ── CLI ───────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Submit sitemap URLs to Bing IndexNow + Bing Webmaster API"
    )
    parser.add_argument("--indexnow", action="store_true", help="IndexNow only")
    parser.add_argument("--bing", action="store_true", help="Bing URL Submission API only")
    parser.add_argument(
        "--all", action="store_true", help="Include already-submitted URLs (re-submission)"
    )
    parser.add_argument("--dry-run", action="store_true", help="Print URLs without submitting")
    parser.add_argument("--sitemap", default=None, help="Override sitemap URL")
    args = parser.parse_args()

    run_indexnow = args.indexnow or (not args.indexnow and not args.bing)
    run_bing = args.bing or (not args.indexnow and not args.bing)

    indexnow_key = settings.INDEXNOW_KEY
    bing_api_key = settings.BING_API_KEY
    sitemap_url = args.sitemap or settings.GOOGLE_INDEXING_SITEMAP_URL

    print(f"Fetching sitemap: {sitemap_url}")
    all_urls = _fetch_sitemap_urls(sitemap_url)
    if not all_urls:
        print("No URLs found in sitemap.", file=sys.stderr)
        return

    if args.all:
        indexnow_pending = list(all_urls)
        bing_pending = list(all_urls)
    else:
        indexnow_pending = tracker.filter_unsubmitted(all_urls, tracker.ENGINE_INDEXNOW)
        bing_pending = tracker.filter_unsubmitted(all_urls, tracker.ENGINE_BING)

    print(f"Total URLs in sitemap:  {len(all_urls)}")
    if run_indexnow:
        print(f"IndexNow pending:       {len(indexnow_pending)}")
    if run_bing:
        print(f"Bing API pending:       {len(bing_pending)}")

    if args.dry_run:
        pending_union = sorted(set(indexnow_pending) | set(bing_pending))
        for url in pending_union:
            print(f"  {url}")
        print("Dry-run — nothing submitted.")
        return

    # IndexNow
    if run_indexnow:
        print("\n[IndexNow]")
        if not indexnow_key:
            print("  SKIP — INDEXNOW_KEY not set in .env", file=sys.stderr)
        elif not indexnow_pending:
            print("  Nothing new to submit.")
        else:
            _submit_indexnow(indexnow_pending, indexnow_key)

    # Bing URL Submission API
    if run_bing:
        print("\n[Bing URL Submission API]")
        if not bing_api_key:
            print(
                "  SKIP — BING_API_KEY not set. "
                "Get it from Bing Webmaster Tools → Settings → API Access.",
                file=sys.stderr,
            )
        elif not bing_pending:
            print("  Nothing new to submit.")
        else:
            ok, fail = _submit_bing_api(bing_pending, bing_api_key)
            print(f"  Bing done. Submitted: {ok}  Failed: {fail}")

    print("\nDone.")
    print(f"Tracker: {tracker.log_path()}")


if __name__ == "__main__":
    main()
