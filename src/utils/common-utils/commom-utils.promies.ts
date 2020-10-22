export interface IPromisePending<T> extends Promise<T> {
  resolve: (value: T) => void;
}
/**
 * Creates promise in the pending state
 * with a sprecial resolve mothod
 *
 * @returns {IPromisePending}
 */
export const createPromisePending = <T>(): IPromisePending<T> => {
  let resolvePromise: ((v: T) => void) | undefined = undefined;
  const promisePending = new Promise<T>((res) => {
    resolvePromise = res;
  });
  if (!resolvePromise) {
    throw new Error('failed to get a resolve function');
  }
  debugger;
  (promisePending as IPromisePending<T>).resolve = resolvePromise;
  return promisePending as IPromisePending<T>;
};

/**
 * Resolves promise pending with a value passed
 * in the arguments.
 *
 * @template T
 * @param {IPromisePending<T>} promisePending
 * @param {T} value
 */
export const resolvePromisePending = <T>(
  promisePending: IPromisePending<T>,
  value: T
): void => {
  promisePending.resolve(value);
};
