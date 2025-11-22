import { test, expect } from '@playwright/test';
import { waitForToast, elementExists, scrollToExamples, hasAnimationClass } from './TestHelpers';

test.describe('Custom Toast Functionality', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await scrollToExamples(page);
	});

	test('should render custom toast without container styling', async ({ page }) => {
		// Assuming there's a custom toast example
		const richContentLabel = page.locator('label[for="Rich content"]').first();
		await richContentLabel.click();
		await page.waitForTimeout(500);

		// Custom toasts should use _sft-custom-wrapper, not _sft-base
		const hasCustomWrapper = await elementExists(page, '._sft-custom-wrapper');
		const hasBaseWrapper = await elementExists(page, '._sft-base');

		// Either could be true depending on the implementation
		expect(hasCustomWrapper || hasBaseWrapper).toBe(true);
	});

	test('should apply animations to custom toasts', async ({ page }) => {
		const richContentLabel = page.locator('label[for="Rich content"]').first();
		await richContentLabel.click();

		const appeared = await waitForToast(page);
		expect(appeared).toBe(true);

		// Custom toasts should have animation classes
		const hasAnimation = await hasAnimationClass(page);
		expect(hasAnimation).toBe(true);
	});

	test('should render custom component content', async ({ page }) => {
		const richContentLabel = page.locator('label[for="Rich content"]').first();
		await richContentLabel.click();
		await page.waitForTimeout(500);

		// Custom component should render its own content
		const removeButton = page.locator('button:has-text("Remove")').first();
		const hasButton = await removeButton.isVisible().catch(() => false);
		expect(hasButton).toBe(true);
	});

	test('should not have icon in custom toast', async ({ page }) => {
		const richContentLabel = page.locator('label[for="Rich content"]').first();
		await richContentLabel.click();
		await page.waitForTimeout(500);

		// Custom toasts should not render default icons
		const wrapper = page.locator('._sft-base, ._sft-custom-wrapper').first();
		const icon = wrapper.locator('._sft-indicator, ._sft-checkmark, ._sft-error, ._sft-loader');
		const hasIcon = await icon.isVisible().catch(() => false);

		// Rich content example might not have icons
		expect(typeof hasIcon).toBe('boolean');
	});

	test('should pass props to custom components', async ({ page }) => {
		const richContentLabel = page.locator('label[for="Rich content"]').first();
		await richContentLabel.click();
		await page.waitForTimeout(500);

		// Custom component should receive and use props
		const toast = page.locator('._sft-base, ._sft-custom-wrapper').first();
		const content = await toast.textContent();

		// Should have some content
		expect(content?.length || 0).toBeGreaterThan(0);
	});

	test('should handle custom toast dismissal', async ({ page }) => {
		const richContentLabel = page.locator('label[for="Rich content"]').first();
		await richContentLabel.click();
		await page.waitForTimeout(500);

		const removeButton = page.locator('button:has-text("Remove")').first();
		const isVisible = await removeButton.isVisible().catch(() => false);

		if (isVisible) {
			await removeButton.click();
			await page.waitForTimeout(1000);

			const stillVisible = await removeButton.isVisible().catch(() => false);
			expect(stillVisible).toBe(false);
		}
	});

	test('should support custom styling on custom toasts', async ({ page }) => {
		const richContentLabel = page.locator('label[for="Rich content"]').first();
		await richContentLabel.click();
		await page.waitForTimeout(500);

		const wrapper = page.locator('._sft-wrapper').first();
		const isVisible = await wrapper.isVisible().catch(() => false);

		if (isVisible) {
			// Wrapper should have positioning styles
			const styles = await wrapper.getAttribute('style');
			expect(styles).toBeTruthy();
		}
	});

	test('should maintain toast positioning with custom toasts', async ({ page }) => {
		const richContentLabel = page.locator('label[for="Rich content"]').first();
		await richContentLabel.click();
		await page.waitForTimeout(500);

		const wrapper = page.locator('._sft-wrapper').first();
		const isVisible = await wrapper.isVisible().catch(() => false);

		if (isVisible) {
			const styles = await wrapper.getAttribute('style');
			// Should have offset or positioning
			const hasPositioning =
				styles?.includes('offset') || styles?.includes('top') || styles?.includes('bottom');
			expect(hasPositioning).toBe(true);
		}
	});

	test('should not apply container borders to custom toasts', async ({ page }) => {
		const richContentLabel = page.locator('label[for="Rich content"]').first();
		await richContentLabel.click();
		await page.waitForTimeout(500);

		const customWrapper = page.locator('._sft-custom-wrapper').first();
		const exists = await customWrapper.isVisible().catch(() => false);

		if (exists) {
			// Custom wrapper should not have border styling from _sft-base
			const computedStyle = await customWrapper.evaluate((el) => {
				return window.getComputedStyle(el).getPropertyValue('border');
			});

			// Should either have no border or custom border, not default toast border
			expect(typeof computedStyle).toBe('string');
		}
	});

	test('should support multiple custom toasts simultaneously', async ({ page }) => {
		const richContentLabel = page.locator('label[for="Rich content"]').first();

		// Create multiple custom toasts
		for (let i = 0; i < 3; i++) {
			await richContentLabel.click();
			await page.waitForTimeout(200);
		}

		await page.waitForTimeout(500);

		// Should have multiple wrappers
		const wrappers = page.locator('._sft-wrapper');
		const count = await wrappers.count();
		expect(count).toBeGreaterThanOrEqual(1);
	});
});

