import { ASYNC_QUEUE_BASE_CLASS_OPTIONS } from './async-queue-class-base.const';
import { extend, delay } from 'utils';
import { TAsyncQueueBaseClassPromiseProviderPending, TAsyncQueueBaseClassPromiseProvider } from './async-queue-class-base.types';
import { TAsyncQueueBaseClass, IAsyncQueueBaseClassOptions } from './async-queue-class-base.types';
import { getRun } from './async-queue-class-base.utils';
import { TAsyncQueueBaseClassPromiseProviderBatch } from './async-queue-class-base.types';

export class AsyncQueueClassBase extends TAsyncQueueBaseClass {
  protected queue: TAsyncQueueBaseClassPromiseProvider<any>[] = [];

  protected batch: Promise<any[]> | void = undefined;

  protected runPromiseProvider?: ReturnType<typeof getRun>;

  constructor(options?: Partial<IAsyncQueueBaseClassOptions>) {
    super(extend(options || {}, ASYNC_QUEUE_BASE_CLASS_OPTIONS) as IAsyncQueueBaseClassOptions);
    this.runPromiseProvider = getRun(this.options.promiseTimeout);
  }

  public do = async <T>(
    promiseProvider: TAsyncQueueBaseClassPromiseProviderPending<T>
  ): Promise<T | Error | (T extends any[] ? Array<T | Error> : never)> => {
    return await new Promise((res) => {
      this.queue.push(() => {
        return this.createPromise<T>(promiseProvider).then(res).catch(res);
      });
      void this.start();
    });
  };

  protected async createBatch(): Promise<any[]> {
    if (!this.queue.length) {
      return [];
    }

    const { options } = this;
    const promisePendingBatch = this.queue.splice(0, options.batchSize);

    if (!this.runPromiseProvider) {
      throw new Error('runPromiseProvider is not defined');
    }
    return await Promise.all(promisePendingBatch.map(this.runPromiseProvider)).catch((err) =>
      new Array(promisePendingBatch.length).fill(err)
    ); // fill with an error if the batch was rejected
  }

  protected start = async () => {
    if (this.batch) {
      return;
    }
    if (!this.queue.length) {
      return;
    }
    this.batch = this.createBatch();
    try {
      await this.batch;
    } catch (err) {
      console.error('AsyncQueueClassBase::error');
      console.error(err);
    }

    const { delayMs } = this.options;

    await delay(delayMs);
    this.batch = undefined;
    void this.start();
  };

  protected isBatch<T>(promiseProvider: any): promiseProvider is TAsyncQueueBaseClassPromiseProviderBatch<T> {
    return promiseProvider instanceof Array;
  }
  protected createPromise<T>(promiseProvider: any): Promise<T | Error>;
  protected createPromise<T>(promiseProvider: any[]): Promise<Array<T | Error>>;
  protected createPromise<T>(
    promiseProvider: TAsyncQueueBaseClassPromiseProviderPending<T>
  ): Promise<Array<T | Error> | T | Error> {
    let result;

    if (!this.runPromiseProvider) {
      throw new Error('runPromiseProvider is not defined');
    }
    if (this.isBatch<T>(promiseProvider)) {
      result = Promise.all(promiseProvider.map(this.runPromiseProvider));
    } else {
      result = this.runPromiseProvider(promiseProvider);
    }
    void this.start();
    return result;
  }
}
