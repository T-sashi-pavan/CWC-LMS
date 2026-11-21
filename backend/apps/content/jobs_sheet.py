"""Job openings from a published Google Sheet (CSV).

Set JOBS_SHEET_URL to the sheet's share link ("Anyone with the link can view") or its "Publish to web" CSV link. Whenever someone edits the sheet, the website picks
the change up on its own: the CSV is fetched when /api/jobs/ is called and kept for JOBS_SHEET_TTL seconds
(default 300), so an edit shows up within a few minutes and no deploy, cron job or database change is needed.

If the sheet cannot be reached, the last good copy is served; if there is none, only jobs added in the admin show.

Columns (row 1, any order, case does not matter):
  title, company            required
  location, job_type, salary, apply_url, posted_date (YYYY-MM-DD or DD-MM-YYYY), active (yes/no)   optional
A row with active = no / closed / expired / false / 0 is hidden, so closing a job is just changing one cell.
"""
import csv
import hashlib
import io
import logging
import re
import threading
import time
from datetime import date, datetime
from urllib.request import Request, urlopen

from django.conf import settings

log = logging.getLogger(__name__)

_lock = threading.Lock()
_cache = {"at": 0.0, "jobs": [], "ok": False}

_CLOSED = {"no", "n", "false", "0", "closed", "expired", "inactive", "off"}
_ALIASES = {
    "job title": "title", "role": "title", "position": "title",
    "company name": "company", "employer": "company",
    "type": "job_type", "job type": "job_type", "jobtype": "job_type",
    "apply link": "apply_url", "apply url": "apply_url", "link": "apply_url", "url": "apply_url",
    "posted": "posted_date", "date": "posted_date", "posted date": "posted_date", "posted on": "posted_date",
    "status": "active",
}
_LIMITS = {"title": 140, "company": 120, "location": 120, "job_type": 40, "salary": 60}


def csv_url(url: str) -> str:
    """Accepts either a published CSV link or a normal share link and returns a link that serves CSV.

    https://docs.google.com/spreadsheets/d/<id>/edit?usp=sharing   (anyone with the link can view)
      becomes https://docs.google.com/spreadsheets/d/<id>/export?format=csv[&gid=<tab>]
    Published links (/d/e/.../pub?output=csv) and any other address are used as they are.
    """
    m = re.match(r"^https://docs\.google\.com/spreadsheets/d/([A-Za-z0-9_-]+)/(?!pub)", url.strip() + "/")
    if not m or m.group(1) == "e":
        return url.strip()
    gid = re.search(r"[#&?]gid=(\d+)", url)
    return f"https://docs.google.com/spreadsheets/d/{m.group(1)}/export?format=csv" + (f"&gid={gid.group(1)}" if gid else "")


def _norm(name: str) -> str:
    key = (name or "").strip().lower().replace("_", " ")
    key = _ALIASES.get(key, key.replace(" ", "_"))
    return key


def _parse_date(text: str):
    text = (text or "").strip()
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%m/%d/%Y", "%d %b %Y", "%d %B %Y"):
        try:
            return datetime.strptime(text, fmt).date().isoformat()
        except ValueError:
            continue
    return None


def _safe_url(text: str) -> str:
    text = (text or "").strip()
    return text if text.lower().startswith(("https://", "http://")) and len(text) <= 500 else ""


def parse_jobs(csv_text: str) -> list[dict]:
    """Turn the sheet's CSV into job dicts shaped like the API's JobSerializer output."""
    reader = csv.reader(io.StringIO(csv_text.lstrip("﻿")))
    rows = list(reader)
    if not rows:
        return []
    headers = [_norm(h) for h in rows[0]]
    jobs, seen = [], set()
    for raw in rows[1:]:
        row = {headers[i]: (raw[i].strip() if i < len(raw) else "") for i in range(len(headers)) if headers[i]}
        title, company = row.get("title", ""), row.get("company", "")
        if not title or not company:
            continue  # blank or half-filled row
        if row.get("active", "").lower() in _CLOSED:
            continue
        job = {k: row.get(k, "")[:n] for k, n in _LIMITS.items()}
        job["job_type"] = job["job_type"] or "Full-time"
        job["apply_url"] = _safe_url(row.get("apply_url", ""))
        job["posted_at"] = _parse_date(row.get("posted_date", ""))
        # a stable id so the page keeps the same key between refreshes; identical rows count once
        key = "|".join(x.lower() for x in (title, company, job["location"], job["apply_url"]))
        if key in seen:
            continue
        seen.add(key)
        job["id"] = "s-" + hashlib.sha1(key.encode("utf-8")).hexdigest()[:10]
        job["is_pro"] = False
        job["locked"] = False
        jobs.append(job)
    # newest first when dates are given; undated rows keep the sheet's order after the dated ones
    jobs.sort(key=lambda j: j["posted_at"] or "", reverse=True)
    return jobs


def _download(url: str) -> str:
    req = Request(url, headers={"User-Agent": "cwc-jobs-sync/1.0", "Accept": "text/csv,*/*"})
    with urlopen(req, timeout=8) as res:  # noqa: S310 - the URL comes from our own setting, not from a visitor
        return res.read(2_000_000).decode("utf-8", errors="replace")


def sheet_jobs() -> list[dict]:
    """Jobs from the sheet (empty when JOBS_SHEET_URL is not set). Cached; never raises."""
    url = getattr(settings, "JOBS_SHEET_URL", "")
    if not url:
        return []
    ttl = getattr(settings, "JOBS_SHEET_TTL", 300)
    now = time.time()
    if _cache["ok"] and now - _cache["at"] < ttl:
        return _cache["jobs"]
    with _lock:
        if _cache["ok"] and time.time() - _cache["at"] < ttl:  # another request refreshed it while we waited
            return _cache["jobs"]
        try:
            _cache.update(jobs=parse_jobs(_download(csv_url(url))), at=time.time(), ok=True)
        except Exception as exc:  # network, timeout, bad sheet: keep serving the last good copy
            log.warning("jobs sheet fetch failed: %s", exc)
            _cache["at"] = time.time() - ttl + 30  # retry in 30 seconds, not on every request
    return _cache["jobs"]


def reset_cache() -> None:
    _cache.update(at=0.0, jobs=[], ok=False)
