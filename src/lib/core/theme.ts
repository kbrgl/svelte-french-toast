import { writable } from 'svelte/store';
import type { Theme, ToastTheme } from './types';

export const theme = writable<Theme>('system');

export const lightTheme: ToastTheme = {
	primary: '#fff',
	secondary: '#363636',
	background: '#fff',
	text: '#333333ff',
	border: 'rgba(24, 24, 24, 0.07)',
	shadow: '0 3px 12px rgba(0,0,0,0.04), 0 2px 7px rgba(0,0,0,0.12)'
};

export const darkTheme: ToastTheme = {
	primary: '#111111',
	secondary: '#f9fafb',
	background: '#1c1c1cfa',
	text: '#f9fafb',
	border: 'rgba(255, 255, 255, 0.02)',
	shadow: '0 3px 12px rgba(0,0,0,0.25), 0 2px 7px rgba(0,0,0,0.35)'
};

export function getSystemTheme(): 'light' | 'dark' {
	if (typeof window === 'undefined') return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function resolveTheme(themeValue: Theme): 'light' | 'dark' {
	return themeValue === 'system' ? getSystemTheme() : themeValue;
}

export function getThemeColors(themeValue: Theme): ToastTheme {
	const resolved = resolveTheme(themeValue);
	return resolved === 'dark' ? darkTheme : lightTheme;
}
