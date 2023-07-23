<script lang="ts">
	import toast, { Toaster } from '../lib';
	import 'prismjs';
	import 'prism-svelte';
	import demoCode from '../www/demo-code';
	import Copy from '../www/Copy.svelte';
	import Examples from '../www/Examples.svelte';
	import pkg from '../../package.json';

	function launchToast() {
		toast.promise(
			new Promise((resolve, reject) => {
				setTimeout(Math.random() < 0.8 ? resolve : reject, 1000);
			}),
			{ loading: 'Toasting bread...', success: 'Here’s your toast!', error: 'Your toast burned :(' }
		);
	}

	const installers = [
		{ name: 'NPM', cmd: 'npm install svelte-french-toast' },
		{ name: 'PNPM', cmd: 'pnpm install svelte-french-toast' },
		{ name: 'Yarn', cmd: 'yarn add svelte-french-toast' },
		{ name: 'Bun', cmd: 'bun add svelte-french-toast' }
	];
	let installer = installers[0].name;
</script>

<Toaster />

<div class="py-24 bg-[#faf6f4] border-b-4">
	<div class="container max-w-xl flex flex-col items-center mx-auto text-center">
		<img class="h-16 mb-10" src="favicon.png" alt="" />
		<div
			class="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-3 mb-10 text-white"
		>
			<div
				class="p-4 text-xl md:text-2xl font-extrabold bg-[#322f35] uppercase tracking-widest rounded-xl -rotate-2 shadow-lg"
			>
				Svelte
			</div>
			<div
				class="p-4 text-xl md:text-2xl font-extrabold bg-[#fd6819] uppercase tracking-widest rounded-xl rotate-3 shadow-lg"
			>
				French
			</div>
			<div
				class="p-4 text-xl md:text-2xl font-extrabold bg-[#322f35] uppercase tracking-widest rounded-xl -rotate-2 shadow-lg"
			>
				Toast
			</div>
		</div>
		<h1 class="font-bold text-3xl md:text-5xl">Buttery smooth toast notifications.</h1>
		<p class="mt-10 text-lg md:text-xl max-w-prose">
			Lightweight, customizable, and beautiful by default.<br />Inspired by
			<a
				href="https://react-hot-toast.com"
				class="font-medium underline decoration-dotted underline-offset-4"
				>React&nbsp;Hot&nbsp;Toast</a
			>.
		</p>
		<div class="flex items-center mt-10 space-x-4">
			<button
				on:click={launchToast}
				class="flex items-center space-x-2 text-lg py-2 font-bold px-5 rounded-xl bg-amber-300 border-2 border-amber-400 shadow"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
						clip-rule="evenodd"
					/>
				</svg>
				<span>Launch toast</span>
			</button>
			<a
				href="https://github.com/kbrgl/svelte-french-toast"
				class="flex items-center space-x-2 text-gray-500"
			>
				<svg class="h-5 w-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
					><title>GitHub</title><path
						fill="currentColor"
						d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
					/></svg
				>
				<span>Source</span>
			</a>
		</div>
		<p class="mt-5 text-sm border rounded-full px-2 py-1 text-gray-500">
			<a href="https://npmjs.com/package/svelte-french-toast">Version {pkg.version}</a>
		</p>
		<div class="grid grid-cols-2 md:grid-cols-3 gap-4 self-stretch mt-10 font-medium">
			{#each ['Emoji Support', 'Customizable', 'Promise API', 'Pause on hover', 'Accessible', 'Headless use'] as feature}
				<div class="flex space-x-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#55aa88"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg
					>
					<p>{feature}</p>
				</div>
			{/each}
		</div>
	</div>
</div>
<div class="container mx-auto max-w-2xl py-10">
	<section>
		<div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
			<p class="text-xl font-bold">1. Install</p>
			<div class="space-x-1">
				{#each installers as i}
					<label for={i.name} class:checked={i.name === installer}>
						<input
							type="radio"
							id={i.name}
							name="installers"
							value={i.name}
							bind:group={installer}
						/>
						{i.name}
					</label>
				{/each}
			</div>
		</div>
		{#each installers as i}
			<div class:hidden={installer !== i.name}>
				<code class="language-shell">
					{i.cmd}
				</code>
				<Copy text={i.cmd} />
			</div>
		{/each}
	</section>
	<section class="mt-10">
		<p class="text-xl font-bold mb-4">2. Mount and use</p>
		<pre class="language-html"><code>{demoCode}</code></pre>
		<Copy text={demoCode} />
	</section>
	<hr class="my-10" />
	<h1 class="text-4xl font-bold mb-5">Examples</h1>
	<Examples />
	<p class="mt-24 mb-2 text-center">
		<a href="https://github.com/kbrgl/svelte-french-toast" class="underline">GitHub</a>
	</p>
	<p class="text-center text-gray-500">
		© 2022 svelte-french-toast · Built by <a class="text-gray-800" href="https://kabirgoel.com"
			>Kabir Goel</a
		>
	</p>
</div>

<style lang="postcss">
	:not(pre) > code,
	pre {
		@apply p-5 block;
	}

	input[type='radio'] {
		@apply appearance-none hidden;
	}
	label {
		cursor: pointer;
		@apply px-3 py-1 rounded-full;
	}
	label.checked {
		@apply bg-gray-200 font-bold;
	}
</style>
