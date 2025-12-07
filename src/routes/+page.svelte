<script lang="ts">
	import toast, { Toaster } from '../lib';
	import 'prismjs';
	import 'prism-svelte';
	import { code } from '../examples/quickstart';
	import Copy from '../examples/Copy.svelte';
	import Examples from '../examples/Examples.svelte';
	import Hero from '../components/Hero.svelte';
	import Installation from '../components/Installation.svelte';
	import pkg from '../../package.json';

	function launchToast() {
		toast.promise(
			new Promise((resolve, reject) => {
				setTimeout(Math.random() < 0.8 ? resolve : reject, 1000);
			}),
			{ loading: 'Toasting bread...', success: 'Here’s your toast!', error: 'Your toast burned :(' }
		);
	}
</script>

<Toaster />

<Hero {launchToast} version={pkg.version} />

<div class="mx-auto max-w-2xl px-5 py-10">
	<section>
		<Installation />
		<div class="mt-10">
			<h2 class="text-xl font-bold">2. Mount and use</h2>
		</div>
		<pre class="language-html"><code>{code}</code></pre>
		<Copy text={code} />
	</section>

	<hr class="my-10" />

	<section>
		<div class="mb-8">
			<h2 class="text-4xl font-bold mb-3">Examples</h2>
			<p class="text-gray-600 text-lg">Click any example to see it in action</p>
		</div>
		<Examples />
	</section>
</div>

<footer class="border-t bg-neutral-50/20 py-12">
	<div class="container mx-auto max-w-4xl px-4 text-center">
		<p class="mb-2">
			<a
				href="https://github.com/kbrgl/svelte-french-toast"
				class="underline text-gray-700 hover:text-orange-600 underline-offset-4 decoration-dashed"
				>GitHub</a
			>
			<span class="mx-3 text-gray-300">·</span>
			<a
				href="https://npmjs.com/package/svelte-french-toast"
				class="underline underline-offset-4 decoration-dashed text-gray-700 hover:text-orange-600"
				>NPM</a
			>
		</p>
		<p class="text-gray-500 text-sm">
			© 2022 svelte-french-toast · Built by <a
				class="text-gray-800 hover:text-orange-600"
				href="https://kabirgoel.com">Kabir Goel</a
			>
		</p>
	</div>
</footer>

<style lang="postcss">
	:global(:not(pre) > code),
	:global(pre) {
		@apply p-5 block rounded-lg;
	}
</style>
