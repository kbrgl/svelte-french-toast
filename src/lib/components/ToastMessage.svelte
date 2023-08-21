<script lang="ts">
	import type { Toast } from '../core/types';

	export let toast: Toast;
</script>

<div class="message" {...toast.ariaProps}>
	{#if typeof toast.message === 'string'}
		{toast.message}
	{:else}
		<svelte:component this={toast.message} {toast} {...toast.props} />
	{/if}
</div>

<style>
	.message {
		display: flex;
		justify-content: center;
		margin: 4px 10px;
		color: inherit;
		flex: 1 1 auto;
		white-space: pre-line;
	}
</style>
