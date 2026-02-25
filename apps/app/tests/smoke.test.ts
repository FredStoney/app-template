import { expect, test } from '@playwright/test';

test.describe('Smoke tests', () => {
	test('home page loads and returns 200', async ({ page }) => {
		const response = await page.goto('/');
		expect(response?.status()).toBe(200);
	});

	test('home page has expected heading', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('page title is set', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/.+/);
	});

	test('page has no broken internal links', async ({ page }) => {
		await page.goto('/');
		const links = page.locator('a[href^="/"]');
		const count = await links.count();

		for (let i = 0; i < count; i++) {
			const href = await links.nth(i).getAttribute('href');
			if (!href) continue;
			const res = await page.request.get(href);
			expect(res.status(), `Link ${href} returned ${res.status()}`).toBeLessThan(400);
		}
	});
});
