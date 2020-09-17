import { TSwarmMessageInstance } from '../../../swarm-message/swarm-message-constructor.types';
import { StorageProvider } from '../../../storage-providers/storage-providers.types';

export interface ISwarmMessageStoreUtilsMessagesCacheOptions {
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
  cache: StorageProvider<TSwarmMessageInstance>;
}

export interface ISwarmMessageStoreUtilsMessageCacheReady {
  _cache: StorageProvider<TSwarmMessageInstance>;

  _dbName: string;
}

export interface ISwarmMessageStoreUtilsMessagesCache {
  /**
   * Open connection with the instance.
   *
   * @param {ISwarmMessageStoreUtilsMessagesCacheOptions} options - options for the instance.
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   */
  connect(options: ISwarmMessageStoreUtilsMessagesCacheOptions): Promise<void>;

  /**
   * Return a swarm message by it's unique address
   *
   * @param {string} messageAddress - message unique address
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @returns {(Promise<TSwarmMessageInstance | undefined>)} - undefined if not exist or swarm message instance
   */
  getMessageByAddress(
    messageAddress: string
  ): Promise<TSwarmMessageInstance | undefined>;

  /**
   * Set a swarm message for the messages's unique address.
   *
   * @param {string} messageAddress - message's unique address
   * @param {TSwarmMessageInstance} message - message instance
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  setMessageByAddress(
    messageAddress: string,
    message: TSwarmMessageInstance
  ): Promise<void>;

  /**
   * Unset message in cache by it's address
   *
   * @param {string} messageAddress - message's address.
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  unsetMessageByAddress(messageAddress: string): Promise<void>;

  /**
   * Returns a swarm message's address for a key
   * of a key-value database.
   *
   * @param {string} dbKey - database key for a key-value database
   * @returns {(Promise<string | undefined>)} - message address or undefined if not exists for the key
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   */
  getMessageAddressByKey(dbKey: string): Promise<string | undefined>;

  /**
   * Set message's address in cache for a key of a key-value database.
   *
   * @param {string} dbKey - database key for a key-value database
   * @param {string} messageAddress - swarm message instance
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  setMessageAddressForKey(dbKey: string, messageAddress: string): Promise<void>;

  /**
   * Unset message's address for a key of a database.
   *
   * @param {string} dbKey
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  unsetMessageAddressForKey(dbKey: string): Promise<void>;

  /**
   * Returns a message by key of a key-value database.
   *
   * @param {string} dbKey
   * @returns {(Promise<TSwarmMessageInstance | undefined>)}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  getMessageByKey(dbKey: string): Promise<TSwarmMessageInstance | undefined>;

  /**
   * Clear all database's values.
   *
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  clear(): Promise<void>;
}
