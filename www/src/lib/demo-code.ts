export default `<script>
import { onMount } from 'svelte';
import toast, { Toaster } from 'svelte-buttered-toast';

onMount(() => {
    toast.success("It works!");
})
</script>

<Toaster />`;
