# Nest + React + Next monorepo

Full-stack **pnpm workspace** template: a **NestJS** API, a **Next.js** public site, a **Vite + React** admin app, an **Expo** mobile app, and shared **TypeScript** libraries. Auth, CRUD, file storage, and seeding are wired around **@ackplus** libs with **TypeORM** and **PostgreSQL**.

## What you get

| Layer | App | Purpose |
|--------|-----|--------|
| API | `apps/api` | NestJS REST API, JWT auth, Swagger + Scalar docs, migrations & seeders |
| Web | `apps/web` | Next.js frontend (default port **3000**) |
| Admin | `apps/admin` | Vite + React admin UI with MUI & TanStack Query (default port **4200**) |
| Mobile | `apps/mobile` | Expo (React Native) app with shared auth/types/utils |
| Shared | `libs/*` | `@libs/types`, `@libs/utils`, `@libs/react-shared` |

## Production-ready features (included)

### Admin app (`apps/admin`)

- **Authentication**: login/register/forgot/reset password flows, OTP verification screens, MFA management UI, profile management
- **User management**: users list/create/edit, status controls, reset password, MFA actions
- **Roles & permissions**: roles CRUD, permission list + assignment UI, navigation protected by `PermissionsEnum` / roles
- **Content**:
  - **Pages**: pages list + add/edit dialog
  - **Templates**: templates list + edit screen, template layouts list + edit screen (template editor included)
  - **Email templates**: dedicated list + add/edit flows (backed by dynamic templates)
- **Settings**: general settings and **database seeders UI** (run one or run-all; optional truncate)

### API (`apps/api`)

- **Auth foundation**: `@ackplus/nest-auth` configured globally (JWT + guards/roles)
- **Core modules**: users, roles, permissions, pages, CMS, settings, templates, countries (see `apps/api/src/app/app.module.ts`)
- **Notifications + templates**:
  - Dynamic templates via `@ackplus/nest-dynamic-templates` (template + template-layout APIs)
  - Email notifications via Nest Mailer + template rendering (see `apps/api/src/app/libs/notification/*`)
  - Event-driven emails (e.g. welcome email on user registration listener)
- **Ops**: CORS for multi-app, throttling, migrations, seeders (including API endpoints to run seeders for super admin)

### Shared libs (`libs/*`)

- **`@libs/types`**: shared enums/types used by both API and Admin navigation/permissions
- **`@libs/react-shared`**: shared services/types used by apps (e.g. seeder service used by Admin settings)

## Repository layout

```
├── apps/
│   ├── api/           # NestJS backend (`/api` global prefix; default port 3333)
│   ├── web/           # Next.js app
│   ├── admin/         # Vite + React admin dashboard
│   └── mobile/        # Expo Router mobile app
├── libs/
│   ├── types/         # @libs/types — shared DTOs / types
│   ├── utils/         # @libs/utils — shared helpers
│   └── react-shared/  # @libs/react-shared — shared React hooks/components
├── tools/
│   └── generators/crud/   # Local CRUD generator (browser UI)
├── docs/
│   └── BULK_CRUD_GENERATION.md   # Notes on JSON-oriented bulk CRUD concepts
├── crud.config.example.json      # Example bulk-style config (reference)
└── pnpm-workspace.yaml             # Workspace + dependency catalog (pinned versions)
```

This repo uses **pnpm workspaces**, not Nx. Package versions for shared dependencies are centralized in `pnpm-workspace.yaml` under `catalog`.

## Prerequisites

- **Node.js** 18+
- **pnpm** 8+ (see `package.json` `packageManager` for the exact version)
- **PostgreSQL** for the API
- For **mobile**: Xcode / Android Studio as usual for Expo native builds

## Install

```bash
pnpm install
```

## Environment variables

Copy the example files and fill in secrets (database, JWT, mail, storage, etc.):

