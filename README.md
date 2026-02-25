# app-template

A full-stack monorepo template based on [thomasmol/boilerplate](https://github.com/thomasmol/boilerplate), adapted for **npm** (no Bun required).

## Structure

| Path | What it is |
|------|------------|
| `apps/app` | SvelteKit frontend (TypeScript, Vite, Tailwind CSS) |
| `apps/api` | Hono API backend (TypeScript, runs on Node via tsx) |
| `packages/auth` | better-auth shared config |
| `packages/db` | Drizzle ORM — schema, migrations, DB connection |

## Quick start

```bash
# Install all workspace dependencies from the repo root
npm install

# Run the SvelteKit frontend
npm run app:dev

# Run the Hono API
npm run api:dev
```

## All scripts (run from repo root)

| Script | What it does |
|--------|-------------|
| `npm run app:dev` | Start SvelteKit dev server (`apps/app`) |
| `npm run api:dev` | Start Hono API with hot-reload via `tsx watch` (`apps/api`) |
| `npm run db:generate` | Generate Drizzle DB migrations |
| `npm run db:studio` | Open Drizzle Studio to inspect the database |

## Documentation

See [`documentation/`](./documentation/) for detailed guides:

- [`new-app-checklist.md`](./documentation/new-app-checklist.md) — **start here** when reusing this template for a new project
- [`setup.md`](./documentation/setup.md) — full setup notes and changes from the original boilerplate
- [`stripe-cli.md`](./documentation/stripe-cli.md) — Stripe CLI for local webhook testing
- [`gemeni-sveltekit.md`](./documentation/gemeni-sveltekit.md) — SvelteKit notes
