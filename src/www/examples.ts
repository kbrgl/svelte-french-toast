import toast from '../lib';
import RichContent from './RichContent.svelte';

export interface Example {
	title: string;
	action: () => void;
	emoji: string;
	snippet: string;
	html?: boolean;
}

const examples: Example[] = [
	{
		title: 'Success',
		emoji: '✅',
		snippet: "toast.success('Successfully toasted!')",
		action: () => {
			toast.success('Successfully toasted!');
		}
	},
	{
		title: 'Error',
		emoji: '❌',
		snippet: `toast.error("This didn't work.")`,

		action: () => {
			toast.error("This didn't work.");
		}
	},
	{
		title: 'Promise',
		emoji: '⏳',
		snippet: `toast.promise(
	saveSettings(settings),
	{
		loading: 'Saving...',
		success: 'Settings saved!',
		error: 'Could not save.',
	}
);`,
		action: () => {
			const promise = new Promise((resolve, reject) => {
				setTimeout(Math.random() < 0.8 ? resolve : reject, 1000);
			});

			toast.promise(promise, {
				loading: 'Saving...',
				success: `Settings saved!`,
				error: `Could not save.`
			});
		}
	},
	{
		title: 'Multiline',
		emoji: '↩️',
		snippet: `toast(
	"This toast is super big. I don't think anyone could eat it in one bite.\\n\\nIt's larger than you expected. You eat it but it does not seem to get smaller.",
	{
		duration: 6000,
	}
);`,
		action: () => {
			toast(
				"This toast is super big. I don't think anyone could eat it in one bite.\n\n It's larger than you expected. You eat it but it does not seem to get smaller.",
				{
					duration: 6000
				}
			);
		}
	},
	{
		title: 'Emoji',
		emoji: '👏',
		snippet: `toast('Good Job!', {
	icon: '👏',
});`,
		action: () => {
			toast('Good Job!', {
				icon: '👏'
			});
		}
	},
	{
		title: 'Dark mode',
		emoji: '🌚',
		snippet: `toast('Hello Darkness!', {
	icon: '👏',
	style: 'border-radius: 200px; background: #333; color: #fff;'
});`,
		action: () => {
			toast('Hello Darkness!', {
				icon: '👏',
				style: 'border-radius: 200px; background: #333; color: #fff;'
			});
		}
	},
	{
		title: 'Rich content',
		emoji: '🔩',
		snippet: `<script>
	import toast_ from 'svelte-french-toast';

	export let toast;

	// Use this component in your app:
	// toast(RichContent, { props: { someProp: '⭐' }})
</script>

<script>
	export let someProp;
</script>
<span>
	Custom and <b>bold</b> with props like {someProp}!
	<button on:click={() => toast_.dismiss(toast.id)}>Dismiss</button>
</span>`,
		html: true,
		action: () => {
			toast(RichContent, { props: { someProp: '⭐' } });
		}
	},
	{
		title: 'Themed',
		emoji: '🎨',
		snippet: `toast.success('Look at me!', {
	style: 'border: 1px solid #713200; padding: 16px; color: #713200;',
	iconTheme: {
		primary: '#713200',
		secondary: '#FFFAEE'
	}
});`,

		action: () => {
			toast.success('Look at me!', {
				style: 'border: 1px solid #713200; padding: 16px; color: #713200;',
				iconTheme: {
					primary: '#713200',
					secondary: '#FFFAEE'
				}
			});
		}
	},
	{
		title: 'Positioning',
		emoji: '⬆️',
		snippet: `toast.success('Always at the bottom.', {
	position: "bottom-center"
})`,
		action: () => {
			toast.success('Always at the bottom.', {
				position: 'bottom-center',
				duration: 10000
			});
		}
	}
];

export default examples;
