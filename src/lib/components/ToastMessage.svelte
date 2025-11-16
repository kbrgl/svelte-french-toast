<script lang="ts">
	import type { Toast } from '../core/types';
	import { prefersReducedMotion } from '../core/utils';

	interface Props {
		toast: Toast;
	}

	let { toast }: Props = $props();

	let animationClass = $derived.by(() => {
		if (toast.type === 'custom') {
			return prefersReducedMotion() ? '_sft-fadeIn' : '_sft-enter';
		}
		return '';
	});
</script>

<div class="_sft-message {animationClass}" {...toast.ariaProps}>
	{#if typeof toast.message === 'string'}
		{toast.message}
	{:else}
		{@const Message = toast.message}
		<Message {toast} {...toast.props} />
	{/if}
</div>
