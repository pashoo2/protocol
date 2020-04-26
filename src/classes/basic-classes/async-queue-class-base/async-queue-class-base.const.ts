import { IAsyncQueueBaseClassOptions } from './async-queue-class-base.types';

export const ASYNC_QUEUE_BASE_CLASS_OPTIONS: IAsyncQueueBaseClassOptions = {
  batchSize: 40,
  promiseTimeout: 3000,
  delayMs: 200,
};
