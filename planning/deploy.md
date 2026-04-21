# PMRead — VPS Deployment Guide

This file is gitignored. Do not commit it.

---

## Overview

Two environments on the same VPS:

| Environment | Folder          | Domain                        | API port | Frontend port |
|-------------|-----------------|-------------------------------|----------|---------------|
| Staging     | ~/pmread-stage  | staging-pmread.rohanyeole.com | 8005     | 3005          |
| Production  | ~/pmread-prod   | pmread.org                    | 8006     | 3006          |

Both environments share the same VPS. Each has its own:
- Postgres database
- Redis instance (or separate DB index)
- Python venv
- `.env` file
- Systemd services

---

## 1. First-time VPS setup

### Install system dependencies

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git python3.12 python3.12-venv python3-pip nodejs npm postgresql redis-server nginx
```

Install Node 20 via nvm if the distro ships an older version:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20 && nvm use 20 && nvm alias default 20
```

---

## 2. Clone repos

```bash
cd ~
git clone git@github.com:YOUR_USER/pmread.git pmread-stage
git clone git@github.com:YOUR_USER/pmread.git pmread-prod
```

Set branch tracking:
```bash
cd ~/pmread-stage && git checkout stage && git branch --set-upstream-to=origin/stage
cd ~/pmread-prod  && git checkout main  && git branch --set-upstream-to=origin/main
```

---

## 3. Python venv (repeat for both folders)

```bash
cd ~/pmread-stage/api
python3.12 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
deactivate

cd ~/pmread-prod/api
python3.12 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
deactivate
```

---

## 4. Frontend dependencies + build (repeat for both)

```bash
cd ~/pmread-stage/app && npm ci && npm run build
cd ~/pmread-prod/app  && npm ci && npm run build
```

---

## 5. Postgres databases

```bash
sudo apt install -y postgresql-16-pgvector
```

```bash
sudo -u postgres psql
```
```sql
CREATE USER pmread_stage WITH PASSWORD 'p<>2UD_r|e$$>mSi';
CREATE DATABASE pmread_stage OWNER pmread_stage;

CREATE USER pmread_prod WITH PASSWORD 'hJ6_hdZo78hXzwwUknDf';
CREATE DATABASE pmread_prod OWNER pmread_prod;

-- pgvector must be created as superuser, once per database, before running migrations
\c pmread_stage
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

\c pmread_prod
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;
\q
```

> `CREATE EXTENSION vector` always requires superuser. The Alembic migration does **not**
> run this — it must be done here during initial DB setup. If you skip it and the migration
> fails, run:
> ```bash
> sudo -u postgres psql -d pmread_stage -c "CREATE EXTENSION IF NOT EXISTS vector;"
> sudo -u postgres psql -d pmread_prod  -c "CREATE EXTENSION IF NOT EXISTS vector;"
> ```

---

## 6. Environment files

### ~/pmread-stage/.env
```
# API
DATABASE_URL=postgresql://pmread_stage:STRONG_PASSWORD_HERE@localhost/pmread_stage
SECRET_KEY=RANDOM_64_CHAR_STRING
ANTHROPIC_API_KEY=sk-ant-...
XAI_API_KEY=xai-...
OPENAI_API_KEY=                        # optional fallback for embeddings
CELERY_BROKER_URL=redis://localhost:6379/1
FRONTEND_URL=https://staging-pmread.rohanyeole.com
BACKEND_URL=https://staging-pmread.rohanyeole.com
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=noreply@pmread.rohanyeole.com

# Frontend
NEXT_PUBLIC_API_URL=https://staging-pmread.rohanyeole.com/api
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_NOINDEX=true
```

