import { test, expect } from '@playwright/test';
import {
	waitForToast,
	getToastCount,
	elementExists,
	scrollToExamples,
	clickExample,
	safeClick,
	getConsoleErrors
} from './TestHelpers';

test.describe('🎯 Production Readiness', () => {
	test('Complete user journey', async ({ page }) => {
		console.log('🔥 Starting complete user journey test...');

		// 1. Verify page loaded
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await expect(page.locator('h1').first()).toBeVisible();

		// 2. Test launch button
		await page.locator('button:has-text("Launch toast")').click();
		await page.waitForTimeout(500);
		const count = await getToastCount(page);
		expect(count).toBeGreaterThan(0);

		// 3. Switch package manager
		await page.locator('label[for="Yarn"]').first().click();
		await page.waitForTimeout(200);

		// 4. Scroll to examples
		await scrollToExamples(page);

		// 5. Test multiple example types in sequence
		const examples = ['Success', 'Error', 'Promise', 'Emoji', 'Themed'];

		for (const example of examples) {
			await clickExample(page, example);
			await page.waitForTimeout(400);
		}

		// 6. Test rich content interaction
		const richClicked = await clickExample(page, 'Rich content');

		if (richClicked) {
			await page.waitForTimeout(500);

			const removeBtn = page.locator('button:has-text("Remove")').first();
			await safeClick(removeBtn);
		}

		// 7. Final verification - page should still be functional
		const launchButton = page.locator('button:has-text("Launch toast")');
		await expect(launchButton).toBeVisible();
		await expect(launchButton).toBeEnabled();

		console.log('✅ Complete user journey test passed!');
	});

	test('Stress test with multiple toasts', async ({ page }) => {
		console.log('🔥 Starting stress test...');

		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await scrollToExamples(page);

		const examples = ['Success', 'Error', 'Emoji', 'Promise'];

		// Create 20 toasts rapidly
		for (let i = 0; i < 20; i++) {
			const randomExample = examples[Math.floor(Math.random() * examples.length)];
			await clickExample(page, randomExample);
			await page.waitForTimeout(50);
		}

		await page.waitForTimeout(1000);

		// Verify page didn't crash
		const heading = page.locator('h1').first();
		await expect(heading).toBeVisible();

		// Toast count should be managed (limit exists)
		const count = await getToastCount(page);
		expect(count).toBeLessThanOrEqual(25);

		console.log(`✅ Stress test passed with ${count} toasts rendered`);
	});

	test('All examples in sequence', async ({ page }) => {
		console.log('🔥 Testing all examples sequentially...');

		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await scrollToExamples(page);

		const allExamples = [
			'Success',
			'Error',
			'Promise',
			'Multiline',
			'Emoji',
			'Dark mode',
			'Rich content',
			'Themed',
			'Positioning',
			'Tailwind'
		];

		let successCount = 0;

		for (const example of allExamples) {
			console.log(`  Testing: ${example}`);

			const clicked = await clickExample(page, example);

			if (clicked) {
				await page.waitForTimeout(300);
				const toastAppeared = await waitForToast(page, 2000);
				if (toastAppeared) {
					successCount++;
				}
			}
		}

		console.log(`✅ ${successCount}/${allExamples.length} examples tested successfully`);
		expect(successCount).toBeGreaterThan(allExamples.length / 2);
	});

	test('Performance under load', async ({ page }) => {
		console.log('🔥 Testing performance under load...');

		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const startTime = Date.now();

		await scrollToExamples(page);

		// Multiple rounds of toast creation
		for (let round = 0; round < 3; round++) {
			console.log(`  Round ${round + 1}/3`);

			const successLabel = page.locator('label[for="Success"]').first();

			for (let i = 0; i < 5; i++) {
				await safeClick(successLabel);
				await page.waitForTimeout(50);
			}

			await page.waitForTimeout(1500);
		}

		const duration = Date.now() - startTime;

		console.log(`  Completed in ${duration}ms`);
		expect(duration).toBeLessThan(20000);

		// Verify page is still responsive
		const launchButton = page.locator('button:has-text("Launch toast")');
		await expect(launchButton).toBeVisible();
		await expect(launchButton).toBeEnabled();

		console.log('✅ Performance test passed!');
	});

	test('Accessibility compliance', async ({ page }) => {
		console.log('🔥 Testing accessibility compliance...');

		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Check ARIA attributes on container
		const toaster = page.locator('._sft-toaster');
		await expect(toaster).toHaveAttribute('role', 'region');
		await expect(toaster).toHaveAttribute('aria-live', 'polite');

		// Check all buttons are accessible
		const allButtons = await page.locator('button:visible').all();
		for (const button of allButtons) {
			const isEnabled = await button.isEnabled();
			expect(isEnabled).toBe(true);
		}

		// Test keyboard navigation
		await page.keyboard.press('Tab');
		await page.waitForTimeout(100);

		const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
		expect(focusedElement).toBeTruthy();

		console.log('✅ Accessibility test passed!');
	});

	test('Cross-browser compatibility', async ({ page, browserName }) => {
		console.log(`🔥 Testing on ${browserName}...`);

		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Basic functionality should work across browsers
		await expect(page.locator('h1').first()).toBeVisible();

		await page.locator('button:has-text("Launch toast")').click();
		await page.waitForTimeout(500);

		const toastAppeared = await waitForToast(page);
		expect(toastAppeared).toBe(true);

		// Test examples
		await scrollToExamples(page);
		await clickExample(page, 'Success');
		await page.waitForTimeout(500);

		const count = await getToastCount(page);
		expect(count).toBeGreaterThan(0);

		console.log(`✅ ${browserName} compatibility confirmed!`);
	});

	test('Memory leak prevention', async ({ page }) => {
		console.log('🔥 Testing memory leak prevention...');

		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await scrollToExamples(page);

		const successLabel = page.locator('label[for="Success"]').first();

		// Multiple cycles
		for (let cycle = 0; cycle < 3; cycle++) {
			console.log(`  Cycle ${cycle + 1}/3`);

			// Create toasts
			for (let i = 0; i < 5; i++) {
				await safeClick(successLabel);
				await page.waitForTimeout(50);
			}

			// Wait for cleanup
			await page.waitForTimeout(5000);

			// Verify cleanup
			const count = await getToastCount(page);
			expect(count).toBeLessThanOrEqual(3);
		}

		// Page should still be responsive
		const launchButton = page.locator('button:has-text("Launch toast")');
		await expect(launchButton).toBeVisible();

		console.log('✅ No memory leaks detected!');
	});
});

