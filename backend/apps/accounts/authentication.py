"""Verify the JWT issued by Supabase Auth and expose it to DRF."""
import jwt
from django.conf import settings
from jwt import PyJWKClient
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed

_jwks_client = None


def _get_jwks_client():
    global _jwks_client
    if _jwks_client is None:
        _jwks_client = PyJWKClient(f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json")
    return _jwks_client


def decode_supabase_token(token: str) -> dict:
    alg = jwt.get_unverified_header(token).get("alg")
    if alg == "HS256":
        if not settings.SUPABASE_JWT_SECRET:
            raise AuthenticationFailed("SUPABASE_JWT_SECRET is not configured.")
        key, algorithms = settings.SUPABASE_JWT_SECRET, ["HS256"]
    else:
        if not settings.SUPABASE_URL:
            raise AuthenticationFailed("SUPABASE_URL is not configured.")
        key = _get_jwks_client().get_signing_key_from_jwt(token).key
        algorithms = ["RS256", "ES256"]
    return jwt.decode(token, key, algorithms=algorithms, audience="authenticated")


class SupabaseUser:
    """Lightweight stand-in for request.user."""

    is_authenticated = True
    is_anonymous = False

    def __init__(self, claims: dict):
        self.claims = claims
        self.id = claims["sub"]
        self.email = claims.get("email", "")
        self.full_name = (claims.get("user_metadata") or {}).get("full_name", "")

    def __str__(self):
        return self.email or self.id


class SupabaseJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        parts = get_authorization_header(request).split()
        if not parts or parts[0].lower() != b"bearer":
            return None
        if len(parts) != 2:
            raise AuthenticationFailed("Invalid Authorization header.")
        try:
            claims = decode_supabase_token(parts[1].decode())
        except jwt.PyJWTError as exc:
            raise AuthenticationFailed(f"Invalid token: {exc}")
        return SupabaseUser(claims), claims

    def authenticate_header(self, request):
        return "Bearer"
