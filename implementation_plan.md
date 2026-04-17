# Add Django + FastAPI Backend to Hireonix

## Background

Hireonix is currently a **Next.js 16 frontend-only** app with features like AI Interview, Career Mapper, Resume Analysis, Career Matching, FAQ Chat, and Parallel Domain Comparison — all with hardcoded/client-side logic. There is **no backend or API layer** yet.

We'll add a **Python backend** that combines:
- **Django** — ORM, Admin panel, User auth, database models, migrations
- **FastAPI** — High-performance async API endpoints (especially for AI/ML features)

## User Review Required

> [!IMPORTANT]
> **Architecture Choice: Django + FastAPI hybrid**  
> Django handles traditional web concerns (users, admin, ORM), while FastAPI serves the performance-sensitive AI/ML endpoints. Both run as a single process using `django-ninja` or as separate processes. See options below.

> [!WARNING]
> **Integration approach**: There are two common patterns:
> 1. **Single process** — Use [django-ninja](https://django-ninja.dev/) (FastAPI-like syntax built on Django) so you get Django's ORM + FastAPI-like async endpoints in one server. **Recommended for simplicity.**
> 2. **Two separate servers** — Django on port 8000, FastAPI on port 8001, each serving different concerns. More complex but fully independent.
>
> **I recommend Option 1 (django-ninja)** for simplicity — you get FastAPI-style async endpoints while still using Django's ORM, admin, and auth. Let me know if you prefer separate servers.

## Proposed Changes

### Backend Directory Structure

```
hireonix/
├── backend/                    ← NEW: Python backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── hireonix/               ← Django project settings
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── users/                  ← Django app: authentication & profiles
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── admin.py
│   │   ├── schemas.py          ← Pydantic schemas (django-ninja)
│   │   └── api.py              ← FastAPI-style endpoints
│   ├── interviews/             ← Django app: AI interview logic
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── admin.py
│   │   ├── schemas.py
│   │   └── api.py
│   ├── jobs/                   ← Django app: job listings & applications
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── admin.py
│   │   ├── schemas.py
│   │   └── api.py
│   └── careers/                ← Django app: career mapping & resume analysis
│       ├── __init__.py
│       ├── models.py
│       ├── admin.py
│       ├── schemas.py
│       └── api.py
├── app/                        ← Existing Next.js frontend (unchanged for now)
├── package.json
└── ...
```

---

### Component 1: Django Project Setup

#### [NEW] [requirements.txt](file:///c:/Users/harsh/Desktop/Hireonix/hireonix/backend/requirements.txt)
- Django 5.x, django-ninja, django-cors-headers, python-dotenv, Pillow, gunicorn

#### [NEW] [manage.py](file:///c:/Users/harsh/Desktop/Hireonix/hireonix/backend/manage.py)
- Standard Django manage.py

#### [NEW] [settings.py](file:///c:/Users/harsh/Desktop/Hireonix/hireonix/backend/hireonix/settings.py)
- Database: SQLite for development (easy to swap to PostgreSQL later)
- CORS configured to allow Next.js dev server (`localhost:3000`)
- Installed apps: `users`, `interviews`, `jobs`, `careers`, `django-ninja`, `corsheaders`
- REST framework settings for django-ninja

#### [NEW] [urls.py](file:///c:/Users/harsh/Desktop/Hireonix/hireonix/backend/hireonix/urls.py)
- Mount django-ninja API at `/api/v1/`
- Django admin at `/admin/`

---

### Component 2: Users App (Auth & Profiles)

#### [NEW] [models.py](file:///c:/Users/harsh/Desktop/Hireonix/hireonix/backend/users/models.py)
- `UserProfile` model extending Django's built-in `User`
- Fields: bio, avatar, preferred_domain, experience_level

#### [NEW] [schemas.py](file:///c:/Users/harsh/Desktop/Hireonix/hireonix/backend/users/schemas.py)
- Pydantic schemas for signup, login, profile CRUD

#### [NEW] [api.py](file:///c:/Users/harsh/Desktop/Hireonix/hireonix/backend/users/api.py)
- `POST /api/v1/auth/signup` — Register user
- `POST /api/v1/auth/login` — Login (JWT token)
- `GET /api/v1/auth/me` — Current user profile
- `PUT /api/v1/auth/me` — Update profile

---

### Component 3: Interviews App

#### [NEW] [models.py](file:///c:/Users/harsh/Desktop/Hireonix/hireonix/backend/interviews/models.py)
- `InterviewSession` — domain, difficulty, mode, user, created_at, overall_score
- `InterviewAnswer` — session FK, question_text, answer_text, score, feedback

#### [NEW] [schemas.py](file:///c:/Users/harsh/Desktop/Hireonix/hireonix/backend/interviews/schemas.py)
- Request/response schemas for starting sessions, submitting answers, getting results

#### [NEW] [api.py](file:///c:/Users/harsh/Desktop/Hireonix/hireonix/backend/interviews/api.py)
- `POST /api/v1/interviews/start` — Start interview session
- `POST /api/v1/interviews/{id}/answer` — Submit an answer
- `GET /api/v1/interviews/{id}/results` — Get results
- `GET /api/v1/interviews/history` — User's past interviews

---

### Component 4: Jobs App

#### [NEW] [models.py](file:///c:/Users/harsh/Desktop/Hireonix/hireonix/backend/jobs/models.py)
- `Job` — title, company, description, location, salary_range, domain, posted_by
- `JobApplication` — job FK, user FK, resume, cover_letter, status

#### [NEW] [api.py](file:///c:/Users/harsh/Desktop/Hireonix/hireonix/backend/jobs/api.py)
- `GET /api/v1/jobs/` — List/filter jobs
- `GET /api/v1/jobs/{id}` — Job detail
- `POST /api/v1/jobs/{id}/apply` — Apply to job
- `POST /api/v1/jobs/` — Create job (recruiter)

---

### Component 5: Careers App (Resume Analysis & Career Mapping)

#### [NEW] [models.py](file:///c:/Users/harsh/Desktop/Hireonix/hireonix/backend/careers/models.py)
- `ResumeAnalysis` — user FK, file_path, analysis_result, score, created_at
- `CareerMap` — user FK, current_skills, suggested_paths, created_at

#### [NEW] [api.py](file:///c:/Users/harsh/Desktop/Hireonix/hireonix/backend/careers/api.py)
- `POST /api/v1/careers/analyze-resume` — Upload & analyze resume
- `POST /api/v1/careers/career-map` — Generate career map
- `GET /api/v1/careers/history` — Past analyses

---

### Component 6: Next.js Frontend Integration

#### [MODIFY] [next.config.ts](file:///c:/Users/harsh/Desktop/Hireonix/hireonix/next.config.ts)
- Add API proxy rewrites: `/api/v1/:path*` → `http://localhost:8000/api/v1/:path*`
- This lets the frontend call `/api/v1/...` without CORS issues in development

---

## Open Questions

> [!IMPORTANT]
> 1. **django-ninja (single process) vs separate FastAPI server?** — I recommend django-ninja for simplicity. Do you agree?
> 2. **Database**: Start with SQLite (simplest) or go straight to PostgreSQL?
> 3. **Authentication**: JWT tokens (stateless, good for API) or Django sessions? I recommend JWT.
> 4. **Do you want me to also wire up the first frontend page** (e.g., AI Interview) to hit the real backend API, or just set up the backend for now?

## Verification Plan

### Automated Tests
1. Run `python manage.py check` — Django system check
2. Run `python manage.py migrate` — Verify migrations work
3. Run `python manage.py runserver` — Confirm server starts
4. Test API endpoints via browser at `http://localhost:8000/api/v1/docs` (auto-generated Swagger UI from django-ninja)
5. Verify Next.js proxy works by running both servers and hitting `/api/v1/` from the front-end

### Manual Verification
- Access Django admin at `http://localhost:8000/admin/`
- View interactive API docs at `http://localhost:8000/api/v1/docs`
- Confirm CORS headers are present in responses
