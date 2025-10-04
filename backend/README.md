# Backend (Express + Sequelize)

This folder contains the Express API and Sequelize models/migrations used by the application.

Quick start (development)

1. Copy the example env and fill values:

```bash
cp .env.example .env
# edit .env and set DB credentials, JWT_SECRET, ULTRAVOX_API_KEY, etc.
```

2. Install dependencies and start the dev server (auto-restarts with node --watch):

```bash
npm install
npm run dev
```

Useful scripts

- `npm run dev` - start the server in development (uses `node --watch`)
- `npm run migrate` - run Sequelize migrations
- `npm run seed` - run seeders
- `npm run migrate:undo` - undo migrations
- `npm run seed:undo` - undo seeders

Environment variables

- See `.env.example` for required variables. Important ones:
  - `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST` - database connection
  - `NODE_ENV` - `development` or `production`
  - `PORT`, `HOST` - server bind
  - `JWT_SECRET` - JWT signing secret (required in production)
  - `FRONTEND_URL` / `FRONTEND_ORIGINS` - frontend origin(s) allowed by CORS
  - `COOKIE_DOMAIN` - optional cookie domain for cross-subdomain cookies
  - `ULTRAVOX_API_URL`, `ULTRAVOX_API_KEY` - external API configuration

Notes

- Don't commit real `.env` files to source control. Use the `.env.example` to document values.
