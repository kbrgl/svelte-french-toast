<script lang="ts">
	import toast_, { type Toast } from '../lib';

	export let toast: Toast;
	export let someProp: string;
</script>

<span
	class="inline-flex justify-between items-center w-full py-2 bg-white border border-neutral-200 rounded-lg shadow-sm px-3"
>
	<span class="font-normal">
		Custom and <b class="font-semibold">bold</b> with props like {someProp}!
	</span>
	<button
		on:click={() => toast_.dismiss(toast.id)}
		class="ml-2 px-2 py-1 rounded-full bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all shadow-sm"
	>
		Remove
	</button>
</span>
