---
name: cwc-project
description: Project handbook for the CWC Ecosystem ("Career with Chaitanya") website. Use before changing the frontend, backend, domain/DNS, Vercel, Supabase, SEO, plans/pricing, or content, and when asked how the site is deployed, which domain and URLs it uses, or which rules to follow.
---

# CWC Ecosystem: project handbook

**Never put secrets in this file** (keys, passwords, JWT secrets, service-role keys). Only variable *names* belong here. Real values live in `backend/.env`, `frontend/.env` and the Vercel project settings.

## 1. What the project is

- **Product:** CWC Ecosystem, also called **Career with Chaitanya**: an edtech and career platform run by the mentor **Chaitanya**. It helps students (mainly freshers) learn, practise interviews, get mentored and reach company referrals.
- **Mentor's main objective:** anyone searching "Chaitanya", "Chaitanya courses", "Chaitanya guidance", "Career with Chaitanya" or similar should find this site at the top of the results. Brand-name searches are realistic to win; the generic word "chaitanya" alone is not. Never promise a guaranteed ranking to the client.
- **Free side:** roadmaps (fresher and experienced), free course videos (Telugu and English), Open Mic (online and offline meets), Crack the Company guides, jobs, testimonials, interview simulator info.
- **Paid side (from the Updated PRD, `CWC_Ecosystem_Product_Requirement_Document_Updated.docx`):** two plans only.
  - **Monthly Career Support Subscription, ₹499/month:** mock technical and HR interview, readiness score and trainer feedback, improvement tips, referral support for one month if the readiness review is cleared.
  - **Career Development Program, ₹30,000:** two live classes a day (1.5 hours each), LMS and recordings, daily mentoring and PM calls, weekly tests and mocks, company simulation drives (target 1 to 2 exposures a month), 1 to 2 month internship subject to eligibility, Interview Simulator, resume prep, referral coordination.
  - The old ₹15,000 plan was removed. Do not reintroduce it.
- **Payments and registration today:** Google Forms only. No payment gateway is built yet (Razorpay is planned, see section 8).

## 2. Domain and hosting configuration

| Item | Value |
|---|---|
| Domain | `cwcecosystem.com`, bought at **GoDaddy** |
| Main (canonical) address | `https://www.cwcecosystem.com` |
| Apex `cwcecosystem.com` | Redirects (308) to the `www` address |
| Old Vercel address | `cwc-lms-5wad.vercel.app`, set to redirect (308) to `www.cwcecosystem.com` |
| Frontend host | **Vercel**, project `cwc-lms-5wad` (Hobby plan; note Hobby is meant for non-commercial use) |
| Backend host | **Vercel** serverless Django, `https://cwc-lms.vercel.app` (API base `https://cwc-lms.vercel.app/api`) |
| Database and auth | **Supabase** (Postgres + Auth + Storage), project ref `oqopujkuejktrjqadrqn` |
| Media (planned) | Cloudflare R2 and Stream; Supabase Storage for now |
| Captcha | Cloudflare Turnstile (site key in `VITE_TURNSTILE_SITE_KEY`) |

### GoDaddy DNS records (keep these)

| Type | Name | Value | Note |
|---|---|---|---|
| A | `@` | `216.198.79.1` | Vercel. Replaced the default "Parked" record. |
| CNAME | `www` | `8da9b319b5ffae38.vercel-dns-017.com.` | Vercel. Edit the existing `www` row; adding a second one fails with "conflicts with another record". |
| NS, SOA | `@` | `ns31/ns32.domaincontrol.com` | GoDaddy defaults, do not touch. |
| CNAME | `_domainconnect` | `_domainconnect.gd.domaincontrol.com.` | GoDaddy default, leave. |
| TXT | `_dmarc` | GoDaddy default | Leave. |

Vercel gives project-specific DNS values. If the domain is ever re-added, copy the values Vercel shows, not the ones in this file. Search Console verification needs one extra TXT record at GoDaddy.

### Settings that must list the new domain

| Where | Setting |
|---|---|
| Supabase, Authentication, URL Configuration | Site URL `https://www.cwcecosystem.com`. Redirect URLs: `https://www.cwcecosystem.com`, `https://www.cwcecosystem.com/**`, `https://cwcecosystem.com`, `https://cwcecosystem.com/**`, `http://localhost:5173`, and the old `cwc-lms-5wad.vercel.app` entries. |
| Backend env (Vercel) | `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`, comma-separated, no spaces. Must include both new addresses (and the old Vercel one if it should keep working directly). Redeploy the backend after changing env vars. |
| Turnstile widget | Hostnames `cwcecosystem.com` and `www.cwcecosystem.com`. |
| Frontend env | `VITE_API_URL=https://cwc-lms.vercel.app/api` (unchanged by the domain move). |

Lesson learned: when `CORS_ALLOWED_ORIGINS` was replaced instead of extended, the old Vercel address lost API access (pages that load data failed). Always **add** to the list.

