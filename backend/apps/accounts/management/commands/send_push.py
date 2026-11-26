from django.core.management.base import BaseCommand

from apps.accounts.push import broadcast_push


class Command(BaseCommand):
    help = "Broadcast a Web Push notification to all subscribed CWC Ecosystem users."

    def add_arguments(self, parser):
        parser.add_argument("--title", required=True, help="Notification title")
        parser.add_argument("--body", required=True, help="Notification message")
        parser.add_argument("--url", default="/", help="Target path when clicked (e.g. /jobs)")

    def handle(self, *args, **opts):
        sent, total = broadcast_push(opts["title"], opts["body"], opts["url"])
        self.stdout.write(self.style.SUCCESS(f"Sent push notification to {sent}/{total} subscribers."))

