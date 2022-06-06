import { dismiss, remove, upsert } from './store';
import {
	type Toast,
	type Renderable,
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
		success: Renderable;
		error: Renderable;
	},
	opts?: DefaultToastOptions
) => {
	const id = toast.loading(msgs.loading, { ...opts, ...opts?.loading });

	promise
		.then((p) => {
			toast.success(resolveValue(msgs.success, p), {
				id,
				...opts,
				...opts?.success
			});
			return p;
		})
		.catch((e) => {
			toast.error(resolveValue(msgs.error, e), {
				id,
				...opts,
				...opts?.error
			});
		});

	return promise;
};

export default toast;
