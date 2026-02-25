# Documentation

This folder holds all project documentation and Cursor context.

## Structure

| Path | Purpose |
|------|---------|
| [new-app-checklist.md](./new-app-checklist.md) | **Start here** — step-by-step checklist for reusing this template in a new project |
| [cursor-context/](./cursor-context/) | Cursor rules, commands, and how they are used |
| [setup.md](./setup.md) | Full setup notes and all changes from the original boilerplate |
| [database.md](./database.md) | Database provider, schema, migration commands, and first-time setup |
| [testing.md](./testing.md) | Playwright e2e and Vitest unit test setup, scripts, and how to add tests |
| [stripe-cli.md](./stripe-cli.md) | Stripe CLI install, login, and webhook forwarding for local dev |
| [stripe.md](./stripe.md) | Stripe subscription integration: architecture, env vars, dev flow, gotchas |
| [cloudflare.md](./cloudflare.md) | Cloudflare setup: bot protection, DNS proxying, rate limiting rules |
| (here) | General project docs; add architecture, contributing, API, etc. as needed |

## Adding docs

- **Project overview / architecture**: add `architecture.md`, `contributing.md`, etc. in this folder.
- **Cursor behavior**: see [cursor-context/](./cursor-context/) and edit files under `.cursor/rules/` and `.cursor/commands/`.
