import { createPromisePendingRejectable } from 'utils';
import { AnyConstructor } from 'types/common.types';

import { IAsyncQueueConcurentWithAutoExecution } from '../../async-queue-concurent-extended/async-queue-concurent-with-auto-execution/async-queue-concurent-with-auto-execution.types';
import { ConcurentAsyncQueueWithAutoExecution } from '../../async-queue-concurent-extended/async-queue-concurent-with-auto-execution/async-queue-concurent-with-auto-execution';
import { IAsyncQueueConcurentMixinDefault } from '../../async-queue-concurent.types';

export function asyncQueueConcurentMixinDefault<M extends AnyConstructor>(
  BaseClass: M,
  jobTimeoutDefault: number
): M & AnyConstructor<IAsyncQueueConcurentMixinDefault> {
  class Mixin extends BaseClass {
    /**
     * All async operations with the database, excluding datbase
     * close and open, should use this queue.
     *
     * @protected
     * @memberof SwarmStoreConnectorOrbitDBDatabase
     */
    private __asyncOperationsQueue: IAsyncQueueConcurentWithAutoExecution<void, Error> | undefined;

    public async _runAsJob<F extends () => any>(
      func: F,
      jobName: string,
      jobTimeout: number = jobTimeoutDefault
    ): Promise<ReturnType<F>> {
      return await this._getAsyncOperationsQueue().executeQueued(func, jobTimeout, jobName);
    }

    public _rejectAllPendingOperations(err: Error): Promise<void> {
      return this._getAsyncOperationsQueue().destroy(err);
    }

    protected _initializeAsyncQueue() {
      this.__asyncOperationsQueue = new ConcurentAsyncQueueWithAutoExecution<void, Error>(createPromisePendingRejectable);
    }

    protected _getAsyncOperationsQueue(): IAsyncQueueConcurentWithAutoExecution<void, Error> {
      if (!this.__asyncOperationsQueue) {
        this._initializeAsyncQueue();
      }
      if (!this.__asyncOperationsQueue) {
        throw new Error('Failed to initialize the async queue instance');
      }
      return this.__asyncOperationsQueue;
    }
  }
  Object.defineProperty(Mixin, 'name', {
    value: `${BaseClass.name}Queued`,
    configurable: false,
    writable: false,
    enumerable: false,
  });
  return Mixin;
}
