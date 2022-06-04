import { endPause as _endPause, startPause as _startPause, useToasterStore } from './store';
import type { Toast, ToastOptions, ToastPosition } from './types';

export function useToaster(toastOptions?: ToastOptions) {
	const { toasts } = useToasterStore(toastOptions);

	const handlers = {
		startPause() {
			_startPause(Date.now());
		},
		endPause() {
			_endPause(Date.now());
		},
		calculateOffset(
			toast: Toast,
			toasts: Toast[],
			opts?: {
				reverseOrder?: boolean;
				gutter?: number;
				defaultPosition?: ToastPosition;
			}
		) {
			const { reverseOrder, gutter = 8, defaultPosition } = opts || {};

			const relevantToasts = toasts.filter(
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
