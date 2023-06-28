import { defineConfig, devices } from '@playwright/experimental-ct-svelte';

export default defineConfig({
	testDir: './tests/components',
	timeout: 10 * 1000,
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? [['github'], ['html']] : [['html', { open: 'never' }]],
	use: {
		trace: 'retain-on-failure',
		video: 'retain-on-failure',
		ctPort: 3100,
		ctTemplateDir: './tests/components/boilerplate'
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	]
});
