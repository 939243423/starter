# Starter

[![Node](https://img.shields.io/badge/Node-%3E%3D18-339933?logo=node.js)](https://nodejs.org)
[![Vue](https://img.shields.io/badge/Vue-3.4-42b883?logo=vuedotjs)](https://vuejs.org)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express)](https://expressjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

A production-grade **full-stack starter template**: Vue 3 + Vite + Tailwind on the front, Express + SQLite + JWT on the back, wired together by zero-dependency Node scripts. Clone it, run two commands, and you have a working app with auth, database, i18n and a design system — ready for web apps or browser games.

[中文文档](./README.zh-CN.md) · [Contributing](./CONTRIBUTING.md)

---

## Why this template

| | |
| --- | --- |
| **Batteries included, no bloat** | Routing, auth, DB layer, i18n, theming, toasts/dialogs, upload, Docker — without UI-framework lock-in or 300 MB of dependencies |
| **One command to rule them all** | `npm run setup` installs everything, `npm run dev` starts both servers with prefixed logs, `npm run build` builds |
| **Template generator built in** | `npm run create -- my-game` stamps out a new project (renames packages, randomizes secrets, drops node_modules) |
| **Game-ready** | `useGameLoop()` gives you a rAF main loop with delta time, FPS and automatic teardown |
| **Design system, not a theme** | Tokens live in CSS variables, so light mode or a rebrand touches one file |

## Features

- **Frontend** — Vue 3 (`<script setup>`), Vue Router 4 with auth guards, Tailwind CSS 3, vue-i18n (zh-CN / en-US), lucide icons, axios wrapper that auto-unwraps the API envelope and handles 401
- **Backend** — Express 4, SQLite with Promise helpers, JWT auth (`verifyToken` / `flexibleToken` / `isAdmin`), bcrypt hashing, multer uploads, unified response + error handling, schema auto-patching
- **DX** — Vite dev proxy, `nodemon` reload, `@` path alias, dependency-free scripts, Docker + Nginx configs, GitHub Actions CI
- **Pages included** — Home (design system showcase), Playground (API + auth + game-loop demo), Login, a protected route, 404

## Quick start

```bash
git clone https://github.com/939243423/starter.git my-app
cd my-app
npm run setup     # install frontend + backend dependencies
npm run dev       # web → http://localhost:5173   api → http://localhost:3000
```

Open <http://localhost:5173>, then visit **Playground** to see health check, register/login and CRUD working end to end.

### Three ways to use it

1. **GitHub template** — click **Use this template** on the repo page.
2. **degit** — `npx degit 939243423/starter my-app && cd my-app && npm run setup`
3. **Generator script** — keep this repo as a mold:
   ```bash
   npm run create -- my-game                                  # creates ./my-game
   npm run create -- my-game --target ../apps/my-game --title "My Game"
   ```

## Project structure

```
.
├── scripts/                 # zero-dependency Node tooling
│   ├── setup.mjs            # install deps for both sides
│   ├── dev.mjs              # run web + api in parallel
│   ├── build.mjs            # production build
│   ├── create-app.mjs       # generate a new project from this skeleton
│   └── clean.mjs            # remove dist / node_modules
├── frontend/
│   └── src/
│       ├── api/             # axios instance + API surface
│       ├── assets/main.css  # design tokens + component classes
│       ├── components/      # AppShell, GlobalDialog, ToastList
│       ├── composables/     # useGameLoop, useRequest
│       ├── i18n/            # locales
│       ├── router/          # routes + auth guards
│       ├── stores/          # lightweight reactive global state
│       ├── utils/           # storage, dialog/toast
│       └── views/           # one folder per page, index.vue inside
└── backend/
    └── src/
        ├── config/          # env.js, db.js (SQLite + schema patching)
        ├── controllers/     # request handling
        ├── middlewares/     # auth, upload, security headers, errors
        ├── routes/          # mounted under /api
        └── utils/           # response helpers, asyncHandler
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run setup` | Install dependencies for frontend and backend (pass `-- --fresh` to reinstall) |
| `npm run dev` | Start web (5173) and api (3000) together |
| `npm run dev:web` / `npm run dev:api` | Start only one side |
| `npm run build` | Build frontend to `frontend/dist` |
| `npm run create -- <name>` | Generate a new project from this skeleton |
| `npm run clean [-- all]` | Remove `dist` (add `all` to also drop `node_modules`) |

## Conventions

**API envelope** — every response is `{ code: 0, message, data }`. The axios interceptor unwraps it, so callers get `data` directly; `code !== 0` or HTTP errors surface as a toast, and `401` clears the session and redirects to login.

**Auth** — `verifyToken` (login required), `flexibleToken` (guest allowed, check `req.isGuest`), `isAdmin` (admin only).

**Adding a page** — create `frontend/src/views/<Name>/index.vue`, register it in `router/index.js`, add `meta: { requiresAuth: true }` if it needs a session.

**Adding an endpoint** — logic in `controllers/`, mount in `routes/`, register in `routes/index.js`, expose it in `frontend/src/api/request.js`. Always bind SQL parameters: `db.run(sql, [params])`.

**Theming** — tokens are CSS variables in `frontend/src/assets/main.css`. Add `.theme-light` to `<html>` (or call `applyTheme('light')` from `stores/app.js`).

**Game loop** — use `composables/useGameLoop.js`; never hand-roll `requestAnimationFrame` in a component, and move by `dt` so speed is frame-rate independent.

## Environment variables

Copy `.env.example` to `.env` (the generator does it for you):

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | API port |
| `NODE_ENV` | `development` | `production` hides error stacks |
| `JWT_SECRET` | dev fallback | **Must be set in production**, otherwise the server refuses to start |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `CORS_ORIGIN` | `*` | CORS allowed origin |
| `DB_FILE` | `backend/data/app.db` | SQLite file path |
| `VITE_API_BASE` | `/api` | Frontend API base (proxied by Vite in dev) |

## Deploy the frontend to Vercel

Vercel builds the **frontend only**. The API needs a host with a writable disk, because SQLite is a native module backed by a file.

- **Root Directory**: `frontend` (recommended). If you deploy from the repo root, the included `vercel.json` already pins install → build → output to `frontend`, and `.vercelignore` excludes `backend`
- **Build settings**: auto-detected as Vite (`npm install` · `npm run build` · output `dist`)
- **Environment variable**: set `VITE_API_BASE` to your API origin, e.g. `https://api.example.com`

> Without those files, Vercel installs the backend as well and `sqlite3` fails to compile (no `distutils`, no toolchain) — that is exactly what the root `vercel.json` prevents.

### Where to run the API

| Option | Fit |
| --- | --- |
| VPS / Docker host | Best — see the compose file below |
| Render · Railway · Fly.io with a volume | Good — `backend/Dockerfile` is ready |
| Vercel Functions · Lambda | Not with SQLite: no persistent disk and no native builds. Swap `backend/src/config/db.js` for a hosted database (Postgres / Turso / Neon); controllers stay unchanged |

## Deploy with Docker (full stack)

```bash
docker compose up -d --build    # web → :8080, api → :3000
```

The frontend image builds with Vite and serves static files through Nginx (SPA fallback + `/api` proxy). Data lives in `./backend/data`, uploads in `./backend/uploads`.

## FAQ

**`npm install` hangs on sqlite3** — its prebuilt binary comes from GitHub, which can be slow or blocked. Set a mirror before installing:
```bash
npm config set sqlite3_binary_host_mirror https://npmmirror.com/mirrors/sqlite3
```
or build from source (`npm rebuild sqlite3 --build-from-source`, needs a C++ toolchain). If another project on this machine already has `sqlite3@5.x` installed, copying its `node_modules/sqlite3` over and running `npm install --ignore-scripts` also works.

**Vercel build fails with `gyp ERR!` or `No module named 'distutils'`** — the backend is being installed on a platform that cannot compile `sqlite3`. Deploy with Root Directory set to `frontend`, or keep the repo root and rely on the bundled `vercel.json` + `.vercelignore`. See [Deploy the frontend to Vercel](#deploy-the-frontend-to-vercel).

**Port already in use** — `npm run dev` checks 3000/5173 up front and tells you what to do. Change `PORT` in `.env` for the API, or `server.port` in `frontend/vite.config.js` for the web (keep the proxy target in sync).

**I only need a frontend** — delete `backend/` and drop the proxy block from `vite.config.js`; `npm run dev:web` already runs the frontend alone.

## Contributing

Issues and pull requests are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE) — do whatever you want, no attribution required.
