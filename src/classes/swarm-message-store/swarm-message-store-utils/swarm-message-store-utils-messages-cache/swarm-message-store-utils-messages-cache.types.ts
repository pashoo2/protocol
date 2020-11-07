import { ISwarmMessageDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import { StorageProvider } from '../../../storage-providers/storage-providers.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
} from '../../../swarm-store-class/swarm-store-class.types';

export interface ISwarmMessageStoreUtilsMessagesCacheOptions<P extends ESwarmStoreConnector, MD extends ISwarmMessageDecrypted> {
  /**
   * Name of the database
   *
   * @type {string}
   * @memberof ISwarmMessageStoreUtilsMessagesCacheOptions
   */
  dbName: string;
  /**
   * Instance of a storage for messges caching.
   *
   * @type {StorageProvider<TSwarmMessageInstance>}
   * @memberof ISwarmMessageStoreUtilsMessagesCacheOptions
   */
  cache: StorageProvider<MD | TSwarmStoreDatabaseEntityKey<P> | TSwarmStoreDatabaseEntityAddress<P>>;
}

export interface ISwarmMessageStoreUtilsMessageCacheReady<P extends ESwarmStoreConnector, MD extends ISwarmMessageDecrypted>
  extends Partial<ISwarmMessageStoreUtilsMessagesCacheOptions<P, MD>> {
  _cache: NonNullable<ISwarmMessageStoreUtilsMessagesCacheOptions<P, MD>['cache']>;

  _dbName: NonNullable<ISwarmMessageStoreUtilsMessagesCacheOptions<P, MD>['dbName']>;
}

export interface ISwarmMessageStoreUtilsMessagesCache<P extends ESwarmStoreConnector, MD extends ISwarmMessageDecrypted> {
  /**
   * Open connection with the instance.
   *
   * @param {ISwarmMessageStoreUtilsMessagesCacheOptions} options - options for the instance.
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   */
  connect(options: ISwarmMessageStoreUtilsMessagesCacheOptions<P, MD>): Promise<void>;

  /**
   * Return a swarm message by it's unique address
   *
   * @param {string} messageAddress - message unique address
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @returns {(Promise<TSwarmMessageInstance | undefined>)} - undefined if not exist or swarm message instance
   */
  getMessageByAddress(messageAddress: TSwarmStoreDatabaseEntityAddress<P>): Promise<MD | undefined>;

  /**
   * Set a swarm message for the messages's unique address.
   *
   * @param {string} messageAddress - message's unique address
   * @param {TSwarmMessageInstance} message - message instance
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  setMessageByAddress(messageAddress: TSwarmStoreDatabaseEntityAddress<P>, message: MD): Promise<void>;

  /**
   * Unset message in cache by it's address
   *
   * @param {string} messageAddress - message's address.
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  unsetMessageByAddress(messageAddress: TSwarmStoreDatabaseEntityAddress<P>): Promise<void>;

  /**
   * Returns a swarm message's address for a key
   * of a key-value database.
   *
   * @param {string} dbKey - database key for a key-value database
   * @returns {(Promise<string | undefined>)} - message address or undefined if not exists for the key
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   */
  getMessageAddressByKey(dbKey: TSwarmStoreDatabaseEntityKey<P>): Promise<TSwarmStoreDatabaseEntityAddress<P> | undefined>;

  /**
   * Set message's address in cache for a key of a key-value database.
   *
   * @param {string} dbKey - database key for a key-value database
   * @param {string} messageAddress - swarm message instance
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  setMessageAddressForKey(
    dbKey: TSwarmStoreDatabaseEntityKey<P>,
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>
  ): Promise<void>;

  /**
   * Unset message's address for a key of a database.
   *
   * @param {string} dbKey
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  unsetMessageAddressForKey(dbKey: TSwarmStoreDatabaseEntityKey<P>): Promise<void>;

  /**
   * Returns a message by key of a key-value database.
   *
   * @param {string} dbKey
   * @returns {(Promise<TSwarmMessageInstance | undefined>)}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  getMessageByKey(dbKey: TSwarmStoreDatabaseEntityKey<P>): Promise<MD | undefined>;

  /**
   * Clear all database's values.
   *
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  clear(): Promise<void>;
}
