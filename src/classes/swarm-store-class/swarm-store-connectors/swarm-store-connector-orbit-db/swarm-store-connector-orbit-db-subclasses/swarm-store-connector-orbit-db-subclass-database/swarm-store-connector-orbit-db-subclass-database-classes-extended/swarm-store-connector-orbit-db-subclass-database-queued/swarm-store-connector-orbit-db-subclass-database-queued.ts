import * as orbitDbModule from 'orbit-db';
import { SwarmStoreConnectorOrbitDBDatabase } from '../../swarm-store-connector-orbit-db-subclass-database';

import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
} from '../../../../../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../../../../swarm-store-class.const';
import { ArgumentTypes } from 'types/helper.types';
import { ISwarmStoreConnectorBasic } from '../../../../../../swarm-store-class.types';
import { ISwarmStoreConnectorOrbitDbDatabaseIteratorOptionsRequired } from '../../swarm-store-connector-orbit-db-subclass-database.types';
import {
  asyncQueueConcurrentMixinDefault,
  IAsyncQueueConcurrentWithAutoExecution,
} from 'classes/basic-classes/async-queue-class-base';
import {
  SWARM_STORE_CONNECTOR_ORBIT_DB_SUBCLASS_DATABASE_QUEUED_CRUD_OPERATIONS_TIMEOUTS_MS,
  SWARM_STORE_CONNECTOR_ORBIT_DB_SUBCLASS_DATABASE_QUEUED_OPERATIONS_DEFAULT_TIMEOUT_MS,
} from './swarm-store-connector-orbit-db-subclass-database-queued.const';
import { ISwarmStoreConnectorOrbitDbDatabaseOptions } from 'classes';

export class SwarmStoreConnectorOrbitDBDatabaseQueued<
    ItemType extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>,
    DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
    DBO extends TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType>
  >
  extends asyncQueueConcurrentMixinDefault(
    SwarmStoreConnectorOrbitDBDatabase,
    SWARM_STORE_CONNECTOR_ORBIT_DB_SUBCLASS_DATABASE_QUEUED_OPERATIONS_DEFAULT_TIMEOUT_MS
  )<ItemType, DbType, DBO>
  implements ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, ItemType, DbType, DBO>
{
  /**
   * All async operations with the database, excluding database
   * close and open, should use this queue.
   *
   * @protected
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  private _asyncOperationsQueue: IAsyncQueueConcurrentWithAutoExecution<void, Error> | undefined;

  constructor(options: ISwarmStoreConnectorOrbitDbDatabaseOptions<ItemType, DbType>, orbitDb: orbitDbModule.OrbitDB) {
    super(options, orbitDb);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.connect = this.connect.bind(this);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.close = this.close.bind(this);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.drop = this.drop.bind(this);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.load = this.load.bind(this);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.add = this.add.bind(this);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.get = this.get.bind(this);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.remove = this.remove.bind(this);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.iterator = this.iterator.bind(this);
  }

  public async connect(
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['connect']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['close']> {
    await this._rejectAllPendingOperationsOnDbOpen();
    return await super.connect(...args);
  }

  public async close(
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['close']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['close']> {
    await this._rejectAllPendingOperationsOnDbClose();
    return await super.close(...args);
  }

  public async drop(
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['drop']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['drop']> {
    await this._rejectAllPendingOperationsOnDbDrop();
    return await super.drop(...args);
  }

  public async load(
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['load']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['load']> {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const loadOriginal = super.load;
    return await this._runAsJob(() => loadOriginal.apply(this, args), 'load');
  }

  public async add(
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['add']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['add']> {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const addOriginal = super.add;
    return await this._runAsJob(
      () => addOriginal.apply(this, args),
      'add',
      SWARM_STORE_CONNECTOR_ORBIT_DB_SUBCLASS_DATABASE_QUEUED_CRUD_OPERATIONS_TIMEOUTS_MS.ADD
    );
  }

  public async get(
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['get']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['get']> {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const getOriginal = super.get;
    return await this._runAsJob(
      () => getOriginal.apply(this, args),
      'get',
      SWARM_STORE_CONNECTOR_ORBIT_DB_SUBCLASS_DATABASE_QUEUED_CRUD_OPERATIONS_TIMEOUTS_MS.GET
    );
  }

  public async remove(
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['remove']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['remove']> {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const removeOriginal = super.remove;
    return await this._runAsJob(
      () => removeOriginal.apply(this, args),
      'remove',
      SWARM_STORE_CONNECTOR_ORBIT_DB_SUBCLASS_DATABASE_QUEUED_CRUD_OPERATIONS_TIMEOUTS_MS.REMOVE
    );
  }

  public async iterator(
    ...args: ArgumentTypes<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['iterator']>
  ): ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['iterator']> {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const iteratorOriginal = super.iterator;
    if ((args[0] as ISwarmStoreConnectorOrbitDbDatabaseIteratorOptionsRequired<DbType>)?.fromCache) {
      // if read value from the cache, read it outside of the main queue
      // e.g. because it may be neccessary within a grant access callback
      // function, what will cause all queue halt, because the callback
      // is performing within the main call and reading a value from inside
      // the callback will be waiting will the current operation will be performed
      // but it will never be performed because it's waiting for the grant access
      // callback.
      return iteratorOriginal.apply(this, args);
    }
    return await this._runAsJob(
      () => iteratorOriginal.apply(this, args),
      'iterator',
      SWARM_STORE_CONNECTOR_ORBIT_DB_SUBCLASS_DATABASE_QUEUED_CRUD_OPERATIONS_TIMEOUTS_MS.ITERATE
    );
  }

  protected _rejectAllPendingOperationsOnDbClose(): Promise<void> {
    return this._rejectAllPendingOperations(new Error('Database closed'));
  }

  protected _rejectAllPendingOperationsOnDbOpen(): Promise<void> {
    return this._rejectAllPendingOperations(new Error('Database opened again'));
  }

  protected _rejectAllPendingOperationsOnDbDrop(): Promise<void> {
    return this._rejectAllPendingOperations(new Error('Database dropped'));
  }
}
