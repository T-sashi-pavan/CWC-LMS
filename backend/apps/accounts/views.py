import logging

from django.db import connection
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Profile

logger = logging.getLogger(__name__)


def health(request):
    """200 only when the app AND the database are reachable. On failure it names the error type (never the
    message, which can contain connection details) and the real message goes to the server logs."""
    try:
        with connection.cursor() as cur:
            cur.execute("SELECT 1")
    except Exception as exc:  # noqa: BLE001
        logger.exception("health check: database unreachable")
        return JsonResponse(
            {"status": "degraded", "service": "career-with-chaitanya", "db": "unreachable", "error": type(exc).__name__},
            status=503,
        )
    return JsonResponse({"status": "ok", "service": "career-with-chaitanya", "db": "ok"})


def root(request):
    """The backend has no web page: say so, and point at the API."""
    return JsonResponse({"service": "career-with-chaitanya", "type": "api", "health": "/api/health/", "docs": None})


def profile_for(user):
    """Return the Profile for an authenticated Supabase user, creating it on first sight."""
    profile, _ = Profile.objects.get_or_create(
        user_id=user.id,
        defaults={"email": user.email, "full_name": user.full_name},
    )
    return profile


def request_is_pro(request) -> bool:
    user = request.user
    if not getattr(user, "is_authenticated", False):
        return False
    return profile_for(user).is_pro


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        p = profile_for(request.user)
        return Response(
            {
                "id": str(p.user_id),
                "email": p.email,
                "full_name": p.full_name,
                "plan": p.plan,
                "is_pro": p.is_pro,
                "pro_until": p.pro_until,
            }
        )
