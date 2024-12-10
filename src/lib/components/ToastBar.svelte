<script lang="ts">
	import ToastIcon from './ToastIcon.svelte';
	import type { Toast, ToastPosition } from '../core/types';
	import { prefersReducedMotion } from '../core/utils';
	import type { Snippet, SvelteComponent } from 'svelte';
	import ToastMessage from './ToastMessage.svelte';

	interface Props {
		toast: Toast;
		position: ToastPosition | undefined;
		style?: string;
		Component?: typeof SvelteComponent | undefined;
	}

	let {
		toast,
		position: position = undefined,
		style = '',
		Component: Component = undefined
	}: Props = $props();

	let top = $derived((toast.position || position || 'top-center').includes('top'));
	let factor: number = $derived(top ? 1 : -1);
	const [enter, exit] = $derived(
		prefersReducedMotion() ? ['fadeIn', 'fadeOut'] : ['enter', 'exit']
	);
	let animation: string = $derived(toast.visible ? enter : exit);
</script>

{#snippet children(data: { toast: Toast })}
	<ToastIcon toast={data.toast} />
	<ToastMessage toast={data.toast} />
{/snippet}

<div
	class="base {toast.height ? animation : 'transparent'} {toast.className || ''}"
	style="{style}; {toast.style}"
	style:--factor={factor}
>
	{#if Component}
		<Component>
			<ToastIcon {toast} slot="icon" />
			<ToastMessage {toast} slot="message" />
		</Component>
	{:else}
		{@render children({ toast })}
	{/if}
</div>

<style>
	@keyframes enterAnimation {
		0% {
			transform: translate3d(0, calc(var(--factor) * -200%), 0) scale(0.6);
			opacity: 0.5;
		}
		100% {
			transform: translate3d(0, 0, 0) scale(1);
			opacity: 1;
		}
	}

	@keyframes exitAnimation {
		0% {
			transform: translate3d(0, 0, -1px) scale(1);
			opacity: 1;
		}
		100% {
			transform: translate3d(0, calc(var(--factor) * -150%), -1px) scale(0.6);
			opacity: 0;
		}
	}

	@keyframes fadeInAnimation {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes fadeOutAnimation {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	.base {
		display: flex;
		align-items: center;
		background: #fff;
		color: #363636;
		line-height: 1.3;
		will-change: transform;
		box-shadow:
			0 3px 10px rgba(0, 0, 0, 0.1),
			0 3px 3px rgba(0, 0, 0, 0.05);
		max-width: 350px;
		pointer-events: auto;
		padding: 8px 10px;
		border-radius: 8px;
	}

	.transparent {
		opacity: 0;
	}

	.enter {
		animation: enterAnimation 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
	}

	.exit {
		animation: exitAnimation 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) forwards;
	}

	.fadeIn {
		animation: fadeInAnimation 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
	}

	.fadeOut {
		animation: fadeOutAnimation 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) forwards;
	}
</style>
