import { SwarmStoreConnectorOrbitDBDatabase } from '../../swarm-store-connector-orbit-db-subclass-database';
import { ConcurentAsyncQueue } from 'classes/basic-classes/async-queue-concurent/async-queue-concurent';
import { createPromisePendingRejectable } from 'utils/common-utils/commom-utils.promies';

import { TSwarmStoreValueTypes, TSwarmStoreDatabaseType } from '../../../../../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../../../../swarm-store-class.const';
import { IJobResolver, IAsyncQueueConcurent } from '../../../../../../../basic-classes/async-queue-concurent/async-queue-concurent.types';
import { ArgumentTypes } from 'types/helper.types';
import { ISwarmStoreConnectorBasic } from '../../../../../../swarm-store-class.types';

export class SwarmStoreConnectorOrbitDBDatabaseQueued<
    TStoreValue extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>,
    DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
  >
  extends SwarmStoreConnectorOrbitDBDatabase<TStoreValue, DbType>
  implements ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, TStoreValue, DbType> {
  /**
   * All async operations with the database, excluding datbase
   * close and open, should use this queue.
   *
   * @protected
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  private _asyncOperationsQueue: IAsyncQueueConcurent<void, Error> | undefined;

  public connect = async (
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<TStoreValue, DbType>['connect']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<TStoreValue, DbType>['close']> => {
    await this._rejectAllPendingOperationsOnDbOpen();
    return super.connect(...args);
  };

  public close = async (
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<TStoreValue, DbType>['close']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<TStoreValue, DbType>['close']> => {
    await this._rejectAllPendingOperationsOnDbClose();
    return super.close(...args);
  };

  public drop = async (
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<TStoreValue, DbType>['drop']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<TStoreValue, DbType>['drop']> => {
    await this._rejectAllPendingOperationsOnDbDrop();
    return super.drop(...args);
  };

  public load = async (
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<TStoreValue, DbType>['load']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<TStoreValue, DbType>['load']> => {
    return this._runAsJob(() => super.load(...args));
  };

  public add = async (
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<TStoreValue, DbType>['add']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<TStoreValue, DbType>['add']> => {
    return this._runAsJob(() => super.add(...args));
  };

  public get = async (
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<TStoreValue, DbType>['get']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<TStoreValue, DbType>['get']> => {
    return this._runAsJob(() => super.get(...args));
  };

  public remove = async (
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<TStoreValue, DbType>['remove']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<TStoreValue, DbType>['remove']> => {
    return this._runAsJob(() => super.remove(...args));
  };

  public iterator = async (
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<TStoreValue, DbType>['iterator']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<TStoreValue, DbType>['iterator']> => {
    return this._runAsJob(() => super.iterator(...args));
  };

  protected _initializeAsyncQueue() {
    this._asyncOperationsQueue = new ConcurentAsyncQueue<void, Error>(createPromisePendingRejectable);
  }

  protected _getAsyncOperationsQueue(): IAsyncQueueConcurent<void, Error> {
    if (!this._asyncOperationsQueue) {
      this._initializeAsyncQueue();
    }
    if (!this._asyncOperationsQueue) {
      throw new Error('Failed to initialize the async queue instance');
    }
    return this._asyncOperationsQueue;
  }

  protected _waitOperationsQueue(): Promise<IJobResolver<void>> {
    return this._getAsyncOperationsQueue().wait();
  }

  protected _rejectAllPendingOperations(err: Error): Promise<void> {
    return this._getAsyncOperationsQueue().destroy(err);
  }

  protected _rejectAllPendingOperationsOnDbClose(): Promise<void> {
    return this._rejectAllPendingOperations(new Error('Datatabase closed'));
  }

  protected _rejectAllPendingOperationsOnDbOpen(): Promise<void> {
    return this._rejectAllPendingOperations(new Error('Datatabase opened again'));
  }

  protected _rejectAllPendingOperationsOnDbDrop(): Promise<void> {
    return this._rejectAllPendingOperations(new Error('Datatabase dropped'));
  }

  protected _runAsJob = async <F extends () => any>(func: F): Promise<ReturnType<F>> => {
    const currentJob = await this._waitOperationsQueue();
    try {
      return await func();
    } finally {
      currentJob.done();
    }
  };
}
