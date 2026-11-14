"""Upload the LangGraph lesson videos to Cloudinary and record their ids for the site.

    pip install cloudinary
    # put CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@kr5lzd8b in backend/.env
    python scripts/upload_langgraph.py "F:/pikachu/cwc/langgraph"

Each lesson in backend/apps/content/member_courses.json has a `file` name; the file is uploaded in 20 MB chunks and
its Cloudinary public id is written back into `public_id`. Re-running skips lessons that already have one.
Note: Cloudinary's free plan limits a single video to 100 MB; larger files must be compressed or the plan upgraded.
"""
import json
import os
import sys
from pathlib import Path

import cloudinary
import cloudinary.uploader

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "backend" / "apps" / "content" / "member_courses.json"


def load_env():
    for line in (ROOT / "backend" / ".env").read_text(encoding="utf-8").splitlines():
        if line.startswith("CLOUDINARY_URL="):
            os.environ["CLOUDINARY_URL"] = line.split("=", 1)[1].strip().strip("\"'")


def main(folder):
    load_env()
    if not os.environ.get("CLOUDINARY_URL"):
        sys.exit("CLOUDINARY_URL missing in backend/.env")
    cloudinary.config(secure=True)
    data = json.loads(DATA.read_text(encoding="utf-8"))
    for c in data["courses"]:
        for i, x in enumerate(c["lessons"], 1):
            if x.get("public_id"):
                continue
            path = Path(folder) / x["file"]
            print(f"uploading {path.name} ...")
            try:
                r = cloudinary.uploader.upload_large(
                    str(path), resource_type="video", folder="langgraph",
                    public_id=f"lesson_{i:02d}", chunk_size=20_000_000, overwrite=True)
            except Exception as e:  # noqa: BLE001
                print(f"  FAILED: {str(e)[:120]}")
                continue
            x["public_id"] = f"v{r['version']}/{r['public_id']}.{r['format']}"
            DATA.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
            print("  ok", x["public_id"])


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else str(ROOT / "langgraph"))