```bash
cp apps/api/.env-example apps/api/.env
cp apps/web/.env-example apps/web/.env.local
cp apps/admin/.env-example apps/admin/.env
cp apps/mobile/.env-example apps/mobile/.env
```

Align URLs across files: API defaults to `http://localhost:3333`, web to `http://localhost:3000`, admin to `http://localhost:4200` (see each `.env-example`). Adjust mobile `EXPO_PUBLIC_*` URLs to match how you reach the API (often `http://localhost:3333` or your machine’s LAN IP for device testing).

## Run in development

Typical order: start PostgreSQL, then the API, then the frontends.

| Command | Description |
|---------|-------------|
| `pnpm api dev` | NestJS API (watch mode; default **http://localhost:3333**) |
| `pnpm web dev` | Next.js dev server (**http://localhost:3000**) |
| `pnpm admin dev` | Vite admin (**http://localhost:4200**) |
| `pnpm mobile dev` | Expo dev server for the mobile app |

Equivalent per-app commands:

```bash
pnpm -C apps/api dev
pnpm -C apps/web dev
pnpm -C apps/admin dev
pnpm -C apps/mobile dev
```

**API docs:** Swagger UI is at `/api/swagger`, Scalar reference at `/api/docs` (see `apps/api/src/main.ts`).

## Docker

This repo includes Docker setup for **API + Web + Admin** (mobile is not containerized here). The dev compose runs all three apps with **hot reload** using bind-mounts.

### Docker (development)

- **Prereqs**: Docker Desktop (or equivalent)
- **Database**: `docker-compose.yml` does **not** include Postgres; point `apps/api/.env-docker` to your Postgres (host machine, managed DB, or add your own `db` service).

1) Ensure API env exists (required by compose):

```bash
cp apps/api/.env-example apps/api/.env-docker
```

2) Start services:

```bash
docker compose up --build
```

3) URLs:

- **API**: `http://localhost:3333/api`
- **Web**: `http://localhost:3000`
- **Admin**: `http://localhost:4200`

Notes:
- The API container also reads `apps/api/.env-local` if present (optional override for local dev).
- Web/admin containers set `*_API_URL` to `http://localhost:3333` for browser calls, and `SERVER_APP_API_URL=http://template-api:3333` for server-to-container calls.

Stop:

```bash
docker compose down
```

If you need a clean rebuild of dependencies/volumes:

```bash
docker compose down -v
docker compose up --build
```

### Docker (production)

`docker-compose.prod.yml` builds production images using:
- `apps/api/Dockerfile`
- `apps/web/Dockerfile`
- `apps/admin/Dockerfile`

1) Create production env for the API (compose expects `apps/api/.env-prod`):

```bash
cp apps/api/.env-example apps/api/.env-prod
```

2) Set these **prod** values appropriately:
- **API**: database credentials, JWT secrets, mail settings, storage settings, and URLs (`API_URL`, `FRONT_URL`, `ADMIN_URL`)
- **Web**: `NEXT_PUBLIC_APP_API_URL`, `NEXT_PUBLIC_APP_FRONT_URL`, `NEXT_PUBLIC_APP_ADMIN_URL`, and `SERVER_APP_API_URL`
- **Admin**: `VITE_API_URL`, `VITE_FRONT_URL`, `VITE_ADMIN_URL`

3) Build + run:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Ports (default from `docker-compose.prod.yml`):
- **API**: `http://localhost:3333`
- **Web**: `http://localhost:4042` (container runs on 3000)
- **Admin**: `http://localhost:4200` (container serves on 80)

#### MinIO (production) — create bucket + make it public (one time)

`docker-compose.prod.yml` includes a **MinIO** service (S3-compatible) on:
- S3 API: `http://localhost:9000`
- Console: `http://localhost:9001`

The API is configured with `AWS_S3_BUCKET=template` in `docker-compose.prod.yml`. You must **create this bucket once**, and if you want public file URLs you must also set the bucket policy to **public read**.

