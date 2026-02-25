import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		reuseExistingServer: !process.env.CI,
		env: {
			// Required by better-auth — use a dedicated test secret; never the production value
			BETTER_AUTH_SECRET:
				process.env.BETTER_AUTH_SECRET ?? 'playwright-test-secret-not-for-production',
			// Database URL — tests that only check UI/redirects work without a real DB
			// because hooks.server.ts handles DB errors gracefully.
			// Set DATABASE_URL to a real DB if you want full auth round-trip tests.
			DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://localhost/test_placeholder',
			// Google OAuth credentials — only needed for full OAuth round-trip tests
			GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? '',
			GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? ''
		}
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	use: {
		baseURL: 'http://localhost:4173'
	}
};

export default config;
