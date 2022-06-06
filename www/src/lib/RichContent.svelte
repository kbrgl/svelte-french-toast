<script lang="ts">
	import type { Toast } from '../../../src';
	import toast_ from '../../../src';

	export let toast: Toast;
</script>

<span>
	Custom and <b>bold</b>
	<button on:click={() => toast_.dismiss(toast.id)}>Dismiss</button>
</span>
