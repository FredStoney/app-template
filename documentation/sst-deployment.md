# SST v3 Deployment (AWS)

This project deploys to AWS using [SST v3](https://sst.dev). The SvelteKit frontend and Hono API each run as separate Lambda functions behind CloudFront.

## Architecture

| Component | AWS resource |
|-----------|-------------|
| SvelteKit (`apps/app`) | Lambda + CloudFront + S3 |
| Hono API (`apps/api`) | Lambda + Function URL |
| Secrets | AWS SSM Parameter Store (via SST) |
| Database | Neon (external serverless Postgres) |

---

## Prerequisites

- **AWS CLI** configured (`aws configure`) — use IAM user `fredstoney` or equivalent with admin permissions
- **Neon account** at [neon.tech](https://neon.tech) — free tier, create a project, copy the `DATABASE_URL`
- **Node.js 22+** and **npm 10+**

---

## One-time setup

### 1. Install SST platform (already done)

```bash
npx sst install
```

### 2. Set secrets

Run these once per stage (replace values with real credentials):

```bash
# Database (Neon connection string)
npx sst secret set DatabaseUrl "postgresql://user:pass@host.neon.tech/dbname?sslmode=require"

# better-auth — generate: openssl rand -hex 32
npx sst secret set BetterAuthSecret "your-64-char-hex-secret"

# Set this to your production domain once you have it, or the CloudFront URL first
npx sst secret set BetterAuthUrl "https://your-domain.com"

# Google OAuth — from Google Cloud Console → Credentials → OAuth 2.0 Client ID
npx sst secret set GoogleClientId "your-client-id.apps.googleusercontent.com"
npx sst secret set GoogleClientSecret "your-client-secret"

# Stripe — from Stripe dashboard → Developers → API keys
npx sst secret set StripeSecretKey "sk_live_..."
npx sst secret set StripeWebhookSecret "whsec_..."
```

### 3. Run DB migrations

After setting `DatabaseUrl`, push the Drizzle schema to Neon.

> **Important:** `npm run db:push` reads `DATABASE_URL` from your local `.env` file, **not** from the SST secret. Running it without the explicit URL will silently push to whatever database is in `.env` (which may be a local or different database), leaving the deployed Lambda's database empty.

Always push using the exact Neon URL:

```bash
DATABASE_URL="postgresql://..." npm run db:push
```

Or keep your local `.env` `DATABASE_URL` in sync with the deployed Neon URL so plain `npm run db:push` targets the right database.

**Do not use `npx sst shell -- npm run db:push`** — `sst shell` injects `DATABASE_URL` from your local `.env` file first, so it will also target the wrong database if `.env` is out of sync.

---

## Deploy

```bash
# Deploy to a personal dev stage (safe for testing)
npx sst deploy --stage dev

# Deploy to production
npx sst deploy --stage production
```

The deploy prints the live URLs for the API and web frontend.

---

## Local development

Nothing changes for local dev — the existing commands work as before:

```bash
npm run app:dev   # SvelteKit on http://localhost:5173
npm run api:dev   # Hono API on http://localhost:3001
```

---

## Stripe webhooks in production

After deploying, register the API Lambda URL as a Stripe webhook endpoint:

1. Go to Stripe dashboard → Developers → Webhooks → Add endpoint
2. Endpoint URL: `<api-lambda-url>/webhooks/stripe`
3. Select events: `customer.subscription.*`, `checkout.session.completed` (or whichever your app handles)
4. Copy the webhook signing secret and update the SST secret:
   ```bash
   npx sst secret set StripeWebhookSecret "whsec_..."
   npx sst deploy --stage production   # redeploy to pick up the new secret
   ```

---

## Cloudflare

Once deployed, point your Cloudflare DNS A/CNAME record at the CloudFront distribution URL (output as `web` from the deploy command). Enable the orange cloud (proxied) as described in [`cloudflare.md`](./cloudflare.md).

Also update `BetterAuthUrl` to your final domain:

```bash
npx sst secret set BetterAuthUrl "https://yourdomain.com"
npx sst deploy --stage production
```

---

## Troubleshooting

### Google sign-in returns 500 on the deployed app

**Symptom:** `POST /api/auth/sign-in/social` returns `500` with an empty body.

**Check CloudWatch logs:**

```bash
# Find the log group
aws logs describe-log-groups \
  --log-group-name-prefix "/aws/lambda/app-template" \
  --profile app-template \
  --query 'logGroups[*].logGroupName' \
  --output table

# Get the most recent log stream name
aws logs describe-log-streams \
  --log-group-name "<log-group-name>" \
  --order-by LastEventTime --descending \
  --profile app-template \
  --query 'logStreams[0].logStreamName' --output text

# Read the logs
aws logs get-log-events \
  --log-group-name "<log-group-name>" \
  --log-stream-name "<stream-name>" \
  --profile app-template \
  --query 'events[*].message' --output text
```

---

### `relation "verification" does not exist`

**Cause:** The database the Lambda connects to has never had the Drizzle schema pushed to it.

This happens because `db:push` reads `DATABASE_URL` from the local `.env` file, not from the SST `DatabaseUrl` secret. So pushing locally targets a different database than the one the Lambda uses.

**Diagnose — confirm which database the Lambda is actually using:**

```bash
aws lambda get-function-configuration \
  --function-name "<web-lambda-function-name>" \
  --profile app-template \
  --query 'Environment.Variables.DATABASE_URL' \
  --output text
```

**Fix — push the schema directly to the Lambda's database URL:**

```bash
DATABASE_URL="<url-from-above>" npm run db:push
```

No redeploy needed — the Lambda picks up the tables immediately.

---

### Lambda is connecting to the wrong database after changing `DatabaseUrl` secret

**Cause:** SST bakes `DATABASE_URL` into the Lambda at deploy time. Changing the SST secret does not update a running Lambda — you must redeploy.

```bash
npx sst secret set DatabaseUrl "your-new-url" --stage dev
npx sst deploy --stage dev
```

**How to verify the Lambda's current `DATABASE_URL`:**

```bash
aws lambda get-function-configuration \
  --function-name "<web-lambda-function-name>" \
  --profile app-template \
  --query 'Environment.Variables.DATABASE_URL' \
  --output text
```

**How to check what `sst shell` is actually using vs what the Lambda has:**

```bash
npx sst shell --stage dev -- node -e "
  console.log('sst shell DATABASE_URL:', process.env.DATABASE_URL);
  console.log('SST secret value:', process.env.SST_RESOURCE_DatabaseUrl);
"
```

If these differ, your local `.env` `DATABASE_URL` is overriding the SST secret inside `sst shell`. Update `.env` to match the Neon URL so all tools stay in sync.

---

### Google OAuth `redirect_uri_mismatch`

The Google Cloud Console OAuth 2.0 Client must have these entries:

- **Authorised JavaScript origins:** `https://your-deployed-url.com`
- **Authorised redirect URIs:** `https://your-deployed-url.com/api/auth/callback/google`

And the `BetterAuthUrl` SST secret must be set to the same origin (no trailing slash):

```bash
npx sst secret set BetterAuthUrl "https://your-deployed-url.com" --stage dev
npx sst deploy --stage dev
```
