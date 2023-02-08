import { dismiss, remove, upsert } from './store';
import {
	type Toast,
	type Renderable,
	type IntoRenderable,
	type DefaultToastOptions,
	type ToastOptions,
	type ToastType,
	resolveValue
} from './types';
import { genId } from './utils';

type Message = Renderable;

type ToastHandler = (message: Message, options?: ToastOptions) => string;

const createToast = (message: Message, type: ToastType = 'blank', opts?: ToastOptions): Toast => ({
	createdAt: Date.now(),
	visible: true,
	type,
	ariaProps: {
		role: 'status',
		'aria-live': 'polite'
	},
	message,
	pauseDuration: 0,
	...opts,
	id: opts?.id || genId()
});

const createHandler =
	(type?: ToastType): ToastHandler =>
	(message, options) => {
		const toast = createToast(message, type, options);
		upsert(toast);
		return toast.id;
	};

const toast = (message: Message, opts?: ToastOptions) => createHandler('blank')(message, opts);

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
		success: IntoRenderable<T>;
		error: IntoRenderable<unknown>;
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
