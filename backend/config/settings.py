"""Django settings for Career with Chaitanya (CWC). """
import os
from pathlib import Path

import dj_database_url
from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


def env_list(name, default=""):
    return [v.strip() for v in os.environ.get(name, default).split(",") if v.strip()]


SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-only-insecure-key")
ON_VERCEL = bool(os.environ.get("VERCEL"))
# Safe default: debug is ON locally, always OFF on Vercel unless explicitly forced.
DEBUG = os.environ.get("DJANGO_DEBUG", "True").lower() == "true"
if ON_VERCEL:
    DEBUG = False  # never show Django's debug pages (settings, env, stack traces) on a public deployment
ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1")
if ON_VERCEL:
    ALLOWED_HOSTS += [".vercel.app"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "apps.accounts",
    "apps.content",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]

# Supabase Postgres only (no SQLite fallback).
DATABASE_URL = os.environ.get("DATABASE_URL", "")
if not DATABASE_URL:
    raise ImproperlyConfigured(
        "DATABASE_URL is not set. Add your Supabase pooler connection string to backend/.env "
        "(or to the Vercel project's environment variables)."
    )

DATABASES = {
    "default": dj_database_url.parse(
        DATABASE_URL,
        # Serverless functions must not hold connections open between invocations.
        conn_max_age=0 if ON_VERCEL else 600,
        conn_health_checks=not ON_VERCEL,
    )
}
# Supabase's transaction pooler (port 6543) supports neither server-side cursors nor prepared statements.
DATABASES["default"]["DISABLE_SERVER_SIDE_CURSORS"] = True
DATABASES["default"].setdefault("OPTIONS", {})["prepare_threshold"] = None

AUTH_PASSWORD_VALIDATORS = []  # end-user passwords are managed by Supabase Auth

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
# Serve admin CSS/JS straight from the packages, so no collectstatic step is needed on Vercel.
WHITENOISE_USE_FINDERS = True
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedStaticFilesStorage"},
}
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ---------- Supabase ----------
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET", "")

# ---------- DRF ----------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ["apps.accounts.authentication.SupabaseJWTAuthentication"],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_PAGINATION_CLASS": None,
    # Roadmap detail is the valuable content: slow down bulk scraping (per user, or per IP when anonymous).
    "DEFAULT_THROTTLE_RATES": {"roadmap_detail": "40/min"},
}

# ---------- Behind Vercel's proxy ----------
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True

# ---------- CORS / CSRF ----------
CORS_ALLOWED_ORIGINS = env_list("CORS_ALLOWED_ORIGINS", "http://localhost:5173")
CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS", "http://localhost:5173")
if os.environ.get("VERCEL_URL"):  # the backend's own deployment URL, so /admin login works
    CSRF_TRUSTED_ORIGINS.append(f"https://{os.environ['VERCEL_URL']}")

# ---------- Media storage ----------
# Now: Supabase Storage for everything. Later: MEDIA_STORAGE=r2 (Cloudflare R2 / Stream) for video streaming.
MEDIA_STORAGE = os.environ.get("MEDIA_STORAGE", "supabase")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_STORAGE_BUCKET = os.environ.get("SUPABASE_STORAGE_BUCKET", "media")
CLOUDFLARE = {
    "ACCOUNT_ID": os.environ.get("CLOUDFLARE_ACCOUNT_ID", ""),
    "R2_ACCESS_KEY_ID": os.environ.get("CLOUDFLARE_R2_ACCESS_KEY_ID", ""),
    "R2_SECRET_ACCESS_KEY": os.environ.get("CLOUDFLARE_R2_SECRET_ACCESS_KEY", ""),
    "R2_BUCKET": os.environ.get("CLOUDFLARE_R2_BUCKET", ""),
    "R2_ENDPOINT": os.environ.get("CLOUDFLARE_R2_ENDPOINT", ""),
    "R2_PUBLIC_URL": os.environ.get("CLOUDFLARE_R2_PUBLIC_URL", ""),
    "STREAM_API_TOKEN": os.environ.get("CLOUDFLARE_STREAM_API_TOKEN", ""),
    "STREAM_CUSTOMER_CODE": os.environ.get("CLOUDFLARE_STREAM_CUSTOMER_CODE", ""),
}
