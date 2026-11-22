"""Job openings from a published Google Sheet (CSV).

Set JOBS_SHEET_URL to the sheet's share link ("Anyone with the link can view") or its "Publish to web" CSV link. Whenever someone edits the sheet, the website picks
the change up on its own: the CSV is fetched when /api/jobs/ is called and kept for JOBS_SHEET_TTL seconds
(default 300), so an edit shows up within a few minutes and no deploy, cron job or database change is needed.

If the sheet cannot be reached, the last good copy is served; if there is none, only jobs added in the admin show.

Columns (row 1, any order, case does not matter). The client's sheet uses:
  Company, Designation          required (Designation is the job title)
  Website                       the apply link (a plain link, a form, LinkedIn, Indeed ... anything starting with http)
  HR Contact                    an email (or a link, or any note). Used to apply when there is no Website link
  Roles and Responsibilities    comma-separated skills/duties, shown as tags
  Location, Experience          optional text
Also understood: title, job_type, salary, apply_url, posted_date (YYYY-MM-DD or DD-MM-YYYY), active (yes/no).
A row with active = no / closed / expired / false / 0 is hidden, so closing a job is just changing one cell.
"""
import csv
import hashlib
import io
import logging
import re
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime
from urllib.request import Request, urlopen

from django.conf import settings

log = logging.getLogger(__name__)

_lock = threading.Lock()
_cache = {"at": 0.0, "jobs": [], "ok": False}

_CLOSED = {"no", "n", "false", "0", "closed", "expired", "inactive", "off"}
_ALIASES = {
    "job title": "title", "role": "title", "position": "title", "designation": "title", "job role": "title",
    "company name": "company", "employer": "company",
    "type": "job_type", "job type": "job_type", "jobtype": "job_type",
    "apply link": "apply_url", "apply url": "apply_url", "link": "apply_url", "url": "apply_url",
    "website": "apply_url", "job link": "apply_url", "job url": "apply_url", "careers page": "apply_url",
    "hr contact": "hr_contact", "hr mail": "hr_contact", "hr email": "hr_contact", "hr mail id": "hr_contact",
    "hr": "hr_contact", "contact": "hr_contact", "email": "hr_contact", "contact email": "hr_contact", "hr contact details": "hr_contact",
    "roles and responsibilities": "responsibilities", "roles & responsibilities": "responsibilities",
    "responsibilities": "responsibilities", "skills": "responsibilities", "skills required": "responsibilities",
    "job description": "responsibilities", "description": "responsibilities",
    "exp": "experience", "experience required": "experience", "experience level": "experience",
    "posted": "posted_date", "date": "posted_date", "posted date": "posted_date", "posted on": "posted_date",
    "status": "active",
}
_LIMITS = {"title": 140, "company": 120, "location": 120, "job_type": 40, "salary": 60, "experience": 40}
_NO_LOCATION = {"", "not specified", "unspecified", "na", "n/a", "-", "none", "nil", "tbd"}
_EMAIL = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(?:\.[A-Za-z0-9\-]+)+")


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


def _split_skills(text: str) -> list[str]:
    """'Python, SQL, Data Structures (DSA, OOP)' -> ['Python', 'SQL', 'Data Structures (DSA, OOP)'] (commas inside brackets stay)."""
    out, depth, cur = [], 0, ""
    for ch in text.replace(chr(10), ", ").replace(";", ","):
        if ch in "([":
            depth += 1
        elif ch in ")]" and depth > 0:
            depth -= 1
        if ch == "," and depth == 0:
            out.append(cur); cur = ""
        else:
            cur += ch
    out.append(cur)
    seen, skills = set(), []
    for item in (re.sub(r"^[\s\-•*\d.)]+", "", i).strip() for i in out):
        if item and item.lower() not in seen:
            seen.add(item.lower()); skills.append(item)
    return skills


def _apply_fields(website: str, hr: str) -> dict:
    """Work out how a person can apply: a link, an HR email, or just a contact note.

    Website may hold a link or (sometimes) an email; HR Contact may hold an email, a link, a phone number or a note.
    The link wins; the email is kept as well so both buttons can show.
    """
    website, hr = (website or "").strip(), (hr or "").strip()
    url = _safe_url(website)
    email = ""
    for text in (website, hr):
        m = _EMAIL.search(text.replace("mailto:", ""))
        if m:
            email = m.group(0)[:120]
            break
    if not url:
        url = _safe_url(hr)                 # the HR cell holds a link, e.g. a form
    note = ""
    if not url and not email and hr:
        note = hr[:120]                     # a phone number or instructions: show it to signed-in members
    return {"apply_url": url, "apply_email": email, "apply_note": note}


def _level(experience: str, title: str) -> str:
    """'fresher' or 'experienced', from the Experience column.

    Freshers, interns, trainees and anything starting at 0 years are freshers; 1 year and up is experienced.
    An empty cell counts as fresher unless the title says senior/lead/manager.
    """
    text = (experience or "").lower()
    if any(w in text for w in ("fresher", "intern", "trainee", "entry")):
        return "fresher"
    m = re.search(r"\d+(?:\.\d+)?", text)
    if m:
        months = "month" in text or "mo" in text.split()
        return "fresher" if months or float(m.group()) < 1 else "experienced"
    if text:  # words such as "experienced" or "senior"
        return "experienced"
    words = set(re.findall(r"[a-z]+", title.lower()))
    return "experienced" if words & {"senior", "sr", "lead", "manager", "principal", "architect"} else "fresher"


