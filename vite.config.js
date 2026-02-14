import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['tests/unit/**/*.{test,spec}.{js,ts}'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov'],
			include: ['src/lib/core/**/*.ts'],
			exclude: ['src/lib/core/**/*.test.ts'],
			thresholds: {
				lines: 90,
				functions: 90,
				statements: 90,
				branches: 70
			}
		}
	},
	server: {
		fs: {
			strict: false
		}
	}
});
