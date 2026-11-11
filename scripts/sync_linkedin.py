"""Build frontend/src/data/linkedin.json (the LinkedIn posts shown on the Testimonials page) from the spreadsheet.

The Google Sheet must be readable without a login. Either:
  1. Share it: Share -> General access -> "Anyone with the link" -> Viewer, then run
         python scripts/sync_linkedin.py
  2. or File -> Download -> CSV, save it as LINKEDIN_POSTS.csv in the project root, then run the same command
         python scripts/sync_linkedin.py            (or:  python scripts/sync_linkedin.py path/to/file.csv)

Each row needs a LinkedIn post link in any column. If another column holds the person's name it is used as the card title.
Supported links: .../posts/...-activity-123...  .../posts/...-share-123...  .../posts/...-ugcPost-123...  and
.../feed/update/urn:li:activity:123 . Posts that cannot be embedded still appear as "View on LinkedIn" cards.
"""
import csv
import io
import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHEET_ID = "1VOjIUt9y2H9EunboaGrLitEG8zZVcQV2JYor5GH1g0s"
SHEET_CSV = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid=0"
LOCAL_CSV = ROOT / "LINKEDIN_POSTS.csv"
OUT = ROOT / "frontend" / "src" / "data" / "linkedin.json"


def embed_url(url):
    m = re.search(r"urn:li:(activity|share|ugcPost):(\d{10,})", url) or re.search(r"-(activity|share|ugcPost)-(\d{10,})", url)
    if m:
        return f"https://www.linkedin.com/embed/feed/update/urn:li:{m[1]}:{m[2]}"
    return "" if "/embed/feed/update/" not in url else url


def read_rows(arg):
    if arg:
        return Path(arg).read_text(encoding="utf-8-sig")
    if LOCAL_CSV.exists():
        print(f"reading {LOCAL_CSV.name}")
        return LOCAL_CSV.read_text(encoding="utf-8-sig")
    print("reading the Google Sheet export ...")
    try:
        req = urllib.request.Request(SHEET_CSV, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.read().decode("utf-8-sig")
    except urllib.error.HTTPError as e:
        sys.exit(f"The sheet is not public (HTTP {e.code}). Share it as 'Anyone with the link: Viewer', "
                 f"or download it as CSV and save it as {LOCAL_CSV.name} in the project root.")


def find_csv(arg):
    if arg:
        return Path(arg)
    for pattern in ("LINKEDIN_POSTS.csv", "*Linkedin*.csv", "*LinkedIn*.csv", "*linkedin*.csv"):
        hit = sorted(ROOT.glob(pattern))
        if hit:
            return hit[0]
    return None


def main():
    arg = sys.argv[1] if len(sys.argv) > 1 else None
    csv_path = find_csv(arg)
    if csv_path:
        print(f"reading {csv_path.name}")
        text = csv_path.read_text(encoding="utf-8-sig")
    else:
        text = read_rows(None)
    posts, seen, name = [], set(), ""
    for row in csv.reader(io.StringIO(text)):
        cells = [c.strip() for c in row]
        # a row is a post if any cell holds a LinkedIn link or LinkedIn's <iframe src="..."> embed code
        blob = " ".join(cells)
        m = re.search(r'src="(https://www\.linkedin\.com/embed/feed/update/[^"]+)"', blob) or re.search(r'(https?://[^\s"<>]*linkedin\.com[^\s"<>]*)', blob)
        label = next((c for c in cells if c and "linkedin" not in c.lower() and not c.lower().startswith(("http", "<")) and len(c) < 60), "")
        if label and label.lower() not in ("name", "linkedin post"):
            name = label                     # the name is only written on the first row of a person's posts
        if not m:
            continue
        url = m.group(1)
        if url in seen:
            continue
        seen.add(url)
        embed = url if "/embed/feed/update/" in url else embed_url(url)
        h = re.search(r'height="(\d+)"', blob)
        posts.append({"url": url.replace("/embed/feed/update/", "/feed/update/"), "embed": embed, "name": name, "height": int(h.group(1)) if h else 0})
    if not posts:
        sys.exit("No LinkedIn links found in the file.")
    OUT.write_text(json.dumps(posts, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(posts)} posts -> {OUT.relative_to(ROOT)}  ({sum(1 for p in posts if p['embed'])} can be embedded)")


if __name__ == "__main__":
    main()
