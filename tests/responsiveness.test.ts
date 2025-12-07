import { test, expect } from '@playwright/test';
import { waitForToast } from './TestHelpers';

test.describe('Responsive Design', () => {
	test('should work on mobile viewport (375x667)', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const heading = page.locator('h1').first();
		await expect(heading).toBeVisible();

		const launchButton = page.locator('button:has-text("Launch toast")');
		await expect(launchButton).toBeVisible();
		await launchButton.click();

		const appeared = await waitForToast(page);
		expect(appeared).toBe(true);
	});

	test('should work on mobile landscape (667x375)', async ({ page }) => {
		await page.setViewportSize({ width: 667, height: 375 });
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const heading = page.locator('h1').first();
		await expect(heading).toBeVisible();
	});

	test('should work on tablet viewport (768x1024)', async ({ page }) => {
		await page.setViewportSize({ width: 768, height: 1024 });
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const heading = page.locator('h1').first();
		await expect(heading).toBeVisible();

		const launchButton = page.locator('button:has-text("Launch toast")');
		await launchButton.click();

		const appeared = await waitForToast(page);
		expect(appeared).toBe(true);
	});

	test('should work on desktop viewport (1920x1080)', async ({ page }) => {
		await page.setViewportSize({ width: 1920, height: 1080 });
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const heading = page.locator('h1').first();
		await expect(heading).toBeVisible();
	});

	test('should work on ultra-wide viewport (2560x1440)', async ({ page }) => {
		await page.setViewportSize({ width: 2560, height: 1440 });
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const heading = page.locator('h1').first();
		await expect(heading).toBeVisible();
	});

	test('should handle viewport resize gracefully', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Start desktop
		await page.setViewportSize({ width: 1920, height: 1080 });
		await page.locator('button:has-text("Launch toast")').click();
		await page.waitForTimeout(300);

		// Resize to mobile
		await page.setViewportSize({ width: 375, height: 667 });
		await page.waitForTimeout(300);

		// Should still be functional
		const launchButton = page.locator('button:has-text("Launch toast")');
		await expect(launchButton).toBeVisible();
	});

	test('should maintain toast visibility during resize', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await page.locator('button:has-text("Launch toast")').click();
		const appeared = await waitForToast(page);
		expect(appeared).toBe(true);

		// Resize while toast is visible
		await page.setViewportSize({ width: 768, height: 1024 });
		await page.waitForTimeout(300);

		// Toast should still be visible
		const toaster = page.locator('._sft-toaster');
		await expect(toaster).toBeVisible();
	});

	test('should adjust layout on small screens', async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 568 }); // iPhone SE
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const heading = page.locator('h1').first();
		await expect(heading).toBeVisible();

		// Content should not overflow
		const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
		const viewportWidth = 320;
		expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // 20px tolerance
	});

	test('should position toasts correctly on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await page.locator('button:has-text("Launch toast")').click();
		await waitForToast(page);

		const wrapper = page.locator('._sft-wrapper').first();
		const boundingBox = await wrapper.boundingBox();

		// Toast should be within viewport
		if (boundingBox) {
			expect(boundingBox.x).toBeGreaterThanOrEqual(0);
			expect(boundingBox.y).toBeGreaterThanOrEqual(0);
			expect(boundingBox.x + boundingBox.width).toBeLessThanOrEqual(375 + 50); // tolerance
		}
	});

	test('should handle orientation changes', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Portrait
		await page.setViewportSize({ width: 375, height: 812 });
		await page.waitForTimeout(200);

		const portraitVisible = await page.locator('h1').first().isVisible();
		expect(portraitVisible).toBe(true);

		// Landscape
		await page.setViewportSize({ width: 812, height: 375 });
		await page.waitForTimeout(200);

		const landscapeVisible = await page.locator('h1').first().isVisible();
		expect(landscapeVisible).toBe(true);
	});
});

test.describe('Toast Container Responsiveness', () => {
	test('should respect max-width on desktop', async ({ page }) => {
		await page.setViewportSize({ width: 1920, height: 1080 });
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await page.locator('button:has-text("Launch toast")').click();
		await waitForToast(page);

		const toast = page.locator('._sft-base').first();
		const boundingBox = await toast.boundingBox();

		// Toast should have a max width (default 350px)
		if (boundingBox) {
			expect(boundingBox.width).toBeLessThanOrEqual(400); // Some tolerance
		}
	});

	test('should adapt width on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		await page.locator('button:has-text("Launch toast")').click();
		await waitForToast(page);

		const toast = page.locator('._sft-base').first();
		const boundingBox = await toast.boundingBox();

		// Toast should not exceed viewport width minus padding
		if (boundingBox) {
			expect(boundingBox.width).toBeLessThanOrEqual(375);
		}
	});
});
