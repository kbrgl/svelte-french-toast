import { test, expect } from '@playwright/test';
import { waitForToast, getToastCount } from './TestHelpers';

test.describe('Core Functionality', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
	});

	test('should render homepage correctly', async ({ page }) => {
		await expect(page).toHaveTitle(/Svelte French Toast/);

		const heroHeading = page.locator('h1').first();
		await expect(heroHeading).toBeVisible();
		await expect(heroHeading).toContainText('Buttery smooth');

		const launchButton = page.locator('button:has-text("Launch toast")');
		await expect(launchButton).toBeVisible();
		await expect(launchButton).toBeEnabled();
	});

	test('should display toast when launch button is clicked', async ({ page }) => {
		await page.locator('button:has-text("Launch toast")').click();

		const appeared = await waitForToast(page);
		expect(appeared).toBe(true);

		const count = await getToastCount(page);
		expect(count).toBeGreaterThan(0);
	});

	test('should have accessible toaster container', async ({ page }) => {
		const toaster = page.locator('._sft-toaster');
		await expect(toaster).toBeVisible();
		await expect(toaster).toHaveAttribute('role', 'region');
		await expect(toaster).toHaveAttribute('aria-live', 'polite');
	});

	test('should handle multiple toasts', async ({ page }) => {
		const launchButton = page.locator('button:has-text("Launch toast")');

		// Launch 3 toasts
		for (let i = 0; i < 3; i++) {
			await launchButton.click();
			await page.waitForTimeout(200);
		}

		const count = await getToastCount(page);
		expect(count).toBeGreaterThanOrEqual(1);
		expect(count).toBeLessThanOrEqual(20);
	});

	test('should auto-dismiss toasts after duration', async ({ page }) => {
		await page.locator('button:has-text("Launch toast")').click();

		const appeared = await waitForToast(page);
		expect(appeared).toBe(true);

		await page.waitForTimeout(5000);

		const count = await getToastCount(page);
		expect(count).toBe(0);
	});
});
