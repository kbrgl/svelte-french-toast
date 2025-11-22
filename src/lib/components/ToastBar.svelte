<script lang="ts">
	import type { Component as ComponentType, Snippet } from 'svelte';
	import type { Toast, ToastPosition } from '../core/types';
	import { prefersReducedMotion } from '../core/utils';
	import { theme, getThemeColors, resolveTheme } from '../core/theme';
	import ToastIcon from './ToastIcon.svelte';
	import ToastMessage from './ToastMessage.svelte';

	interface Props {
		toast: Toast;
		position?: ToastPosition | undefined;
		style?: string;
		Component?: ComponentType<Record<string, unknown>> | undefined;
		children?: Snippet<
			[
				{
					ToastIcon: typeof ToastIcon;
					ToastMessage: typeof ToastMessage;
					toast: Toast;
				}
			]
		>;
	}

	let {
		toast,
		position = undefined,
		style = '',
		Component = undefined,
		children
	}: Props = $props();

	let factor: number | undefined = $derived.by(() => {
		const top = (toast.position || position || 'top-center').includes('top');
		return top ? 1 : -1;
	});

	let animation: string | undefined = $derived.by(() => {
		const [enter, exit] = prefersReducedMotion()
			? ['_sft-fadeIn', '_sft-fadeOut']
			: ['_sft-enter', '_sft-exit'];
		return toast.visible ? enter : exit;
	});

	let themeColors = $derived(getThemeColors($theme));
	let isDark = $derived(resolveTheme($theme) === 'dark');

	let computedClasses = $derived.by(() => {
		const classes = [];

		if (toast.type === 'custom') {
			classes.push('_sft-custom-wrapper');
		} else {
			classes.push('_sft-base');
		}

		if (toast.height) {
			classes.push(animation);
		} else {
			classes.push('_sft-transparent');
		}

		if (toast.className) {
			classes.push(toast.className);
		}

		return classes.join(' ');
	});

	let computedStyle = $derived.by(() => {
		const styles = [`--sft-factor: ${factor}`];

		// Only add theme colors for non-custom toasts
		if (toast.type !== 'custom') {
			styles.unshift(
				`--sft-toast-bg: ${themeColors.background}`,
				`--sft-toast-text: ${themeColors.text}`,
				`--sft-toast-border: ${themeColors.border}`,
				`--sft-toast-shadow: ${themeColors.shadow}`
			);
		}

		if (toast.style) {
			styles.push(toast.style);
		}
		if (style) {
			styles.push(style);
		}

		return styles.join('; ');
	});
</script>

<div class={computedClasses} class:dark={isDark} style={computedStyle}>
	{#if Component}
		<Component {...toast.props}>
			{#snippet icon()}
				<ToastIcon {toast} />
			{/snippet}
			{#snippet message()}
				<ToastMessage {toast} />
			{/snippet}
		</Component>
	{:else if children}
		{@render children({ ToastIcon, ToastMessage, toast })}
	{:else if toast.type === 'custom'}
		<!-- Custom: Just the message, no icon -->
		<ToastMessage {toast} />
	{:else}
		<!-- Standard: Icon + Message -->
		<ToastIcon {toast} />
		<ToastMessage {toast} />
	{/if}
</div>
