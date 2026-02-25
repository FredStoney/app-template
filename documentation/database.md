# Database setup

This project uses [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL. The database package lives in `packages/db`.

---

## Provider

[Supabase](https://supabase.com) is used as the hosted PostgreSQL provider. Create a free project and copy the **direct connection string** from:

> Settings → Database → Connection string → URI

The URL format is:

```
postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
```

**Important:** The `[password]` shown in Supabase is a placeholder — the brackets are **not** part of the actual password. If the password contains special characters (e.g. `/`), URL-encode them (e.g. `/` → `%2F`) before pasting into `.env`.

---

## Environment variables

Add the following to the root `.env` file:

```
DATABASE_URL=postgresql://postgres:[your-password]@db.[ref].supabase.co:5432/postgres
```

---

## npm scripts

These scripts are defined in the root `package.json` and delegate to the `@boilerplate/db` workspace:

| Script | Command | Purpose |
|--------|---------|---------|
| `npm run db:generate` | `drizzle-kit generate` | Generate SQL migration files from schema changes |
| `npm run db:migrate` | `drizzle-kit migrate` | Apply pending migrations to the database |
| `npm run db:push` | `drizzle-kit push --force` | Push schema directly (bypasses migration tracking) |
| `npm run db:studio` | `drizzle-kit studio` | Open Drizzle Studio visual DB browser |

---

## First-time setup

Run these two commands once after cloning and filling in `.env`:

```bash
npm run db:generate
npm run db:migrate
```

`db:generate` reads `packages/db/schema.ts` and produces SQL migration files under `packages/db/migrations/`. `db:migrate` applies those files to the database.

### Supabase note

`db:migrate` requires permission to create a `drizzle` tracking schema. If it fails with a schema permission error, ensure your Supabase project is using the **direct connection** (port `5432`), not the pooler (port `6543`). The direct connection has the necessary permissions.

---

## Schema

All table definitions live in `packages/db/schema.ts`. The following tables are created on first migration:

| Table | Purpose |
|-------|---------|
| `user` | Authenticated users |
| `session` | Active user sessions |
| `account` | Linked OAuth provider accounts |
| `verification` | Email/token verification records |
| `organization` | Organisations (Better Auth organization plugin) |
| `member` | Organisation membership |
| `invitation` | Organisation invitations |

---

## Adding schema changes

1. Edit `packages/db/schema.ts`
2. Run `npm run db:generate` — a new migration file is created in `packages/db/migrations/`
3. Run `npm run db:migrate` — the migration is applied to the database
4. Commit both the schema change and the generated migration file

---

## vite.config.ts note

By default Vite looks for `.env` files relative to the `apps/app/` directory, not the monorepo root. The `vite.config.ts` is configured to load env vars from the repo root and inject them into `process.env` so server-side packages (`packages/auth`, `packages/db`) can read them:

```typescript
const monorepoRoot = resolve(__dirname, '../../');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, monorepoRoot, '');
  Object.assign(process.env, env);
  return { plugins: [...], envDir: monorepoRoot };
});
```

Without this, `DATABASE_URL`, `GOOGLE_CLIENT_ID`, and `BETTER_AUTH_SECRET` would all be `undefined` at runtime.

---

## drizzle.config.ts note

The Drizzle config at `packages/db/drizzle.config.ts` loads the root `.env` explicitly using `dotenv`, since drizzle-kit runs from the `packages/db` directory and would not find the root env file otherwise:

```typescript
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '../../.env') });
```
