export interface IAsyncQueueBaseClassOptions {
  /**
   * a number of promises in one batch
   *
   * @type {number}
   * @memberof IAsyncQueueBaseClassOptions
   */
  batchSize: number;
  /**
   * timeout for a one batch
   *
   * @type {number}
   * @memberof IAsyncQueueBaseClassOptions
   */
  promiseTimeout: number;
  /**
   * a delay between executing of a two batches
   *
   * @type {number}
   * @memberof IAsyncQueueBaseClassOptions
   */
  delayMs: number;
}

export type TAsyncQueueBaseClassPromiseProvider<T> = () => Promise<T>;

export type TAsyncQueueBaseClassPromiseProviderBatch<T> = TAsyncQueueBaseClassPromiseProvider<T>[];

export type TAsyncQueueBaseClassPromiseProviderPending<T> = TAsyncQueueBaseClassPromiseProvider<T> | TAsyncQueueBaseClassPromiseProviderBatch<T>;

export interface IAsyncQueueBaseClass {
  /**
   * resolve promises provided in queue
   *
   * @template T
   * @param {Promise<T>[]} pending
   * @returns {(Promise<T | Error>)}
   * @memberof IAsyncQueueBaseClass
   */
  do<T>(pending: TAsyncQueueBaseClassPromiseProviderBatch<T>): Promise<Array<T | Error> | Error>;
  do<T>(pending: TAsyncQueueBaseClassPromiseProvider<T>): Promise<T | Error>;
}

export abstract class TAsyncQueueBaseClass implements IAsyncQueueBaseClass {
  /**
   * queue of promises pending
   *
   * @protected
   * @abstract
   * @type {(Promise<any>[] | void)}
   * @memberof TAsyncQueueBaseClass
   */
  protected abstract queue: TAsyncQueueBaseClassPromiseProvider<any>[];

  /**
   * the currently executing batch of a promises
   *
   * @protected
   * @abstract
   * @type {(Promise<any>[] | void)}
   * @memberof TAsyncQueueBaseClass
   */
  protected abstract batch: Promise<any[]> | void;

  constructor(protected options: IAsyncQueueBaseClassOptions) {}

  public abstract async do<T>(pending: TAsyncQueueBaseClassPromiseProviderPending<T>): Promise<T | Error | Array<T | Error>>;
}
