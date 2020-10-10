import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import {
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseType,
} from '../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessagesDatabaseMesssageMeta } from '../../swarm-messages-database.types';
import { ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';

export type TSwarmMessagesDatabaseCacheMessagesRemovedFromCache<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> = DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.FEED
  ? Set<TSwarmStoreDatabaseEntityAddress<P>>
  : Set<TSwarmStoreDatabaseEntityKey<P>>;

export interface ISwarmMessagesDatabaseMessagesCacheMessageDescription<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> {
  messageMeta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>;
  messageEntry: ISwarmMessageInstanceDecrypted;
}

export interface ISwarmMessagesDatabaseMessagesCacheStoreCommon<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> {
  readonly tempCacheStore?: ISwarmMessagesDatabaseMessagesCacheStoreCommon<
    P,
    DbType
  >;
  /**
   * Returns all messages stored in cache
   *
   * @returns {Array<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>}
   * @memberof ISwarmMessagesDatabaseMessagesCacheStore
   */
  getAll(): Array<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>;
  /**
   * Read message from the cache
   *
   * @param {ISwarmMessagesDatabaseMesssageMeta<P, DbType>} messageCharacteristic
   * @returns {(ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType> | undefined)}
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  get(
    messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ):
    | ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
    | undefined;
  /**
   * Add message to cache if not exists. It may cause a deffered update
   * of the message in cache.
   *
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  add(
    description: ISwarmMessagesDatabaseMessagesCacheMessageDescription<
      P,
      DbType
    >
  ): void;
  /**
   * Remove message with a description provided from the cache.
   * It may cause a deffered cache update and the message may
   * be removed not immediately,
   *
   * @param {ISwarmMessagesDatabaseMesssageMeta<P, DbType>} messageCharacteristic
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  remove(
    messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): void;
}

export interface ISwarmMessagesDatabaseMessagesCacheStore<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> extends ISwarmMessagesDatabaseMessagesCacheStoreCommon<P, DbType> {
  /**
   * Get messages to read after the current batch of update will be performed.
   *
   * @returns {Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>}
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  getDefferedReadAfterCurrentCacheUpdateBatch(): Set<
    ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  >;
  /**
   * Reset messages to read after the current batch of update will be performed.
   *
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  resetDefferedAfterCurrentCacheUpdateBatch(): void;
  /**
   * Get messages to read after the current cache update proces will be ended.
   *
   * @returns {Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>}
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  getDefferedRead(): Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>;
  /**
   * Reset messages to read after the current cache update proces will be ended.
   *
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  resetDeffered(): void;
  /**
   * Link with a store which is
   *
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  linkTempStore(
    tempCacheStore: ISwarmMessagesDatabaseMessagesCacheStoreCommon<P, DbType>
  ): void;
  /**
   * Unlink a temp store
   *
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  unlinkTempStore(): void;
  /**
   * Update all messages in cache with messages stored in the temp store
   *
   * @memberof ISwarmMessagesDatabaseMessagesCacheStore
   */
  updateByTempStore(): void;
}

export interface ISwarmMessagesDatabaseMessagesCacheStoreConstructor<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> {
  constructor(
    dbType: DbType,
    isTemp: boolean
  ): ISwarmMessagesDatabaseMessagesCacheStore<P, DbType>;
}
