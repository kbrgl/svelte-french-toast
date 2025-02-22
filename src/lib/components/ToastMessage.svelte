<script lang="ts">
	import type { Toast } from '../core/types';

	interface Props {
		toast: Toast;
	}

	let { toast }: Props = $props();
</script>

<div class="message" {...toast.ariaProps}>
	{#if typeof toast.message === 'string'}
		{toast.message}
	{:else}
		{@const Message = toast.message}
		<Message {toast} {...toast.props} />
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
