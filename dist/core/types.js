const isFunction = (valOrFunction) => typeof valOrFunction === 'function';
export const resolveValue = (valOrFunction, arg) => (isFunction(valOrFunction) ? valOrFunction(arg) : valOrFunction);
