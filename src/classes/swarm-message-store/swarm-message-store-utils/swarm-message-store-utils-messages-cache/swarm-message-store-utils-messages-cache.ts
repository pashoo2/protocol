import { StorageProvider } from '../../../storage-providers/storage-providers.types';
import { ISwarmMessageDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import {
  SWARM_MESSAGE_STORE_UTILS_MESSAGES_CACHE_KEY_DB_KEY_VALUE_KEY_PREFIX,
  SWARM_MESSAGE_STORE_UTILS_MESSAGES_CACHE_KEY_PARTS_DELIMETER,
} from './swarm-message-store-utils-messages-cache.const';
import {
  ISwarmMessageStoreUtilsMessagesCache,
  ISwarmMessageStoreUtilsMessagesCacheOptions,
  ISwarmMessageStoreUtilsMessageCacheReady,
} from './swarm-message-store-utils-messages-cache.types';
import assert from 'assert';
import {
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
} from '../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';

export class SwarmMessageStoreUtilsMessagesCache<P extends ESwarmStoreConnector, MD extends ISwarmMessageDecrypted>
  implements ISwarmMessageStoreUtilsMessagesCache<P, MD> {
  /**
   * Falag means the instance is opened and ready to use.
   *
   * @protected
   * @type {boolean}
   * @memberof SwarmMessageStoreUtilsMessagesCache
   */
  protected _isReady: boolean = false;
  protected _cache?: StorageProvider<MD | TSwarmStoreDatabaseEntityKey<P> | TSwarmStoreDatabaseEntityAddress<P>>;

  protected _dbName?: string;

  /**
   * Open connection with the instance.
   *
   * @param {ISwarmMessageStoreUtilsMessagesCacheOptions} options - options for the instance.
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   */
  async connect(options: ISwarmMessageStoreUtilsMessagesCacheOptions<P, MD>): Promise<void> {
    if (this._isReady) {
      return;
    }
    this._validateAndSetOptions(options);
    this._isReady = true;
  }

  /**
   * Return a swarm message by it's unique address
   *
   * @param {string} messageAddress - message unique address
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @returns {(Promise<TSwarmMessageInstance | undefined>)} - undefined if not exist or swarm message instance
   */
  getMessageByAddress = async (messageAddress: TSwarmStoreDatabaseEntityAddress<P>): Promise<MD | undefined> => {
    if (this._checkIsReady()) {
      const cacheKey = this.getCacheKeyForMessageAddressAndDbName(messageAddress);
      const value = await this._cache.get(cacheKey);

      if (value instanceof Error) {
        throw value;
      }
      if (typeof value === 'string') {
        throw new Error('A swarm message instance must not be a string');
      }
      return value;
    }
  };

  /**
   * Set a swarm message for the messages's unique address.
   *
   * @param {string} messageAddress - message's unique address
   * @param {TSwarmMessageInstance} message - message instance
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  setMessageByAddress = async (messageAddress: TSwarmStoreDatabaseEntityAddress<P>, message: MD): Promise<void> => {
    if (this._checkIsReady()) {
      const cacheKey = this.getCacheKeyForMessageAddressAndDbName(messageAddress);
      const value = await this._cache.set(cacheKey, message);

      if (value instanceof Error) {
        throw value;
      }
    }
  };

  /**
   * Unset message in cache by it's address
   *
   * @param {string} messageAddress - message's address.
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  unsetMessageByAddress = async (messageAddress: TSwarmStoreDatabaseEntityAddress<P>): Promise<void> => {
    if (this._checkIsReady()) {
      const cacheKey = this.getCacheKeyForMessageAddressAndDbName(messageAddress);
      const value = await this._cache.unset(cacheKey);

      if (value instanceof Error) {
        throw value;
      }
    }
  };

  /**
   * Returns a swarm message's address for a key
   * of a key-value database.
   *
   * @param {string} dbKey - database key for a key-value database
   * @returns {(Promise<string | undefined>)} - message address or undefined if not exists for the key
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   */
  getMessageAddressByKey = async (
    dbKey: TSwarmStoreDatabaseEntityKey<P>
  ): Promise<TSwarmStoreDatabaseEntityAddress<P> | undefined> => {
    if (this._checkIsReady()) {
      const cacheKey = this.getCacheKeyForDbKeyAndDbName(dbKey);
      const value = await this._cache.get(cacheKey);

      if (value instanceof Error) {
        throw value;
      }
      if (typeof value !== 'string') {
        throw new Error('A swarm message address must be a string');
      }
      return value;
    }
  };

  /**
   * Set message's address in cache for a key of a key-value database.
   *
   * @param {string} dbKey - database key for a key-value database
   * @param {string} messageAddress - swarm message instance
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  setMessageAddressForKey = async (
    dbKey: TSwarmStoreDatabaseEntityKey<P>,
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>
  ): Promise<void> => {
    if (this._checkIsReady()) {
      const cacheKey = this.getCacheKeyForDbKeyAndDbName(dbKey);
      const value = await this._cache.set(cacheKey, messageAddress);

      if (value instanceof Error) {
        throw value;
      }
    }
  };

  /**
   * Unset message's address for a key of a database.
   *
   * @param {string} dbKey
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  unsetMessageAddressForKey = async (dbKey: TSwarmStoreDatabaseEntityKey<P>): Promise<void> => {
    if (this._checkIsReady()) {
      const cacheKey = this.getCacheKeyForDbKeyAndDbName(dbKey);
      const value = await this._cache.unset(cacheKey);

      if (value instanceof Error) {
        throw value;
      }
    }
  };

  /**
   * Returns a message by key of a key-value database.
   *
   * @param {string} dbKey
   * @returns {(Promise<TSwarmMessageInstance | undefined>)}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  getMessageByKey = async (dbKey: TSwarmStoreDatabaseEntityKey<P>): Promise<MD | undefined> => {
    const messageAddress = await this.getMessageAddressByKey(dbKey);

    if (!messageAddress) {
      return;
    }
    return this.getMessageByAddress(messageAddress);
  };

  /**
   * Clear all database's values.
   *
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  clear = async (): Promise<void> => {
    if (this._checkIsReady()) {
      await this._cache.clearDb();
    }
  };

  /**
   * Validate options
   *
   * @protected
   * @param {ISwarmMessageStoreUtilsMessagesCacheOptions} options
   * @memberof SwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  protected _validateOptions(options: ISwarmMessageStoreUtilsMessagesCacheOptions<P, MD>): void {
    assert(!!options, 'Options should not be empty');
    assert(typeof options === 'object', 'Options should be an object');
    assert(typeof options.dbName === 'string', 'A database name should be a string');
    assert(!!options.cache, 'A cache storage implementation should be defined');
    assert(typeof options.cache === 'object', 'Cache implementation should be an object');
    assert(
      typeof options.cache.get === 'function',
      'Cache implementation is not related to the interface - should have the "get" method'
    );
    assert(
      typeof options.cache.set === 'function',
      'Cache implementation is not related to the interface - should have the "set" method'
    );
  }

  /**
   * Validate and set options
   *
   * @protected
   * @param {ISwarmMessageStoreUtilsMessagesCacheOptions} options
   * @memberof SwarmMessageStoreUtilsMessagesCache
   */
  protected _validateAndSetOptions(options: ISwarmMessageStoreUtilsMessagesCacheOptions<P, MD>): void {
    this._validateOptions(options);
    this._cache = options.cache;
    this._dbName = options.dbName;
  }

  /**
   * Checks the instance is ready to use
   *
   * @protected
   * @returns {this is ISwarmMessageStoreUtilsMessageCacheReady}
   * @memberof SwarmMessageStoreUtilsMessagesCache
   * @throws
   */
  protected _checkIsReady(): this is ISwarmMessageStoreUtilsMessageCacheReady<P, MD> {
    assert(this._isReady, 'The instance is not ready');
    assert(this._cache, 'Cache is not defined for the instance');
    assert(this._dbName, 'Database name should be defined');
    return true;
  }

  /**
   * Get key in cache for Key value storage
   *
   * @protected
   * @param {string} messageAddress
   * @param {string} dbName
   * @returns {string}
   * @memberof SwarmMessageStore
   */
  protected getCacheKeyForMessageAddressAndDbName(messageAddress: TSwarmStoreDatabaseEntityAddress<P>): string {
    return `${this._dbName}${SWARM_MESSAGE_STORE_UTILS_MESSAGES_CACHE_KEY_PARTS_DELIMETER}${messageAddress}`;
  }

  protected getCacheKeyForDbKeyAndDbName(messageKey: TSwarmStoreDatabaseEntityKey<P>): string {
    return `${SWARM_MESSAGE_STORE_UTILS_MESSAGES_CACHE_KEY_DB_KEY_VALUE_KEY_PREFIX}${this._dbName}${SWARM_MESSAGE_STORE_UTILS_MESSAGES_CACHE_KEY_PARTS_DELIMETER}${messageKey}`;
  }

  protected async clearCache() {
    await this._cache?.clearDb();
  }
}
