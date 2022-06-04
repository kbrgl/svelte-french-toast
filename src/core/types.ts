import type { SvelteComponent } from 'svelte';

export type ToastType = 'success' | 'error' | 'loading' | 'blank' | 'custom';
export type ToastPosition =
	| 'top-left'
	| 'top-center'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right';

export type Renderable = SvelteComponent | string | null;

export interface IconTheme {
	primary: string;
	secondary: string;
}

export interface Toast {
	type: ToastType;
	id: string;
	message: Renderable;
	icon?: Renderable;
	duration?: number;
	pauseDuration: number;
	position?: ToastPosition;

	ariaProps: {
		role: 'status' | 'alert';
		'aria-live': 'assertive' | 'off' | 'polite';
	};

	style?: CSSProperties;
	className?: string;
	iconTheme?: IconTheme;

	createdAt: number;
	visible: boolean;
	height?: number;
}

export type ToastOptions = Partial<
	Pick<
		Toast,
		'id' | 'icon' | 'duration' | 'ariaProps' | 'className' | 'style' | 'position' | 'iconTheme'
	>
>;

export type DefaultToastOptions = ToastOptions & {
	[key in ToastType]?: ToastOptions;
};

export interface ToasterProps {
	position?: ToastPosition;
	toastOptions?: DefaultToastOptions;
	reverseOrder?: boolean;
	gutter?: number;
	containerStyle?: string;
	containerClassName?: string;
}
