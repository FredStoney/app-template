# New App Checklist

Everything you need to do when starting a real app from this template. Work through each section in order — later sections depend on values from earlier ones.

---

## 1. Rename the project

The template hard-codes two names that need changing: the npm workspace scope (`@boilerplate`) and the app identifier (`app-template`).

### 1a. Root `package.json`

Change `"name"` from `app-template` to your new project name:

```json
"name": "your-app-name"
```

### 1b. `sst.config.ts`

Update the `name` field and the AWS profile name:

```typescript
return {
  name: 'your-app-name',      // was: 'app-template'
  // ...
  providers: {
    aws: { profile: 'your-app-name' }  // was: 'app-template' — match your AWS profile
  }
};
```

### 1c. Workspace package names (`@boilerplate/*`)

Every `package.json` inside `apps/` and `packages/` has a `"name"` in the `@boilerplate` scope, and those names are imported in source files. Rename them consistently.

Files to update (names → new scope, e.g. `@your-app`):

| File | Current name |
|------|-------------|
| `packages/db/package.json` | `@boilerplate/db` |
| `packages/auth/package.json` | `@boilerplate/auth` |
| `apps/api/package.json` | `@boilerplate/api` |
| `apps/app/package.json` | `@boilerplate/app` |

Also update any `"dependencies"` or `"devDependencies"` that reference `@boilerplate/*` — for example `apps/api/package.json` depends on `@boilerplate/db` and `@boilerplate/auth`.

Source files that import `@boilerplate/*` and will need updating:

- `apps/api/src/app.ts`
- `apps/api/src/stripe/stripe.service.ts`
- `apps/api/src/stripe/stripe.routes.ts`
- `apps/app/src/hooks.server.ts`
- `apps/app/src/lib/subscription.ts`
- `apps/app/src/routes/api/auth/[...all]/+server.ts`
- `apps/app/src/routes/(protected)/dashboard/+page.server.ts`
- `packages/auth/index.ts`

After renaming, re-run `npm install` from the repo root to rebuild the workspace symlinks.

---

## 2. Google OAuth

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com) → create a new project (or reuse one)
- [ ] Navigate to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
- [ ] Select **Web application**
- [ ] Add **Authorized redirect URIs**:
  - `http://localhost:5173/api/auth/callback/google` (local dev)
  - `https://yourdomain.com/api/auth/callback/google` (production — add once you have a domain)
- [ ] Copy **Client ID** → `GOOGLE_CLIENT_ID` in `.env`
- [ ] Copy **Client Secret** → `GOOGLE_CLIENT_SECRET` in `.env`

---

## 3. Database

See [`database.md`](./database.md) for full detail. The short version:

### Local development (Supabase)

