import { type Writable } from 'svelte/store';
import type { DefaultToastOptions, Toast } from './types';
interface State {
    toasts: Writable<Toast[]>;
    pausedAt: Writable<number | null>;
}
export declare const toasts: State['toasts'];
export declare const pausedAt: State['pausedAt'];
export declare function update(toast: Partial<Toast>): void;
export declare function add(toast: Toast): void;
export declare function upsert(toast: Toast): void;
export declare function dismiss(toastId?: Toast['id']): void;
export declare function remove(toastId?: Toast['id']): void;
export declare function startPause(time: number): void;
export declare function endPause(time: number): void;
export declare function useToasterStore(toastOptions?: DefaultToastOptions): State;
export {};
