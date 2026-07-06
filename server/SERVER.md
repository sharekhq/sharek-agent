# Sharek CLI Auth Server

Device flow OAuth2 server that allows CLI users to authenticate without needing client credentials. The server holds the OAuth app secret and mediates the authorization flow.

## How it works

```
CLI                        Auth Server                    Sharek
 │                              │                           │
 ├─ POST /device/code ─────────►│                           │
 │◄── device_code + user_code ──│                           │
 │                              │                           │
 │  User opens browser ────────►│                           │
 │  Enters code                 │                           │
 │                              ├─ redirect to OAuth ──────►│
 │                              │◄── callback with code ────│
 │                              ├─ exchange for token ─────►│
 │                              │◄── access_token ──────────│
 │                              │  (stored in Postgres)     │
 │                              │                           │
 │  POST /device/token (poll) ─►│                           │
 │◄── access_token ─────────────│                           │
```

## Prerequisites

- Node.js >= 18
- PostgreSQL

## Environment Variables

| Variable | Required | Default                       | Description |
|----------|----------|-------------------------------|-------------|
| `DATABASE_URL` | Yes | -                             | Postgres connection string |
| `SHAREK_OAUTH_CLIENT_ID` | Yes | -                             | OAuth app client ID from Sharek |
| `SHAREK_OAUTH_CLIENT_SECRET` | Yes | -                             | OAuth app client secret from Sharek |
| `PORT` | No | `3111`                        | Server port |
| `SERVER_URL` | No | `http://localhost:{PORT}`     | Public URL of this server (used for generating links) |
| `SHAREK_FRONTEND_URL` | No | `https://dash.sharek.app` | Sharek frontend URL for OAuth redirects |
| `SHAREK_API_URL` | No | `https://dash.sharek.app/api`      | Sharek API URL for token exchange |

## Setup

### 1. Create an OAuth app in Sharek

Go to Sharek Settings → Developer → OAuth Apps and create a new app. Set the callback URL to:

```
https://your-server-domain.com/device/callback
```

### 2. Set up Postgres

Create a database. The server auto-creates the `device_requests` table on startup.

### 3. Configure environment

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/sharek_auth"
export SHAREK_OAUTH_CLIENT_ID="pca_xxx"
export SHAREK_OAUTH_CLIENT_SECRET="pcs_xxx"
export SERVER_URL="https://cli-auth.sharek.app"
```

### 4. Run

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Production (tsx runtime — `start:prod`'s CJS build can't load ESM-only node-fetch)
pnpm start
```

Or build the container image:

```bash
docker build -t sharek-cli-auth ./server
```

The `build-auth-server.yml` workflow builds and pushes `ghcr.io/sharekhq/sharek-cli-auth` on every push to `main` touching `server/`.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/device/code` | CLI calls this to start a new device flow. Returns `device_code`, `user_code`, and `verification_uri`. |
| `GET` | `/device/verify` | Browser page where the user enters their code. Accepts optional `?code=` query param to prefill. |
| `POST` | `/device/verify` | Validates the user code and redirects to Sharek OAuth. |
| `GET` | `/device/callback` | Sharek redirects here after authorization. Exchanges the auth code for a token and stores it. |
| `POST` | `/device/token` | CLI polls this with `{"device_code": "..."}`. Returns `authorization_pending` until the user completes auth, then returns the token. |
| `GET` | `/health` | Health check. Returns `{"status": "ok"}`. |

## Database

The server uses a single table that is auto-created on startup:

```sql
CREATE TABLE device_requests (
  device_code TEXT PRIMARY KEY,
  user_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending' or 'completed'
  access_token TEXT,
  api_url TEXT,
  organization_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Rows are deleted after the CLI retrieves the token, or on next access if expired (15 minutes).

## Deployment

Any platform that runs Node.js and can connect to Postgres works (Railway, Fly.io, Render, VPS, etc.).

The server is stateless beyond Postgres, so it scales horizontally — run multiple instances behind a load balancer if needed.