- [ ] Create a free project at [supabase.com](https://supabase.com)
- [ ] Go to **Settings → Database → Connection string → URI** and copy the direct connection string (port `5432`)
- [ ] Add to `.env`:
  ```
  DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
  ```
- [ ] Run migrations once:
  ```bash
  npm run db:generate
  npm run db:migrate
  ```

### Production (Neon)

- [ ] Create a free project at [neon.tech](https://neon.tech)
- [ ] Copy the connection string — you will use it as the `DatabaseUrl` SST secret in step 6

---

## 4. Stripe

See [`stripe.md`](./stripe.md) for full detail.

- [ ] Create or log in to your [Stripe account](https://dashboard.stripe.com) — use **test mode** during development
- [ ] **Create a product**: Stripe Dashboard → Product catalogue → Add product
- [ ] **Create a price** on that product (e.g. monthly recurring)
- [ ] Copy the **Price ID** (starts with `price_`) → `STRIPE_PRO_PRICE_ID` in `.env`
- [ ] Go to **Developers → API keys** and copy the **Secret key** → `STRIPE_SECRET_KEY` in `.env`
- [ ] Install the Stripe CLI (see [`stripe-cli.md`](./stripe-cli.md)):
  ```bash
  brew install stripe/stripe-cli/stripe
  stripe login
  ```
- [ ] Run the webhook forwarder (with the API already running):
  ```bash
  npm run stripe:listen
  ```
  Copy the printed `whsec_...` value → `STRIPE_WEBHOOK_SECRET` in `.env`

---

## 5. Environment variables

Copy `.env.example` to `.env` and fill in every value. Full list:

| Variable | Where to get it |
|----------|----------------|
| `DATABASE_URL` | Supabase dashboard → Settings → Database → URI (direct, port 5432) |
| `BETTER_AUTH_SECRET` | Generate: `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | `http://localhost:5173` for local dev; your production domain once deployed |
| `GOOGLE_CLIENT_ID` | Google Cloud Console → Credentials (step 2) |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console → Credentials (step 2) |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys → Secret key |
| `STRIPE_PRO_PRICE_ID` | Stripe Dashboard → Product catalogue → your product → Pricing → Price ID |
| `STRIPE_WEBHOOK_SECRET` | Printed by `npm run stripe:listen` (local); Dashboard signing secret (production) |

---

## 6. Local development smoke test

With `.env` fully populated:

```bash
# Terminal 1 — SvelteKit frontend (http://localhost:5173)
npm run app:dev

# Terminal 2 — Hono API (http://localhost:3001)
npm run api:dev

# Terminal 3 — Stripe webhook forwarder
npm run stripe:listen
```

Check the following before continuing to deployment:

- [ ] Google sign-in flow works (`/sign-in`)
- [ ] Pricing page shows your plan (`/pricing`)
- [ ] Stripe test checkout completes (card `4242 4242 4242 4242`)
- [ ] Dashboard shows **Active** badge after checkout (`/dashboard`)

---

## 7. SST / AWS deployment

See [`sst-deployment.md`](./sst-deployment.md) for full detail.

### 7a. AWS profile

- [ ] Create an IAM user in your AWS account with admin permissions
- [ ] Run `aws configure --profile your-app-name` and enter the credentials
- [ ] Make sure the profile name in `sst.config.ts` matches (updated in step 1b)

### 7b. Set SST secrets

Run each command once — these are stored in AWS SSM Parameter Store:

```bash
npx sst secret set DatabaseUrl "postgresql://..."          # Neon connection string (step 3)
npx sst secret set BetterAuthSecret "your-64-char-hex"    # openssl rand -hex 32
npx sst secret set BetterAuthUrl "https://yourdomain.com" # update after deploy if needed
npx sst secret set GoogleClientId "....apps.googleusercontent.com"
npx sst secret set GoogleClientSecret "GOCSPX-..."
npx sst secret set StripeSecretKey "sk_live_..."           # use live key for production
npx sst secret set StripeWebhookSecret "whsec_..."         # Dashboard signing secret (step 8)
```

### 7c. Push DB schema to Neon

```bash
npm run db:push
```

### 7d. Deploy

```bash
npx sst deploy --stage production
```

The command prints the live URLs for the API Lambda and the SvelteKit frontend (CloudFront). Note both — you will need them in subsequent steps.

---

## 8. Stripe webhook (production)

- [ ] Go to Stripe Dashboard → **Developers → Webhooks → Add endpoint**
- [ ] Endpoint URL: `<api-lambda-url>/webhooks/stripe` (from step 7d output)
- [ ] Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- [ ] Copy the **Signing secret** from the new endpoint
- [ ] Update the SST secret and redeploy:
  ```bash
  npx sst secret set StripeWebhookSecret "whsec_..."
  npx sst deploy --stage production
  ```

---

## 9. Custom domain & Cloudflare

See [`cloudflare.md`](./cloudflare.md) for full detail.

- [ ] Add your domain to Cloudflare and update nameservers at your registrar
- [ ] Create a CNAME record pointing your domain to the CloudFront URL (from step 7d), with the orange cloud **Proxied** enabled
- [ ] Enable **Bot Fight Mode** (Security → Bots)
- [ ] Update `BetterAuthUrl` to your final domain and update the Google OAuth redirect URI (step 2):
  ```bash
  npx sst secret set BetterAuthUrl "https://yourdomain.com"
  npx sst deploy --stage production
  ```
- [ ] (Optional) Set SSL/TLS mode to **Full (strict)**
- [ ] (Optional) Add a rate limiting rule for `/api/auth` and `/billing` POST requests

---

## Quick reference — all files touched

| What | Files |
|------|-------|
| Project rename | `package.json`, `sst.config.ts`, `apps/*/package.json`, `packages/*/package.json`, all `@boilerplate` source imports |
| Env vars | `.env`, `.env.example` |
| DB schema | `packages/db/schema.ts` (extend for your domain) |
| Auth config | `packages/auth/index.ts` |
| Stripe plans | Update `STRIPE_PRO_PRICE_ID` and any plan names in the UI (`apps/app/src/routes/pricing`) |