### ~/pmread-prod/.env
```
# API
DATABASE_URL=postgresql://pmread_prod:STRONG_PASSWORD_HERE@localhost/pmread_prod
SECRET_KEY=DIFFERENT_RANDOM_64_CHAR_STRING
ANTHROPIC_API_KEY=sk-ant-...
XAI_API_KEY=xai-...
OPENAI_API_KEY=                        # optional fallback for embeddings
CELERY_BROKER_URL=redis://localhost:6379/0
FRONTEND_URL=https://pmread.rohanyeole.com
BACKEND_URL=https://pmread.rohanyeole.com
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=re_...
FROM_EMAIL=noreply@pmread.rohanyeole.com

# Frontend
NEXT_PUBLIC_API_URL=https://pmread.rohanyeole.com/api
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_NOINDEX=false
```

The api reads from `api/.env` and the frontend reads from `app/.env.local`.
Symlink them so a single `.env` at root covers both:

```bash
# Staging
ln -s ~/pmread-stage/.env ~/pmread-stage/api/.env
ln -s ~/pmread-stage/.env ~/pmread-stage/app/.env.local

# Prod
ln -s ~/pmread-prod/.env ~/pmread-prod/api/.env
ln -s ~/pmread-prod/.env ~/pmread-prod/app/.env.local
```

---

## 7. Alembic migrations

```bash
cd ~/pmread-stage/api && source venv/bin/activate && alembic upgrade head && deactivate
cd ~/pmread-prod/api  && source venv/bin/activate && alembic upgrade head && deactivate
```

---

## 8. Systemd services

Create each file at `/etc/systemd/system/`. Replace `ubuntu` with your actual user.

### pmread-stage-api.service
```ini
[Unit]
Description=PMRead Staging API
After=network.target postgresql.service

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/pmread-stage/api
EnvironmentFile=/home/ubuntu/pmread-stage/.env
ExecStart=/home/ubuntu/pmread-stage/api/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8005
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### pmread-stage-worker.service
```ini
[Unit]
Description=PMRead Staging Celery Worker
After=network.target redis.service

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/pmread-stage/api
EnvironmentFile=/home/ubuntu/pmread-stage/.env
ExecStart=/home/ubuntu/pmread-stage/api/venv/bin/celery -A app.worker worker --loglevel=info
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### pmread-stage-frontend — managed by PM2 (see section 8b)

### pmread-prod-api.service
```ini
[Unit]
Description=PMRead Production API
After=network.target postgresql.service

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/pmread-prod/api
EnvironmentFile=/home/ubuntu/pmread-prod/.env
ExecStart=/home/ubuntu/pmread-prod/api/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8006
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### pmread-prod-worker.service
```ini
[Unit]
Description=PMRead Production Celery Worker
After=network.target redis.service

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/pmread-prod/api
EnvironmentFile=/home/ubuntu/pmread-prod/.env
ExecStart=/home/ubuntu/pmread-prod/api/venv/bin/celery -A app.worker worker --loglevel=info
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### pmread-prod-frontend — managed by PM2 (see section 8b)

### Enable and start API + worker services

```bash
sudo systemctl daemon-reload
sudo systemctl enable pmread-stage-api pmread-stage-worker
sudo systemctl enable pmread-prod-api  pmread-prod-worker
sudo systemctl start  pmread-stage-api pmread-stage-worker
sudo systemctl start  pmread-prod-api  pmread-prod-worker
```

---

## 8b. PM2 — Frontend processes

API and Celery workers run under systemd. The Next.js frontends run under PM2.

### Install PM2

```bash
npm install -g pm2
```

### First-time setup (run once)

```bash
# Stop and disable the old systemd frontend services if they exist
sudo systemctl stop    pmread-stage-frontend pmread-prod-frontend 2>/dev/null || true
sudo systemctl disable pmread-stage-frontend pmread-prod-frontend 2>/dev/null || true

# Build static assets and copy into standalone dir (staging)
cd ~/pmread-stage/app
npm ci --silent && npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public       .next/standalone/public

# Build static assets and copy into standalone dir (prod)
cd ~/pmread-prod/app
npm ci --silent && npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public       .next/standalone/public

# Start both frontends with PM2
PORT=3005 HOSTNAME=127.0.0.1 pm2 start ~/pmread-stage/app/.next/standalone/server.js \
  --name pmread-stage-frontend

PORT=3006 HOSTNAME=127.0.0.1 pm2 start ~/pmread-prod/app/.next/standalone/server.js \
  --name pmread-prod-frontend

# Save process list and enable PM2 on boot
pm2 save
pm2 startup   # follow the printed command (sudo env PATH=... pm2 startup systemd ...)
```

