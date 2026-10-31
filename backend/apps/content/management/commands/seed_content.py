"""Load SAMPLE content so the POC has something to show.

Everything here is placeholder text - replace it from /admin with Chaitanya's real
roadmaps, jobs and (real, permissioned) student testimonials.
"""
from django.core.management.base import BaseCommand

from apps.content.models import Interview, Job, Roadmap, Testimonial

ROADMAPS = [
    dict(slug="software-developer", title="Software Developer", duration="12 weeks", order=1,
         summary="From DSA basics to a clean, interview-ready portfolio.",
         steps=[
             {"title": "Programming fundamentals", "detail": "Pick one language and get fluent."},
             {"title": "Data structures & algorithms", "detail": "Arrays to graphs, 2 problems a day."},
             {"title": "Build 2 real projects", "detail": "Deploy them and write a solid README."},
             {"title": "Resume & LinkedIn", "detail": "One-page, impact-first resume."},
             {"title": "Mock interviews", "detail": "Practise out loud until it feels natural."},
         ]),
    dict(slug="data-analyst", title="Data Analyst", duration="10 weeks", order=2,
         summary="SQL, Excel, dashboards and the stories behind the numbers.",
         steps=[
             {"title": "Excel & SQL", "detail": "Joins, window functions, pivots."},
             {"title": "Visualisation", "detail": "Power BI or Tableau dashboards."},
             {"title": "Case studies", "detail": "Two portfolio case studies."},
             {"title": "Interview prep", "detail": "Metrics, guesstimates and SQL rounds."},
         ]),
    dict(slug="freshers-aptitude", title="Fresher Placement Prep", duration="6 weeks", order=3,
         summary="Aptitude, communication and HR rounds for campus and off-campus drives.",
         steps=[
             {"title": "Aptitude basics", "detail": "Quant, logical, verbal."},
             {"title": "Group discussion", "detail": "Structure, tone and body language."},
             {"title": "HR round", "detail": "Tell me about yourself, strengths and salary."},
         ]),
    dict(slug="product-manager-pro", title="Product / Senior Roles (Pro)", duration="16 weeks", order=4,
         is_pro=True,
         summary="Advanced roadmap for switchers and experienced hires.",
         steps=[
             {"title": "Role mapping", "detail": "Find the right target role."},
             {"title": "Case interviews", "detail": "Frameworks with live feedback."},
         ]),
]

INTERVIEWS = [
    dict(kind="mock", title="Free mock interview: HR round", level="Beginner", duration_min=20, order=1,
         description="A guided HR round with feedback from the mentor's checklist."),
    dict(kind="mock", title="Free mock interview: Technical basics", level="Beginner", duration_min=30, order=2,
         description="Core concepts and problem-solving, scored on a simple rubric."),
    dict(kind="mock", title="Advanced mock with detailed report", level="Advanced", duration_min=45, order=3,
         is_pro=True, description="Role-specific panel with a written improvement plan."),
    dict(kind="ai", title="AI interview: Basic", level="Beginner", duration_min=15, order=1,
         description="Practise common questions with instant AI feedback."),
    dict(kind="ai", title="AI interview: Next level", level="Pro", duration_min=30, order=2, is_pro=True,
         description="Adaptive follow-ups, role-based questions and deep scoring."),
    dict(kind="video", title="Video simulation: Panel interview", level="Pro", duration_min=40, order=1,
         is_pro=True, description="Realistic video-based interview simulation with playback review."),
    dict(kind="video", title="Video simulation: Client round", level="Pro", duration_min=25, order=2,
         is_pro=True, description="Handle a tough stakeholder on camera."),
]

JOBS = [
    ("Junior Software Developer", "Sample Tech Pvt Ltd", "Hyderabad", "Full-time", "₹4-6 LPA", False),
    ("Data Analyst Trainee", "Sample Analytics", "Bengaluru", "Full-time", "₹3.5-5 LPA", False),
    ("Customer Support Associate", "Sample Services", "Remote", "Full-time", "₹2.5-3.5 LPA", False),
    ("QA Engineer", "Sample Labs", "Pune", "Full-time", "₹4-6 LPA", False),
    ("Frontend Developer (React)", "Sample Product Co", "Bengaluru", "Full-time", "₹10-16 LPA", True),
    ("Backend Engineer (Django)", "Sample Cloud", "Remote", "Full-time", "₹12-18 LPA", True),
    ("Business Analyst", "Sample Consulting", "Mumbai", "Full-time", "₹9-14 LPA", True),
    ("Product Associate", "Sample Fintech", "Hyderabad", "Full-time", "₹14-20 LPA", True),
]

TESTIMONIALS = [
    ("Student One", "Placed as Software Developer",
     "[SAMPLE] The roadmap told me exactly what to learn each week. No more guessing."),
    ("Student Two", "Placed as Data Analyst",
     "[SAMPLE] The mock interviews felt real, and my confidence in the actual round showed."),
    ("Student Three", "Placed as QA Engineer",
     "[SAMPLE] Chaitanya's feedback on my resume got me three interview calls in a week."),
]


class Command(BaseCommand):
    help = "Seed sample roadmaps, interviews, jobs and testimonials (idempotent)."

    def handle(self, *args, **opts):
        for r in ROADMAPS:
            Roadmap.objects.update_or_create(slug=r["slug"], defaults=r)
        for i in INTERVIEWS:
            Interview.objects.update_or_create(title=i["title"], defaults=i)
        for n, (t, c, loc, jt, sal, pro) in enumerate(JOBS):
            Job.objects.update_or_create(
                title=t, company=c,
                defaults=dict(location=loc, job_type=jt, salary=sal, is_pro=pro, order=n,
                              apply_url="https://example.com/apply"),
            )
        for n, (name, role, quote) in enumerate(TESTIMONIALS):
            Testimonial.objects.update_or_create(name=name, defaults=dict(role=role, quote=quote, order=n))
        self.stdout.write(self.style.SUCCESS("Sample content loaded."))
