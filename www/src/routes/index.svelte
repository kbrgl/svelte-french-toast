<script>
	import Toaster from '../../../src/components/Toaster.svelte';
	import toast from '../../../src/index';

	function copyCommand() {
		const promise = navigator.clipboard.writeText('yarn add svelte-buttered-toast');
		toast.promise(promise, { loading: 'Copying...', success: 'Copied!', error: 'Could not copy' });
	}
</script>

<Toaster />
<div class="bg-gradient-to-b from-orange-100 to-transparent min-h-screen text-stone-700">
	<div class="mx-auto container py-24 text-center flex flex-col items-center">
		<h1 class="font-bold text-5xl">Buttery smooth toasts</h1>
		<p class="mt-5 text-xl font-medium text-stone-500 max-w-prose mx-auto">
			React Hot Toast's smoking hot notifications, now for Svelte.
		</p>
		<div class="block mt-10 bg-white rounded-xl shadow">
			<code class="p-5">yarn add svelte-buttered-toast</code>
			<button class="p-5 border-l font-medium" type="button" on:click={copyCommand}>Copy</button>
		</div>
	</div>
</div>
