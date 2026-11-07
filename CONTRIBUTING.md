# Contributing to Verve HRMS

## The one rule: stay in your folder

Each developer owns one app and works **only** inside that app's two folders:

```
web/src/apps/<your-app>/     ← screens, components, hooks
api/app/apps/<your-app>/     ← API routes, models, business logic, tests
```

Everything else (`web/src/core`, `web/src/shared`, `api/app/core`, `api/app/shared`, config files) belongs to the maintainer.
If you need something changed there, such as a new shared button or a new core API, open a separate small PR or ask the maintainer.

**Why:** six people work in one repo. If everyone stays in their own folder, merges almost never conflict.

### What you must not do

- Import code from another app's folder (`@/apps/pms/...` inside `exit/`). Ask for it to be moved into `shared/` instead.
- Read or write another app's database tables. Call that app's API instead.
- Commit `.env` files, passwords, API keys or real employee data.
- Check permissions only in the UI. Every API endpoint must check permissions on the backend.

## Branches

```
feature/<app>  ──PR──►  develop  ──(auto deploy)──►  STAGING   (managers test here)
                           │
                           └──release PR (maintainer only)──►  main  ──►  PRODUCTION
```

| Branch | Purpose | Who merges |
|---|---|---|
| `main` | Production. Always stable. | Maintainer only |
| `develop` | Integration. Deploys to staging. | Maintainer, after review |
| `feature/<app>` | Your app's ongoing work, e.g. `feature/pms` | You push here |
| `feature/portal-core` | Portal login, dashboard, launcher, roles | Maintainer |

### Daily workflow

```bash
git checkout feature/pms
git pull origin feature/pms
git merge origin/develop        # pick up everyone else's merged work (do this often)
# ...work, commit...
git push origin feature/pms
```

Open a pull request from `feature/<app>` into **`develop`** when a piece of work is ready to show.

**Merge small and often (at least weekly).** One giant merge at the end is where conflicts and broken builds come from.

## Pull requests

- Target branch: `develop` (never `main`).
- Fill in the PR template.
- CI must be green: lint, typecheck, tests and build.
- At least one approval from the maintainer (or the folder's code owner).
- Keep PRs focused, with one feature or fix each.

## Commit messages

Use a short, present-tense summary with the app as a prefix:

```
pms: add monthly self-assessment form
attendance: fix check-out time rounding
core: add role assignment page
```

## Adding your app's first screen and endpoint

Your app is already wired in: it has a launcher tile, sidebar entry, search results, quick actions and a page with tabs. Start here:

| What | File |
|---|---|
| App identity: name, tagline, icon, accent color, category | `web/src/apps/<app>/index.tsx` |
| Tabs in your app header (`nav`) | same file. Each tab's `path` must match a route |
| Home-screen shortcuts (`quickActions`) | same file |
| Pages (`routes`) | same file + `web/src/apps/<app>/pages/` |
| API endpoints (served at `/api/v1/<app>/...`) | `api/app/apps/<app>/router.py` |

Tips:

- A tab whose page doesn't exist yet automatically shows an "in development" card. Add the route when you build it.
- Inside your pages, `useCurrentApp()` gives you your app's manifest (name, accent, …).
- Reuse the shared building blocks in `web/src/shared/ui/` (`Card`, `Badge`, `Progress`, `AppIcon`, …) and the color tokens (`bg-surface`, `text-muted`, `border-border`, `text-primary`) so your app matches the portal in light and dark mode.
- The home dashboard currently uses `web/src/core/dashboard/sampleData.ts`. When your app has a real summary API, tell the maintainer so your widget can switch to it.

A full app starter template (database models, permissions and tests) arrives in **Phase 2**. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
