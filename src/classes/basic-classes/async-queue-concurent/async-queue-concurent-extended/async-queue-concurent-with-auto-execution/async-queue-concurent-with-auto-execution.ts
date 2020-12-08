import { ConcurentAsyncQueue } from '../../async-queue-concurent';
import { MaybeError } from '../../../../../types/common.types';
import { IAsyncQueueConcurentWithAutoExecution } from './async-queue-concurent-with-auto-execution.types';

export class ConcurentAsyncQueueWithAutoExecution<T = void, E extends MaybeError = void>
  extends ConcurentAsyncQueue<T, E>
  implements IAsyncQueueConcurentWithAutoExecution<T, E> {
  public async executeQueued<TE extends T = T>(jobCreator: () => Promise<TE>): Promise<TE> {
    const currentJob = await this.wait();
    let jobResult: TE | undefined = undefined;

    try {
      jobResult = await jobCreator();
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      if (!jobResult) {
        throw new Error('The job hasnt been executed');
      }
      currentJob.done(jobResult);
    }
    return jobResult;
  }
}
