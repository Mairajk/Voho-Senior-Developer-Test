# Voho Senior Developer Test

Monorepo with two folders: `backend/` (Express + Sequelize) and `frontend/` (Next.js).

Node version: use the current LTS 22.x series (e.g. Node 22). If using nvm:

```bash
nvm install 22
nvm use 22
```

Overview

- backend: JWT auth with access/refresh cookies, tenant-aware multi-tenant data, Ultravox API helper.
- frontend: Next.js app with SSR tenant resolution by subdomain, central `apiClient` with credentials enabled, and User/Tenant contexts.

Primary flows

- Tenant resolution by subdomain (SSR calls backend /api/tenant/:subdomain).
- Signup/login create and set `accessToken` and `refreshToken` cookies.
- Auth middleware verifies tokens and refreshes access tokens using refreshToken cookie.

Environment

- See `backend/.env.example` and `frontend/.env.example` for the required env vars (DB, JWT_SECRET, COOKIE_DOMAIN, ULTRAVOX_API_URL/KEY, BACKEND_URL, NEXT_PUBLIC_API_URL, etc.).

Run locally

- Backend: `cd backend && cp .env.example .env && npm install && npm run dev`
- Frontend: `cd frontend && cp .env.example .env.local && npm install && npm run dev`

For more detailed instructions, see the READMEs inside `backend/` and `frontend/`.
