import { IPromisePendingRejectable } from 'types/promise.types';
import { MaybeError } from 'types/common.types';

export interface IJobResolveCallback<T> {
  (v: T): unknown;
}

export interface IJobResolver<T> {
  done: IJobResolveCallback<T>;
}

export interface IJobPromise<T, E extends MaybeError> extends IPromisePendingRejectable<T, E> {}

export interface IAsyncQueueConcurent<T, E extends MaybeError> {
  /**
   * Wait till all previous jobs will be done
   *
   * @returns {Promise<IJobResolver>}
   * @memberof IAsyncQueueConcurent
   */
  wait(): Promise<IJobResolver<T>>;
  /**
   * Destroy and fail all pending promise
   *
   * @param {E} err
   * @returns {Promise<void>}
   * @memberof IAsyncQueueConcurent
   */
  destroy(err: E): Promise<void>;
}