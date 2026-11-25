"""Offline meetups from a published Google Sheet (CSV).

Set OFFLINE_MEETS_SHEET_URL to the sheet's share link ("Anyone with the link can view") or its "Publish to web" CSV link.
Columns (row 1, any order, case-insensitive):
  City, Location, Map link, Date, Day, Timing, Active (yes/no)
"""
import csv
import io
import logging
import threading
import time
from datetime import date, datetime
from urllib.request import Request, urlopen

from django.conf import settings

from .jobs_sheet import csv_url

log = logging.getLogger(__name__)

_lock = threading.Lock()
_cache = {"at": 0.0, "meets": [], "ok": False}

_YES = {"yes", "y", "true", "1", "active", "on"}
_NO = {"no", "n", "false", "0", "closed", "expired", "inactive", "off"}

_ALIASES = {
    "city": "city",
    "location": "location",
    "venue": "location",
    "place": "location",
    "map link": "map_link",
    "map_link": "map_link",
    "map": "map_link",
    "google map": "map_link",
    "date": "date",
    "day": "day",
    "timing": "timing",
    "time": "timing",
    "active": "active",
    "active(yes/no)": "active",
    "active (yes/no)": "active",
    "status": "active",
}


def _parse_date(val: str):
    s = (val or "").strip()
    if not s:
        return None
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%Y/%m/%d", "%d %b %Y", "%d %B %Y"):
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            continue
    return None


def _is_active(row: dict) -> bool:
    raw = (row.get("active") or "").strip().lower()
    if raw in _NO:
        return False
    if raw and raw not in _YES:
        return False
    if not raw:
        return False
    d = _parse_date(row.get("date", ""))
    if d and d < date.today():
        return False
    return True


def _parse_csv(text: str) -> list[dict]:
    reader = csv.DictReader(io.StringIO(text))
    if not reader.fieldnames:
        return []
    col_map = {}
    for f in reader.fieldnames:
        key = (f or "").strip().lower()
        if key in _ALIASES:
            col_map[f] = _ALIASES[key]

    meets = []
    for raw in reader:
        item = {}
        for k, v in raw.items():
            dest = col_map.get(k)
            if dest:
                item[dest] = (v or "").strip()
        if not any(item.values()):
            continue
        if not _is_active(item):
            continue
        meets.append({
            "city": item.get("city", ""),
            "location": item.get("location", ""),
            "map_link": item.get("map_link", ""),
            "date": item.get("date", ""),
            "day": item.get("day", ""),
            "timing": item.get("timing", ""),
            "active": True,
        })
    return meets


def get_offline_meets() -> list[dict]:
    url = getattr(settings, "OFFLINE_MEETS_SHEET_URL", "")
    if not url:
        return []
    ttl = getattr(settings, "OFFLINE_MEETS_SHEET_TTL", 300)
    now = time.monotonic()
    with _lock:
        if _cache["ok"] and (now - _cache["at"]) < ttl:
            return list(_cache["meets"])

    try:
        req = Request(csv_url(url), headers={"User-Agent": "CWC-LMS/1.0"})
        with urlopen(req, timeout=8) as resp:
            text = resp.read().decode("utf-8", errors="replace")
        meets = _parse_csv(text)
        with _lock:
            _cache.update({"at": time.monotonic(), "meets": meets, "ok": True})
        return meets
    except Exception as exc:
        log.warning("Failed to fetch offline meets sheet: %s", exc)
        with _lock:
            return list(_cache["meets"]) if _cache["ok"] else []

