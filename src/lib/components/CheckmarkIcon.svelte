<!-- Adapted from https://github.com/timolins/react-hot-toast -->
<script lang="ts">
	import type { IconTheme } from '../core/types';

	export let primary: IconTheme['primary'] = '#61d345';
	export let secondary: IconTheme['secondary'] = '#fff';
</script>

<div style:--primary={primary} style:--secondary={secondary}></div>

<style>
	div {
		width: 20px;
		opacity: 0;
		height: 20px;
		border-radius: 10px;
		background: var(--primary, #61d345);
		position: relative;
		transform: rotate(45deg);
		animation: circleAnimation 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
		animation-delay: 100ms;
	}

	div::after {
		content: '';
		box-sizing: border-box;
		animation: checkmarkAnimation 0.2s ease-out forwards;
		opacity: 0;
		animation-delay: 200ms;
		position: absolute;
		border-right: 2px solid;
		border-bottom: 2px solid;
		border-color: var(--secondary, #fff);
		bottom: 6px;
		left: 6px;
		height: 10px;
		width: 6px;
	}

	@keyframes circleAnimation {
		from {
			transform: scale(0) rotate(45deg);
			opacity: 0;
		}
		to {
			transform: scale(1) rotate(45deg);
			opacity: 1;
		}
	}

	@keyframes checkmarkAnimation {
		0% {
			height: 0;
			width: 0;
			opacity: 0;
		}
		40% {
			height: 0;
			width: 6px;
			opacity: 1;
		}
		100% {
			opacity: 1;
			height: 10px;
		}
	}
</style>
