"""Turn the raw photos into small web-ready WebP files (originals are never touched).

    python scripts/optimize_media.py

  videos,photos,meetups/Photos/*          -> frontend/public/students/<id>.webp   (480x600 portrait, face-biased crop)
  videos,photos,meetups/Meetups/meetup photos/* -> frontend/public/meetups/mNN.webp (1280w) + mNN-sm.webp (480w)
                                              + frontend/src/data/meetups.json (size manifest, duplicates skipped)
Typical result: 15 headshots ~20 KB each, meetup photos 1 MB -> ~80 KB.
"""
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "videos,photos,meetups"
PUB = ROOT / "frontend" / "public"

# photo file stem (lower-case) -> student id used in frontend/src/data/students.js
STUDENT_IDS = {
    "afsana": "afsana", "bhavya": "bhavya", "divya": "divya", "jilla srivardhan": "jillasrivardhan",
    "mahendhar": "mahendhar", "mani kumar": "manikumar", "mounika": "mounika", "narendra": "narendra",
    "phanindra": "phanindra", "desing raju": "raju", "rami reddy": "ramireddy", "ramya": "ramya",
    "ravi kiran": "ravikiran", "satish": "satish", "srikeerthi": "srikeerthi",
}


def save_webp(im, path, q):
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "WEBP", quality=q, method=6)
    return path.stat().st_size


def students():
    total_in = total_out = 0
    for f in sorted((SRC / "Photos").iterdir()):
        sid = STUDENT_IDS.get(f.stem.strip().lower())
        if not sid:
            print("  ! no id for", f.name)
            continue
        im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")
        w = min(480, im.width)                      # never upscale a small source
        im = ImageOps.fit(im, (w, round(w * 1.25)), Image.LANCZOS, centering=(0.5, 0.28))
        total_in += f.stat().st_size
        total_out += save_webp(im, PUB / "students" / f"{sid}.webp", 82)
    print(f"students: {len(STUDENT_IDS)} headshots, {total_in // 1024} KB -> {total_out // 1024} KB")


def meetups():
    folder = SRC / "Meetups" / "meetup photos"
    seen, manifest, total_in, total_out = set(), [], 0, 0
    for f in sorted(folder.iterdir(), key=lambda p: p.name.lower()):
        digest = hashlib.md5(f.read_bytes()).hexdigest()
        if digest in seen:
            print("  duplicate skipped:", f.name)
            continue
        seen.add(digest)
        n = len(manifest) + 1
        im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")
        big = ImageOps.contain(im, (1280, 1280), Image.LANCZOS)
        small = ImageOps.contain(im, (480, 480), Image.LANCZOS)
        total_in += f.stat().st_size
        total_out += save_webp(big, PUB / "meetups" / f"m{n:02d}.webp", 78)
        save_webp(small, PUB / "meetups" / f"m{n:02d}-sm.webp", 74)
        manifest.append({"n": n, "w": big.width, "h": big.height})
    out = ROOT / "frontend" / "src" / "data" / "meetups.json"
    out.write_text(json.dumps(manifest), encoding="utf-8")
    print(f"meetups: {len(manifest)} photos, {total_in // 1024} KB -> {total_out // 1024} KB (+ thumbnails) -> {out.relative_to(ROOT)}")


if __name__ == "__main__":
    students()
    meetups()
