import { describe, expect, it } from 'vitest';
import { resolveValue } from '../../../src/lib/core/types';

describe('resolveValue', () => {
	it('returns direct values as-is', () => {
		expect(resolveValue('plain-text', 'ignored')).toBe('plain-text');
	});

	it('calls a value function with its argument', () => {
		expect(resolveValue((name: string) => `hello ${name}`, 'toast')).toBe('hello toast');
	});
});
