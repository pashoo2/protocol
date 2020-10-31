import { MaybeError } from 'types/common.types';
import { IPromisePendingRejectableCreator } from 'types/promise.types';

import {
  IAsyncQueueConcurent,
  IJobPromise,
  IJobResolver,
  IJobResolveCallback,
} from './async-queue-concurent.types';
import { createJobPromise } from './async-queue-concurent.utils';

export class ConcurentAsyncQueue<T = void, E extends MaybeError = void>
  implements IAsyncQueueConcurent<T, E> {
  private queue: Array<IJobPromise<T, E>> = [];

  private _isDestroying: boolean = false;

  constructor(
    protected _promisePendingRejectableCreator: IPromisePendingRejectableCreator<
      T,
      E
    >
  ) {}

  public wait = (): Promise<IJobResolver<T>> => {
    this.failIfDestroying();

    const { queue } = this;
    const lastWorkPromise = !!queue.length && queue[queue.length - 1];
    const jobPromise = createJobPromise<T, E>(
      this._promisePendingRejectableCreator
    );
    const promiseToWaitBeforeRunJob = (lastWorkPromise ||
      Promise.resolve()) as IJobPromise<T, E>;

    this._addInQueue(jobPromise);
    return promiseToWaitBeforeRunJob.then(
      this._createResolverStep(
        this._createWorkPromiseResolver(jobPromise.resolve, jobPromise)
      )
    );
  };

  public destroy = async (err: E): Promise<void> => {
    this.failIfDestroying();
    try {
      this.setIsDestroying();
      await this._rejectAllPendingJobs(err);
      this.clearQueue();
    } finally {
      this.unsetIsDestroying();
    }
  };

  protected _addInQueue = (jobPromise: IJobPromise<T, E>) => {
    this.queue = [...this.queue, jobPromise];
  };

  protected _createResolverStep = (
    resolver: IJobResolveCallback<T>
  ): (() => IJobResolver<T>) => {
    return () => ({
      done: resolver,
    });
  };

  protected _createWorkPromiseResolver = (
    workPromiseResolve: IJobResolveCallback<T>,
    workPromise: IJobPromise<T, E>
  ): ((v: T) => void) => {
    return (v: T): void => {
      this.failIfDestroying();
      this._removePromiseFromQueue(workPromise);
      workPromiseResolve(v);
    };
  };

  protected _removePromiseFromQueue = (workPromise: IJobPromise<T, E>) => {
    this.queue = this.queue.filter((item) => item !== workPromise);
  };

  protected _rejectAllPendingJobs = (err: E) => {
    return Promise.all(this.queue.map((job) => job.reject(err)));
  };

  protected clearQueue = () => {
    this.queue = [];
  };

  protected setIsDestroying() {
    this._isDestroying = true;
  }

  protected unsetIsDestroying() {
    this._isDestroying = false;
  }

  protected failIfDestroying() {
    if (this._isDestroying) {
      throw new Error('The instance is destroying');
    }
  }
}
