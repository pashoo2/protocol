import { ConcurentAsyncQueue } from '../../async-queue-concurent';
import { MaybeError } from '../../../../../types/common.types';
import { IAsyncQueueConcurentWithAutoExecution } from './async-queue-concurent-with-auto-execution.types';
import { timeout } from 'utils';

export class ConcurentAsyncQueueWithAutoExecution<T = void, E extends MaybeError = void>
  extends ConcurentAsyncQueue<T, E>
  implements IAsyncQueueConcurentWithAutoExecution<T, E> {
  public async executeQueued<TE extends T = T>(
    jobCreator: () => Promise<TE>,
    timeoutMs: number = 1000,
    jobName?: string
  ): Promise<TE> {
    const currentJob = await this.wait();
    const thisJobName = jobName || jobCreator.name;
    let jobResult: TE | undefined = undefined;
    let isError: boolean = false;

    try {
      jobResult = (await Promise.race([jobCreator(), timeout(timeoutMs, new Error(`Job ${thisJobName} timed-out`))])) as TE;
      isError = false;
    } catch (err) {
      console.error(err);
      isError = true;
      throw new Error(`Job ${thisJobName} failed: ${err.message}`);
    } finally {
      if (!isError) {
        currentJob.done(jobResult as TE);
      }
    }
    return jobResult;
  }
}
