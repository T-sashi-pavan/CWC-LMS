from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.views import request_is_pro

from .models import Interview, Job, Roadmap, Testimonial
from .serializers import (
    InterviewSerializer,
    JobSerializer,
    RoadmapSerializer,
    TestimonialSerializer,
)

PLANS = [
    {
        "id": "free",
        "name": "Free",
        "price": 0,
        "currency": "INR",
        "period": "forever",
        "features": [
            "Free guidance and roadmaps",
            "Free mock interviews",
            "AI interview (basic)",
            "Job openings",
            "Student testimonials",
        ],
    },
    {
        "id": "pro",
        "name": "Pro",
        "price": 499,
        "currency": "INR",
        "period": "month",
        "features": [
            "Everything in Free",
            "Next-level AI interview",
            "Video simulation interviews",
            "Bigger job openings",
            "Mock interviews with more features",
            "Advanced roadmaps",
        ],
    },
]


class TieredListView(ListAPIView):
    """Lists items; Pro items are included but flagged `locked` for Free users."""

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["is_pro"] = request_is_pro(self.request)
        return ctx


class RoadmapList(TieredListView):
    queryset = Roadmap.objects.all()
    serializer_class = RoadmapSerializer

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["authed"] = bool(getattr(self.request.user, "is_authenticated", False))
        return ctx


def _preview(content: dict) -> dict:
    """What a visitor may read without full access: the pitch and the phase titles, not the curriculum."""
    c = content or {}
    return {
        "title_lines": c.get("title_lines", []), "meta_line": c.get("meta_line", ""), "summary": c.get("summary", ""),
        "facts": c.get("facts", []), "overview": c.get("overview", []),
        "target_role": c.get("target_role", {}),
        "phases": [
            {"n": p["n"], "title": p["title"], "objective": p.get("objective", ""),
             "module_titles": [m["title"] for m in p.get("modules", [])]}
            for p in c.get("phases", [])
        ],
        "careers": c.get("careers", []),
        "phase_count": c.get("phase_count", 0), "lab_count": c.get("lab_count", 0), "module_count": c.get("module_count", 0),
    }


class RoadmapDetail(APIView):
    """GET /api/roadmaps/<slug>/ with a server-side access level:

    full     logged in (and Pro if the roadmap is Pro): the whole curriculum
    preview  featured roadmap for a visitor, or a Pro roadmap for a Free member: pitch + phase titles only
    none     any other roadmap for a visitor: card details only
    The text itself is only sent when the level allows it, so it can't be pulled out of the page.
    """

    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "roadmap_detail"

    def get(self, request, slug):
        r = get_object_or_404(Roadmap, slug=slug)
        authed = bool(getattr(request.user, "is_authenticated", False))
        is_pro = request_is_pro(request)
        ctx = {"is_pro": is_pro, "authed": authed}
        data = dict(RoadmapSerializer(r, context=ctx).data)
        data.pop("steps", None)

        if authed and (not r.is_pro or is_pro):
            level, content = "full", r.content
        elif (not authed and r.featured) or (authed and r.is_pro and not is_pro):
            level, content = "preview", _preview(r.content)
        else:
            level, content = "none", None
        data["access"] = level
        data["content"] = content
        resp = Response(data)
        resp["Cache-Control"] = "private, no-store"   # personalised by login state: never share via a CDN
        return resp


class InterviewList(TieredListView):
    serializer_class = InterviewSerializer

    def get_queryset(self):
        qs = Interview.objects.all()
        kind = self.request.query_params.get("kind")
        return qs.filter(kind=kind) if kind else qs


class JobList(TieredListView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer


class TestimonialList(ListAPIView):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer


class PlanList(APIView):
    def get(self, request):
        return Response(PLANS)
