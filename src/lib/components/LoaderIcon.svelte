<!-- Adapted from https://github.com/timolins/react-hot-toast -->
<script lang="ts">
	import type { IconTheme } from '../core/types';

	interface Props {
		primary?: IconTheme['primary'];
		secondary?: IconTheme['secondary'];
	}

	let { primary = '#616161', secondary = '#e0e0e0' }: Props = $props();
</script>

<div class="_sft-loader" style:--primary={primary} style:--secondary={secondary}></div>
