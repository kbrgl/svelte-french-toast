import { get } from 'svelte/store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	add,
	dismiss,
	endPause,
	pausedAt,
	remove,
	startPause,
	toasts,
	update,
	upsert,
	useToasterStore
} from '../../../src/lib/core/store';
import type { Toast } from '../../../src/lib/core/types';

const makeToast = (overrides: Partial<Toast> = {}): Toast => ({
	id: 'toast-id',
	type: 'blank',
	message: 'hello',
	createdAt: Date.now(),
	visible: true,
	pauseDuration: 0,
	ariaProps: {
		role: 'status',
		'aria-live': 'polite'
	},
	...overrides
});

describe('store', () => {
	beforeEach(() => {
		remove();
		pausedAt.set(null);
		vi.useRealTimers();
	});

	afterEach(() => {
		remove();
		pausedAt.set(null);
		vi.clearAllTimers();
		vi.useRealTimers();
	});

	it('adds toasts to the front and keeps at most 20', () => {
		for (let i = 1; i <= 25; i += 1) {
			add(makeToast({ id: i.toString(), message: `toast-${i}` }));
		}

		const current = get(toasts);

		expect(current).toHaveLength(20);
		expect(current[0]?.id).toBe('25');
		expect(current[19]?.id).toBe('6');
	});

	it('upsert updates an existing toast by id', () => {
		add(makeToast({ id: 'a', message: 'first', type: 'success' }));
		upsert(makeToast({ id: 'a', message: 'second', type: 'error' }));

		const current = get(toasts);

		expect(current).toHaveLength(1);
		expect(current[0]).toMatchObject({
			id: 'a',
			type: 'error',
			message: 'second'
		});
	});

	it('dismiss marks a toast invisible and removes it after 1 second', () => {
		vi.useFakeTimers();
		add(makeToast({ id: 'a' }));

		dismiss('a');
		expect(get(toasts)[0]?.visible).toBe(false);

		vi.advanceTimersByTime(999);
		expect(get(toasts)).toHaveLength(1);

		vi.advanceTimersByTime(1);
		expect(get(toasts)).toHaveLength(0);
	});

	it('dismiss without an id hides and removes every toast', () => {
		vi.useFakeTimers();
		add(makeToast({ id: 'a' }));
		add(makeToast({ id: 'b' }));

		dismiss();
		expect(get(toasts).every((toast) => toast.visible === false)).toBe(true);

		vi.runOnlyPendingTimers();
		expect(get(toasts)).toHaveLength(0);
	});

	it('remove without an id clears all toasts immediately', () => {
		add(makeToast({ id: 'a' }));
		add(makeToast({ id: 'b' }));

		remove();

		expect(get(toasts)).toEqual([]);
	});

	it('startPause and endPause apply elapsed pause time', () => {
		add(makeToast({ id: 'a', pauseDuration: 10 }));

		startPause(100);
		endPause(160);

		expect(get(pausedAt)).toBe(null);
		expect(get(toasts)[0]?.pauseDuration).toBe(70);
	});

	it('update patches the existing toast fields', () => {
		add(makeToast({ id: 'a', message: 'before' }));

		update({ id: 'a', message: 'after', className: 'custom' });

		expect(get(toasts)[0]).toMatchObject({
			id: 'a',
			message: 'after',
			className: 'custom'
		});
	});

	it('useToasterStore merges options with type defaults and per-toast overrides', () => {
		add(
			makeToast({
				id: 'a',
				type: 'success',
				style: 'color: red;',
				className: 'toast-class'
			})
		);
		const merged = useToasterStore({
			duration: 5000,
			style: 'padding: 2px;',
			success: {
				duration: 900,
				style: 'font-weight: bold;'
			}
		});

		const toast = get(merged.toasts)[0];

		expect(toast?.duration).toBe(900);
		expect(toast?.className).toBe('toast-class');
		expect(toast?.style).toContain('padding: 2px;');
		expect(toast?.style).toContain('font-weight: bold;');
		expect(toast?.style).toContain('color: red;');
	});

	it('useToasterStore preserves explicit zero duration values', () => {
		add(makeToast({ id: 'a', type: 'success', duration: 0 }));
		const merged = useToasterStore({
			duration: 5000,
			success: {
				duration: 900
			}
		});

		expect(get(merged.toasts)[0]?.duration).toBe(0);
	});
});
