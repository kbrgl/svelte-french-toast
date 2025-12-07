<script lang="ts">
	import type { Toast } from '../core/types';
	import CheckmarkIcon from './CheckmarkIcon.svelte';
	import ErrorIcon from './ErrorIcon.svelte';
	import LoaderIcon from './LoaderIcon.svelte';

	interface Props {
		toast: Toast;
	}

	let { toast }: Props = $props();
	let { type, icon, iconTheme } = $derived(toast);
</script>

{#if typeof icon === 'string'}
	<div class="_sft-animated">{icon}</div>
{:else if typeof icon !== 'undefined'}
	{@const IconComponent = icon}
	<IconComponent />
{:else if type !== 'blank'}
	<div class="_sft-indicator">
		<LoaderIcon {...iconTheme} />
		{#if type !== 'loading'}
			<div class="_sft-status">
				{#if type === 'error'}
					<ErrorIcon {...iconTheme} />
				{:else}
					<CheckmarkIcon {...iconTheme} />
				{/if}
			</div>
		{/if}
	</div>
{/if}
