# PMRead

Turn customer research into PRDs. Upload interviews, calls, and support tickets — PMRead extracts insights and generates evidence-backed product requirement documents.

**Stack:** Next.js 16 · FastAPI · PostgreSQL · Celery · Redis · Anthropic Claude

---

## Repository structure

```
pmread/
├── api/          # FastAPI backend + Celery worker
├── app/          # Next.js frontend
└── .github/
    └── workflows/
        ├── ci.yml      # Runs on PRs to stage
        └── deploy.yml  # Deploys stage → prod automatically
```

---

## Local development

### Prerequisites

- Python 3.12
- Node 20
- PostgreSQL
- Redis

### 1. Clone

```bash
git clone git@github.com:YOUR_USER/pmread.git
cd pmread
```

### 2. Backend

```bash
cd api
python3.12 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `api/.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost/pmread_dev
SECRET_KEY=any-random-string-for-local
ANTHROPIC_API_KEY=sk-ant-...
CELERY_BROKER_URL=redis://localhost:6379/0
FRONTEND_URL=http://localhost:3000
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

Run migrations and start:
```bash
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --reload --port 8000
```

### 3. Celery worker

```bash
cd api
source venv/bin/activate
celery -A app.worker worker --loglevel=info
```

### 4. Frontend

```bash
cd app
npm install
```

Create `app/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
npm run dev
```

App runs at `http://localhost:3000`, API at `http://localhost:8000`.

---

## Branch workflow

```
feature/* ──PR──▶ stage ──CI passes, merge──▶ auto-promote──▶ main
                    │                                             │
               staging VPS                                  prod VPS
```

- All new work branches off `stage`, not `main`
- PRs target `stage` — CI (lint + security + type-check) runs on every PR
- Merging to `stage` triggers a staging deploy, then auto-promotes to `main`
- `main` triggers the production deploy — never commit directly to it

---

## Environment variables reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | yes | Postgres connection string |
| `SECRET_KEY` | yes | JWT signing key (min 32 chars) |
| `ANTHROPIC_API_KEY` | yes | Claude API key |
| `CELERY_BROKER_URL` | yes | Redis URL |
| `FRONTEND_URL` | yes | Base URL of frontend (for email links) |
| `RAZORPAY_KEY_ID` | yes | Razorpay key |
| `RAZORPAY_KEY_SECRET` | yes | Razorpay secret |
| `RAZORPAY_WEBHOOK_SECRET` | yes | Razorpay webhook signature secret |
| `SMTP_HOST` | no | SMTP server (email disabled if unset) |
| `SMTP_PORT` | no | Default `587` |
| `SMTP_USER` | no | SMTP username |
| `SMTP_PASS` | no | SMTP password |
| `FROM_EMAIL` | no | Sender address for transactional email |
| `NEXT_PUBLIC_API_URL` | yes | API base URL (frontend) |
| `NEXT_PUBLIC_GA_ID` | no | Google Analytics GA4 measurement ID |
| `NEXT_PUBLIC_NOINDEX` | no | Set `true` on staging to block search indexing |
| `SENTRY_DSN` | no | Sentry error tracking DSN |

---

## Database migrations

```bash
# Apply all pending migrations
alembic upgrade head

# Create a new migration after model changes
alembic revision --autogenerate -m "describe the change"

# Roll back one step
alembic downgrade -1
```

---

## Deployment

See `deploy.md` (gitignored, local only) for full VPS setup instructions covering systemd services, Nginx config, and SSL.
