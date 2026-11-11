"""Import the roadmap .docx files into the Roadmap table (idempotent: re-running updates in place).

    python manage.py import_roadmaps --dry-run                # parse + show a summary, touch nothing
    python manage.py import_roadmaps --json out.json          # also write the parsed data to a file
    python manage.py import_roadmaps                          # write to the database
    python manage.py import_roadmaps --dir ../roadmaps_documents --prune-samples

The table below decides each roadmap's slug, display title, category, order and whether it is shown to
visitors who are not logged in (`featured`). Change it here, or later in /admin.
"""
import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from apps.content.models import Roadmap
from apps.content.roadmap_parser import parse_roadmap

# file stem -> (slug, title, category, featured, order)
CATALOGUE = {
    "Agentic_AI_Engineering_Roadmap": ("agentic-ai", "Agentic AI Engineering", "ai", True, 1),
    "Generative_AI_Engineering_Roadmap": ("generative-ai", "Generative AI Engineering", "ai", True, 2),
    "Data_Analyst_Roadmap": ("data-analyst", "Data Analyst", "data", True, 3),
    "Python_Full_Stack_Engineering_Roadmap": ("python-full-stack", "Python Full Stack Engineering", "fullstack", True, 4),
    "AI_Engineering_Roadmap": ("ai-engineering", "AI Engineering", "ai", False, 5),
    "Data_Science_with_Generative_AI_Roadmap": ("data-science-genai", "Data Science with Generative AI", "ai", False, 6),
    "MERN_Stack_Engineering_Roadmap": ("mern-stack", "MERN Stack Engineering", "fullstack", False, 7),
    "Java_Full_Stack_Engineering_Roadmap": ("java-full-stack", "Java Full Stack Engineering", "fullstack", False, 8),
    "DevOps_Multi_Cloud_Engineering_Roadmap": ("devops-multi-cloud", "DevOps & Multi-Cloud Engineering", "cloud", False, 9),
    "Automation_Engineering_Roadmap": ("automation-engineering", "Automation Engineering", "cloud", False, 10),
    "Forward_Deployment_Engineer_Roadmap": ("forward-deployment", "Forward Deployment Engineer", "cloud", False, 11),
}
# the old seed_content samples ("data-analyst" is reused by the real one, so it is updated, not deleted)
SAMPLE_SLUGS = ["software-developer", "freshers-aptitude", "product-manager-pro"]


def _title_fallback(stem):
    return stem.replace("_Roadmap", "").replace("_", " ")


class Command(BaseCommand):
    help = "Parse roadmaps_documents/*.docx and upsert them as Roadmap rows."

    def add_arguments(self, p):
        p.add_argument("--dir", default=str(Path(settings.BASE_DIR).parent / "roadmaps_documents"))
        p.add_argument("--dry-run", action="store_true")
        p.add_argument("--json", help="also write the parsed roadmaps to this file")
        p.add_argument("--prune-samples", action="store_true", help="delete the 4 old sample roadmaps from seed_content")

    def handle(self, *args, **o):
        folder = Path(o["dir"])
        files = sorted(folder.glob("*.docx"))
        if not files:
            raise CommandError(f"No .docx files in {folder}")

        parsed = []
        for f in files:
            data = parse_roadmap(f)
            slug, title, cat, featured, order = CATALOGUE.get(f.stem, (None, _title_fallback(f.stem), "ai", False, 99))
            slug = slug or title.lower().replace(" ", "-")
            parsed.append((f.stem, dict(
                slug=slug, title=title, category=cat, featured=featured, order=order,
                tagline=data["meta_line"] or (data["title_lines"][1] if len(data["title_lines"]) > 1 else ""),
                summary=data["summary"][:300],
                duration="",  # the documents give no duration: fill in from /admin when known
                steps=[{"title": f"Phase {p['n']}: {p['title']}", "detail": p["outcome"]} for p in data["phases"]],
                content=data,
            )))

        self.stdout.write(f"{'slug':26}{'phases':>7}{'modules':>8}{'labs':>5}  featured")
        for _, d in parsed:
            c = d["content"]
            self.stdout.write(f"{d['slug']:26}{c['phase_count']:>7}{c['module_count']:>8}{c['lab_count']:>5}  {'yes' if d['featured'] else ''}")

        if o["json"]:
            Path(o["json"]).write_text(json.dumps([d for _, d in parsed], indent=1, ensure_ascii=False), encoding="utf-8")
            self.stdout.write(f"wrote {o['json']}")
        if o["dry_run"]:
            self.stdout.write(self.style.WARNING("Dry run: nothing written to the database."))
            return

        for _, d in parsed:
            Roadmap.objects.update_or_create(slug=d["slug"], defaults={k: v for k, v in d.items() if k != "slug"})
        if o["prune_samples"]:
            n, _ = Roadmap.objects.filter(slug__in=SAMPLE_SLUGS).delete()
            self.stdout.write(f"removed {n} sample roadmap(s)")
        self.stdout.write(self.style.SUCCESS(f"Imported {len(parsed)} roadmaps."))
