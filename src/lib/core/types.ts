import type { SvelteComponent } from 'svelte';

export type ToastType = 'success' | 'error' | 'loading' | 'blank' | 'custom';
/** Specifies the toast's position on the screen
 *
 * Logical positions (`start`, `end`) are recommended over absolute positions
 * (`left`, `right`), as they automatically adjust based on the text direction
 * of the locale (LTR or RTL). Examples:
 * - Use `top-start` instead of `top-left`.
 * - Use `top-end` instead of `top-right`. */
export type ToastPosition =
	| 'top-left'
	| 'top-center'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right'
	| 'top-start'
	| 'top-end'
	| 'bottom-start'
	| 'bottom-end';

export type Renderable<T extends Record<string, unknown> = Record<string, unknown>> =
	| typeof SvelteComponent<T>
	| string
	| null;

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

export interface Toast<T extends Record<string, unknown> = Record<string, unknown>> {
	type: ToastType;
	id: string;
	message: Renderable<T>;
	icon?: Renderable;
	duration?: number;
	pauseDuration: number;
	position?: ToastPosition;

	// We use `Omit` here in the case that the Component has `export let toast: Toast`.
	// We are already passing the toast to the component, and it should not be included in props.
	props?: Omit<T, 'toast'>;

	ariaProps: {
		role: 'status' | 'alert';
		'aria-live': 'assertive' | 'off' | 'polite';
	};

	style?: string;
	className?: string;
	iconTheme?: IconTheme;

	createdAt: number;
	visible: boolean;
	height?: number;
}

export type DOMToast<T extends Record<string, unknown> = Record<string, unknown>> = Toast<T> & {
	offset: number;
};

export type ToastOptions<T extends Record<string, unknown> = Record<string, unknown>> = Partial<
	Pick<
		Toast<T>,
		| 'id'
		| 'icon'
		| 'duration'
		| 'ariaProps'
		| 'className'
		| 'style'
		| 'position'
		| 'iconTheme'
		| 'props'
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
