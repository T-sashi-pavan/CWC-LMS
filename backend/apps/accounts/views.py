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


def _merge_progress(existing: dict, incoming: dict) -> dict:
    """Merge progress payloads without losing watched lessons, streak logs, or visited flags."""
    ex = existing if isinstance(existing, dict) else {}
    inc = incoming if isinstance(incoming, dict) else {}

    watched = {}
    for src in (ex.get("watched"), inc.get("watched")):
        if isinstance(src, dict):
            for k, v in src.items():
                if isinstance(k, str) and isinstance(v, list):
                    cur = set(watched.get(k, []))
                    cur.update(int(x) for x in v if isinstance(x, (int, float)))
                    watched[k] = sorted(cur)

    log = {}
    for src in (ex.get("log"), inc.get("log")):
        if isinstance(src, dict):
            for k, v in src.items():
                if isinstance(k, str) and isinstance(v, (int, float)):
                    log[k] = max(log.get(k, 0), int(v))

    visited = {}
    for src in (ex.get("visited"), inc.get("visited")):
        if isinstance(src, dict):
            for k, v in src.items():
                if isinstance(k, str) and v:
                    visited[k] = True

    last = inc.get("last") if isinstance(inc.get("last"), dict) else ex.get("last")
    if not isinstance(last, dict):
        last = {"course": "dsa", "idx": 0}

    return {"watched": watched, "last": last, "log": log, "visited": visited}


class MeProgressView(APIView):
    """GET / PATCH /api/me/progress/: sync learning progress across devices."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        p = profile_for(request.user)
        resp = Response(p.progress or {})
        resp["Cache-Control"] = "private, no-store"
        return resp

    def patch(self, request):
        p = profile_for(request.user)
        merged = _merge_progress(p.progress, request.data)
        p.progress = merged
        p.save(update_fields=["progress"])
        resp = Response(merged)
        resp["Cache-Control"] = "private, no-store"
        return resp
