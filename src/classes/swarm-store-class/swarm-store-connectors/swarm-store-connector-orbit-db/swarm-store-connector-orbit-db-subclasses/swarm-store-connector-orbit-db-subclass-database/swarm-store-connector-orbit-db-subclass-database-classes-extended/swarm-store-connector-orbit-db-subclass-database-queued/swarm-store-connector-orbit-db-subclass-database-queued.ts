import { SwarmStoreConnectorOrbitDBDatabase } from '../../swarm-store-connector-orbit-db-subclass-database';
import { createPromisePendingRejectable } from 'utils/common-utils/commom-utils.promies';

import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
} from '../../../../../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../../../../swarm-store-class.const';
import { ArgumentTypes } from 'types/helper.types';
import { ISwarmStoreConnectorBasic } from '../../../../../../swarm-store-class.types';
import { ConcurentAsyncQueueWithAutoExecution } from '../../../../../../../basic-classes/async-queue-concurent/async-queue-concurent-extended/async-queue-concurent-with-auto-execution/async-queue-concurent-with-auto-execution';
import { IAsyncQueueConcurentWithAutoExecution } from '../../../../../../../basic-classes/async-queue-concurent/async-queue-concurent-extended/async-queue-concurent-with-auto-execution/async-queue-concurent-with-auto-execution.types';
import { ISwarmStoreConnectorOrbitDbDatabaseIteratorOptionsRequired } from '../../swarm-store-connector-orbit-db-subclass-database.types';

export class SwarmStoreConnectorOrbitDBDatabaseQueued<
    ItemType extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>,
    DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
    DBO extends TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType>
  >
  extends SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>
  implements ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, ItemType, DbType, DBO> {
  /**
   * All async operations with the database, excluding datbase
   * close and open, should use this queue.
   *
   * @protected
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  private _asyncOperationsQueue: IAsyncQueueConcurentWithAutoExecution<void, Error> | undefined;

  public connect = async (
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['connect']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['close']> => {
    await this._rejectAllPendingOperationsOnDbOpen();
    return await super.connect(...args);
  };

  public close = async (
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['close']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['close']> => {
    await this._rejectAllPendingOperationsOnDbClose();
    return await super.close(...args);
  };

  public drop = async (
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['drop']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['drop']> => {
    await this._rejectAllPendingOperationsOnDbDrop();
    return await super.drop(...args);
  };

  public load = async (
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['load']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['load']> => {
    return await this._runAsJob(() => super.load(...args), 'load');
  };

  public add = async (
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['add']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['add']> => {
    return await this._runAsJob(() => super.add(...args), 'add');
  };

  public get = async (
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['get']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['get']> => {
    return await this._runAsJob(() => super.get(...args), 'get');
  };

  public remove = async (
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['remove']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['remove']> => {
    return await this._runAsJob(() => super.remove(...args), 'remove');
  };

  public iterator = async (
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['iterator']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['iterator']> => {
    if ((args[0] as ISwarmStoreConnectorOrbitDbDatabaseIteratorOptionsRequired<DbType>)?.fromCache) {
      // if read value from the cache, read it outside of the main queue
      // e.g. because it may be neccessary within a grant access callback
      // function, what will cause all queue halt, because the callback
      // is performing within the main call and reading a value from inside
      // the callback will be waiting will the current operation will be performed
      // but it will never be performed because it's waiting for the grant access
      // callback.
      return await super.iterator(...args);
    }
    return await this._runAsJob(() => super.iterator(...args), 'iterator');
  };

  protected _initializeAsyncQueue() {
    this._asyncOperationsQueue = new ConcurentAsyncQueueWithAutoExecution<void, Error>(createPromisePendingRejectable);
  }

  protected _getAsyncOperationsQueue(): IAsyncQueueConcurentWithAutoExecution<void, Error> {
    if (!this._asyncOperationsQueue) {
      this._initializeAsyncQueue();
    }
    if (!this._asyncOperationsQueue) {
      throw new Error('Failed to initialize the async queue instance');
    }
    return this._asyncOperationsQueue;
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

  protected _runAsJob = async <F extends () => any>(func: F, jobName: string): Promise<ReturnType<F>> => {
    // eslint-disable-next-line @typescript-eslint/return-await
    return await this._getAsyncOperationsQueue().executeQueued(func, 20000, jobName);
  };
}
