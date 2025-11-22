import { type Page, type Locator } from '@playwright/test';

/**
 * Wait for a toast to appear on the page
 */
export async function waitForToast(page: Page, timeout = 5000): Promise<boolean> {
	try {
		await page.waitForSelector('._sft-base, ._sft-custom-wrapper, ._sft-message', {
			timeout,
			state: 'visible'
		});
		return true;
	} catch {
		return false;
	}
}

/**
 * Get the count of visible toasts
 */
export async function getToastCount(page: Page): Promise<number> {
	const baseCount = await page.locator('._sft-base:visible').count();
	const customCount = await page.locator('._sft-custom-wrapper:visible').count();
	return baseCount + customCount;
}

/**
 * Check if an element exists on the page
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
	return (await page.locator(selector).count()) > 0;
}

/**
 * Safely click a locator with visibility check
 */
export async function safeClick(locator: Locator): Promise<boolean> {
	try {
		const isVisible = await locator.isVisible({ timeout: 1000 });
		if (isVisible) {
			await locator.click();
			return true;
		}
		return false;
	} catch {
		return false;
	}
}

/**
 * Wait for toast to disappear (auto-dismiss)
 */
export async function waitForToastDismiss(page: Page, timeout = 6000): Promise<boolean> {
	try {
		await page.waitForSelector('._sft-base:visible', { timeout, state: 'hidden' });
		return true;
	} catch {
		return false;
	}
}

/**
 * Get toast text content
 */
export async function getToastText(page: Page): Promise<string | null> {
	const toast = page.locator('._sft-base, ._sft-custom-wrapper, ._sft-message').first();
	const isVisible = await toast.isVisible().catch(() => false);
	return isVisible ? await toast.textContent() : null;
}

/**
 * Check if toast has animation class
 */
export async function hasAnimationClass(page: Page): Promise<boolean> {
	const toast = page.locator('._sft-base, ._sft-custom-wrapper').first();
	const className = await toast.getAttribute('class');
	return /_sft-enter|_sft-fadeIn|_sft-animated/.test(className || '');
}

/**
 * Scroll to examples section
 */
export async function scrollToExamples(page: Page): Promise<void> {
	await page.locator('text=Examples').first().scrollIntoViewIfNeeded();
	await page.waitForTimeout(300);
}

/**
 * Click example by label
 */
export async function clickExample(page: Page, exampleName: string): Promise<boolean> {
	const label = page.locator(`label[for="${exampleName}"]`).first();
	return await safeClick(label);
}

/**
 * Get console errors (filtered)
 */
export async function getConsoleErrors(page: Page): Promise<string[]> {
	const errors: string[] = [];
	page.on('console', (msg) => {
		if (msg.type() === 'error') {
			errors.push(msg.text());
		}
	});
	await page.waitForTimeout(1000);

	return errors.filter(
		(e) => !e.includes('favicon') && !e.includes('chrome-extension') && !e.includes('net::ERR')
	);
}