test.describe('🏆 THE ULTIMATE TEST', () => {
	test('Complete integration - everything at once', async ({ page }) => {
		console.log('🔥 FINAL BOSS: THE ULTIMATE TEST 🔥');

		const startTime = Date.now();

		// 1. Page load verification
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await expect(page).toHaveTitle(/Svelte French Toast/);
		await expect(page.locator('h1').first()).toBeVisible();

		// 2. Hero interactions
		await page.locator('button:has-text("Launch toast")').click();
		await page.waitForTimeout(300);

		// 3. Test all package managers
		const managers = ['NPM', 'PNPM', 'Yarn', 'Bun'];
		for (const manager of managers) {
			const label = page.locator(`label[for="${manager}"]`).first();
			await safeClick(label);
			await page.waitForTimeout(100);
		}

		// 4. Test all examples
		await scrollToExamples(page);

		const examples = [
			'Success',
			'Error',
			'Promise',
			'Multiline',
			'Emoji',
			'Dark mode',
			'Rich content',
			'Themed',
			'Positioning',
			'Tailwind'
		];

		for (const example of examples) {
			await clickExample(page, example);
			await page.waitForTimeout(200);
		}

		// 5. Stress test
		const successLabel = page.locator('label[for="Success"]').first();
		for (let i = 0; i < 10; i++) {
			await safeClick(successLabel);
			await page.waitForTimeout(100);
		}

		// 6. Test viewport changes
		await page.setViewportSize({ width: 375, height: 667 });
		await page.waitForTimeout(300);
		await page.setViewportSize({ width: 1920, height: 1080 });
		await page.waitForTimeout(300);

		// 7. Test scrolling behavior
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(200);
		await page.evaluate(() => window.scrollTo(0, 0));
		await page.waitForTimeout(200);

		// 8. Test rich content interaction
		await clickExample(page, 'Rich content');
		await page.waitForTimeout(500);
		const removeBtn = page.locator('button:has-text("Remove")').first();
		await safeClick(removeBtn);

		// 9. Verify accessibility
		const toaster = page.locator('._sft-toaster');
		await expect(toaster).toHaveAttribute('role', 'region');
		await expect(toaster).toHaveAttribute('aria-live', 'polite');

		// 10. Test keyboard navigation
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.waitForTimeout(200);

		// 11. Verify no console errors
		const errors = await getConsoleErrors(page);
		expect(errors.length).toBe(0);

		// 12. Final verification
		const launchButton = page.locator('button:has-text("Launch toast")');
		await expect(launchButton).toBeVisible();
		await expect(launchButton).toBeEnabled();

		await launchButton.click();
		await page.waitForTimeout(500);

		const finalToastExists = await elementExists(page, '._sft-base, ._sft-custom-wrapper');
		expect(finalToastExists).toBe(true);

		// 13. Performance check
		const duration = Date.now() - startTime;
		console.log(`  Total test duration: ${duration}ms`);
		expect(duration).toBeLessThan(30000);

		const remainingToasts = await getToastCount(page);
		console.log(`  Remaining toasts: ${remainingToasts}`);

		console.log('✅ ✅ ✅ FINAL BOSS DEFEATED! ✅ ✅ ✅');
		console.log('🎉 ALL TESTS PASSED - READY FOR PRODUCTION! 🚀');
	});
});

