import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	eslintPluginSvelte.configs.recommended,
	eslintConfigPrettier.recommended,
	{
		ignorePatterns: ['*.cjs'],
		overrides: [
			{
				files: ['*.svelte'],
				parser: 'svelte-eslint-parser',
				parserOptions: {
					parser: '@typescript-eslint/parser'
				}
			}
		],
		parserOptions: {
			sourceType: 'module',
			ecmaVersion: 2020
		},
		env: {
			browser: true,
			es2017: true,
			node: true
		}
	}
);
