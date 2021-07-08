import { TAsyncQueueBaseClassPromiseProvider } from './async-queue-class-base.types';
import { timeout } from 'utils';

const returnError = (res: any) => {
  return res instanceof Error ? res : new Error(String(res));
};

export const getRun =
  (timeoutMs: number) =>
  <T>(promiseProvider: TAsyncQueueBaseClassPromiseProvider<T>): Promise<T | Error> => {
    try {
      return Promise.race([promiseProvider(), timeout(timeoutMs)]).catch(returnError);
    } catch (err) {
      return Promise.resolve(err);
    }
  };
