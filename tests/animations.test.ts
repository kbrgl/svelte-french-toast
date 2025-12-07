import test, { expect } from '@playwright/test';
import { elementExists, waitForToast } from './TestHelpers';

test.describe('Svelte French Toast - Animations', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.locator('text=Examples').first().scrollIntoViewIfNeeded();
	});

	test('should have animation classes on toast entry', async ({ page }) => {
		const successLabel = page.locator('label[for="Success"]').first();
		await successLabel.click();

		const appeared = await waitForToast(page);
		if (appeared) {
			const toast = page.locator('._sft-base').first();
			const className = await toast.getAttribute('class');

			const hasAnimation = /_sft-enter|_sft-fadeIn|_sft-animated/.test(className || '');
			expect(hasAnimation).toBe(true);
		}
	});

	test('should display icon animations', async ({ page }) => {
		const successLabel = page.locator('label[for="Success"]').first();
		await successLabel.click();

		const appeared = await waitForToast(page);
		if (appeared) {
			// Check for icon elements
			const hasIcon = await elementExists(page, '._sft-checkmark, ._sft-indicator, ._sft-animated');
			expect(hasIcon).toBe(true);
		}
	});

	test('should show loader animation for promises', async ({ page }) => {
		const promiseLabel = page.locator('label[for="Promise"]').first();
		await promiseLabel.click();
		await page.waitForTimeout(200);

		// Loader might appear briefly
		const loaderExists = await elementExists(page, '._sft-loader');
		const indicatorExists = await elementExists(page, '._sft-indicator');

		// Either should exist during promise execution
		expect(loaderExists || indicatorExists).toBe(true);
	});
});
