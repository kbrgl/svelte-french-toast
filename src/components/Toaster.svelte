<script lang="ts">
	import { useToaster } from '../core/use-toaster';
	import ToastBar from '../components/ToastBar.svelte';
	import type { ToastOptions, ToastPosition } from '../core/types';
	import { prefersReducedMotion } from '../core/utils';
	import ToastMessage from './ToastMessage.svelte';

	export let reverseOrder: boolean = false;
	export let position: ToastPosition = 'top-center';
	export let toastOptions: ToastOptions | undefined = undefined;
	export let gutter: number = 8;
	export let containerStyle: string | undefined = undefined;
	export let containerClassName: string | undefined = undefined;

	const { toasts, handlers } = useToaster(toastOptions);
</script>

<div
	class={`toaster ${containerClassName || ''}`}
	style={containerStyle}
	on:mouseenter={handlers.startPause}
	on:mouseleave={handlers.endPause}
>
	{#each $toasts as toast (toast.id)}
		{@const toastPosition = toast.position || position}
		{@const toastOffset = handlers.calculateOffset(toast, $toasts, {
			reverseOrder,
			gutter,
			defaultPosition: position
		})}
		<div
			class="wrapper"
			class:active={toast.visible}
			class:transition={!prefersReducedMotion()}
			style:--factor={toastPosition.includes('top') ? 1 : -1}
			style:--offset={toastOffset}
			style:top={(toastPosition.includes('top') && 0) || null}
			style:bottom={(toastPosition.includes('bottom') && 0) || null}
			style:justify-content={(toastPosition.includes('center') && 'center') ||
				(toastPosition.includes('right') && 'flex-end') ||
				null}
		>
			{#if toast.type === 'custom'}
				<ToastMessage {toast} />
			{:else}
				<slot {toast}>
					<ToastBar {toast} position={toastPosition} />
				</slot>
			{/if}
		</div>
	{/each}
</div>

<style>
	.toaster {
		--default-offset: 16px;

		position: fixed;
		z-index: 9999;
		top: var(--default-offset);
		left: var(--default-offset);
		right: var(--default-offset);
		bottom: var(--default-offset);
		pointer-events: none;
	}

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
