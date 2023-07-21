<script lang="ts">
	import toast_, { type Toast } from '../lib';

	export let toast: Toast;
	export let someProp: string;
</script>

<span>
	Custom and <b>bold</b> with props like {someProp}!
	<button on:click={() => toast_.dismiss(toast.id)}>Dismiss</button>
</span>
