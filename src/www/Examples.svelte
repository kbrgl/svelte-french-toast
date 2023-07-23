<script lang="ts">
	import Copy from './Copy.svelte';
	import examples, { type Example } from './examples';

	let selected: Example['title'] | null = 'Success';
</script>

<div class="grid grid-cols-2 md:grid-cols-3 gap-4 rounded-xl mb-5">
	{#each examples as example (example.title)}
		<label
			for={example.title}
			class="cursor-pointer p-2 bg-gray-100 hover:border-blue-500 rounded-xl transition-colors border-2 border-transparent"
			class:checked={example.title === selected}
		>
			<input
				type="radio"
				id={example.title}
				name="examples"
				value={example.title}
				on:change={() => {
					example.action();
				}}
				bind:group={selected}
			/>
			<span class="mr-1">{example.emoji}</span>
			<span class="font-medium">{example.title}</span>
		</label>
	{/each}
</div>
{#each examples as example}
	<div class:hidden={example.title !== selected}>
		<div class="overflow-auto">
			<pre class="language-{example.html ? 'svelte' : 'javascript'} h-80 table w-full"><code
					class="table-cell align-middle">{example.snippet}</code
				></pre>
		</div>
		<Copy text={example.snippet} />
	</div>
{/each}

<style lang="postcss">
	input[type='radio'] {
		@apply appearance-none;
	}
	.checked {
		@apply border-blue-500 font-bold;
	}
</style>
