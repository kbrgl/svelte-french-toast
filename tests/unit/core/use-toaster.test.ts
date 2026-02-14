import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { add, pausedAt, remove } from '../../../src/lib/core/store';
import toast from '../../../src/lib/core/toast';
import type { Toast } from '../../../src/lib/core/types';

const destroyCallbacks: Array<() => void> = [];

vi.mock('svelte', () => ({
	onDestroy: (callback: () => void) => {
		destroyCallbacks.push(callback);
	}
}));

import useToaster from '../../../src/lib/core/use-toaster';

const makeToast = (overrides: Partial<Toast> = {}): Toast => ({
	id: 'toast-id',
	type: 'blank',
	message: 'hello',
	createdAt: Date.now(),
	visible: true,
	pauseDuration: 0,
	duration: 1000,
	ariaProps: {
		role: 'status',
		'aria-live': 'polite'
	},
	...overrides
});

describe('useToaster', () => {
	beforeEach(() => {
		remove();
		pausedAt.set(null);
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	afterEach(() => {
		while (destroyCallbacks.length > 0) {
			const callback = destroyCallbacks.pop();
			callback?.();
		}
		remove();
		pausedAt.set(null);
		vi.clearAllTimers();
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it('dismisses toasts immediately when their duration already elapsed', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-01-01T00:00:10.000Z'));
		const dismissSpy = vi.spyOn(toast, 'dismiss');

		useToaster();
		add(makeToast({ id: 'expired', createdAt: Date.now() - 1500, duration: 1000 }));

		expect(dismissSpy).toHaveBeenCalledWith('expired');
	});

	it('schedules dismissal for finite durations', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
		const dismissSpy = vi.spyOn(toast, 'dismiss');

		useToaster();
		add(makeToast({ id: 'finite', duration: 1000 }));

		vi.advanceTimersByTime(999);
		expect(dismissSpy).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1);
		expect(dismissSpy).toHaveBeenCalledWith('finite');
	});

	it('does not schedule dismissals for infinite durations', () => {
		vi.useFakeTimers();
		const dismissSpy = vi.spyOn(toast, 'dismiss');

		useToaster();
		add(makeToast({ id: 'infinite', type: 'loading', duration: Infinity }));

		vi.advanceTimersByTime(60_000);
		expect(dismissSpy).not.toHaveBeenCalled();
	});

	it('pauses and resumes dismissal timers', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
		const dismissSpy = vi.spyOn(toast, 'dismiss');
		const { handlers } = useToaster();

		add(makeToast({ id: 'paused', duration: 1000 }));

		vi.advanceTimersByTime(500);
		handlers.startPause();
		vi.advanceTimersByTime(2000);
		expect(dismissSpy).not.toHaveBeenCalled();

		handlers.endPause();
		vi.advanceTimersByTime(499);
		expect(dismissSpy).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1);
		expect(dismissSpy).toHaveBeenCalledWith('paused');
	});

	it('calculates offsets by position, visibility, gutter, and order', () => {
		const { handlers } = useToaster();
		const toastA = makeToast({ id: 'a', height: 10, visible: true, position: 'top-center' });
		const toastB = makeToast({ id: 'b', height: 20, visible: true, position: 'top-center' });
		const toastC = makeToast({ id: 'c', height: 30, visible: false, position: 'top-center' });
		const toastD = makeToast({ id: 'd', height: 40, visible: true, position: 'bottom-center' });
		const allToasts = [toastA, toastB, toastC, toastD];

		expect(
			handlers.calculateOffset(toastA, allToasts, { gutter: 8, defaultPosition: 'top-center' })
		).toBe(0);
		expect(
			handlers.calculateOffset(toastB, allToasts, { gutter: 8, defaultPosition: 'top-center' })
		).toBe(18);
		expect(
			handlers.calculateOffset(toastA, allToasts, {
				gutter: 8,
				reverseOrder: true,
				defaultPosition: 'top-center'
			})
		).toBe(28);
	});
});
