import { expect, test } from '@playwright/experimental-ct-svelte';
import App from './boilerplate/App.svelte';

test.use({ viewport: { width: 500, height: 500 } });

test.describe('LTR', () => {
	test.beforeEach(async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.lang = 'en';
			document.documentElement.dir = 'ltr';
		});
	});

	test('top-start', async ({ mount }) => {
		const component = await mount(App, {
			props: { toastProps: ['Hello world!', { position: 'top-start' }] }
		});

		const toast = component.getByRole('status');
		// toast should be top left
		const toastRect = await toast.boundingBox();
		expect(toastRect?.x).toBeLessThan(150);
	});

	test('top-end', async ({ mount }) => {
		const component = await mount(App, {
			props: { toastProps: ['Hello world!', { position: 'top-end' }] }
		});

		const toast = component.getByRole('status');
		// toast should be top right
		const toastRect = await toast.boundingBox();
		expect(toastRect?.x).toBeGreaterThan(350);
	});

	test('bottom-start', async ({ mount }) => {
		const component = await mount(App, {
			props: {
				toastProps: ['Hello world!', { position: 'bottom-start' }]
			}
		});

		const toast = component.getByRole('status');
		// toast should be bottom left
		const toastRect = await toast.boundingBox();
		expect(toastRect?.x).toBeLessThan(150);
	});

	test('bottom-end', async ({ mount }) => {
		const component = await mount(App, {
			props: { toastProps: ['Hello world!', { position: 'bottom-end' }] }
		});

		const toast = component.getByRole('status');
		// toast should be bottom right
		const toastRect = await toast.boundingBox();
		expect(toastRect?.x).toBeGreaterThan(350);
	});
});

test.describe('RTL', () => {
	test.beforeEach(async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.lang = 'ar';
			document.documentElement.dir = 'rtl';
		});
	});

	test('top-start', async ({ mount }) => {
		const component = await mount(App, {
			props: { toastProps: ['مرحبا', { position: 'top-start' }] }
		});

		const toast = component.getByRole('status');
		// toast should be top right
		const toastRect = await toast.boundingBox();
		expect(toastRect?.x).toBeGreaterThan(350);
	});

	test('top-end', async ({ mount }) => {
		const component = await mount(App, {
			props: { toastProps: ['مرحبا', { position: 'top-end' }] }
		});

		const toast = component.getByRole('status');
		// toast should be top left
		const toastRect = await toast.boundingBox();
		expect(toastRect?.x).toBeLessThan(150);
	});

	test('bottom-start', async ({ mount }) => {
		const component = await mount(App, {
			props: { toastProps: ['مرحبا', { position: 'bottom-start' }] }
		});

		const toast = component.getByRole('status');
		// toast should be bottom right
		const toastRect = await toast.boundingBox();
		expect(toastRect?.x).toBeGreaterThan(350);
	});

	test('bottom-end', async ({ mount }) => {
		const component = await mount(App, {
			props: { toastProps: ['مرحبا', { position: 'bottom-end' }] }
		});

		const toast = component.getByRole('status');
		// toast should be bottom left
		const toastRect = await toast.boundingBox();
		expect(toastRect?.x).toBeLessThan(150);
	});
});
