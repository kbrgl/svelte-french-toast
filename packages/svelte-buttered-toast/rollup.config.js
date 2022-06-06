import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import typescript from '@rollup/plugin-typescript';
import { sveltePreprocess } from 'svelte-preprocess/dist/autoProcess';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const name = pkg.name
	.replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
	.replace(/^\w/, (m) => m.toUpperCase())
	.replace(/-\w/g, (m) => m[1].toUpperCase());

const isProduction = process.env.NODE_ENV !== 'development';

export default {
	input: 'index.ts',
	output: [
		{ file: pkg.module, format: 'es', sourcemap: !isProduction, exports: 'named' },
		{ file: pkg.main, format: 'umd', name, sourcemap: !isProduction, exports: 'named' }
	],
	plugins: [
		typescript({ sourceMap: !isProduction }),
		svelte({
			preprocess: sveltePreprocess({ typescript: true }),
			emitCss: false
		}),
		resolve(),
		commonjs(),
		isProduction && terser()
	]
};