Option A — MinIO Console (UI):
- Open `http://localhost:9001`
- Sign in with the MinIO root credentials you configured in `docker-compose.prod.yml`
- Create bucket: **Buckets → Create Bucket →** name it `template`
- Make bucket public: **Buckets → template → Access Policy → Public**

Option B — MinIO Client (`mc`) CLI:

```bash
# 1) Install mc (Mac):
brew install minio/stable/mc

# 2) Add an alias to your MinIO
mc alias set template-minio http://localhost:9000 <MINIO_ROOT_USER> <MINIO_ROOT_PASSWORD>

# 3) Create bucket (idempotent)
mc mb -p template-minio/template || true

# 4) Make bucket public read (anonymous download)
mc anonymous set download template-minio/template
```

If you **do not** want a public bucket, skip the public policy step and serve files via **presigned URLs** instead.

Logs:

```bash
docker compose -f docker-compose.prod.yml logs -f
```

Stop:

```bash
docker compose -f docker-compose.prod.yml down
```

## Build

Root script builds **API, web, and admin** (not mobile):

```bash
pnpm build
```

Per app:

```bash
pnpm api build
pnpm web build
pnpm admin build
```

Use `pnpm -C apps/mobile` with the scripts in `apps/mobile/package.json` for production mobile builds when you need them.

## Database

- **Migrations** (from `apps/api`): `migration:create`, `migration:generate`, `migration:run`, `migration:rollback` — see `apps/api/package.json`.
- **Seed:**

```bash
pnpm api seed
pnpm api seed:refresh   # refresh seed data (see seeder CLI)
```

## Lint

```bash
pnpm lint
```

Runs each package’s `lint` script where defined (`apps/web`, `apps/admin`, `apps/mobile`, etc.).

## Tests

```bash
pnpm test
```

Runs `test` recursively; ensure each workspace package that should run tests has the right devDependencies (e.g. Jest) installed.

## Update @ackplus libs

```bash
pnpm update-ackplus
```

Bumps the listed `@ackplus/*` libs to latest across the workspace.

## CRUD code generation

This template includes a **local browser-based CRUD generator** (Fastify + UI). It scaffolds API and React surfaces from a form-driven config (entity, columns, targets for api/admin/web).

```bash
pnpm run g:crud
```

This installs generator deps if needed, starts the tool (default port starts at **4876** if free), and opens your browser. Use the UI to preview and generate files into the monorepo.

For **JSON-first / bulk** CRUD concepts and field examples, see [docs/BULK_CRUD_GENERATION.md](./docs/BULK_CRUD_GENERATION.md) and [crud.config.example.json](./crud.config.example.json). That document was written for an Nx-style CLI in some setups; this repo’s **supported path** for generation is the command above unless you add your own automation.

## Tech stack

### API (`apps/api`)

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/) + PostgreSQL
- [@ackplus](https://www.npmjs.com/search?q=%40ackplus) — auth, CRUD, file storage, seeder, dynamic templates, etc.
- [Swagger](https://swagger.io/) + [Scalar](https://scalar.com/) API reference

### Web (`apps/web`)

- [Next.js](https://nextjs.org/) 16
- [Tailwind CSS](https://tailwindcss.com/) 4
- [React](https://react.dev/) 19
- Shared: `@libs/types`, `@libs/utils`, `@libs/react-shared`

### Admin (`apps/admin`)

- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- [MUI](https://mui.com/) + Emotion
- [TanStack Query](https://tanstack.com/query)
- [@ackplus/react-tanstack-data-table](https://www.npmjs.com/package/@ackplus/react-tanstack-data-table)

### Mobile (`apps/mobile`)

- [Expo](https://expo.dev/) + [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- TanStack Query, shared libraries, `@ackplus` auth client

### Shared libs

- **@libs/types** — shared types/DTOs aligned with Nest + validation
- **@libs/utils** — cross-app utilities
- **@libs/react-shared** — shared React pieces (consumers supply React, Query, auth libs)
