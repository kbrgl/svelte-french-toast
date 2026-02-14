import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/test-harness');
});

test('shows and dismisses a success toast', async ({ page }) => {
	await page.getByRole('button', { name: 'Trigger success' }).click();

	const successToast = page.getByText('Success toast');
	await expect(successToast).toBeVisible();

	await page.getByRole('button', { name: 'Dismiss all' }).click();
	await expect(successToast).toBeHidden();
});

test('removes all toasts immediately', async ({ page }) => {
	await page.getByRole('button', { name: 'Trigger success' }).click();
	await page.getByRole('button', { name: 'Trigger error' }).click();

	await expect(page.getByText('Success toast')).toBeVisible();
	await expect(page.getByText('Error toast')).toBeVisible();

	await page.getByRole('button', { name: 'Remove all' }).click();
	await expect(page.getByText('Success toast')).toBeHidden();
	await expect(page.getByText('Error toast')).toBeHidden();
});

test('auto dismisses short-lived toasts', async ({ page }) => {
	await page.getByRole('button', { name: 'Trigger auto dismiss' }).click();

	const autoToast = page.getByText('Auto dismiss toast');
	await expect(autoToast).toBeVisible();
	await expect(autoToast).toBeHidden({ timeout: 3000 });
});

test('handles promise success and error flows', async ({ page }) => {
	await page.getByRole('button', { name: 'Trigger promise success' }).click();
	await expect(page.getByText('Promise loading')).toBeVisible();
	await expect(page.getByText('Promise success: ok')).toBeVisible();

	await page.getByRole('button', { name: 'Trigger promise error' }).click();
	await expect(page.getByText('Promise error: fail')).toBeVisible();
});
