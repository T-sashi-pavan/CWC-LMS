from rest_framework.generics import ListAPIView
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