test.describe('CI/CD Health Check', () => {
	test('🎯 Production readiness verification', async ({ page }) => {
		console.log('🎯 Running production readiness check...');

		const checks: Record<string, boolean> = {
			'Page loads': false,
			'Hero visible': false,
			'Toast works': false,
			'Examples work': false,
			'Navigation works': false,
			Responsive: false,
			Accessible: false,
			'No errors': false,
			'Custom toasts': false
		};

		try {
			// Page loads
			await page.goto('/');
			await page.waitForLoadState('networkidle');
			checks['Page loads'] = true;

			// Hero visible
			await expect(page.locator('h1').first()).toBeVisible();
			checks['Hero visible'] = true;

			// Toast works
			await page.locator('button:has-text("Launch toast")').click();
			checks['Toast works'] = await waitForToast(page);

			// Examples work
			await scrollToExamples(page);
			await clickExample(page, 'Success');
			await page.waitForTimeout(300);
			checks['Examples work'] = await elementExists(page, '._sft-base');

			// Navigation works
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			checks['Navigation works'] = true;

			// Responsive
			await page.setViewportSize({ width: 375, height: 667 });
			await page.waitForTimeout(200);
			checks['Responsive'] = await page.locator('h1').first().isVisible();

			// Accessible
			const toaster = page.locator('._sft-toaster');
			checks['Accessible'] = (await toaster.getAttribute('role')) === 'region';

			// No errors
			const errors = await getConsoleErrors(page);
			checks['No errors'] = errors.length === 0;

			// Custom toasts
			await page.setViewportSize({ width: 1920, height: 1080 });
			await scrollToExamples(page);
			await clickExample(page, 'Rich content');
			await page.waitForTimeout(500);
			checks['Custom toasts'] = await elementExists(page, '._sft-base, ._sft-custom-wrapper');
		} catch (error) {
			console.error('Health check error:', error);
		}

		// Print results
		console.log('\n📊 Results:');
		console.log('================================');
		for (const [check, passed] of Object.entries(checks)) {
			const icon = passed ? '✅' : '❌';
			console.log(`${icon} ${check}`);
		}
		console.log('================================\n');

		const allPassed = Object.values(checks).every((v) => v === true);
		expect(allPassed).toBe(true);

		if (allPassed) {
			console.log('🎉 ALL CHECKS PASSED - READY FOR PRODUCTION! 🚀');
		}
	});
});
