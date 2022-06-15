<script lang="ts">
	import toast_, { type Toast } from '../lib';

	export let toast: Toast;
</script>

<span>
	Custom and <b>bold</b>
	<button on:click={() => toast_.dismiss(toast.id)}>Dismiss</button>
</span>
