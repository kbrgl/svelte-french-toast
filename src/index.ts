import toast from './core/toast';
// Type re-export workaround, to stay compatible with TS 3.7 and lower
import type {
	ToastOptions as _ToastOptions,
	ToastPosition as _ToastPosition,
	Toast as _Toast,
	Renderable as _Renderable,
	ValueOrFunction as _ValueOrFunction,
	ToasterProps as _ToasterProps,
	DefaultToastOptions as _DefaultToastOptions,
	IconTheme as _IconTheme,
	ToastType as _ToastType,
	ValueFunction as _ValueFunction
} from './core/types';

export { default as useToaster } from './core/use-toaster';
export { useToasterStore } from './core/store';
export { default as ToastBar } from './components/ToastBar.svelte';
export { default as ToastIcon } from './components/ToastIcon.svelte';
export { default as Toaster } from './components/Toaster.svelte';
export { default as CheckmarkIcon } from './components/CheckmarkIcon.svelte';
export { default as ErrorIcon } from './components/ErrorIcon.svelte';
export { default as LoaderIcon } from './components/LoaderIcon.svelte';
export { resolveValue } from './core/types';

export type ToastOptions = _ToastOptions;
export type ToastPosition = _ToastPosition;
export type Toast = _Toast;
export type Renderable = _Renderable;
export type ValueOrFunction<TValue, TArg> = _ValueOrFunction<TValue, TArg>;
export type ToasterProps = _ToasterProps;
export type DefaultToastOptions = _DefaultToastOptions;
export type IconTheme = _IconTheme;
export type ToastType = _ToastType;
export type ValueFunction<TArg, TValue> = _ValueFunction<TArg, TValue>;

export { toast };
export default toast;
