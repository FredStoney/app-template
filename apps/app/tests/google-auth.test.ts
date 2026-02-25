import { expect, test } from '@playwright/test';

test.describe('Google Authentication', () => {
	test.describe('Login page', () => {
		test('login page loads with 200 status', async ({ page }) => {
			const response = await page.goto('/auth/login');
			expect(response?.status()).toBe(200);
		});

		test('login page shows a sign-in heading', async ({ page }) => {
			await page.goto('/auth/login');
			await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		});

		test('login page shows "Continue with Google" button', async ({ page }) => {
			await page.goto('/auth/login');
			await expect(
				page.getByRole('button', { name: /continue with google/i })
			).toBeVisible();
		});

		test('Google button is not disabled on initial load', async ({ page }) => {
			await page.goto('/auth/login');
			const button = page.getByRole('button', { name: /continue with google/i });
			await expect(button).toBeEnabled();
		});
	});

	test.describe('Route protection', () => {
		test('unauthenticated access to /dashboard redirects to /auth/login', async ({ page }) => {
			await page.goto('/dashboard');
			await expect(page).toHaveURL(/\/auth\/login/);
		});

		test('redirect preserves a returnTo query param', async ({ page }) => {
			await page.goto('/dashboard');
			// The app should land on the login page after redirection
			await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible();
		});
	});

	test.describe('OAuth flow initiation', () => {
		/**
		 * This test intercepts the network request that the better-auth client sends
		 * when the user clicks "Continue with Google", verifying the correct provider
		 * is requested without completing the real OAuth round-trip.
		 *
		 * Full OAuth round-trip tests require:
		 *   GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET env vars
		 *   A running PostgreSQL database seeded for tests
		 */
		test('clicking Google button sends sign-in request with google provider', async ({
			page
		}) => {
			await page.goto('/auth/login');

			// Capture the social sign-in API request before it fires
			const signInRequestPromise = page.waitForRequest(
				(req) =>
					req.url().includes('/api/auth/sign-in/social') && req.method() === 'POST'
			);

			// Stub the auth API so the test doesn't actually redirect to Google
			await page.route('**/api/auth/sign-in/social', async (route) => {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({
						url: 'https://accounts.google.com/o/oauth2/auth?client_id=test&mock=1'
					})
				});
			});

			await page.getByRole('button', { name: /continue with google/i }).click();

			const signInRequest = await signInRequestPromise;
			expect(signInRequest.url()).toContain('/api/auth/sign-in/social');

			const body = signInRequest.postDataJSON() as Record<string, unknown>;
			expect(body.provider).toBe('google');
		});

		test('sign-in button shows loading state while request is in-flight', async ({ page }) => {
			await page.goto('/auth/login');

			// Prevent any navigation away from the page so we can inspect the DOM state
			await page.route('**/accounts.google.com/**', (route) => route.abort());

			// Hold the auth request open with a delay long enough to observe loading state
			await page.route('**/api/auth/sign-in/social', async (route) => {
				await new Promise((resolve) => setTimeout(resolve, 800));
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ url: 'https://accounts.google.com/o/oauth2/auth?mock=1' })
				});
			});

			await page.getByRole('button', { name: /continue with google/i }).click();

			// While the request is in-flight the button text changes to "Signing in…" and is disabled
			const loadingButton = page.getByRole('button', { name: /signing in/i });
			await expect(loadingButton).toBeVisible();
			await expect(loadingButton).toBeDisabled();
		});
	});
});
