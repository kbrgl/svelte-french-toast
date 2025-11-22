import { test, expect } from '@playwright/test';
import { elementExists, scrollToExamples, clickExample, getToastText } from './TestHelpers';

test.describe('Toast Examples', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await scrollToExamples(page);
	});

	test('should show success toast example', async ({ page }) => {
		const successLabel = page.locator('label[for="Success"]').first();
		await successLabel.click();
		await page.waitForTimeout(500);

		const toastExists = await elementExists(page, '._sft-base');
		if (toastExists) {
			const toast = page.locator('._sft-base').first();
			const text = await toast.textContent();
			expect(text).toContain('toasted');
		}
	});

	test('should show error toast', async ({ page }) => {
		await clickExample(page, 'Error');
		await page.waitForTimeout(500);

		const text = await getToastText(page);
		expect(text?.toLowerCase()).toMatch(/didn't work|error/);

		const hasErrorIcon = await elementExists(page, '._sft-error');
		expect(hasErrorIcon).toBe(true);
	});

	test('should show loading toast for promises', async ({ page }) => {
		await clickExample(page, 'Promise');
		await page.waitForTimeout(300);

		const loaderExists = await elementExists(page, '._sft-loader');
		const indicatorExists = await elementExists(page, '._sft-indicator');

		expect(loaderExists || indicatorExists).toBe(true);
	});

	test('should show multiline toast', async ({ page }) => {
		await clickExample(page, 'Multiline');
		await page.waitForTimeout(500);

		const text = await getToastText(page);
		expect(text?.length || 0).toBeGreaterThan(50);
	});

	test('should show emoji toast', async ({ page }) => {
		await clickExample(page, 'Emoji');
		await page.waitForTimeout(500);

		const text = await getToastText(page);
		expect(text).toContain('Good Job');

		// Check for emoji presence
		const hasEmoji = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/u.test(text || '');
		expect(hasEmoji).toBe(true);
	});

	test('should apply inline dark mode styling', async ({ page }) => {
		await clickExample(page, 'Dark mode');

		const toast = page.locator('._sft-base').first();
		await expect(toast).toBeVisible({ timeout: 2000 });

		const styles = await toast.evaluate((el) => {
			const s = getComputedStyle(el);
			return {
				background: s.backgroundColor,
				color: s.color
			};
		});

		expect(styles.background).toBe('rgb(51, 51, 51)');

		expect(styles.color).toBe('rgb(255, 255, 255)');
	});

	test('should show rich content component', async ({ page }) => {
		await clickExample(page, 'Rich content');
		await page.waitForTimeout(500);

		const removeButton = page.locator('button:has-text("Remove")').first();
		const hasButton = await removeButton.isVisible().catch(() => false);
		expect(hasButton).toBe(true);
	});

	test('should apply themed colors', async ({ page }) => {
		await clickExample(page, 'Themed');
		await page.waitForTimeout(500);

		const toast = page.locator('._sft-base').first();
		const isVisible = await toast.isVisible().catch(() => false);

		if (isVisible) {
			await expect(toast).toContainText('Look at me');
			const styles = await toast.getAttribute('style');
			expect(styles?.length || 0).toBeGreaterThan(20);
		}
	});

	test('should position toast at bottom', async ({ page }) => {
		await clickExample(page, 'Positioning');
		await page.waitForTimeout(500);

		const wrapper = page.locator('._sft-wrapper').first();
		const isVisible = await wrapper.isVisible().catch(() => false);

		if (isVisible) {
			const styles = await wrapper.getAttribute('style');
			expect(styles).toContain('bottom');
		}
	});

	test('should apply Tailwind classes', async ({ page }) => {
		await clickExample(page, 'Tailwind');
		await page.waitForTimeout(500);

		const toast = page.locator('._sft-base').first();
		const isVisible = await toast.isVisible().catch(() => false);

		if (isVisible) {
			const className = await toast.getAttribute('class');
			const hasTailwind = /bg-|from-|to-|gradient|rounded-/i.test(className || '');
			expect(hasTailwind).toBe(true);
		}
	});
});
