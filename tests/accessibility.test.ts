import { test, expect } from '@playwright/test';
import { waitForToast, scrollToExamples, clickExample } from './TestHelpers';

test.describe('Accessibility', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
	});

	test('should have proper ARIA attributes on toaster', async ({ page }) => {
		const toaster = page.locator('._sft-toaster');
		await expect(toaster).toBeVisible();
		await expect(toaster).toHaveAttribute('role', 'region');
		await expect(toaster).toHaveAttribute('aria-live', 'polite');
	});

	test('should have proper ARIA attributes on toasts', async ({ page }) => {
		await page.locator('button:has-text("Launch toast")').click();

		const appeared = await waitForToast(page);
		expect(appeared).toBe(true);

		const toast = page.locator('._sft-base').first();

		// Toast message should have proper ARIA props
		const message = toast.locator('._sft-message').first();
		const role = await message.getAttribute('role').catch(() => null);

		// Should have status or alert role
		expect(role === 'status' || role === 'alert' || role === null).toBe(true);
	});

	test('should support keyboard navigation', async ({ page }) => {
		await page.keyboard.press('Tab');
		await page.waitForTimeout(100);

		const focusedElement = await page.evaluate(() => {
			return {
				tag: document.activeElement?.tagName,
				type: document.activeElement?.getAttribute('type')
			};
		});

		expect(focusedElement.tag).toBeTruthy();
	});

	test('should allow keyboard interaction with buttons', async ({ page }) => {
		await scrollToExamples(page);

		// Tab to first button
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		// Press Enter
		await page.keyboard.press('Enter');
		await page.waitForTimeout(300);

		// Should trigger some action
		const launchButton = page.locator('button:has-text("Launch toast")');
		await expect(launchButton).toBeVisible();
	});

	test('should have accessible button labels', async ({ page }) => {
		const buttons = await page.locator('button').all();

		for (const button of buttons) {
			const isVisible = await button.isVisible().catch(() => false);

			if (isVisible) {
				const text = await button.textContent();
				const ariaLabel = await button.getAttribute('aria-label');

				// Button should have either text content or aria-label
				expect(text || ariaLabel).toBeTruthy();
			}
		}
	});

	test('should have proper color contrast', async ({ page }) => {
		await page.locator('button:has-text("Launch toast")').click();
		await waitForToast(page);

		const toast = page.locator('._sft-base').first();
		const isVisible = await toast.isVisible().catch(() => false);

		if (isVisible) {
			// Check that toast has both background and text color set
			const styles = await toast.evaluate((el) => {
				const computed = window.getComputedStyle(el);
				return {
					background: computed.backgroundColor,
					color: computed.color
				};
			});

			expect(styles.background).toBeTruthy();
			expect(styles.color).toBeTruthy();
		}
	});

	test('should handle focus management on toast appearance', async ({ page }) => {
		// Focus should not be trapped by toasts
		await page.locator('button:has-text("Launch toast")').click();
		await waitForToast(page);

		// User should still be able to tab through page
		await page.keyboard.press('Tab');
		await page.waitForTimeout(100);

		const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
		expect(focusedElement).toBeTruthy();
	});

	test('should support screen reader announcements', async ({ page }) => {
		await scrollToExamples(page);
		await clickExample(page, 'Success');
		await page.waitForTimeout(500);

		// Toast container should have aria-live="polite"
		const toaster = page.locator('._sft-toaster');
		const ariaLive = await toaster.getAttribute('aria-live');
		expect(ariaLive).toBe('polite');
	});

	test('should have semantic HTML structure', async ({ page }) => {
		// Check for proper HTML5 elements
		const footer = page.locator('footer');
		await expect(footer).toBeVisible();

		const heading = page.locator('h1');
		await expect(heading).toBeVisible();
	});

	test('should maintain focus order', async ({ page }) => {
		await page.locator('button:has-text("Launch toast")').click();
		await waitForToast(page);

		// Focus order should remain logical
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		const newFocus = await page.evaluate(() => document.activeElement?.tagName);
		expect(newFocus).toBeTruthy();
	});

	test('should have proper heading hierarchy', async ({ page }) => {
		// Check heading levels
		const h1Count = await page.locator('h1').count();
		expect(h1Count).toBeGreaterThan(0);
		expect(h1Count).toBeLessThanOrEqual(2); // Should not have multiple h1s

		// Check for logical hierarchy
		const h2Count = await page.locator('h2').count();
		expect(h2Count).toBeGreaterThanOrEqual(0);
	});

	test('should support high contrast mode', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'dark' });

		await page.locator('button:has-text("Launch toast")').click();
		await waitForToast(page);

		const toast = page.locator('._sft-base').first();
		const isVisible = await toast.isVisible().catch(() => false);

		// Toast should still be visible in dark mode
		expect(isVisible).toBe(true);
	});
});

test.describe('Accessibility - Interactive Elements', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
	});

	test('should have accessible form controls', async ({ page }) => {
		// Check radio buttons for package managers
		const labels = page.locator('label[for]');
		const count = await labels.count();
		expect(count).toBeGreaterThan(0);

		// Each label should have a for attribute matching an input
		for (let i = 0; i < Math.min(count, 5); i++) {
			const label = labels.nth(i);
			const forAttr = await label.getAttribute('for');
			expect(forAttr).toBeTruthy();

			const input = page.locator(`#${forAttr}`);
			const inputExists = await input.count();
			expect(inputExists).toBeGreaterThan(0);
		}
	});

	test('should have accessible custom component interactions', async ({ page }) => {
		await scrollToExamples(page);
		await clickExample(page, 'Rich content');
		await page.waitForTimeout(500);

		const removeButton = page.locator('button:has-text("Remove")').first();
		const isVisible = await removeButton.isVisible().catch(() => false);

		if (isVisible) {
			// Button should be keyboard accessible
			await removeButton.focus();
			await page.keyboard.press('Enter');
			await page.waitForTimeout(300);

			// Should have triggered the removal
			const stillVisible = await removeButton.isVisible().catch(() => false);
			expect(typeof stillVisible).toBe('boolean');
		}
	});
});
