<script lang="ts">
	import ToastIcon from './ToastIcon.svelte';
	import type { Toast, ToastPosition } from '../core/types';
	import { prefersReducedMotion } from '../core/utils';
	import type { SvelteComponent } from 'svelte';
	import ToastMessage from './ToastMessage.svelte';

	export let toast: Toast;
	export let position: ToastPosition | undefined = undefined;
	export let style = '';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let Component: typeof SvelteComponent<any> | undefined = undefined;

	let factor: number;
	let animation: string;
	$: {
		const top = (toast.position || position || 'top-center').includes('top');
		factor = top ? 1 : -1;

		const [enter, exit] = prefersReducedMotion() ? ['fadeIn', 'fadeOut'] : ['enter', 'exit'];
		animation = toast.visible ? enter : exit;
	}
</script>

<div
	class="base {toast.height ? animation : 'transparent'} {toast.className || ''}"
	style="{style}; {toast.style}"
	style:--factor={factor}
>
	{#if Component}
		<svelte:component this={Component}>
			<ToastIcon {toast} slot="icon" />
			<ToastMessage {toast} slot="message" />
		</svelte:component>
	{:else}
		<slot {ToastIcon} {ToastMessage} {toast}>
			<ToastIcon {toast} />
			<ToastMessage {toast} />
		</slot>
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
		box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
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
