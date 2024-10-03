import { dismiss, remove, upsert } from './store';
import { resolveValue } from './types';
import { genId } from './utils';
const createToast = (message, type = 'blank', opts) => ({
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
const createHandler = (type) => (message, options) => {
    const toast = createToast(message, type, options);
    upsert(toast);
    return toast.id;
};
const toast = (message, opts) => createHandler('blank')(message, opts);
toast.error = createHandler('error');
toast.success = createHandler('success');
toast.loading = createHandler('loading');
toast.custom = createHandler('custom');
toast.dismiss = (toastId) => {
    dismiss(toastId);
};
toast.remove = (toastId) => remove(toastId);
toast.promise = (promise, msgs, opts) => {
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
