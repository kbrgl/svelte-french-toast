import type toast from '$lib';
import type { test } from '@playwright/experimental-ct-svelte';

export type Mount = Parameters<Parameters<typeof test>[1]>['0']['mount'];
export type ToastProps = Parameters<typeof toast>;
