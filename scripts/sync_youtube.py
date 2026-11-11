"""Pull the channel's playlists + every video (title, length) from the YouTube Data API into
frontend/src/data/courses.json, which the home page and course player read.

    python scripts/sync_youtube.py              # needs YOUTUBE_API_V3_KEY in backend/.env

The key is read from backend/.env and is NEVER written to the output. Re-run (and redeploy) whenever a new
playlist or video goes up. ~20 API calls per run, far below the daily quota.
"""
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "frontend" / "src" / "data" / "courses.json"
HANDLE = "careerwithchaitanya"

# playlist title (lower-case substring) -> tab label, language, order. Unlisted playlists are still included at the end.
CONFIG = [
    ("complete ai agents course", "AI Agents", "Telugu", "Zero to hero: build AI agents from Python basics to production."),
    ("agentic ai", "Agentic AI", "English", "AI agents, agentic AI, AGI and ASI, taught class by class."),
    ("dsa with python", "DSA with Python", "English", "Problem solving to programming: data structures and algorithms in Python."),
    ("python in telugu", "Python", "Telugu", "Python, APIs and modules explained step by step in Telugu."),
    ("langchain", "LangChain", "English", "Structured output, tools and ReAct agents with LangChain."),
    ("llms", "LLMs", "Telugu", "Run LLMs offline, call them with APIs and build mini projects."),
]


def env_key():
    for line in (ROOT / "backend" / ".env").read_text(encoding="utf-8").splitlines():
        if line.startswith("YOUTUBE_API_V3_KEY="):
            return line.split("=", 1)[1].strip().strip("\"'")
    sys.exit("YOUTUBE_API_V3_KEY not found in backend/.env")


KEY = env_key()


def api(path, **params):
    params["key"] = KEY
    url = f"https://www.googleapis.com/youtube/v3/{path}?{urllib.parse.urlencode(params)}"
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        msg = json.loads(e.read().decode("utf-8", "replace")).get("error", {}).get("message", "")
        sys.exit(f"YouTube API {e.code}: {msg}")


def seconds(iso):
    h, m, s = (int(x or 0) for x in re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso or "").groups())
    return h * 3600 + m * 60 + s


def paged(path, **params):
    items, tok = [], None
    while True:
        r = api(path, **params, **({"pageToken": tok} if tok else {}))
        items += r["items"]
        tok = r.get("nextPageToken")
        if not tok:
            return items


def main():
    ch = api("channels", part="id,statistics", forHandle=HANDLE)["items"][0]
    stats = ch["statistics"]
    playlists = paged("playlists", part="snippet,contentDetails,status", channelId=ch["id"], maxResults=50)

    out = []
    for p in playlists:
        if p["status"]["privacyStatus"] != "public":
            continue
        entries = paged("playlistItems", part="contentDetails", playlistId=p["id"], maxResults=50)
        ids = [e["contentDetails"]["videoId"] for e in entries]
        info = {}
        for i in range(0, len(ids), 50):
            for v in api("videos", part="contentDetails,snippet", id=",".join(ids[i:i + 50]))["items"]:
                info[v["id"]] = v
        videos = [
            {"id": vid, "title": info[vid]["snippet"]["title"], "seconds": seconds(info[vid]["contentDetails"]["duration"])}
            for vid in ids if vid in info          # private / deleted videos have no entry
        ]
        title = p["snippet"]["title"]
        cfg = next((c for c in CONFIG if c[0] in title.lower()), None)
        out.append({
            "id": p["id"],
            "title": title,
            "label": cfg[1] if cfg else title[:24],
            "lang": cfg[2] if cfg else "",
            "blurb": cfg[3] if cfg else "",
            "order": CONFIG.index(cfg) if cfg else 99,
            "hours": round(sum(v["seconds"] for v in videos) / 3600, 1),
            "videos": videos,
        })
    out.sort(key=lambda c: c["order"])
    data = {
        "channel": {"handle": HANDLE, "subscribers": int(stats.get("subscriberCount", 0)), "videos": int(stats.get("videoCount", 0))},
        "playlists": out,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    total = sum(len(c["videos"]) for c in out)
    print(f"{len(out)} playlists, {total} video entries -> {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")
    for c in out:
        print(f"  {c['label']:16} {c['lang']:8} {len(c['videos']):3} videos  {c['hours']:5.1f} h")


if __name__ == "__main__":
    main()
