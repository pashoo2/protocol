import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import {
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseType,
} from '../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessagesDatabaseMesssageMeta, TSwarmMessageDatabaseMessagesCached } from '../../swarm-messages-database.types';
import { ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../swarm-message-store/types/swarm-message-store.types';

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

export interface ISwarmMessagesDatabaseMessagesCacheStoreTemp<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted,
  IsTemp extends boolean
> {
  /**
   * Whether it is a temporary storage
   *
   * @type {IsTemp}
   * @memberof ISwarmMessagesDatabaseMessagesCacheStoreCommon
   */
  readonly isTemp: IsTemp;
  /**
   * Returns all messages stored in cache
   *
   * @returns {TSwarmMessageDatabaseMessagesCached<P, DbType>}
   * @memberof ISwarmMessagesDatabaseMessagesCacheStore
   */
  readonly entries: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined;
  /**
   * Read message from the cache
   *
   * @param {ISwarmMessagesDatabaseMesssageMeta<P, DbType>} messageCharacteristic
   * @returns {(ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType> | undefined)}
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  get(
    messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined | undefined;
  /**
   * Add message to cache forcely.
   *
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  set(description: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>): void;
  /**
   * Remove message with a description provided from the cache.
   *
   * @param {ISwarmMessagesDatabaseMesssageMeta<P, DbType>} messageCharacteristic
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  unset(messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void;
  /**
   * Update database with messages passed in the argument.
   *
   * @param {TSwarmMessageDatabaseMessagesCached<P, DbType>} entries
   * @memberof ISwarmMessagesDatabaseMessagesCacheStoreTemp
   * @returns {boolean} - whether some messages were updated in the cache
   */
  update(entries: TSwarmMessageDatabaseMessagesCached<P, DbType, MD>): boolean;
}

export interface ISwarmMessagesDatabaseMessagesCacheStoreNonTemp<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted
> extends ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, false> {
  readonly isTemp: false;
  /**
   * Get messages to read after the current batch of update will be performed.
   *
   * @returns {Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>}
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  getDefferedReadAfterCurrentCacheUpdateBatch(): Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>;
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
   * Add message to cache if not exists. It may cause a deffered update
   * of the message in cache.
   *
   * @param {ISwarmMessagesDatabaseMessagesCacheMessageDescription<
   *       P,
   *       DbType
   *     >} description
   * @returns {boolean} - whether message added or already exists in the cache
   * @memberof ISwarmMessagesDatabaseMessagesCacheStoreNonTemp
   */
  addToDeffered(description: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>): boolean;
  /**
   * Remove message with a description provided from the cache.
   * It may cause a deffered cache update and the message may
   * be removed not immediately,
   *
   * @param {ISwarmMessagesDatabaseMesssageMeta<P, DbType>} messageCharacteristic
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  remove(messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void;
  /**
   * Link with a temporary store, cause it can be necessary to check
   * whether a message is already in it.
   *
   * @param {ISwarmMessagesDatabaseMessagesCacheStoreTemp<
   *       P,
   *       DbType,
   *       any
   *     >} tempCacheStore
   * @memberof ISwarmMessagesDatabaseMessagesCacheStoreNonTemp
   */
  linkWithTempStore(tempCacheStore: ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, true>): void;
  /**
   * Update messages with a messages from a temporary store
   * linked earlier.
   * Messages can updated only from a storage linked to,
   * to save a consistency.
   *
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   * @return {boolean} - whether cache entries were updated
   */
  updateByTempStore(): boolean;
  /**
   * Unlink the temp storage linked before.
   *
   * @memberof ISwarmMessagesDatabaseMessagesCacheStoreNonTemp
   */
  unlinkWithTempStore(): void;
}

export type TSwarmMessagesDatabaseMessagesCacheStore<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted,
  IsTemp extends boolean
> = IsTemp extends true
  ? ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, IsTemp>
  : ISwarmMessagesDatabaseMessagesCacheStoreNonTemp<P, DbType, MD>;

export interface ISwarmMessagesDatabaseMessagesCacheStoreFabric<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted,
  IsTemp extends boolean
> {
  (dbType: DbType, dbName: string, isTemp: IsTemp): TSwarmMessagesDatabaseMessagesCacheStore<P, DbType, MD, IsTemp>;
}
