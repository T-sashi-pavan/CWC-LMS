"""Ask Cloudinary for every converted version the site uses, once, so real visitors get the cached copy.

Cloudinary converts a video the first time a size is requested (about 10 s for a 50 MB file) and serves the
cached result afterwards. Run this after uploading new videos or changing sizes in students.js:

    python scripts/warm_cloudinary.py

It reads the video ids from frontend/src/data/students.js and requests: the pop-up video (WebM for Chrome/
Firefox + MP4 for Safari), the 4 s muted preview, and the poster images. It only downloads to /dev/null.
"""
import re
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://res.cloudinary.com/kr5lzd8b/video/upload/"
ids = sorted(
    i for i in set(re.findall(r"v\d+/[\w.\-]+\.mp4", (ROOT / "frontend/src/data/students.js").read_text(encoding="utf-8")))
    if not i.startswith("v123/")   # the example id used in a code comment
)
UA = "Mozilla/5.0 Chrome/124"


def jobs(vid):
    still = vid.rsplit(".", 1)[0] + ".webp"
    for w in (360, 540, 640, 720):
        yield f"so_1,w_{w},q_auto,f_webp/{still}", "*/*"
    yield f"so_2,du_4,w_360,q_auto:low,ac_none/{vid}", "video/mp4,*/*"
    yield f"f_auto,q_auto,w_540/{vid}", "video/webm,video/mp4,*/*"       # Chrome / Firefox -> WebM
    yield f"f_auto,q_auto,w_540/{vid}", "video/mp4,*/*;q=0.5"            # Safari -> MP4
    yield f"f_auto,q_auto,w_720/{vid}", "video/webm,video/mp4,*/*"       # meetup recordings


def fetch(job):
    path, accept = job
    t0 = time.time()
    try:
        req = urllib.request.Request(BASE + path, headers={"User-Agent": UA, "Accept": accept})
        with urllib.request.urlopen(req, timeout=180) as r:
            n = len(r.read())
        return path, n, time.time() - t0, None
    except Exception as e:  # noqa: BLE001
        return path, 0, time.time() - t0, str(e)[:60]


def main():
    all_jobs = [j for vid in ids for j in jobs(vid)]
    print(f"{len(ids)} videos -> {len(all_jobs)} versions to warm")
    bad = 0
    with ThreadPoolExecutor(max_workers=4) as pool:
        for path, n, dt, err in pool.map(fetch, all_jobs):
            if err:
                bad += 1
                print(f"  FAILED {path}: {err}")
    print(f"done, {len(all_jobs) - bad} ok, {bad} failed")


if __name__ == "__main__":
    main()
