import { expect, test } from '@playwright/experimental-ct-svelte';
import App from './boilerplate/App.svelte';

test.use({ viewport: { width: 500, height: 500 } });

test('should render', async ({ mount }) => {
	const component = await mount(App, {
		props: { toastProps: ['Hello world!'] }
	});
	await expect(component.getByText('Hello world!')).toBeVisible();
});
