# Setup & Changes from Original Boilerplate

This project is based on [thomasmol/boilerplate](https://github.com/thomasmol/boilerplate), a full-stack monorepo template. The original repo was built for **Bun** as the runtime and package manager. The changes below adapt it to run with **Node.js + npm**.

---

## What the boilerplate provides

| Area | Tech |
|------|------|
| Frontend | SvelteKit 2, Svelte 5, Vite, Tailwind CSS 4, TypeScript |
| Backend | Hono (lightweight HTTP framework), TypeScript |
| Auth | better-auth |
| Database | Drizzle ORM (PostgreSQL) |
| Linting/Formatting | oxlint, oxfmt |

---

## Changes made

### 1. Package manager: Bun → npm

The original used Bun workspaces and Bun-specific CLI flags. All scripts have been updated to use npm.

**Root `package.json` scripts (before → after):**

```json
// Before (Bun)
"api:dev": "bun run --cwd apps/api dev",
"app:dev": "bun run --cwd apps/app dev",
"www:dev": "bun run --cwd apps/www dev"

// After (npm)
"api:dev": "npm run dev -w @boilerplate/api",
"app:dev": "npm run dev -w @boilerplate/app"
```

The `www:dev` script was removed (no `apps/www` in this template).

---

### 2. Workspace protocol: `workspace:*` → `*`

npm does not support the `workspace:*` protocol used by pnpm/Bun. Replaced with `*` in all affected `package.json` files so npm resolves them via its workspace symlink mechanism.

Files changed:
- `apps/api/package.json`
- `packages/auth/package.json`

---

### 3. Catalog protocol: `catalog:` → explicit versions

pnpm/Bun support a shared version catalog in the root `package.json`. npm does not. All `catalog:` references were replaced with explicit version strings matching the catalog defined in the root.

| Package | Version |
|---------|---------|
| `zod` | `^4.3.6` |
| `better-auth` | `^1.4.0` |
| `hono` | `^4.11.7` |
| `@hono/zod-openapi` | `^1.2.0` |
| `@scalar/hono-api-reference` | `^0.9.37` |

Files changed:
- `apps/app/package.json`
- `apps/api/package.json`
- `packages/auth/package.json`

---

### 4. API runtime: `bun run --hot` → `tsx watch` + `@hono/node-server`

The API dev script originally used `bun run --hot` (Bun's hot-reload). Replaced with `tsx watch`, which provides the same hot-reload experience on Node.js.

`tsx` was added as a `devDependency` in `apps/api/package.json`:

```json
"devDependencies": {
  "tsx": "^4.19.0"
}
```

**`apps/api/package.json` script (before → after):**

```json
// Before
"dev": "bun run --hot src/index.ts"

// After
"dev": "tsx watch src/index.ts"
```

**Additional fix — Hono Node.js server adapter:**

The original boilerplate started the HTTP server via Bun's native convention:

```typescript
// Bun-only — does nothing under Node.js
export default { port: 3001, fetch: app.fetch };
```

Under Node/tsx this exports a plain object and no server starts. Fixed by installing `@hono/node-server` and replacing the export with:

```typescript
import { serve } from '@hono/node-server';
serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`API running on http://localhost:${info.port}`);
});
```

**Env loading fix:**

`tsx` does not auto-load `.env`. Added `apps/api/src/env.ts` (imported first in `index.ts`) to call `dotenv.config()` with the monorepo root path. See [stripe.md](./stripe.md) for full details.

---

### 5. Project name

`"name"` in the root `package.json` was updated from `"boilerplate"` to `"app-template"`.

---

## Running the project

### Prerequisites

- **Node.js** 20+ and **npm** 10+
- A **PostgreSQL** database (for Drizzle ORM)

### Install

```bash
# From the repo root — installs all workspace packages
npm install
```

### Development

```bash
# Frontend (SvelteKit) — http://localhost:5173
npm run app:dev

# Backend (Hono API) — http://localhost:3000 (default)
npm run api:dev
```

Both can be run in parallel in separate terminal tabs.

### Database

Configure your database connection string in `packages/db` (typically via a `.env` file).

```bash
# Generate migration files from schema changes
npm run db:generate

# Open Drizzle Studio (visual DB browser)
npm run db:studio
```

---

## Notes

- **TypeScript** is fully configured throughout — all `packages/` and `apps/` have their own `tsconfig.json` extending from the root.
- **Tailwind CSS 4** is used in `apps/app` via the Vite plugin (`@tailwindcss/vite`).
- The original boilerplate also had a `@boilerplate/auth` workspace package wiring `better-auth` — this is preserved as-is.
- If you later switch to Bun, revert the script and `workspace:`/`catalog:` changes above.
