<!-- Adapted from https://github.com/timolins/react-hot-toast -->
<script lang="ts">
	import type { IconTheme } from '../core/types';

	interface Props {
		primary?: IconTheme['primary'];
		secondary?: IconTheme['secondary'];
	}

	let { primary = '#ff4b4b', secondary = '#fff' }: Props = $props();
</script>

<div class="_sft-error" style:--primary={primary} style:--secondary={secondary}></div>
