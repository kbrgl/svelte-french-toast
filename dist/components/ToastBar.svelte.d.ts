import { SvelteComponent } from "svelte";
import type { Toast, ToastPosition } from '../core/types';
declare const ToastBar: import("svelte").Component<{
    toast: Toast;
    position: ToastPosition | undefined;
    style?: string;
    Component?: typeof SvelteComponent | undefined;
}, {}, "">;
export default ToastBar;
