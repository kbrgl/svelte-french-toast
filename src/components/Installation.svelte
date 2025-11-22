<script lang="ts">
	import Copy from '../examples/Copy.svelte';

	const installers = [
		{ name: 'NPM', cmd: 'npm install svelte-french-toast' },
		{ name: 'PNPM', cmd: 'pnpm install svelte-french-toast' },
		{ name: 'Yarn', cmd: 'yarn add svelte-french-toast' },
		{ name: 'Bun', cmd: 'bun add svelte-french-toast' }
	];

	let installer = $state(installers[0].name);
</script>

<section>
	<div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
		<h2 class="text-xl font-bold">1. Install</h2>
		<div class="flex gap-2">
			{#each installers as i}
				<label for={i.name} class:checked={i.name === installer} class="flex items-center gap-2">
					<img src={`/managers/${i.name.toLowerCase()}.png`} alt={i.name} class="w-5 h-5" />
					<input type="radio" id={i.name} name="installers" value={i.name} bind:group={installer} />
					{i.name}
				</label>
			{/each}
		</div>
	</div>

	{#each installers as i}
		<div class:hidden={installer !== i.name}>
			<pre class="language-shell">{i.cmd}</pre>
			<Copy text={i.cmd} />
		</div>
	{/each}
</section>

<style lang="postcss">
	input[type='radio'] {
		@apply appearance-none hidden;
	}

	label {
		cursor: pointer;
		@apply px-4 py-1.5 rounded-full text-sm font-medium transition-all;
		@apply bg-gray-100 text-gray-700 hover:bg-gray-200;
	}

	label.checked {
		@apply bg-amber-400 text-white shadow-sm;
	}

	label img {
		@apply w-5 h-5;
	}
</style>
