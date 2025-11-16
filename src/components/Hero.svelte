<script lang="ts">
	interface Props {
		launchToast: () => void;
		version: string;
	}

	let { launchToast, version }: Props = $props();

	const features = [
		'Emoji Support',
		'Customizable',
		'Promise API',
		'Pause on hover',
		'Accessible',
		'Headless use'
	];
</script>

<div class="py-24 bg-[#faf6f4] border-b-4 border-neutral-200">
	<div class="container max-w-4xl flex flex-col items-center mx-auto text-center px-4">
		<img class="h-20 mb-10" src="favicon.png" alt="Svelte French Toast" />

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

		<h1 class="font-bold text-4xl md:text-6xl mb-6">Buttery smooth toast notifications</h1>

		<p class="text-lg md:text-xl text-gray-700 max-w-2xl mb-10">
			Lightweight, customizable, and beautiful by default. Built for Svelte 5.<br />
			Inspired by
			<a
				href="https://react-hot-toast.com"
				class="font-medium underline decoration-dotted underline-offset-4 hover:text-orange-600 transition-all"
				>React Hot Toast</a
			>.
		</p>

		<div class="flex items-center gap-4 mb-8">
			<button
				onclick={launchToast}
				class="flex items-center space-x-2 text-lg py-3 font-bold px-6 rounded-xl bg-amber-300 hover:bg-amber-400 border-2 border-amber-400 shadow-md transition-all"
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
				class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
			>
				<svg class="h-5 w-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<title>GitHub</title>
					<path
						fill="currentColor"
						d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
					/>
				</svg>
				<span>Source</span>
			</a>
		</div>

		<p class="text-sm border rounded-full px-3 py-1 text-gray-500 bg-white/50 mb-10">
			<a href="https://npmjs.com/package/svelte-french-toast" class="hover:text-orange-600"
				>Version {version}</a
			>
		</p>
		<div class="flex justify-center items-center">
			<div
				class="grid grid-cols-2 md:grid-cols-3 gap-4 self-stretch max-w-2xl font-medium items-center"
			>
				{#each features as feature}
					<div class="flex items-center justify-center space-x-2 bg-white/60 rounded-lg px-4 py-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#059669"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
						<p class="text-sm">{feature}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
