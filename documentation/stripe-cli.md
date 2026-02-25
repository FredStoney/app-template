# Stripe CLI setup

The Stripe CLI is used to forward webhooks to your local server so you can test payment flows (e.g. `checkout.session.completed`) before deploying.

## 1. Install

**macOS (Homebrew):**

```bash
brew install stripe/stripe-cli/stripe
```

**Other platforms:** See [Stripe CLI install docs](https://docs.stripe.com/stripe-cli#install).

Verify:

```bash
stripe --version
```

## 2. Log in

Link the CLI to your Stripe account (opens browser):

```bash
stripe login
```

Use a **test** Stripe account or test mode keys while developing.

## 3. Forward webhooks to your local API

With your API running (e.g. `bun run api:dev`), in another terminal run:

```bash
stripe listen --forward-to localhost:3001/webhooks/stripe
```

Or use the project script from the repo root:

```bash
bun run stripe:listen
```

The CLI will:

- Print a **webhook signing secret** (e.g. `whsec_...`). Use this in local development only.
- Forward Stripe events to `http://localhost:3001/webhooks/stripe`.

## 4. Use the signing secret locally

Add the **listened** signing secret to your local env (e.g. `.env` or `.env.local`) so your webhook handler can verify events:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

**Important:** Use the secret from `stripe listen` for local development. In production, use the signing secret from the Stripe Dashboard (Webhooks → your endpoint → Signing secret).

## 5. Trigger test events (optional)

With `stripe listen` running, you can trigger test events without going through the UI:

```bash
stripe trigger checkout.session.completed
```

See [Stripe CLI trigger](https://docs.stripe.com/stripe-cli#trigger) for more events.

## Summary

| Step              | Command / action                                      |
|-------------------|--------------------------------------------------------|
| Install           | `brew install stripe/stripe-cli/stripe`                |
| Log in            | `stripe login`                                        |
| Start API         | `bun run api:dev`                                     |
| Forward webhooks  | `bun run stripe:listen` or `stripe listen --forward-to localhost:3001/webhooks/stripe` |
| Set local secret  | Add `STRIPE_WEBHOOK_SECRET=whsec_...` to `.env`       |
