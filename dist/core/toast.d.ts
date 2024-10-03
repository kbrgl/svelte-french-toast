import { type Renderable, type DefaultToastOptions, type ToastOptions, type ValueOrFunction } from './types';
type Message<T extends Record<string, any> = Record<string, any>> = Renderable<T>;
type ToastHandler = <T extends Record<string, any> = Record<string, any>>(message: Message<T>, options?: ToastOptions<T>) => string;
declare const toast: {
    <T extends Record<string, any> = Record<string, any>>(message: Message<T>, opts?: ToastOptions<T>): string;
    error: ToastHandler;
    success: ToastHandler;
    loading: ToastHandler;
    custom: ToastHandler;
    dismiss(toastId?: string): void;
    remove(toastId?: string): void;
    promise<T>(promise: Promise<T>, msgs: {
        loading: Renderable;
        success: ValueOrFunction<Renderable, T>;
        error: ValueOrFunction<Renderable, any>;
    }, opts?: DefaultToastOptions): Promise<T>;
};
export default toast;
