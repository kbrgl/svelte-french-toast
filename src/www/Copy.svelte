<script lang="ts">
	import toast from '../lib';

	function copy(text: string) {
		const promise = navigator.clipboard.writeText(text);
		toast.promise(promise, { loading: 'Copying...', success: 'Copied!', error: 'Could not copy' });
	}

	export let text: string;
</script>

<button
	type="button"
	class="text-sm mt-2 text-blue-600 font-medium space-x-1 flex items-center"
	on:click={() => copy(text)}
>
	<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
		<path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
		<path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
	</svg>
	<span>Copy</span>
</button>
