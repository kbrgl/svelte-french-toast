<script lang="ts">
	import { onMount } from 'svelte';

	import type { DOMToast } from '../core/types';
	import { prefersReducedMotion } from '../core/utils';
	import ToastBar from './ToastBar.svelte';
	import ToastMessage from './ToastMessage.svelte';

	export let toast: DOMToast;
	export let setHeight: (height: number) => void;

	let wrapperEl: HTMLElement;
	onMount(() => {
		setHeight(wrapperEl.getBoundingClientRect().height);
	});

	$: top = toast.position?.includes('top') ? 0 : null;
	$: bottom = toast.position?.includes('bottom') ? 0 : null;
	$: factor = toast.position?.includes('top') ? 1 : -1;
	$: justifyContent =
		(toast.position?.includes('center') && 'center') ||
		((toast.position?.includes('right') || toast.position?.includes('end')) && 'flex-end') ||
		null;
</script>

<div
	bind:this={wrapperEl}
	class="wrapper"
	class:active={toast.visible}
	class:transition={!prefersReducedMotion()}
	style:--factor={factor}
	style:--offset={toast.offset}
	style:top
	style:bottom
	style:justify-content={justifyContent}
>
	{#if toast.type === 'custom'}
		<ToastMessage {toast} />
	{:else}
		<slot {toast}>
			<ToastBar {toast} position={toast.position} />
		</slot>
	{/if}
</div>

<style>
	.wrapper {
		left: 0;
		right: 0;
		display: flex;
		position: absolute;
		transform: translateY(calc(var(--offset, 16px) * var(--factor) * 1px));
	}

	.transition {
		transition: all 230ms cubic-bezier(0.21, 1.02, 0.73, 1);
	}

	.active {
		z-index: 9999;
	}

	.active > :global(*) {
		pointer-events: auto;
	}
</style>
