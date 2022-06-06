import { get, writable, type Writable } from 'svelte/store';
import type { DefaultToastOptions, Toast, ToastType } from './types';
import writableDerived from 'svelte-writable-derived';

const TOAST_LIMIT = 20;

interface State {
	toasts: Writable<Toast[]>;
	pausedAt: Writable<number | null>;
}

export const toasts: State['toasts'] = writable([]);
export const pausedAt: State['pausedAt'] = writable(null);

const toastTimeouts = new Map<Toast['id'], ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
	if (toastTimeouts.has(toastId)) {
		return;
	}

	const timeout = setTimeout(() => {
		toastTimeouts.delete(toastId);
		remove(toastId);
	}, 1000);

	toastTimeouts.set(toastId, timeout);
};

const clearFromRemoveQueue = (toastId: string) => {
	const timeout = toastTimeouts.get(toastId);
	if (timeout) {
		clearTimeout(timeout);
	}
};

export function update(toast: Partial<Toast>) {
	if (toast.id) {
		clearFromRemoveQueue(toast.id);
	}
	toasts.update(($toasts) => $toasts.map((t) => (t.id === toast.id ? { ...t, ...toast } : t)));
}

export function add(toast: Toast) {
	toasts.update(($toasts) => [toast, ...$toasts].slice(0, TOAST_LIMIT));
}

export function upsert(toast: Toast) {
	if (get(toasts).find((t) => t.id === toast.id)) {
		update(toast);
	} else {
		add(toast);
	}
}

export function dismiss(toastId?: Toast['id']) {
	toasts.update(($toasts) => {
		if (toastId) {
			addToRemoveQueue(toastId);
		} else {
			$toasts.forEach((toast) => {
				addToRemoveQueue(toast.id);
			});
		}

		return $toasts.map((t) =>
			t.id === toastId || toastId === undefined ? { ...t, visible: false } : t
		);
	});
}

export function remove(toastId?: Toast['id']) {
	toasts.update(($toasts) => {
		if (toastId === undefined) {
			return [];
		}
		return $toasts.filter((t) => t.id !== toastId);
	});
}

export function startPause(time: number) {
	pausedAt.set(time);
}

export function endPause(time: number) {
	let diff: number;

	pausedAt.update(($pausedAt) => {
		diff = time - ($pausedAt || 0);
		return null;
	});

	toasts.update(($toasts) =>
		$toasts.map((t) => ({
			...t,
			pauseDuration: t.pauseDuration + diff
		}))
	);
}

const defaultTimeouts: {
	[key in ToastType]: number;
} = {
	blank: 4000,
	error: 4000,
	success: 2000,
	loading: Infinity,
	custom: 4000
};

export function useToasterStore(toastOptions: DefaultToastOptions = {}): State {
	const mergedToasts = writableDerived(
		toasts,
		($toasts) =>
			$toasts.map((t) => ({
				...toastOptions,
				...toastOptions[t.type],
				...t,
				duration:
					t.duration ||
					toastOptions[t.type]?.duration ||
					toastOptions?.duration ||
					defaultTimeouts[t.type],
				style: [toastOptions.style, toastOptions[t.type]?.style, t.style].join(';')
			})),
		($toasts) => $toasts
	);
	return {
		toasts: mergedToasts,
		pausedAt
	};
}
