import type { SvelteComponent } from 'svelte';
export type ToastType = 'success' | 'error' | 'loading' | 'blank' | 'custom';
/** Specifies the toast's position on the screen
 *
 * Logical positions (`start`, `end`) are recommended over absolute positions
 * (`left`, `right`), as they automatically adjust based on the text direction
 * of the locale (LTR or RTL). Examples:
 * - Use `top-start` instead of `top-left`.
 * - Use `top-end` instead of `top-right`. */
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
export type Renderable<T extends Record<string, any> = Record<string, any>> = typeof SvelteComponent<T> | string | null;
export interface IconTheme {
    primary: string;
    secondary: string;
}
export type ValueFunction<TValue, TArg> = (arg: TArg) => TValue;
export type ValueOrFunction<TValue, TArg> = TValue | ValueFunction<TValue, TArg>;
export declare const resolveValue: <TValue, TArg>(valOrFunction: ValueOrFunction<TValue, TArg>, arg: TArg) => TValue;
export interface Toast<T extends Record<string, any> = Record<string, any>> {
    type: ToastType;
    id: string;
    message: Renderable<T>;
    icon?: Renderable;
    duration?: number;
    pauseDuration: number;
    position?: ToastPosition;
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
export type DOMToast<T extends Record<string, any> = Record<string, any>> = Toast<T> & {
    offset: number;
};
export type ToastOptions<T extends Record<string, any> = Record<string, any>> = Partial<Pick<Toast<T>, 'id' | 'icon' | 'duration' | 'ariaProps' | 'className' | 'style' | 'position' | 'iconTheme' | 'props'>>;
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
