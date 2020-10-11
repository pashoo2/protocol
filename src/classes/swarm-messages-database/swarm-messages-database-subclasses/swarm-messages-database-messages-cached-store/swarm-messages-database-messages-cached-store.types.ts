import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType } from '../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessagesDatabaseMesssageMeta,
  TSwarmMessageDatabaseMessagesCached,
} from '../../swarm-messages-database.types';
import {
  ISwarmMessagesDatabaseMessagesCacheStoreConstructor,
  ISwarmMessagesDatabaseMessagesCacheStore,
  ISwarmMessagesDatabaseMessagesCacheMessageDescription,
} from '../swarm-messages-database-cache/swarm-messages-database-cache.types';

export interface ISwarmMessagesDatabaseMessagesCachedStoreCore<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  IsTemp extends boolean = false
> {
  /**
   * Version of the store.
   *
   * @type {number}
   * @memberof ISwarmMessagesDatabaseMessagesCachedStoreCore
   */
  readonly storeVersion: number;

  /**
   * Entries stored.
   *
   * @type {Array<ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>>}
   * @memberof ISwarmMessagesDatabaseMessagesCachedStoreCore
   */
  readonly entries: Array<
    ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
  >;

  /**
   * List with entries cached.
   *
   * @type {TSwarmMessageDatabaseMessagesCached<P, DbType>}
   * @memberof ISwarmMessagesDatabaseMessagesCachedStoreCore
   */
  readonly entriesCached: TSwarmMessageDatabaseMessagesCached<P, DbType>;

  /**
   * Is it a temporary cache store.
   *
   * @type {IsTemp}
   * @memberof ISwarmMessagesDatabaseMessagesCachedStoreCore
   */
  readonly isTemp: IsTemp;

  /**
   * Return message from the cache
   *
   * @param {ISwarmMessagesDatabaseMesssageMeta<P, DbType>} meta
   * @returns {(ISwarmMessagesDatabaseMessagesCacheMessageDescription<P,DbType> | undefined)}
   * @memberof ISwarmMessagesDatabaseMessagesCachedStoreCore
   */
  get(
    meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ):
    | ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
    | undefined;

  /**
   * Set the entry in the cache right at this moment.
   *
   * @param {ISwarmMessagesDatabaseMessagesCacheMessageDescription<P,DbType>} entry
   * @memberof ISwarmMessagesDatabaseMessagesCachedStoreCore
   */
  set(
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
  ): void;

  /**
   * Add a new entry to the store, can be a deffered operation.
   *
   * @param {ISwarmMessagesDatabaseMessagesCacheMessageDescription<P,DbType>} entry
   * @memberof ISwarmMessagesDatabaseMessagesCachedStoreCore
   */
  add: IsTemp extends false
    ? (
        entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
      ) => void
    : undefined;

  /**
   * Remove a message with the characteristics from the cache right in this moment.
   *
   * @param {ISwarmMessagesDatabaseMesssageMeta<P, DbType>} meta
   * @returns {void}
   * @memberof ISwarmMessagesDatabaseMessagesCachedStoreCore
   */
  unset(meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void;
  /**
   * Remove an existing message from the store. Can be a deffered operation.
   *
   * @param {ISwarmMessagesDatabaseMesssageMeta<P, DbType>} meta
   * @returns {void}
   * @memberof ISwarmMessagesDatabaseMessagesCachedStoreCore
   */
  remove: IsTemp extends false
    ? (meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>) => void
    : undefined;
}

export type TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash = string;

export interface ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  IsTemp extends boolean
> extends ISwarmMessagesDatabaseMessagesCacheStore<P, DbType, IsTemp> {
  /**
   * Add the entry for reading it directly from the store after the current
   * batch update will be done.
   *
   * @param {ISwarmMessagesDatabaseMesssageMeta<P, DbType>} meta
   * @memberof ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods
   */
  _addToDefferedReadAfterCurrentCacheUpdateBatch(
    meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): void;
  /**
   * Add the entry for reading it directly from the store after overall
   * provess of cache update will be ended.
   *
   * @param {ISwarmMessagesDatabaseMesssageMeta<P, DbType>} meta
   * @memberof ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods
   */
  _addToDefferedUpdate(
    meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): void;
}

export interface ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethodsConstructor<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  IsTemp extends boolean
>
  extends ISwarmMessagesDatabaseMessagesCacheStoreConstructor<
    P,
    DbType,
    IsTemp
  > {
  constructor(
    dbType: DbType,
    isTemp: IsTemp
  ): ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods<
    P,
    DbType,
    IsTemp
  >;
}

export interface ISwarmMessagesDatabaseMessagesCachedStoreCoreConstructor<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  IsTemp extends boolean = false
> {
  constructor(
    cachedStore: ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods<
      P,
      DbType,
      IsTemp
    >,
    isTemp: IsTemp,
    dbType: DbType,
    dbName: string
  ): ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, IsTemp>;
}
