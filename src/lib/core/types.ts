import type { Component, SvelteComponent } from 'svelte';

export type ToastType = 'success' | 'error' | 'loading' | 'blank' | 'custom';

export type ToastPosition =
	| 'top-left'
	| 'top-center'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right';

export type Theme = 'light' | 'dark' | 'system';

export interface ToastTheme {
	primary: string;
	secondary: string;
	background: string;
	text: string;
	border: string;
	shadow: string;
}

export type Renderable =
	| Component<Record<string, unknown>, Record<string, unknown>, string>
	| typeof SvelteComponent<Record<string, unknown>>
	| string
	| null
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	| Component<any, any, any>;

export interface IconTheme {
	primary: string;
	secondary: string;
}

export type ValueFunction<TValue, TArg> = (arg: TArg) => TValue;
export type ValueOrFunction<TValue, TArg> = TValue | ValueFunction<TValue, TArg>;

const isFunction = <TValue, TArg>(
	valOrFunction: ValueOrFunction<TValue, TArg>
): valOrFunction is ValueFunction<TValue, TArg> => typeof valOrFunction === 'function';

export const resolveValue = <TValue, TArg>(
	valOrFunction: ValueOrFunction<TValue, TArg>,
	arg: TArg
): TValue => (isFunction(valOrFunction) ? valOrFunction(arg) : valOrFunction);

export interface Toast {
	type: ToastType;
	id: string;
	message: Renderable;
	icon?: Renderable;
	duration?: number;
	pauseDuration: number;
	position?: ToastPosition;
	props?: Record<string, unknown>;
	ariaProps: {
		role: 'status' | 'alert';
		'aria-live': 'assertive' | 'off' | 'polite';
	};

	className?: string;
	style?: string;
	iconTheme?: IconTheme;
	unstyled?: boolean;

	createdAt: number;
	visible: boolean;
	height?: number;
}

export type DOMToast = Toast & {
	offset: number;
};

export type ToastOptions = Partial<
	Pick<
		Toast,
		| 'id'
		| 'icon'
		| 'duration'
		| 'ariaProps'
		| 'className'
		| 'style'
		| 'position'
		| 'iconTheme'
		| 'props'
		| 'unstyled'
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
	theme?: Theme;
	visibleToasts?: number;
}
