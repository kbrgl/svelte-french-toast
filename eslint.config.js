import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import svelteConfig from './svelte.config.js';

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	eslintPluginSvelte.configs['flat/recommended'],
	eslintConfigPrettier,
	{
		ignores: [
			'*.cjs',
			'.DS_Store',
			'node_modules',
			'/build',
			'.svelte-kit',
			'/package',
			'.env',
			'.env.*',
			'!.env.example',
			'pnpm-lock.yaml',
			'package-lock.json',
			'yarn.lock'
		]
	},
	{
		languageOptions: {
			sourceType: 'module',
			ecmaVersion: 2020,
			globals: {
				...globals.browser,
				...globals.es2017,
				...globals.node
			}
		}
	},
	{
		files: ['*.svelte', '**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser,
				svelteConfig
			}
		}
	}
);
