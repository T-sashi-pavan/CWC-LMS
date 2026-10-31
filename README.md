# Career with Chaitanya: LMS POC

Monorepo with a separate backend and frontend.

```
cwc/
├── backend/                 Django + Django REST Framework
│   ├── api/index.py         Vercel serverless entrypoint
│   ├── config/              settings, urls, wsgi/asgi
│   └── apps/
│       ├── accounts/        Profile (free/pro plan), Supabase JWT auth, /api/me
│       └── content/         Roadmaps, interviews, jobs, testimonials, plans + seed command
├── frontend/                React (Vite) + React Router
│   └── src/
│       ├── components/      Logo, AppLayout, ProfileMenu, ThemeToggle, Turnstile, ui
│       ├── context/         AuthContext (Supabase auth), ToastContext
│       ├── lib/             supabase client, api helper, useApi hook
│       ├── pages/           Login, Home, Roadmaps, Interviews, Jobs, Testimonials, Pro
│       └── styles/          index.css (app + light/dark theme), login.css
├── .github/workflows/       ci.yml (build + Django checks)
└── README.md
```

**How it fits together:** the browser logs in with Supabase Auth (email/password or Google, optional Cloudflare
Turnstile). React sends the Supabase JWT to Django, which verifies it and serves content from Supabase Postgres.
Free vs Pro is decided server-side, so locked content never leaves the API. All media is stored in Supabase Storage
for now; Cloudflare R2/Stream is planned for video streaming (placeholders are in `backend/.env.example`).

## Run locally

Backend (http://localhost:8000):
```bash
cd backend
python -m venv .venv && .venv\Scripts\activate      # Windows
pip install -r requirements.txt
copy .env.example .env                               # then fill it in (DATABASE_URL is required)
python manage.py migrate
python manage.py seed_content                        # sample data
python manage.py createsuperuser                     # for /admin
python manage.py runserver
```

Frontend (http://localhost:5173):
```bash
cd frontend
npm install
copy .env.example .env                               # then fill it in
npm run dev
```

The backend requires `DATABASE_URL` (Supabase Postgres only, there is no SQLite fallback). With no frontend
Supabase keys the UI runs in **demo mode** (any login works, no real auth).

## Make a user Pro (until payments are wired)
Log in once, then in `/admin` > Profiles set the user's plan to **Pro**.

## Deploy on Vercel (two projects from this one repo)

Vercel is configured with `vercel.json` (it has no YAML config). CI checks live in `.github/workflows/ci.yml`.

**1. Backend project**: Vercel > Add New > Project > import the repo
- Root Directory: `backend` (framework preset: Other)
- Environment variables: everything in `backend/.env.example`. Use the Supabase **Transaction pooler** URL (port 6543)
  for `DATABASE_URL`, and set `DJANGO_DEBUG=False`.
- After it deploys, set `CORS_ALLOWED_ORIGINS` to the frontend URL and `CSRF_TRUSTED_ORIGINS` to the frontend URL
  plus the backend's own `https://...vercel.app`, then redeploy.
- Run `python manage.py migrate` and `seed_content` once from your machine (with the same `DATABASE_URL`).

**2. Frontend project**: add a second project from the same repo
- Root Directory: `frontend` (Vite is detected; `frontend/vercel.json` adds the SPA rewrite so `/login`, `/jobs` etc.
  survive a refresh)
- Environment variables: `VITE_API_URL=https://<backend>.vercel.app/api`, `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY` (and `VITE_TURNSTILE_SITE_KEY` if used). Set them before building: Vite bakes them in.

**3. Supabase**: Authentication > URL Configuration: set Site URL to the frontend URL and add it (and
`http://localhost:5173`) to Redirect URLs. Required for email confirmation and Google login to return to your site.

Never commit `.env` files. Sample content in `seed_content` (jobs, testimonials) is placeholder; replace it from `/admin`.
