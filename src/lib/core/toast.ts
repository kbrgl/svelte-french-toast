import { dismiss, remove, upsert } from './store';
import {
	type Toast,
	type Renderable,
	type DefaultToastOptions,
	type ToastOptions,
	type ToastType,
	type ValueOrFunction,
	resolveValue
} from './types';
import { genId } from './utils';

type Message<T extends Record<string, any> = Record<string, any>> = Renderable<T>;

type ToastHandler = <T extends Record<string, any> = Record<string, any>>(
	message: Message<T>,
	options?: ToastOptions<T>
) => string;

const createToast = <T extends Record<string, any> = Record<string, any>>(
	message: Message<T>,
	type: ToastType = 'blank',
	opts?: ToastOptions<T>
): Toast<T> => ({
	createdAt: Date.now(),
	visible: true,
	type,
	ariaProps: {
		role: 'status',
		'aria-live': 'polite'
	},
	message,
	pauseDuration: 0,
	icon: opts?.icon,
	duration: opts?.duration,
	iconTheme: opts?.iconTheme,
	position: opts?.position,
	props: opts?.props,
	id: opts?.id || genId()
});

const createHandler =
	(type?: ToastType): ToastHandler =>
	(message, options) => {
		const toast = createToast(message, type, options);
		upsert(toast);
		return toast.id;
	};

const toast = <T extends Record<string, any> = Record<string, any>>(
	message: Message<T>,
	opts?: ToastOptions<T>
) => createHandler('blank')(message, opts);

toast.error = createHandler('error');
toast.success = createHandler('success');
toast.loading = createHandler('loading');
toast.custom = createHandler('custom');

toast.dismiss = (toastId?: string) => {
	dismiss(toastId);
};

toast.remove = (toastId?: string) => remove(toastId);

toast.promise = <T>(
	promise: Promise<T>,
	msgs: {
		loading: Renderable;
		success: ValueOrFunction<Renderable, T>;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		error: ValueOrFunction<Renderable, any>;
	},
	opts?: DefaultToastOptions
) => {
	//default to Infinity, so that the loading toast will stay until we have resolved the promise
    const id = toast.loading(msgs.loading, { duration: Infinity, 
        ...opts, 
        ...opts?.loading 
    });
    promise
        .then((p) => {
		// remove the toast explicity, instead of reusing the id with success/error toast. With this we don't need to override the opts of toast.loading for toast.success/toast.error
        toast.remove(id)
        toast.success(msgs.success ?? p, {
            ...opts,
            ...opts?.success
        });
        return p;
    })
        .catch((e) => {
        toast.remove(id)
        toast.error(msgs.error ?? e, {
            ...opts,
            ...opts?.error
        });
    });
    return promise;
};

export default toast;