_CITY = {"bangalore": "Bengaluru", "gurgaon": "Gurugram", "bombay": "Mumbai", "madras": "Chennai", "calcutta": "Kolkata"}


def _location(text: str) -> str:
    """Empty for 'Not specified'; old city names are written the modern way so one city is not listed twice."""
    text = (text or "").strip()
    if text.lower() in _NO_LOCATION:
        return ""
    return _CITY.get(text.lower(), text)[:_LIMITS["location"]]


def parse_jobs(csv_text: str, default_date: str | None = None) -> list[dict]:
    """Turn the sheet's CSV into job dicts shaped like the API's JobSerializer output.

    default_date (YYYY-MM-DD) is the posting date for rows without their own date, e.g. the tab's date.
    """
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
        job["location"] = _location(row.get("location", ""))
        job.update(_apply_fields(row.get("apply_url", ""), row.get("hr_contact", "")))
        is_intern = "intern" in title.lower() or "/internship" in job["apply_url"].lower()
        job["job_type"] = job["job_type"] or ("Internship" if is_intern else "Full-time")
        job["level"] = _level(job["experience"], title)
        job["posted_at"] = _parse_date(row.get("posted_date", "")) or default_date
        resp = row.get("responsibilities", "")
        skills = _split_skills(resp)
        if skills and all(len(x) <= 60 for x in skills):   # a list of skills/duties: show as tags
            job["skills"], job["description"] = [x for x in skills][:20], ""
        else:                                              # free text: show as a short paragraph
            job["skills"], job["description"] = [], resp[:600]
        # a stable id so the page keeps the same key between refreshes; identical rows count once
        key = "|".join(x.lower() for x in (title, company, job["location"], job["apply_url"], job["apply_email"]))
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


def _download(url: str, limit: int = 2_000_000) -> str:
    req = Request(url, headers={"User-Agent": "cwc-jobs-sync/1.0", "Accept": "text/csv,text/html,*/*"})
    with urlopen(req, timeout=8) as res:  # noqa: S310 - the URL comes from our own setting, not from a visitor
        return res.read(limit).decode("utf-8", errors="replace")


_TAB = re.compile(r'\[\d+,0,\\"(\d+)\\",\[\{\\"1\\":\[\[0,0,\\"([^"\\]*)\\"')
MAX_TABS = 60  # newest tabs only, so a year of daily tabs cannot make the page slow


def sheet_tabs(url: str) -> list[tuple[str, str]]:
    """[(gid, tab name)] for every tab of a Google Sheet, or [] if they cannot be listed.

    The client posts one tab per day and names it with the date (21/11/2026). The tab list is read from the sheet's
    own page, so a new day's tab shows up on the website without any change here. Published CSV links (/pub?...)
    belong to one tab and cannot be listed.
    """
    m = re.match(r"^https://docs\.google\.com/spreadsheets/d/([A-Za-z0-9_-]+)/(?!pub)", url.strip() + "/")
    if not m or m.group(1) == "e":
        return []
    page = _download(f"https://docs.google.com/spreadsheets/d/{m.group(1)}/edit", limit=3_000_000)
    seen, tabs = set(), []
    for gid, name in _TAB.findall(page):
        if gid not in seen:
            seen.add(gid)
            tabs.append((gid, name))
    return tabs


def _fetch_tab(base: str, gid: str, name: str):
    """Jobs of one tab, or None if it could not be read (one broken tab must not hide the others)."""
    try:
        return parse_jobs(_download(f"{base}&gid={gid}"), default_date=_parse_date(name))
    except Exception as exc:
        log.warning("jobs sheet tab %s (%s) failed: %s", name, gid, exc)
        return None


def load_all(url: str) -> list[dict]:
    """Every tab of the sheet, merged, newest first, each job once (a job repeated on later days keeps its newest date)."""
    first = csv_url(url)
    try:
        tabs = sheet_tabs(url)
    except Exception as exc:
        log.warning("jobs sheet tab list failed, using the linked tab only: %s", exc)
        tabs = []
    if not tabs:
        return parse_jobs(_download(first))
    base = first.split("&gid=")[0]
    tabs.sort(key=lambda t: _parse_date(t[1]) or "", reverse=True)
    tabs = tabs[:MAX_TABS]
    with ThreadPoolExecutor(max_workers=12) as pool:
        parts = list(pool.map(lambda t: _fetch_tab(base, *t), tabs))
    if all(p is None for p in parts):
        raise RuntimeError("no tab could be read")
    merged, seen = [], set()
    for part in parts:
        for job in part or []:
            if job["id"] not in seen:
                seen.add(job["id"])
                merged.append(job)
    merged.sort(key=lambda j: j["posted_at"] or "", reverse=True)
    return merged


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
            _cache.update(jobs=load_all(url), at=time.time(), ok=True)
        except Exception as exc:  # network, timeout, bad sheet: keep serving the last good copy
            log.warning("jobs sheet fetch failed: %s", exc)
            _cache["at"] = time.time() - ttl + 30  # retry in 30 seconds, not on every request
    return _cache["jobs"]


def reset_cache() -> None:
    _cache.update(at=0.0, jobs=[], ok=False)
