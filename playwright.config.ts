import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	use: {
		baseURL: 'http://127.0.0.1:4173'
	},
	webServer: {
		command: 'pnpm run build && pnpm run preview --host 127.0.0.1 --port 4173',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: !process.env.CI
	},
	testMatch: ['**/*.spec.ts'],
	testDir: 'tests',
	timeout: 30000
};

export default config;
