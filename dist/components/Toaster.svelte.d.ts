import type { ToastOptions, ToastPosition } from '../core/types';
declare const Toaster: import("svelte").Component<{
    reverseOrder?: boolean;
    toastOptions?: ToastOptions;
    position?: ToastPosition;
    gutter?: number;
    containerStyle?: string;
    containerClassName?: string;
}, {}, "">;
export default Toaster;
