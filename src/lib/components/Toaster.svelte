<script lang="ts">
	import useToaster from '../core/use-toaster';
	import type { DOMToast, ToastOptions, ToastPosition } from '../core/types';
	import ToastWrapper from './ToastWrapper.svelte';

	interface Props {
		reverseOrder?: boolean;
		toastOptions?: ToastOptions;
		position?: ToastPosition;
		gutter?: number;
		containerStyle?: string;
		containerClassName?: string;
	}

	let {
		reverseOrder = false,
		toastOptions,
		position = 'top-center',
		gutter = 8,
		containerStyle,
		containerClassName
	}: Props = $props();

	const { toasts, handlers } = useToaster(toastOptions);

	let _toasts: DOMToast[] = $derived(
		$toasts.map((toast) => ({
			...toast,
			position: toast.position || position,
			offset: handlers.calculateOffset(toast, $toasts, {
				reverseOrder,
				gutter,
				defaultPosition: position
			})
		}))
	);
</script>

<div
	class="toaster {containerClassName || ''}"
	style={containerStyle}
	onmouseenter={handlers.startPause}
	onmouseleave={handlers.endPause}
	role="alert"
>
	{#each _toasts as toast (toast.id)}
		<ToastWrapper {toast} setHeight={(height) => handlers.updateHeight(toast.id, height ?? 0)} />
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
</style>