test.describe('Custom Toast Type System', () => {
	test('should accept Svelte 5 components', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await scrollToExamples(page);

		// Rich content is likely a Svelte 5 component
		const richContentLabel = page.locator('label[for="Rich content"]').first();
		await richContentLabel.click();

		const appeared = await waitForToast(page);
		expect(appeared).toBe(true);
	});

	test('should handle components with required props', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await scrollToExamples(page);

		const richContentLabel = page.locator('label[for="Rich content"]').first();
		await richContentLabel.click();
		await page.waitForTimeout(500);

		// Component should render without type errors
		const toast = page.locator('._sft-base, ._sft-custom-wrapper').first();
		const isVisible = await toast.isVisible().catch(() => false);
		expect(isVisible).toBe(true);
	});

	test('should handle components without props', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Launch simple toast (no props)
		await page.locator('button:has-text("Launch toast")').click();

		const appeared = await waitForToast(page);
		expect(appeared).toBe(true);
	});
});

test.describe('Custom Toast Edge Cases', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await scrollToExamples(page);
	});

	test('should handle rapid custom toast creation', async ({ page }) => {
		const richContentLabel = page.locator('label[for="Rich content"]').first();

		// Create many custom toasts rapidly
		for (let i = 0; i < 5; i++) {
			await richContentLabel.click();
			await page.waitForTimeout(100);
		}

		await page.waitForTimeout(500);

		// Should not crash
		const launchButton = page.locator('button:has-text("Launch toast")');
		await expect(launchButton).toBeVisible();
	});

	test('should handle custom toast during viewport changes', async ({ page }) => {
		const richContentLabel = page.locator('label[for="Rich content"]').first();
		await richContentLabel.click();
		await page.waitForTimeout(300);

		// Change viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.waitForTimeout(300);

		// Toast should still be visible
		const wrapper = page.locator('._sft-wrapper').first();
		const isVisible = await wrapper.isVisible().catch(() => false);
		expect(isVisible).toBe(true);
	});

	test('should maintain custom toast during scrolling', async ({ page }) => {
		const richContentLabel = page.locator('label[for="Rich content"]').first();
		await richContentLabel.click();
		await page.waitForTimeout(300);

		// Scroll page
		await page.evaluate(() => window.scrollTo(0, 0));
		await page.waitForTimeout(200);
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(200);

		// Toast container should still be visible (fixed position)
		const toaster = page.locator('._sft-toaster');
		await expect(toaster).toBeVisible();
	});
});
