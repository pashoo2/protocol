import { MaybeError, IResolvable, IRejectable } from './common.types';

export interface IPromisePending<T> extends Promise<T>, IResolvable<T> {}

export interface IPromiseRejectable<T, E extends MaybeError> extends Promise<T>, IRejectable<E> {}

export interface IPromisePendingRejectable<T, E extends MaybeError> extends IPromisePending<T>, IPromiseRejectable<T, E> {}

export interface ICustomPromiseDescription<T, E extends MaybeError> extends IRejectable<E>, IResolvable<T> {
  promise: Promise<T>;
}

export interface ICustomPromiseCreator<T, E extends MaybeError> {
  (): ICustomPromiseDescription<T, E>;
}

export interface IPromisePendingRejectableCreator<T, E extends MaybeError> {
  (): IPromisePendingRejectable<T, E>;
}

export type PromiseResolveType<P extends Promise<unknown>> = P extends Promise<infer T> ? T : never;

/**
 * Promise which can be cancelled from outside
 * of it.
 *
 * @export
 * @interface IPromiseCancellable
 * @extends {(Promise<T | E>)}
 * @template T
 * @template E
 */
export interface IPromiseCancellable<T, E extends Error = Error> extends Promise<T | E> {
  /**
   * Cancells the promise with error provided
   * or a default error.
   *
   * @param {E} error - error with which the promise will be resolved
   * @memberof IPromiseCancellable
   */
  cancel(error?: E): void;
}
