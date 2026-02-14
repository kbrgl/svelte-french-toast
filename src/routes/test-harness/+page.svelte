<script lang="ts">
	import toast, { Toaster } from '$lib';

	const longDuration = 10_000;

	function triggerSuccess() {
		toast.success('Success toast', { duration: longDuration });
	}

	function triggerError() {
		toast.error('Error toast', { duration: longDuration });
	}

	function triggerAutoDismiss() {
		toast.success('Auto dismiss toast', { duration: 250 });
	}

	function triggerPromiseSuccess() {
		toast.promise(
			new Promise<string>((resolve) => {
				setTimeout(() => resolve('ok'), 150);
			}),
			{
				loading: 'Promise loading',
				success: (value: string) => `Promise success: ${value}`,
				error: (err: unknown) =>
					`Promise error: ${err instanceof Error ? err.message : String(err)}`
			},
			{
				success: { duration: longDuration },
				error: { duration: longDuration }
			}
		);
	}

	function triggerPromiseError() {
		toast.promise(
			new Promise<string>((_, reject) => {
				setTimeout(() => reject(new Error('fail')), 150);
			}),
			{
				loading: 'Promise loading',
				success: (value: string) => `Promise success: ${value}`,
				error: (err: unknown) =>
					`Promise error: ${err instanceof Error ? err.message : String(err)}`
			},
			{
				success: { duration: longDuration },
				error: { duration: longDuration }
			}
		);
	}

	function dismissAll() {
		toast.dismiss();
	}

	function removeAll() {
		toast.remove();
	}
</script>

<Toaster />

<main>
	<h1>Toast Test Harness</h1>

	<div class="actions">
		<button type="button" onclick={triggerSuccess}>Trigger success</button>
		<button type="button" onclick={triggerError}>Trigger error</button>
		<button type="button" onclick={triggerAutoDismiss}>Trigger auto dismiss</button>
		<button type="button" onclick={triggerPromiseSuccess}>Trigger promise success</button>
		<button type="button" onclick={triggerPromiseError}>Trigger promise error</button>
		<button type="button" onclick={dismissAll}>Dismiss all</button>
		<button type="button" onclick={removeAll}>Remove all</button>
	</div>
</main>

<style>
	main {
		display: grid;
		gap: 1rem;
		padding: 2rem;
	}

	.actions {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, max-content));
		gap: 0.75rem;
	}

	button {
		width: fit-content;
		padding: 0.6rem 0.9rem;
		border-radius: 0.5rem;
		border: 1px solid #ddd;
		background: #fff;
		cursor: pointer;
	}
</style>
