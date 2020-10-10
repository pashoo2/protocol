import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
} from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesDatabaseMesssageMeta } from '../../swarm-messages-database.types';
import {
  ISwarmMessagesDatabaseMessagesCacheStore,
  ISwarmMessagesDatabaseMessagesCacheMessageDescription,
} from '../swarm-messages-database-cache/swarm-messages-database-cache.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';

export interface ISwarmMessagesDatabaseMessagesCachedStoreCore<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> {
  readonly entries: Array<
    ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
  >;
  readonly isTemp?: boolean;
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
  add(
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
  ): void;
  /**
   * Add a new entry to the store, can be a deffered operation.
   *
   * @param {ISwarmMessagesDatabaseMessagesCacheMessageDescription<P,DbType>} entry
   * @memberof ISwarmMessagesDatabaseMessagesCachedStoreCore
   */
  addNew(
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
  ): void;
  /**
   * Remove a message with the characteristics from the cache right in this moment.
   *
   * @param {ISwarmMessagesDatabaseMesssageMeta<P, DbType>} meta
   * @returns {void}
   * @memberof ISwarmMessagesDatabaseMessagesCachedStoreCore
   */
  remove(meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void;
  /**
   * Remove an existing message from the store. Can be a deffered operation.
   *
   * @param {ISwarmMessagesDatabaseMesssageMeta<P, DbType>} meta
   * @returns {void}
   * @memberof ISwarmMessagesDatabaseMessagesCachedStoreCore
   */
  removeExisting(meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void;
}

export type TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash = string;

export interface ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> extends ISwarmMessagesDatabaseMessagesCacheStore<P, DbType> {
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

export interface ISwarmMessagesDatabaseMessagesCachedStoreCoreConstructor<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> {
  constructor(
    cachedStore: ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods<
      P,
      DbType
    >,
    isTemp: boolean,
    dbType: DbType
  ): ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType>;
}
