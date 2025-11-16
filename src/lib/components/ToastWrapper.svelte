<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { DOMToast } from '../core/types';
	import { prefersReducedMotion } from '../core/utils';
	import ToastBar from './ToastBar.svelte';
	import ToastMessage from './ToastMessage.svelte';

	interface Props {
		toast: DOMToast;
		setHeight: (height: number) => void;
		children?: Snippet<[{ toast: DOMToast }]>;
	}

	let { toast, setHeight, children }: Props = $props();

	let clientHeight: number | undefined = $state();

	onMount(() => {
		if (clientHeight === undefined) return;
		setHeight(clientHeight);
	});

	let top = $derived(toast.position?.includes('top') ? 0 : null);
	let bottom = $derived(toast.position?.includes('bottom') ? 0 : null);
	let factor = $derived(toast.position?.includes('top') ? 1 : -1);
	let justifyContent = $derived(
		(toast.position?.includes('center') && 'center') ||
			(toast.position?.includes('right') && 'flex-end') ||
			(toast.position?.includes('left') && 'flex-start') ||
			null
	);
</script>

<div
	bind:clientHeight
	class="_sft-wrapper"
	class:_sft-active={toast.visible}
	class:_sft-transition={!prefersReducedMotion()}
	style:--factor={factor}
	style:--offset={toast.offset}
	style:top
	style:bottom
	style:justify-content={justifyContent}
>
	{#if toast.type === 'custom' && !children}
		<ToastMessage {toast} />
	{:else if children}
		{@render children({ toast })}
	{:else}
		<ToastBar {toast} position={toast.position} />
	{/if}
</div>
