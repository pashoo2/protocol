import { IAsyncQueueBaseClassOptions } from './async-queue-class-base.types';

export const ASYNC_QUEUE_BASE_CLASS_OPTIONS: IAsyncQueueBaseClassOptions = {
  batchSize: 10,
  promiseTimeout: 3000,
  delayMs: 500,
};