## 3. Repository layout

```
cwc/
├── backend/            Django + Django REST Framework (api/index.py is the Vercel entry)
│   └── apps/accounts   Profile, Supabase JWT auth (SupabaseJWTAuthentication), /api/me
│   └── apps/content    roadmaps, interviews, jobs, testimonials, member_courses.json (+ seed command)
├── frontend/           React 18 + Vite + React Router v6, plain CSS
│   ├── src/pages       Landing, Home, Roadmaps, CourseTracks, FresherCourses, Courses, CrackCompany,
│   │                   Jobs, OpenMic, InterviewSimulator, Interviews, Testimonials, About, Login
│   ├── src/components  layouts (PublicLayout, AppLayout), NavDropdown, Seo, OfflineCarousel, GreetingPopup ...
│   ├── src/data        homeContent.js, plans.js, companies.js, students.js, meetups.json, greetings.js, site.js
│   ├── src/seo         routes.js (single source for page titles and descriptions)
│   ├── src/lib         supabase client, api helper, afterLogin.js
│   ├── src/styles      CSS split by area (see rules)
│   └── scripts         seo-build.mjs, spa-fallback.mjs (run by `npm run build` as `postbuild`)
├── vercel.json         root rewrites (framework null, outputDirectory frontend/dist)
└── README.md
```

How it fits together: the browser logs in with Supabase Auth (email or Google). React sends the Supabase JWT to Django, which verifies it and serves content. Free versus member access is decided server-side for roadmaps and the member course (`/api/courses/members/` returns 401 without login).

## 4. Environment variable names (values are secret, never write them here)

- **Backend:** `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_JWT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`, `MEDIA_STORAGE`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`, `CLOUDFLARE_*` (R2 and Stream).
- **Frontend (public values only, anything `VITE_` ships to the browser):** `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_TURNSTILE_SITE_KEY`.
- **Planned:** `RAZORPAY_KEY_ID` (also `VITE_RAZORPAY_KEY_ID`), `RAZORPAY_KEY_SECRET` (backend only), `RAZORPAY_WEBHOOK_SECRET`, `RAZORPAY_PLAN_ID_499`; `ANTHROPIC_API_KEY` for LLM features; `JOBS_SHEET_URL` and job-API keys (Adzuna, RapidAPI) for jobs; `CRON_SECRET` for scheduled jobs.

## 5. Forms and external links

- **Plans (both ₹499/month and ₹30,000):** Google Form "Course Registration" (name, email, phone, graduation year, qualification, branch, optional course domain). Defined once in `frontend/src/data/plans.js` as `PLAN_FORM`. The form does **not** ask which plan was chosen; ask the mentor to add that question or send two forms.
- **Interview Simulator:** Google Form "Interview Stimulator" (same details plus a Drive link to the resume). Constant `SIMULATOR_FORM` in `plans.js`, used on `/interview-simulator`.
- **Social profiles** (used for structured data): YouTube `@careerwithchaitanya`, Instagram `careerwithchaitanya`, LinkedIn `chaitanya-madakasira`.

## 6. Site structure and navigation

- **Visitor nav:** Home, Free resources (dropdown: Open Mic, Roadmaps, Course videos, Crack the Company), **Courses Hub** (dropdown: Courses, Interview Simulator), Jobs, Testimonials, About us.
- **Logged-in nav:** the same, plus an **Interviews** tab (the ₹499 mock interview program; its Book buttons are still toast-only).
- **Courses flow:** `/course-tracks` (Freshers or Experienced, Experienced is "Coming soon") then `/course-tracks/freshers` (five courses: Data Science, Data Analysis, AI & ML, Python Full Stack, Java Full Stack), then **Know more** reveals the two plans with a feature comparison and a **Click to start** button to the form.
- **Open Mic order:** hero, "In the room" slideshow (only the 16:9 photos, shown whole, no bars), Watch recent meets, Join an online meet, Meet in person, More moments gallery (above the footer).
- **Crack the Company:** first 3 companies are free; the rest are locked with a lock icon until login (client-side only, so guide text is in the public bundle).
- **Theme:** **dark is the default** (`cwc_theme` in localStorage overrides it; the light/dark toggle stays).
- **Post-login redirect:** `frontend/src/lib/afterLogin.js` remembers the page a visitor came from so email and Google (OAuth) logins return to it.

## 7. Rules we follow

### Code and styling
1. **CSS order matters.** `main.jsx` imports: index, login, home, creative, showcase, roadmaps, courses, media, viewer, social, courses-nav, navdd, jobs, crack. Later files win. New styles go at the **end of `crack.css`**.
2. **Check for class-name clashes before adding CSS.** Old rules are left in `index.css` (for example `.plans` and `.plan` with a `max-width`). New plan blocks use the `cplan*` prefix for that reason. Grep first.
3. **Use theme tokens** (`--paper`, `--line`, `--ink`, `--muted`, `--orange`, `--orange-text`, `--apricot`, `--surface`, `--cream`) so dark and light both work.
4. **Icons are the outline set in `Icon.jsx`** (24px grid). Add a new path there; never use emoji icons.
5. **Every layout must be responsive** (check desktop and about 390px phone width, no horizontal scroll).
6. **One source for page text:** page titles and descriptions live in `src/seo/routes.js`. Plans, courses and form links live in `src/data/plans.js`. Do not duplicate them in components.
7. Wrap `sessionStorage`/`localStorage` access in try/catch. Keys in use: `cwc_theme`, `cwc_greeting_seen_welcome-features`, `cwc_jobs_nudge`, `cwc_last_path`, `cwc_after_login`, `cwc_ck_<id>`.
8. Server-side checks for anything paid or private. Client-side locks are teasers only.

### Content and wording
9. **Referrals, exposure and internships are never guaranteed.** Always say "subject to openings, employer participation and eligibility". Never promise an interview, internship or job.
10. **Simulations are simulations.** Never call a company simulation a real hiring drive.
11. Do not reintroduce the ₹15,000 plan. Referral readiness is based on demonstrated skill and assessment, not on finishing the whole course.
12. Real student names, photos and videos need consent. `SHOW_SAMPLE_STORIES` in `students.js` must be **false** before launch. Company guide text for Wipro, Cognizant, Capgemini, Deloitte and Amazon is hedged and should be reviewed by the mentor.
13. Add a short privacy note wherever phone, email or resume are collected (the Google Forms do this).

### SEO
14. The site is a single-page app. `npm run build` runs `scripts/seo-build.mjs`, which writes a real HTML file per listed page (with title, description, canonical, social tags, noscript text) plus `sitemap.xml`, then `spa-fallback.mjs` writes `404.html`. **Add every new public page to `src/seo/routes.js`**, or it will not be pre-built or put in the sitemap.
15. `/login` and `/interviews` are `noindex` (see `robots.txt`). Canonical host is `https://www.cwcecosystem.com`.
16. Ranking steps outside the code: verify the domain in Google Search Console (DNS TXT at GoDaddy), submit the sitemap, request indexing, repeat in Bing Webmaster Tools, and put `https://www.cwcecosystem.com` in the YouTube, Instagram and LinkedIn profiles and video descriptions.
17. Known gap: `/roadmaps/<slug>` pages are not pre-built and may return a 404 status on Vercel even though the app loads.

