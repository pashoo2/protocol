import { ConcurentAsyncQueue } from '../../async-queue-concurent';
import { MaybeError } from '../../../../../types/common.types';
import { IAsyncQueueConcurentWithAutoExecution } from './async-queue-concurent-with-auto-execution.types';

export class ConcurentAsyncQueueWithAutoExecution<T = void, E extends MaybeError = void>
  extends ConcurentAsyncQueue<T, E>
  implements IAsyncQueueConcurentWithAutoExecution<T, E> {
  public async executeQueued<TE extends T = T>(jobCreator: () => Promise<TE>): Promise<TE> {
    const currentJob = await this.wait();
    let jobResult: TE | undefined = undefined;
    let isExecuted: boolean = false;

    try {
      jobResult = await jobCreator();
      isExecuted = true;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      if (!isExecuted) {
        throw new Error('The job hasnt been executed');
      }
      currentJob.done(jobResult as TE);
    }
    return jobResult;
  }
}
