<script lang="ts">
	import type { DOMToast, ToastOptions, ToastPosition, Theme } from '../core/types';
	import { theme } from '../core/theme';
	import useToaster from '../core/use-toaster';
	import ToastWrapper from './ToastWrapper.svelte';

	interface Props {
		reverseOrder?: boolean;
		position?: ToastPosition;
		toastOptions?: ToastOptions | undefined;
		gutter?: number;
		containerStyle?: string | undefined;
		containerClassName?: string | undefined;
		theme?: Theme;
		visibleToasts?: number;
	}

	let {
		reverseOrder = false,
		position = 'top-center',
		toastOptions = undefined,
		gutter = 8,
		containerStyle = undefined,
		containerClassName = undefined,
		theme: themeOverride = undefined,
		visibleToasts = 20
	}: Props = $props();

	if (themeOverride) {
		theme.set(themeOverride);
	}

	const { toasts, handlers } = useToaster(toastOptions);

	let _toasts: DOMToast[] = $derived(
		$toasts.slice(0, visibleToasts).map((toast) => ({
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
	class="_sft-toaster {containerClassName || ''}"
	style={containerStyle}
	onmouseenter={handlers.startPause}
	onmouseleave={handlers.endPause}
	role="region"
	aria-live="polite"
>
	{#each _toasts as toast (toast.id)}
		<ToastWrapper {toast} setHeight={(height) => handlers.updateHeight(toast.id, height)} />
	{/each}
</div>
