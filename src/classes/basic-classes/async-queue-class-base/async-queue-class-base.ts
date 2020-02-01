import { ASYNC_QUEUE_BASE_CLASS_OPTIONS } from './async-queue-class-base.const';
import { extend } from '../../../utils/common-utils/common-utils-objects';
import {
  TAsyncQueueBaseClassPromiseProviderPending,
  TAsyncQueueBaseClassPromiseProvider,
} from './async-queue-class-base.types';
import {
  TAsyncQueueBaseClass,
  IAsyncQueueBaseClassOptions,
} from './async-queue-class-base.types';
import { getRun } from './async-queue-class-base.utils';
import { delay } from '../../../utils/common-utils/common-utils-timer';

export class AsyncQueueClassBase extends TAsyncQueueBaseClass {
  protected queue: TAsyncQueueBaseClassPromiseProvider<any>[] = [];

  protected batch: Promise<any[]> | void = undefined;

  protected runPromiseProvider?: ReturnType<typeof getRun>;

  constructor(options?: Partial<IAsyncQueueBaseClassOptions>) {
    super(
      extend(
        options || {},
        ASYNC_QUEUE_BASE_CLASS_OPTIONS
      ) as IAsyncQueueBaseClassOptions
    );
    this.runPromiseProvider = getRun(this.options.promiseTimeout);
  }

  public do = async <T>(
    promiseProvider: TAsyncQueueBaseClassPromiseProviderPending<T>
  ): Promise<T | Array<T | Error> | Error> => {
    return new Promise((res) => {
      this.queue.push(() => {
        return this.createPromise<T>(promiseProvider)
          .then(res)
          .catch(res);
      });
      this.start();
    });
  };

  protected async createBatch(): Promise<any[]> {
    if (!this.queue.length) {
      return [];
    }

    const { options } = this;
    const promisePendingBatch = this.queue.splice(0, options.batchSize);

    return Promise.all(
      promisePendingBatch.map(this.runPromiseProvider!)
    ).catch((err) => new Array(promisePendingBatch.length).fill(err)); // fill with an error if the batch was rejected
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
    this.start();
  };

  protected createPromise = <T>(
    promiseProvider: TAsyncQueueBaseClassPromiseProviderPending<T>
  ): Promise<T | Array<T | Error> | Error> => {
    let result;
    if (promiseProvider instanceof Array) {
      result = Promise.all(promiseProvider.map(this.runPromiseProvider!));
    } else {
      result = this.runPromiseProvider!(promiseProvider);
    }
    this.start();
    return result;
  };
}
