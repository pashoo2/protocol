import { IAsyncQueueConcurent } from 'classes/basic-classes/async-queue-concurent/async-queue-concurent.types';
import { MaybeError } from '../../../../../types/common.types';

export interface IAsyncQueueConcurentWithAutoExecution<T, E extends MaybeError> extends IAsyncQueueConcurent<T, E> {
  /**
   * Executes a promise returned by the job creator function
   * when the queue will come.
   *
   * @template TE
   * @param {() => Promise<TE>} jobCreator
   * @returns {Promise<TE>}
   * @memberof IAsyncQueueConcurentWithAutoExecution
   */
  executeQueued<TE extends T = T>(jobCreator: () => Promise<TE>, timeoutMs?: number, jobName?: string): Promise<TE>;
}
