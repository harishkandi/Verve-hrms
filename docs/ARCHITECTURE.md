# Verve HRMS Architecture

## Summary

Verve HRMS is **one repository, one website, one API and one database**, split into **independent app folders**.

```
Browser ─► verve-hrms website (Vercel)
             │  /               → Dashboard + app launcher        (core)
             │  /onboarding     → Onboarding screens              (apps/onboarding)
             │  /pms … /exit    → each app's screens              (apps/<id>)
             │
             └─ /api/* ──► Verve HRMS API (Render)
                             │  /api/health, auth, users, roles   (core)
                             │  /api/v1/<id>/…                    (apps/<id>)
                             ▼
                          PostgreSQL — one schema per app
```

## Why this shape

| Decision | Reason |
|---|---|
| One website for all apps | Logging in once works automatically. No cross-site login is needed, and no custom domain is required. |
| Folder per app | Each developer works independently, with few merge conflicts. |
| One API, router per app | One deployment to manage. Each app's code is still isolated. |
| One database, schema per app | Each app owns its tables. Apps share data only through APIs. |
| Same stack everywhere | Anyone can review anyone's code, and there is one CI pipeline. |
| Clean boundaries | Any app can later move to its own repo and service without a rewrite. |

## Key concepts

### App manifest (web)

Each app exports a manifest from `web/src/apps/<id>/index.tsx`: id, name, tagline, icon, accent color, category, required permission, header tabs, quick actions and routes.
`web/src/core/apps/registry.ts` lists all manifests. Everything below is generated from that list, so adding an app never touches portal code:

| Portal feature | Built from |
|---|---|
| Home launcher tiles and the All apps directory | name, tagline, description, icon, accent, category |
| Sidebar (pinned + all apps) and the app switcher | name, icon, accent |
| Quick actions row on Home | `quickActions` |
| Global search (Ctrl/⌘ K) | apps + quick actions |
| App header with breadcrumb, tabs and pin button | `nav`, accent |
| Routes `/<id>/…` | `routes` |

### Portal experience (web)

- **Home**: greeting and status chips, quick actions, "jump back in" (recent apps), app tiles, and a "Today at Verve" widget per app. Widgets show **sample data** (`core/dashboard/sampleData.ts`) until each app ships a summary API.
- **Pinned and recent apps** are saved per browser (localStorage). They could move to the user profile later.
- **Theme**: light, dark or system, saved per browser and applied before first paint.
- **Notifications** menu: sample data until the notifications service (Phase 6).

### App router (api)

Each app exposes a FastAPI `router` from `api/app/apps/<id>/router.py`, mounted under `/api/v1`.
`api/app/apps/__init__.py` lists all routers.

### Login (Phase 1)

- Accounts are created by Admin/HR only. New users get a temporary password and must change it at first login.
- Passwords are stored hashed, never in plain text.
- After login the browser holds a secure session. Every app inside the portal uses the same session automatically.

### Roles and permissions (Phase 1)

- **Permission**: a small key such as `pms.open`, `pms.review.approve` or `reimbursement.finance.verify`.
- **Role**: a named bundle of permissions (Super Admin, HR Admin, Manager, Employee, Finance, …).
- The launcher shows only apps whose `<id>.open` permission the user has.
- **The API checks permissions on every request.** Hiding things in the UI is not security.
- Data rules (for example, a manager sees only their own team) use the employee's reporting manager.

### Employee identity (Phase 1)

The portal core owns the employee record and its permanent `employee_id`.
Apps store only `employee_id` and fetch names and details from the core API. They never keep their own copy of the employee list.

## Environments

| Environment | Deploys from | Data | URL |
|---|---|---|---|
| Local | your machine | local test data | `localhost:5173` |
| Staging | `develop` | fake/seed data only | free Vercel/Render URL (to be created in Phase 4) |
| Production | `main` | real data | free Vercel/Render URL (to be created in Phase 5) |

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| 0 | Repo skeleton, branches, CI, docs | **In progress** |
| 1 | Portal core: login, users, employees, roles/permissions, launcher, dashboard | Planned |
| 2 | App starter template (DB models, permissions, tests) | Planned |
| 3 | Apps built in parallel on `feature/<app>` branches | Planned |
| 4 | Staging deployment from `develop` | Planned |
| 5 | Production release from `main` | Planned |
| 6 | Notifications, dashboard widgets, audit screens, reports | Planned |
