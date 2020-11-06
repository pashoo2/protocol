import { MaybeError } from 'types/common.types';
import {
  IPromisePendingRejectable,
  IPromisePending,
  IPromiseRejectable,
  ICustomPromiseDescription,
  ICustomPromiseCreator,
  IPromisePendingRejectableCreator,
} from 'types/promise.types';

export const createCustomPromise = <T, E extends MaybeError = void>(): ICustomPromiseDescription<T, E> => {
  let resolve: ((v: T) => void) | undefined = undefined;
  let reject: ((err: E) => void) | undefined = undefined;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  if (!resolve) {
    throw new Error('Failed to create a work promise resolver function');
  }
  if (!reject) {
    throw new Error('Failed to create a work promise rejector function');
  }
  return {
    resolve,
    reject,
    promise,
  };
};

/**
 * Create promise can be rejected or resolved from the outside
 *
 * @template T
 * @param {ICustomPromiseCreator<T>} [customPromiseCreator=createCustomPromise]
 * @returns {IPromisePendingRejectable<T>}
 */
export const createPromisePendingRejectable = <T, E extends MaybeError = void>(
  customPromiseCreator: ICustomPromiseCreator<T, E> = createCustomPromise
): IPromisePendingRejectable<T, E> => {
  const { promise, resolve, reject } = customPromiseCreator();
  ((promise as unknown) as IPromisePending<T>).resolve = resolve;
  ((promise as unknown) as IPromiseRejectable<T, E>).reject = reject;
  return promise as IPromisePendingRejectable<T, E>;
};

/**
 * Creates promise in the pending state
 * with a sprecial resolve mothod
 *
 *
 * @template T
 * @param {IPromisePendingRejectableCreator} [promisePendingRejectableCreator=createPromisePendingRejectable]
 * @returns {IPromisePending<T>}
 */
export const createPromisePending = <T, E extends MaybeError = void>(
  promisePendingRejectableCreator: IPromisePendingRejectableCreator<T, E> = createPromisePendingRejectable
): IPromisePending<T> => {
  return promisePendingRejectableCreator();
};

/**
 * Resolves promise pending with a value passed
 * in the arguments.
 *
 * @template T
 * @param {IPromisePending<T>} promisePending
 * @param {T} value
 */
export const resolvePromisePending = <T>(promisePending: IPromisePending<T>, value: T): void => {
  promisePending.resolve(value);
};