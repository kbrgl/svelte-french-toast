import { useToasterStore } from './store';
import type { ToastOptions } from './types';

export function useToaster(toastOptions?: ToastOptions) {
	const { toasts, pausedAt } = useToasterStore(toastOptions);

	let _toasts;
	toasts.subscribe((toasts) => (_toasts = toasts));

	const handlers = {
		startPause() {
			pausedAt.set(Date.now());
		},
		endPause() {
			pausedAt.update((prevPausedAt) => {
				if (!prevPausedAt) {
					return null;
				}
			});
		},
		calculateOffset(
			toast: Toast,
			opts?: {
				reverseOrder?: boolean;
				gutter?: number;
				defaultPosition?: ToastPosition;
			}
		) {
			const { reverseOrder, gutter, defaultPosition } = opts || {};

			const relevantToasts = _toasts.filter(
				(t) => (t.position || defaultPosition) === (toast.position || defaultPosition) && t.height
			);
			const toastIndex = relevantToasts.findIndex((t) => t.id === toast.id);
			const toastsBefore = relevantToasts.filter(
				(toast, i) => i < toastIndex && toast.visible
			).length;

			const offset = relevantToasts
				.filter((t) => t.visible)
				.slice(...(reverseOrder ? [toastsBefore + 1] : [0, toastsBefore]))
				.reduce((acc, t) => acc + (t.height || 0) + gutter, 0);

			return offset;
		}
	};

	return { toasts, handlers };
}
