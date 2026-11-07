# Verve HRMS

One portal for all of Verve's internal applications: one login, one dashboard, one launcher.

| App | Folder (web) | Folder (api) |
|---|---|---|
| Verve Onboarding | `web/src/apps/onboarding` | `api/app/apps/onboarding` |
| Verve PMS | `web/src/apps/pms` | `api/app/apps/pms` |
| VerveFit | `web/src/apps/vervefit` | `api/app/apps/vervefit` |
| Verve Reimbursement | `web/src/apps/reimbursement` | `api/app/apps/reimbursement` |
| Verve Attendance | `web/src/apps/attendance` | `api/app/apps/attendance` |
| Verve Leave | `web/src/apps/leave` | not started |
| Verve Exit | `web/src/apps/exit` | `api/app/apps/exit` |

## Tech stack

- **web/**: React + TypeScript + Vite + Tailwind CSS
- **api/**: Python 3.12 + FastAPI, managed with [uv](https://docs.astral.sh/uv/)

## Getting started

Prerequisites: [Node.js 22+](https://nodejs.org), [uv](https://docs.astral.sh/uv/getting-started/installation/) and Git.

```bash
git clone https://github.com/adminsoftware-alt/verve-hrms.git
cd verve-hrms
```

**Terminal 1: API** (http://localhost:8000/api/docs)

```bash
cd api
cp .env.example .env
uv sync
uv run uvicorn app.main:app --reload
```

**Terminal 2: Web** (http://localhost:5173)

```bash
cd web
npm install
npm run dev
```

The web dev server forwards every `/api/...` request to the API, so both behave like one website.

> Port 8000 already in use? Start the API with `--port 8010` and the web with `API_URL=http://localhost:8010 npm run dev`.

## Checks (same as CI)

| | Web (`cd web`) | API (`cd api`) |
|---|---|---|
| Lint | `npm run lint` | `uv run ruff check .` |
| Format | — | `uv run ruff format .` |
| Types | `npm run typecheck` | — |
| Tests | `npm test` | `uv run pytest` |

## Preview site

The staging preview runs on Vercel with no backend: apps that would call an API use built-in sample data, and the top bar says "Preview · sample data". Nothing is saved; a reload resets it.

- Build it locally with `cd web && npm run build:preview && npx vite preview`.
- Vercel settings live in [web/vercel.json](web/vercel.json). In Vercel, set the project's **Root Directory** to `web`.

## Documentation

- [CONTRIBUTING.md](CONTRIBUTING.md): branches, pull requests and folder rules. **Read this first.**
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): how the portal and apps fit together.
- [docs/plan.md](docs/plan.md): original product vision and requirements.
