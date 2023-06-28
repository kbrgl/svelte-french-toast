<script lang="ts">
	import { onMount } from 'svelte';
	import Toaster from '../../../src/lib/components/Toaster.svelte';
	import toast from '../../../src/lib/core/toast';
	import type { ToastProps } from './types';

	export let toastProps: ToastProps;

	onMount(() => {
		toast(toastProps[0], toastProps[1]);
	});
</script>

<Toaster />
