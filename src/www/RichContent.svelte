<script lang="ts">
	import toast_, { type Toast } from '../lib';

	interface Props {
		toast: Toast;
		someProp: string;
	}

	let { toast, someProp }: Props = $props();
</script>

<span>
	Custom and <b>bold</b> with props like {someProp}!
	<button onclick={() => toast_.dismiss(toast.id)}>Dismiss</button>
</span>
