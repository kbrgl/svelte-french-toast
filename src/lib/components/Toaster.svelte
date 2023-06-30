<script lang="ts">
	import useToaster from '../core/use-toaster';
	import type { DOMToast, ToastOptions, ToastPosition } from '../core/types';
	import ToastWrapper from './ToastWrapper.svelte';

	export let reverseOrder = false;
	export let position: ToastPosition = 'top-center';
	export let toastOptions: ToastOptions | undefined = undefined;
	export let gutter = 8;
	export let containerStyle: string | undefined = undefined;
	export let containerClassName: string | undefined = undefined;

	const { toasts, handlers } = useToaster(toastOptions);

	let _toasts: DOMToast[];

	$: _toasts = $toasts.map((toast) => ({
		...toast,
		position: toast.position || position,
		offset: handlers.calculateOffset(toast, $toasts, {
			reverseOrder,
			gutter,
			defaultPosition: position
		})
	}));
</script>

<div
	class="toaster {containerClassName || ''}"
	style={containerStyle}
	on:mouseenter={handlers.startPause}
	on:mouseleave={handlers.endPause}
	role="alert"
>
	{#each _toasts as toast (toast.id)}
		<ToastWrapper {toast} setHeight={(height) => handlers.updateHeight(toast.id, height)} />
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
