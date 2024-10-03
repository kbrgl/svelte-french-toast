import type { Toast, ToastOptions, ToastPosition } from './types';
declare function calculateOffset(toast: Toast, $toasts: Toast[], opts?: {
    reverseOrder?: boolean;
    gutter?: number;
    defaultPosition?: ToastPosition;
}): number;
export default function useToaster(toastOptions?: ToastOptions): {
    toasts: import("svelte/store").Writable<Toast<Record<string, any>>[]>;
    handlers: {
        startPause(): void;
        endPause(): void;
        updateHeight: (toastId: string, height: number) => void;
        calculateOffset: typeof calculateOffset;
    };
};
export {};