### Working in this repo
18. **Local ports:** frontend `http://localhost:5173` (Vite uses the next port if 5173 is taken, so read the log), backend `http://localhost:8000`. The frontend `.env` points at 8000.
19. **Backend must run from `backend/.venv`** (`.venv/Scripts/python.exe manage.py runserver 8000`). The system Python has no Django.
20. **Other projects share this machine.** A different Vite app and a uvicorn server have appeared on ports 5173 and 8000. **Never kill a process you did not start.** Check what owns a port before stopping it. TaskStop does not always end Vite; use `Stop-Process` on the exact process for your own servers.
21. Shell: Git Bash rewrites paths that start with `/` (for example `/jobs` becomes a Windows path). Quote full URLs, or use PowerShell for such tests.
22. Visual checks use Playwright (python). Set `cwc_greeting_seen_welcome-features` and `cwc_jobs_nudge` in sessionStorage first or the pop-ups intercept clicks. Pages that use `useApi` need the backend running.
23. **Do not commit or push unless asked.** Nothing deploys until pushed and Vercel redeploys. Redeploy the backend after changing env vars.
24. Do not commit `.env`, `CLIENT_CONTENT_FORM.xlsx` temp files (`~$...`), or anything with secrets. Paste no real secrets into chat; use placeholders and `.env.example`.

## 8. Open decisions and next work

- **Confirm with the mentor:** access period for each plan, what "daily" means, what counts as a company exposure, how internships are sourced, mock pass criteria and who approves readiness, whether ₹499/month is recurring, and the refund and cancellation policy.
- **Planned build (see the earlier plan):** Phase 1: Plans page, profile and consent, Razorpay (orders for ₹30,000, subscriptions for ₹499/month, activation only from a verified webhook), plan-aware dashboard. Phase 2: live classes, LMS gating, mentoring and PM log, tests and mocks, simulation drives. Phase 3: company and referral CRM, internships, analytics. Start with the Django admin before a custom admin portal.
- **Jobs sources:** two paths, a public spreadsheet (`JOBS_SHEET_URL`) and an API or LangChain fetch via official job APIs. Do not scrape LinkedIn or Naukri. Run fetches as scheduled jobs, not inside a web request, and deduplicate by company, title, location and apply URL.
- **Interview Simulator:** launch with question banks and trainer scoring; add LLM feedback later with a spend cap.
- A 1200×630 share image is still needed for link previews (currently the 512px logo).
