import { get } from 'svelte/store';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { remove, toasts } from '../../../src/lib/core/store';
import toast from '../../../src/lib/core/toast';

describe('toast API', () => {
	beforeEach(() => {
		remove();
	});

	afterEach(() => {
		remove();
	});

	it('creates a blank toast with defaults', () => {
		const id = toast('Hello');
		const current = get(toasts);

		expect(current).toHaveLength(1);
		expect(current[0]).toMatchObject({
			id,
			type: 'blank',
			message: 'Hello',
			visible: true,
			ariaProps: {
				role: 'status',
				'aria-live': 'polite'
			}
		});
	});

	it('creates typed toasts through helper methods', () => {
		toast.success('ok');
		toast.error('nope');
		toast.loading('working');
		toast.custom('custom');

		expect(get(toasts).map((t) => t.type)).toEqual(['custom', 'loading', 'error', 'success']);
	});

	it('reuses the same id via upsert semantics', () => {
		toast.success('first', { id: 'fixed' });
		toast.error('second', { id: 'fixed' });
		const current = get(toasts);

		expect(current).toHaveLength(1);
		expect(current[0]).toMatchObject({
			id: 'fixed',
			type: 'error',
			message: 'second'
		});
	});

	it('dismiss and remove proxy store behavior', () => {
		const id = toast('will-dismiss');
		toast.dismiss(id);

		expect(get(toasts)[0]?.visible).toBe(false);

		toast.remove(id);
		expect(get(toasts)).toEqual([]);
	});

	it('toast.promise updates the loading toast to success and resolves original value', async () => {
		const resultPromise = Promise.resolve('done');
		const returned = toast.promise(
			resultPromise,
			{
				loading: 'Loading...',
				success: (value: string) => `Success: ${value}`,
				error: (err: unknown) => `Error: ${String(err)}`
			},
			{
				loading: { duration: Infinity },
				success: { duration: 5000 }
			}
		);

		const loading = get(toasts)[0];
		expect(loading).toMatchObject({
			type: 'loading',
			message: 'Loading...'
		});

		await expect(returned).resolves.toBe('done');
		await Promise.resolve();

		const updated = get(toasts)[0];
		expect(updated?.id).toBe(loading?.id);
		expect(updated?.type).toBe('success');
		expect(updated?.message).toBe('Success: done');
		expect(updated?.duration).toBe(5000);
	});

	it('toast.promise updates the loading toast to error when promise rejects', async () => {
		const error = new Error('boom');
		const resultPromise = Promise.reject(error);
		const returned = toast.promise(resultPromise, {
			loading: 'Loading...',
			success: 'Done',
			error: (err: unknown) => `Error: ${err instanceof Error ? err.message : String(err)}`
		});

		await expect(returned).rejects.toThrow('boom');
		await Promise.resolve();

		const updated = get(toasts)[0];
		expect(updated?.type).toBe('error');
		expect(updated?.message).toBe('Error: boom');
	});
});
