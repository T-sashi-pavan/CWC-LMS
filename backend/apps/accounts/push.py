import json
import logging

from django.conf import settings
from pywebpush import WebPushException, webpush

from .models import PushSubscription

log = logging.getLogger(__name__)


def send_push(sub: PushSubscription, title: str, body: str, url: str = "/") -> bool:
    """Send one Web Push notification. Returns False and deletes expired subscriptions."""
    if not settings.VAPID_PRIVATE_KEY:
        return False
    payload = json.dumps({
        "title": title,
        "body": body,
        "url": url,
        "icon": "/favicon-192.png",
        "badge": "/favicon-48.png",
    })
    try:
        webpush(
            subscription_info={
                "endpoint": sub.endpoint,
                "keys": {"p256dh": sub.p256dh, "auth": sub.auth},
            },
            data=payload,
            vapid_private_key=settings.VAPID_PRIVATE_KEY,
            vapid_claims={"sub": settings.VAPID_CLAIM_EMAIL},
        )
        return True
    except WebPushException as exc:
        status = getattr(getattr(exc, "response", None), "status_code", None)
        if status in (404, 410):
            sub.delete()
        else:
            log.warning("WebPush failed (%s): %s", status, exc)
        return False


def broadcast_push(title: str, body: str, url: str = "/") -> tuple[int, int]:
    """Send a notification to all subscribed users. Returns (sent_count, total_count)."""
    subs = list(PushSubscription.objects.all())
    sent = sum(1 for s in subs if send_push(s, title, body, url))
    return sent, len(subs)