### Nginx ports

| Environment | API port | Frontend port |
|---|---|---|
| Staging | 8005 | 3005 |
| Production | 8006 | 3006 |

### Daily PM2 commands

```bash
pm2 status                        # see all processes
pm2 logs pmread-stage-frontend    # live log tail
pm2 logs pmread-stage-frontend --lines 100  # last 100 lines
pm2 restart pmread-stage-frontend
pm2 restart pmread-prod-frontend
```

### Deploy restart (replaces systemctl for frontend)

```bash
# After build + cp -r static steps:
pm2 restart pmread-stage-frontend
# or
pm2 restart pmread-prod-frontend
```

### Allow deploy user to restart services without password

```bash
sudo tee /etc/sudoers.d/pmread > /dev/null <<EOF
siteadmin ALL=(ALL) NOPASSWD: \
  /bin/systemctl restart pmread-stage-api, \
  /bin/systemctl restart pmread-stage-worker, \
  /bin/systemctl restart pmread-prod-api, \
  /bin/systemctl restart pmread-prod-worker
EOF
```

PM2 restarts (`pm2 restart pmread-stage-frontend`) run as the deploy user directly — no sudo needed.

---

## 9. Nginx

Install Certbot for prod SSL:
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### /etc/nginx/sites-available/pmread-stage
```nginx
server {
    listen 80;
    server_name staging-pmread.rohanyeole.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name staging-pmread.rohanyeole.com;

    ssl_certificate     /etc/letsencrypt/live/staging-pmread.rohanyeole.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/staging-pmread.rohanyeole.com/privkey.pem;

    # No indexing — belt and suspenders alongside NEXT_PUBLIC_NOINDEX
    add_header X-Robots-Tag "noindex, nofollow" always;

    location /api/ {
        proxy_pass http://127.0.0.1:8005;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto https;
        proxy_read_timeout 120s;
    }

    location / {
        proxy_pass http://127.0.0.1:3005;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

### /etc/nginx/sites-available/pmread-prod
```nginx
server {
    listen 80;
    server_name pmread.rohanyeole.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name pmread.rohanyeole.com;

    ssl_certificate     /etc/letsencrypt/live/pmread.rohanyeole.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pmread.rohanyeole.com/privkey.pem;

    location /api/ {
        proxy_pass http://127.0.0.1:8006;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto https;
        proxy_read_timeout 120s;
    }

    location / {
        proxy_pass http://127.0.0.1:3006;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

Enable sites:
```bash
sudo ln -s /etc/nginx/sites-available/pmread-stage /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/pmread-prod  /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Get SSL cert for prod:
```bash
sudo certbot --nginx -d pmread.rohanyeole.com
sudo certbot --nginx -d staging-pmread.rohanyeole.com
```

---

## 10. GitHub Secrets

Go to GitHub repo → Settings → Secrets and variables → Actions → New repository secret:

| Secret           | Value                                          |
|------------------|------------------------------------------------|
| `VPS_HOST`       | VPS IP or hostname                             |
| `VPS_USER`       | `ubuntu` (or your SSH user)                    |
| `VPS_SSH_KEY`    | Full private key (`-----BEGIN...-----END-----`) |
| `VPS_PORT`       | `22` (omit if default)                         |
| `APP_DIR_STAGE`  | `/home/ubuntu/pmread-stage`                    |
| `APP_DIR_PROD`   | `/home/ubuntu/pmread-prod`                     |

---

## 11. Deploy flow

```
feature/* ──PR──▶ stage ──CI passes──▶ merge
                   │
                   └─▶ stage-deploy (VPS pmread-stage)
                         │
                         └─▶ auto-promote: stage merged into main
                               │
                               └─▶ prod-deploy (VPS pmread-prod)
```

Manual deploy (if needed):
```bash
# On VPS — stage
cd ~/pmread-stage && git pull origin stage
source api/venv/bin/activate && pip install -q -r api/requirements.txt
cd api && alembic upgrade head && cd ..
cd app && npm ci --silent && npm run build
# Required for standalone output — copy static assets into the standalone dir
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
cd ..
sudo systemctl restart pmread-stage-api pmread-stage-worker pmread-stage-frontend

# On VPS — prod
cd ~/pmread-prod && git pull origin main
source api/venv/bin/activate && pip install -q -r api/requirements.txt
cd api && alembic upgrade head && cd ..
cd app && npm ci --silent && npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
cd ..
sudo systemctl restart pmread-prod-api pmread-prod-worker pmread-prod-frontend
```

---

## 12. Useful commands

```bash
# Check service status
sudo systemctl status pmread-prod-api
sudo systemctl status pmread-prod-worker

# View live logs (follow mode)
sudo journalctl -u pmread-prod-api -f
sudo journalctl -u pmread-prod-worker -f
sudo journalctl -u pmread-prod-frontend -f

# Last 100 lines (useful after a crash)
sudo journalctl -u pmread-prod-worker -n 100 --no-pager

# Restart everything at once
sudo systemctl restart pmread-prod-api pmread-prod-worker pmread-prod-frontend

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## 13. Debugging the Celery worker

### Is the worker running and connected to Redis?

```bash
# Quick health check — lists active queues and registered tasks
cd ~/pmread-prod/api
source venv/bin/activate
celery -A app.worker inspect active
celery -A app.worker inspect registered   # should list extract_insights_task, index_github_repo_task
```

### Is a task stuck / queued but not running?

```bash
celery -A app.worker inspect reserved    # tasks picked up but not started
celery -A app.worker inspect active      # tasks currently running

# See what's sitting in the queue (raw Redis)
redis-cli -n 0 llen celery               # prod queue length
redis-cli -n 1 llen celery               # stage queue length
```

### Manually trigger a task to test end-to-end

```bash
cd ~/pmread-prod/api && source venv/bin/activate
python - <<'EOF'
from app.tasks.extraction import extract_insights_task
from app.tasks.github_index import index_github_repo_task

# Replace with a real doc_id from the DB
result = extract_insights_task.delay("YOUR-DOC-UUID-HERE")
print("Task ID:", result.id)
EOF
```

### Worker crashed — find out why

```bash
# Show last crash with full traceback
sudo journalctl -u pmread-prod-worker -n 200 --no-pager | grep -A 20 "ERROR\|Traceback\|Exception"
```

### Worker not picking up tasks at all

```bash
# 1. Confirm Redis is up
redis-cli -n 0 ping          # should return PONG

# 2. Check the broker URL in .env matches the redis-cli -n index
grep CELERY_BROKER_URL ~/pmread-prod/.env

# 3. Restart worker and watch startup logs
sudo systemctl restart pmread-prod-worker
sudo journalctl -u pmread-prod-worker -f
# Look for: "Connected to redis://..." and "celery@... ready."
```

### SSE events not reaching the browser (indexing/extraction spinner stuck)

```bash
# Check Redis pub/sub — publish a test event and verify it lands
redis-cli -n 0 subscribe "project:YOUR-PROJECT-UUID"   # terminal 1 — listen
redis-cli -n 0 publish  "project:YOUR-PROJECT-UUID" '{"type":"ping"}'  # terminal 2

# If subscribe gets the message → Redis is fine, check the FastAPI SSE endpoint
# If not → worker is publishing to the wrong DB index (check CELERY_BROKER_URL vs redis -n)

# Check the SSE endpoint directly (replace token)
curl -N "https://pmread.rohanyeole.com/api/projects/YOUR-PROJECT-UUID/events?token=YOUR-JWT"
```

### GitHub indexing failed / stuck on "Indexing…"

```bash
# 1. Check worker log for the task
sudo journalctl -u pmread-prod-worker -n 300 --no-pager | grep -i "github\|index\|ERROR"

# 2. Check project status directly in DB
sudo -u postgres psql -d pmread_prod -c \
  "SELECT id, github_repo, github_index_status FROM projects WHERE github_repo IS NOT NULL;"

# 3. Reset a stuck project so the user can re-link
sudo -u postgres psql -d pmread_prod -c \
  "UPDATE projects SET github_index_status = NULL WHERE id = 'YOUR-PROJECT-UUID';"
```

### Run the worker manually in foreground (most useful for debugging)

```bash
cd ~/pmread-prod/api
source venv/bin/activate
# Runs in terminal — all logs printed directly, Ctrl+C to stop
celery -A app.worker worker --loglevel=debug --concurrency=1
```

---

## 14. Debugging PM2 / Frontend service failures

### Check PM2 process status

```bash
pm2 status                                        # overview of all processes
pm2 show pmread-prod-frontend                     # cwd, script, port, env, restart count
pm2 logs pmread-prod-frontend --lines 100         # last 100 lines (stdout + stderr)
pm2 logs pmread-prod-frontend --err --lines 50    # stderr only
```

### EADDRINUSE — port already in use

Happens when the old process didn't release the port before the new one tried to bind.

```bash
# Find which process holds the port
sudo lsof -i :3006          # prod frontend
sudo lsof -i :8006          # prod API
sudo lsof -i :3005          # stage frontend
sudo lsof -i :8005          # stage API

# Kill it by PID (replace 12345 with actual PID from lsof output)
sudo kill -9 12345

# Or kill by port directly
sudo fuser -k 3006/tcp
sudo fuser -k 8006/tcp

# Then restart cleanly
pm2 restart pmread-prod-frontend --update-env
sudo systemctl restart pmread-prod-api
```

**Permanent fix:** delete and recreate the pm2 process with the correct PORT env var:

```bash
pm2 delete pmread-prod-frontend
PORT=3006 HOSTNAME=127.0.0.1 pm2 start ~/pmread-prod/app/.next/standalone/server.js \
  --name pmread-prod-frontend
pm2 save
```

### Frontend errored — diagnose fast

```bash
# 1. What's the exit code and last error?
pm2 show pmread-prod-frontend | grep -E "status|restarts|exit"

# 2. Full error log
pm2 logs pmread-prod-frontend --err --lines 100

# 3. Run standalone server manually to see raw error
PORT=3006 HOSTNAME=127.0.0.1 node ~/pmread-prod/app/.next/standalone/server.js
```

### API service failed (systemd)

```bash
# Full status with error
sudo systemctl status pmread-prod-api -l

# Last 100 log lines with timestamps
sudo journalctl -u pmread-prod-api -n 100 --no-pager

# Follow live (watch it start/fail in real time)
sudo journalctl -u pmread-prod-api -f

# Run API manually to see raw error
cd ~/pmread-prod/api && source venv/bin/activate
uvicorn app.main:app --host 127.0.0.1 --port 8006
```

### Port reference (prod)

| Service | Port | Managed by |
|---|---|---|
| API (FastAPI/uvicorn) | 8006 | systemd `pmread-prod-api` |
| Frontend (Next.js) | 3006 | pm2 `pmread-prod-frontend` |
| Celery worker | — | systemd `pmread-prod-worker` |
| Redis | 6379 db0 | system redis-server |
| Postgres | 5432 | system postgresql |

### Port reference (stage)

| Service | Port | Managed by |
|---|---|---|
| API (FastAPI/uvicorn) | 8005 | systemd `pmread-stage-api` |
| Frontend (Next.js) | 3005 | pm2 `pmread-stage-frontend` |
| Celery worker | — | systemd `pmread-stage-worker` |
| Redis | 6379 db1 | system redis-server |
| Postgres | 5432 | system postgresql |
