# Testing

This project uses **Playwright** for end-to-end (e2e) smoke tests and **Vitest** for unit tests.

---

## Quick reference

| Script (from repo root) | What it does |
|-------------------------|-------------|
| `npm test` | Run all Playwright e2e smoke tests (headless) |
| `npm run test:ui` | Open Playwright's interactive UI to run/debug tests visually |
| `npm run test:unit` | Run Vitest unit tests once |
| `npm run test:unit:watch` | Run Vitest in watch mode |

All `npm test` / `npm run test:ui` commands delegate to `apps/app` via npm workspaces.

---

## E2e tests (Playwright)

### Location

```
apps/app/
├── playwright.config.ts     # Playwright configuration
└── tests/
    └── smoke.test.ts        # Smoke test suite
```

### How it works

Playwright builds the SvelteKit app and starts it on the preview server before running tests. This means tests always run against a **production build**, not the dev server, which is more representative of real behaviour.

```
npm test
  → vite build          (build the app)
  → vite preview        (serve on :4173)
  → playwright test     (run tests against :4173)
```

On a second run locally, if a server is already running on port 4173, Playwright will reuse it (`reuseExistingServer: true`) instead of rebuilding — saving time during development.

### Config (`apps/app/playwright.config.ts`)

```ts
webServer: {
  command: 'npm run build && npm run preview',
  port: 4173,
  reuseExistingServer: !process.env.CI   // always rebuild fresh in CI
},
testDir: 'tests',
testMatch: /(.+\.)?(test|spec)\.[jt]s/,
use: {
  baseURL: 'http://localhost:4173'
}
```

### Current smoke tests (`apps/app/tests/smoke.test.ts`)

| Test | What it asserts |
|------|----------------|
| Home page loads and returns 200 | HTTP status from `GET /` is 200 |
| Home page has expected heading | An `<h1>` element is visible on the page |
| Page title is set | The `<title>` tag contains text (not empty) |
| No broken internal links | All `href="/"` links on the home page return HTTP < 400 |

### Running in interactive UI mode

```bash
npm run test:ui
```

This opens the Playwright UI — useful for debugging failing tests, stepping through interactions, viewing screenshots and traces, and running individual tests.

### Viewing the last test report

```bash
npm run test:report   # from apps/app
```

Playwright generates an HTML report after each run at `apps/app/playwright-report/`.

---

## Unit tests (Vitest)

Vitest is installed at the root workspace level. It's available for testing pure TypeScript logic (utilities, services, DB helpers, etc.) without needing a browser or a running server.

### Running

```bash
# Run once
npm run test:unit

# Watch mode (re-runs on file changes)
npm run test:unit:watch
```

### Where to add unit tests

Place test files anywhere in the monorepo with a `.test.ts` or `.spec.ts` suffix. By convention:

```
packages/db/          → test DB helpers / schema logic
packages/auth/        → test auth utilities
apps/api/src/         → test service functions, schema validation
```

---

## How the AI agent verifies the app

Two approaches are used:

### 1. Live browser check (visual)
Start the dev server in the background, then navigate to `localhost:5173` (or whichever port Vite uses) using the built-in browser tool to take a screenshot and inspect the DOM snapshot. Best for quick visual confirmation.

```bash
npm run app:dev   # starts SvelteKit dev server
```

### 2. Automated test run (repeatable)
Run `npm test` — Playwright builds the app, starts the preview server, and runs all smoke tests headlessly. The pass/fail output is sufficient to confirm the app is healthy.

```bash
npm test
```

---

## Adding new tests

### New page / route

Add a test block in `apps/app/tests/smoke.test.ts` (or create a new file in `apps/app/tests/`):

```ts
test('about page loads', async ({ page }) => {
  const response = await page.goto('/about');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toBeVisible();
});
```

### New unit test

Create a `*.test.ts` file next to the code it tests:

```ts
import { describe, it, expect } from 'vitest';
import { myUtil } from './my-util';

describe('myUtil', () => {
  it('does the thing', () => {
    expect(myUtil('input')).toBe('expected');
  });
});
```

---

## CI considerations

- Set `CI=true` in your CI environment — this disables `reuseExistingServer` so Playwright always does a fresh build.
- Chromium is installed locally via `npx playwright install chromium`. In CI, run this step before the test step.
- The HTML report artifact (`apps/app/playwright-report/`) is worth uploading as a CI artifact for debugging failures.
