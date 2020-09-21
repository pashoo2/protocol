import {
  ISwarmMessageDatabaseMessagingMethods,
  ISwarmMessagesDatabaseConnectOptions,
  ISwarmMessageDatabaseEvents,
  ISwarmMessagesDatabaseReady,
} from './swarm-messages-database.types';
import {
  ESwarmStoreConnector,
  ESwarmStoreEventNames,
} from '../swarm-store-class/swarm-store-class.const';
import assert from 'assert';
import {
  ISwarmMessageStore,
  ISwarmMessageStoreMessagingRequestWithMetaResult,
  ISwarmMessageStoreDeleteMessageArg,
} from '../swarm-message-store/swarm-message-store.types';
import { getEventEmitterInstance } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmMessageStoreEventNames } from '../swarm-message-store/swarm-message-store.const';
import { ISwarmMessageInstanceDecrypted } from '../swarm-message/swarm-message-constructor.types';
import { TTypedEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../swarm-store-class/swarm-store-class.types';
import {
  ESwarmMessagesDatabaseEventsNames,
  SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_PAGE_DEFAULT,
  SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_LIMIT_DEFAULT,
  SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_MAX_PAGE_QUERY_ATTEMPTS_DEFAULT,
} from './swarm-messages-database.const';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import {
  ISwarmMessagesDatabaseConnectCurrentUserOptions,
  TSwarmMessageDatabaseMessagesCache,
} from './swarm-messages-database.types';
import validateUserIdentifier from '../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier';
import { TSwarmMessageUserIdentifierSerialized } from '../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import {
  TSwarmStoreDatabaseIteratorMethodArgument,
  TSwarmStoreDatabaseEntityKey,
} from '../swarm-store-class/swarm-store-class.types';
import { resolveOnIdleCallback } from '../../utils/throttling-utils/throttling-utils-idle-callback/throttling-utils-idle-callback';
import { THROTTLING_UTILS_IDLE_CALLBACK_TIME_REMAINING_MAX_MS } from '../../utils/throttling-utils/throttling-utils-idle-callback/throttling-utils-idle-callback.const';
import { round } from '../../utils/common-utils/common-utils-number';
import { getItemsCount } from '../../utils/common-utils/common-utils-main';
import { TSwarmStoreDatabaseEntityUniqueIndex } from '../swarm-store-class/swarm-store-class.types';

export class SwarmMessagesDatabase<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>
> implements ISwarmMessageDatabaseMessagingMethods<P, DbType> {
  get dbName(): string | undefined {
    return this._dbName;
  }

  get dbType(): DbType {
    return this._dbType as DbType;
  }

  get isReady(): boolean {
    return this._isReady && !!this._swarmMessageStore;
  }

  get emitter(): TTypedEmitter<ISwarmMessageDatabaseEvents<P, DbType>> {
    return this._emitter;
  }

  get isMessagesListContainsAllMessages(): boolean {
    return !!this._isSwarmMessagesCacheContainsAllMessages;
  }

  get whetherMessagesListUpdateInProgress(): boolean {
    return !!this._isSwarmMessagesCacheUpdateInProgress;
  }

  get cachedMessages():
    | TSwarmMessageDatabaseMessagesCache<P, DbType>
    | undefined {
    return this._messagesCached;
  }

  protected get _currentUserId():
    | TSwarmMessageUserIdentifierSerialized
    | undefined {
    return this._currentUserOptons?.userId;
  }

  /**
   * Is this instance is Key-Value database
   *
   * @readonly
   * @protected
   * @memberof SwarmMessagesDatabase
   */
  protected get _isKeyValueDatabase() {
    return this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;
  }

  /**
   * name of the databasESwarmStoreConnectorOrbitDbDatabaseTypee
   *
   * @protected
   * @type {string}
   * @memberof SwarmMessagesDatabase
   */
  protected _dbName?: string;

  protected _dbType?: DbType;

  protected _emitter = getEventEmitterInstance<
    ISwarmMessageDatabaseEvents<P, DbType>
  >();

  /**
   * An instance implemented ISwarmMessageStore
   * interface.
   *
   * @protected
   * @type {ISwarmMessageStore<P>}
   * @memberof SwarmMessagesDatabase
   */
  protected _swarmMessageStore?: ISwarmMessageStore<P, DbType>;

  /**
   * Options for the database which used for
   * database initialization via ISwarmMessageStore.
   *
   * @protectedimport { ISwarmMessagesDatabaseReady, } from './swarm-messages-database.types';
   * @type {TSwarmStoreDatabaseOptions}
   * @memberof SwarmMessagesDatabase
   */
  protected _dbOptions?: TSwarmStoreDatabaseOptions<P, T>;

  protected _currentUserOptons?: ISwarmMessagesDatabaseConnectCurrentUserOptions;

  protected _isReady: boolean = false;

  protected _messagesCached?: TSwarmMessageDatabaseMessagesCache<P, DbType>;

  /**
   * Whether the cache contains all messages from the databse
   *
   * @protected
   * @type {boolean}
   * @memberof SwarmMessagesDatabase
   */
  protected _isSwarmMessagesCacheContainsAllMessages: boolean = false;

  /**
   * Is update of the database entries cached running.
   *
   * @protected
   * @type {boolean}
   * @memberof SwarmMessagesDatabase
   */
  protected _isSwarmMessagesCacheUpdateInProgress: boolean = false;

  /**
   * Flag means that when the cureent cache update will be ended
   * it's necessary to update it from the start to the end once
   * again.
   * That may be caused by replication process ended or adding/removing
   * of a message to the database.
   *
   * @protected
   * @type {boolean}
   * @memberof SwarmMessagesDatabase
   */
  protected _isSwarmMessagesCacheUpdateRequested: boolean = false;

  async connect(
    options: ISwarmMessagesDatabaseConnectOptions<P, T, DbType>
  ): Promise<void> {
    this._handleOptions(options);
    await this._openDatabaseInstance();
    this._setListeners();
    this._setIsReady();
  }

  close = async (): Promise<void> => {
    if (!this.isReady) {
      console.warn('SwarmMessageDatabase instance was already closed');
      return;
    }
    this._unsetIsReady();
    await this._closeSwarmDatabaseInstance();
    this._emitInstanceClosed();
    this._handleDatabaseClosed();
  };

  drop = async (): Promise<void> => {
    if (!this.isReady) {
      console.warn('SwarmMessageDatabase instance was already closed');
      return;
    }
    this._unsetIsReady();
    await this._dropSwarmDatabaseInstance();
    this._emitDatabaseDropped();
    this._handleDatabaseClosed();
  };

  addMessage = (
    ...args: Parameters<
      ISwarmMessageDatabaseMessagingMethods<P, DbType>['addMessage']
    >
  ): ReturnType<
    ISwarmMessageDatabaseMessagingMethods<P, DbType>['addMessage']
  > => {
    if (!this._checkIsReady()) {
      throw new Error('The instance is not ready to use');
    }
    return this._swarmMessageStore.addMessage(this._dbName, ...args);
  };

  deleteMessage = (
    messageAddressOrKey: ISwarmMessageStoreDeleteMessageArg<P>
  ): ReturnType<
    ISwarmMessageDatabaseMessagingMethods<P, DbType>['deleteMessage']
  > => {
    if (!this._checkIsReady()) {
      throw new Error('The instance is not ready to use');
    }
    return this._swarmMessageStore.deleteMessage(
      this._dbName,
      messageAddressOrKey
    );
  };

  collect = (
    ...args: Parameters<
      ISwarmMessageDatabaseMessagingMethods<P, DbType>['collect']
    >
  ): ReturnType<
    ISwarmMessageDatabaseMessagingMethods<P, DbType>['collect']
  > => {
    if (!this._checkIsReady()) {
      throw new Error('The instance is not ready to use');
    }
    return this._swarmMessageStore.collect(this._dbName, ...args);
  };

  collectWithMeta = (
    ...args: Parameters<
      ISwarmMessageDatabaseMessagingMethods<P, DbType>['collectWithMeta']
    >
  ): ReturnType<
    ISwarmMessageDatabaseMessagingMethods<P, DbType>['collectWithMeta']
  > => {
    if (!this._checkIsReady()) {
      throw new Error('The instance is not ready to use');
    }
    return this._swarmMessageStore.collectWithMeta(this._dbName, ...args);
  };

  /**
   * Checks if the instance is ready to use
   *
   * @protected
   * @memberof SwarmMessagesDatabase
   */
  protected _checkIsReady(): this is ISwarmMessagesDatabaseReady<P, DbType> {
    if (!this._isReady) {
      throw new Error('The instance is not ready to use');
    }
    if (!this._swarmMessageStore) {
      throw new Error(
        'Implementation of the SwarmMessgaeStore interface is not provided'
      );
    }
    if (!this._dbName) {
      throw new Error('Database name is not defined for the instance');
    }
    if (!this._currentUserId) {
      throw new Error('Identity of the current user is not defined');
    }
    return true;
  }

  protected _validateOptions(
    options: ISwarmMessagesDatabaseConnectOptions<P, T, DbType>
  ): void {
    assert(!!options, 'An options object must be provided');
    assert(typeof options === 'object', 'Options must be an object');
    assert(!!options.dbOptions, 'An options for database must be provided');
    assert(
      typeof options.dbOptions === 'object',
      'An options for database must be an object'
    );
    assert(
      !!options.swarmMessageStore,
      'An instance implemented SwarmMessageStore interface must be provided'
    );
    assert(
      options.swarmMessageStore.isReady,
      'An implementation of the ISwarmMessageStore interface must be ready to use'
    );
    assert(!!options.user, 'The current user options must be defined');
    assert(
      typeof options.user === 'object',
      'The current user options should be an object'
    );
    validateUserIdentifier(options.user.userId);
  }

  protected _setDbOptions(dbOptions: TSwarmStoreDatabaseOptions<P, T>): void {
    this._dbOptions = dbOptions;
    this._dbName = dbOptions.dbName;
    this._dbType = dbOptions.dbType as DbType;
  }

  protected _setUserOptions(
    optionsUser: ISwarmMessagesDatabaseConnectCurrentUserOptions
  ): void {
    this._currentUserOptons = optionsUser;
  }

  protected _setOptions(
    options: ISwarmMessagesDatabaseConnectOptions<P, T, DbType>
  ): void {
    this._setDbOptions(options.dbOptions);
    this._swarmMessageStore = options.swarmMessageStore;
    this._setUserOptions(options.user);
  }

  /**
   * Handle options provided for the connect
   * method.
   *
   * @protected
   * @param {ISwarmMessage_handleDatabaseClosedsDatabaseConnectOptions<P>} options
   * @memberof SwarmMessagesDatabase
   */
  protected _handleOptions(
    options: ISwarmMessagesDatabaseConnectOptions<P, T, DbType>
  ): void {
    this._validateOptions(options);
    this._setOptions(options);
  }

  protected _checkDatabaseProps(): this is Omit<
    ISwarmMessagesDatabaseReady<P, DbType>,
    'isReady'
  > {
    const swarmMessageStore = this._swarmMessageStore;

    if (!swarmMessageStore) {
      throw new Error(
        'A SwarmMessageStore interface implementation is not defined'
      );
    }

    const { _dbName } = this;

    if (!_dbName) {
      throw new Error('A database name is not defined');
    }
    return true;
  }

  /**
   * Set the database is ready to use.
   *
   * @protected
   * @memberof SwarmMessagesDatabase
   */
  protected _setIsReady = (): void => {
    this._isReady = true;
  };

  /**
   * Unset flag that the database is ready to use.
   *
   * @protected
   * @memberof SwarmMessagesDatabase
   */
  protected _unsetIsReady = (): void => {
    this._isReady = false;
  };

  protected _handleDatabaseLoadingEvent = (
    dbName: string,
    percentage: number
  ): void => {
    if (this._dbName !== dbName) return;
    this._emitter.emit(ESwarmStoreEventNames.DB_LOADING, dbName, percentage);
  };

  protected _handleDatabaseUpdatedEvent = (dbName: string): void => {
    if (this._dbName !== dbName) return;
    this._emitter.emit(ESwarmStoreEventNames.UPDATE, dbName);
    this._updateMessagesCache();
  };

  protected _handleDatabaseNewMessage = (
    dbName: string,
    message: ISwarmMessageInstanceDecrypted,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ) => {
    if (this._dbName !== dbName) return;
    this._emitter.emit(
      ESwarmMessageStoreEventNames.NEW_MESSAGE,
      dbName,
      message,
      messageAddress,
      key
    );
    this._handleCacheUpdateOnNewMessage(message, messageAddress, key);
  };

  protected _handleDatabaseDeleteMessage = (
    dbName: string,
    userID: TSwarmMessageUserIdentifierSerialized,
    // the global unique address (hash) of the DELETE message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key for the value,
    // for feed store it will be hash of the message which deleted by this one.
    keyOrHash?: TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>
  ) => {
    if (this._dbName !== dbName) return;
    this._emitter.emit(
      ESwarmMessageStoreEventNames.DELETE_MESSAGE,
      dbName,
      userID,
      messageAddress,
      keyOrHash
    );
    this._handleCacheUpdateOnDeleteMessage(userID, messageAddress, keyOrHash);
  };

  protected _handleDatabaseMessageError = (
    dbName: string,
    // swarm message string failed to deserialize
    messageSerialized: string,
    // error occurred while deserializing the message
    error: Error,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ) => {
    if (this._dbName !== dbName) return;
    this._emitter.emit(
      ESwarmMessageStoreEventNames.NEW_MESSAGE_ERROR,
      dbName,
      messageSerialized,
      error,
      messageAddress,
      key
    );
  };

  protected _handleDatabaseReadyEvent = (dbName: string): void => {
    if (this._dbName !== dbName) return;
    this._emitter.emit(ESwarmStoreEventNames.READY, dbName);
    this._setIsReady();
  };

  protected _emitInstanceClosed() {
    if (!this._dbName) {
      throw new Error(
        'SwarmMessagesDatabase::_emitInstanceClosed: failed cause there is no database name defined'
      );
    }
    this._emitter.emit(ESwarmStoreEventNames.CLOSE_DATABASE, this._dbName);
  }

  protected _handleDatabaseClosedEvent = (dbName: string): void => {
    if (this._dbName !== dbName) return;
    this._emitInstanceClosed();
    this._handleDatabaseClosed();
  };

  protected _emitDatabaseDropped(): void {
    if (!this._dbName) {
      throw new Error(
        'SwarmMessagesDatabase::_emitDatabaseDropped: failed cause there is no database name defined'
      );
    }
    this._emitter.emit(ESwarmStoreEventNames.DROP_DATABASE, this._dbName);
  }

  protected _handleDatabaseDroppedEvent = (dbName: string): void => {
    if (this._dbName !== dbName) return;
    this._emitDatabaseDropped();
    this._handleDatabaseClosed();
  };

  /**
   /**
   * Set listeners to listen events of the SwarmMessageStore
   * implementation.
   *
   *
   * @protected
   * @param {boolean} [isSetListeners=true] - set or remove the listeners
   * @memberof SwarmMessagesDatabase
   */
  protected _setListeners(isSetListeners: boolean = true): void {
    const method = isSetListeners ? 'addListener' : 'removeListener';

    this._swarmMessageStore?.[method](
      ESwarmStoreEventNames.DB_LOADING,
      this._handleDatabaseLoadingEvent
    );
    this._swarmMessageStore?.[method](
      ESwarmStoreEventNames.UPDATE,
      this._handleDatabaseUpdatedEvent
    );
    this._swarmMessageStore?.[method](
      ESwarmMessageStoreEventNames.NEW_MESSAGE,
      this._handleDatabaseNewMessage
    );
    this._swarmMessageStore?.[method](
      ESwarmMessageStoreEventNames.DELETE_MESSAGE,
      this._handleDatabaseDeleteMessage
    );
    this._swarmMessageStore?.[method](
      ESwarmStoreEventNames.READY,
      this._handleDatabaseReadyEvent
    );
    this._swarmMessageStore?.[method](
      ESwarmStoreEventNames.CLOSE_DATABASE,
      this._handleDatabaseClosedEvent
    );
    this._swarmMessageStore?.[method](
      ESwarmStoreEventNames.DROP_DATABASE,
      this._handleDatabaseDroppedEvent
    );
  }

  protected async _openDatabaseInstance(): Promise<void> {
    if (!this._swarmMessageStore) {
      throw new Error('Swarm message store must be provided');
    }
    if (!this._dbOptions) {
      throw new Error('There is no options provided for the database');
    }

    const result = await this._swarmMessageStore?.openDatabase(this._dbOptions);

    if (result instanceof Error) {
      throw new Error(`Failed top open the database: ${result.message}`);
    }
  }

  protected _unsetOptions(): void {
    this._dbName = undefined;
    this._dbOptions = undefined;
    this._dbType = undefined;
    this._currentUserOptons = undefined;
  }

  protected _unsetThisInstanceListeners(): void {
    this._emitter.removeAllListeners();
  }

  protected _unsetSwarmStoreListeners() {
    this._setListeners(false);
  }

  protected _unsetSwarmMessageStoreInstance(): void {
    this._unsetSwarmStoreListeners();
    this._swarmMessageStore = undefined;
  }

  /**
   * Close the database
   *
   * @protected
   * @memberof SwarmMessagesDatabase
   */
  protected async _handleDatabaseClosed() {
    this._unsetIsReady();
    this._unsetOptions();
    this._unsetThisInstanceListeners();
    this._unsetSwarmMessageStoreInstance();
  }

  protected async _closeSwarmDatabaseInstance(): Promise<void> {
    if (!this._checkDatabaseProps()) {
      throw new Error('Database props are not valid');
    }
    const dbName = this._dbName;
    const result = await this._swarmMessageStore.closeDatabase(dbName);

    if (result instanceof Error) {
      throw new Error(
        `Failed to close the database ${dbName}: ${result.message}`
      );
    }
  }

  protected async _dropSwarmDatabaseInstance() {
    if (!this._checkDatabaseProps()) {
      throw new Error('Database props are not valid');
    }

    const dbName = this._dbName;
    const result = await this._swarmMessageStore?.dropDatabase(dbName);

    if (result instanceof Error) {
      throw new Error(
        `Failed to drop the database ${dbName}: ${result.message}`
      );
    }
  }

  // TODO - move the cache to a separate class

  protected _getMessageWithMeta(
    dbName: string,
    message: ISwarmMessageInstanceDecrypted,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ): ISwarmMessageStoreMessagingRequestWithMetaResult<P> {
    return {
      message,
      dbName,
      messageAddress,
      key,
    };
  }

  protected _addMessageInKeyValueStoreCache = (
    messageWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<P>,
    // for key-value store it will be the key
    key: TSwarmStoreDatabaseEntityKey<P>
  ) => {
    (this._messagesCached as TSwarmMessageDatabaseMessagesCache<
      ESwarmStoreConnector.OrbitDB,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    >)?.set(key, messageWithMeta);
  };

  protected _addMessageInFeedStoreCache = (
    messageWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<P>,
    // for key-value store it will be the key
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>
  ) => {
    (this._messagesCached as TSwarmMessageDatabaseMessagesCache<
      ESwarmStoreConnector.OrbitDB,
      ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >)?.set(messageAddress, messageWithMeta);
  };

  /**
   * Create message's description and add it to the
   * cache.
   *
   * @protected
   * @param {string} dbName
   * @param {ISwarmMessageInstanceDecrypted} message
   * @param {TSwarmStoreDatabaseEntityAddress<P>} messageAddress
   * @param {TSwarmStoreDatabaseEntityKey<P>} [key]
   * @memberof SwarmMessagesDatabase
   */
  protected _addMessageToCache(
    dbName: string,
    message: ISwarmMessageInstanceDecrypted,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ) {
    const messageDescription = this._getMessageWithMeta(
      dbName,
      message,
      messageAddress,
      key
    );

    if (this._isKeyValueDatabase) {
      if (!key) {
        throw new Error(
          'A key should be defined to add a message in the key-value store messages cache'
        );
      }
      this._addMessageInKeyValueStoreCache(messageDescription, key);
    } else {
      this._addMessageInFeedStoreCache(messageDescription, messageAddress);
    }
  }

  protected _removeKeyValueFromKVStoreCache = (
    key: TSwarmStoreDatabaseEntityKey<P>
  ) => {
    (this._messagesCached as TSwarmMessageDatabaseMessagesCache<
      ESwarmStoreConnector.OrbitDB,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    >)?.delete(key);
  };

  protected _removeMessageFromFeedStoreCache = (
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>
  ) => {
    (this._messagesCached as TSwarmMessageDatabaseMessagesCache<
      ESwarmStoreConnector.OrbitDB,
      ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >)?.delete(messageAddress);
  };

  protected _removeMessageFromCache(
    // for a non key-value stores
    messageAddress?: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityAddress<P> | TSwarmStoreDatabaseEntityKey<P>
  ) {
    if (this._isKeyValueDatabase) {
      if (!key) {
        throw new Error(
          "Key should be provided to remove it's value from the key-value store"
        );
      }
      this._removeKeyValueFromKVStoreCache(
        key as TSwarmStoreDatabaseEntityKey<P>
      );
    } else {
      if (!messageAddress) {
        throw new Error(
          'A message address should be provided to remove message from the feed store messages cache'
        );
      }
      this._removeMessageFromFeedStoreCache(messageAddress);
    }
  }

  /**
   * Handle what to do with a cache of the messages
   * if a new message added to the storage.
   *
   * @protected
   * @param {ISwarmMessageInstanceDecrypted} message
   * @param {TSwarmStoreDatabaseEntityUniqueAddress<P>} messageAddress
   * @param {string} [key]
   * @memberof SwarmMessagesDatabase
   */
  protected _handleCacheUpdateOnNewMessage(
    message: ISwarmMessageInstanceDecrypted,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ) {
    if (this._checkIsReady()) {
      const isMessageAddedByCurrentUser = message.uid === this._currentUserId;
      debugger;
      if (isMessageAddedByCurrentUser) {
        this._addMessageToCache(this._dbName, message, messageAddress, key);
      } else {
        // TODO - may be it's not neccessary to update the overall cache.
        // but a conflicts with removed messages can be occurred.
        this._updateMessagesCache();
      }
    }
  }

  /**
   * Performing the swarm messages cache updating
   * on message removed from the databse.
   *
   * @protected
   * @param {TSwarmMessageUserIdentifierSerialized} userID
   * @param {TSwarmStoreDatabaseEntityUniqueAddress<P>} messageAddress
   * @param {string} [keyOrHash]
   * @memberof SwarmMessagesDatabase
   */
  protected _handleCacheUpdateOnDeleteMessage(
    userID: TSwarmMessageUserIdentifierSerialized,
    // the global unique address (hash) of the DELETE message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key for the value,
    // for feed store it will be hash of the message which deleted by this one.
    keyOrHash?:
      | TSwarmStoreDatabaseEntityAddress<P>
      | TSwarmStoreDatabaseEntityKey<P>
  ) {
    if (this._checkIsReady()) {
      const isMessageRemovedByCurrentUser = userID === this._currentUserId;
      const isKVStore = this._isKeyValueDatabase;
      debugger;
      if (isMessageRemovedByCurrentUser) {
        this._removeMessageFromCache(
          isKVStore
            ? undefined
            : ((keyOrHash as unknown) as TSwarmStoreDatabaseEntityAddress<P>), // address
          isKVStore
            ? ((keyOrHash as unknown) as TSwarmStoreDatabaseEntityKey<P>)
            : undefined // key
        );
      } else {
        // TODO - may be it's not neccessary to update the overall cache.
        // but a conflicts with removed messages can be occurred.
        this._updateMessagesCache();
      }
    }
  }

  protected _setMessagesCacheUpdateInProgress = () => {
    this._isSwarmMessagesCacheUpdateInProgress = true;
    this._emitter.emit(ESwarmMessagesDatabaseEventsNames.CACHE_UPDATING);
  };

  protected _unsetCacheUpdateInProgress = () => {
    this._isSwarmMessagesCacheUpdateInProgress = false;
    this._emitter.emit(
      ESwarmMessagesDatabaseEventsNames.CACHE_UPDATED,
      this._messagesCached
    );
  };

  protected _setNewCacheUpdatePlanned = () => {
    this._isSwarmMessagesCacheUpdateRequested = true;
  };

  protected _unsetNewCacheUpdatePlanned = () => {
    this._isSwarmMessagesCacheUpdateRequested = false;
  };

  protected _setFullMessagesReadFromDatabaseToCache() {
    this._isSwarmMessagesCacheContainsAllMessages = true;
  }

  protected _unsetFullMessagesReadFromDatabaseToCache() {
    this._isSwarmMessagesCacheContainsAllMessages = false;
  }

  /**
   * Whether the limit of failed attempts reached
   *
   * @param {number} queryAttemtNumber
   * @returns {boolean}
   */
  protected _whetherMaxDatabaseQueriesAttemptsFailed = (
    queryAttemtNumber: number
  ): boolean => {
    return (
      queryAttemtNumber >=
      SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_MAX_PAGE_QUERY_ATTEMPTS_DEFAULT
    );
  };

  /**
   * Get options for query for a batch of messages
   *
   * @param {number} messagesCountToQuery
   * @param {string[]} messagesReadAddressesOrKeysToExclude
   * @returns {TSwarmStoreDatabaseIteratorMethodArgument<P>}
   */
  protected _getDatabaseMessagesQueryOptions = (
    messagesCountToQuery: number,
    messagesReadAddressesOrKeysToExclude: string[]
  ): TSwarmStoreDatabaseIteratorMethodArgument<P, DbType> => {
    return {
      limit: messagesCountToQuery,
      neq: messagesReadAddressesOrKeysToExclude,
    } as TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>;
  };

  /**
   * Perform query to collect messages from the database.
   *
   * @protected
   * @param {number} messagesCountToQuery
   * @param {string[]} messagesReadAddressesOrKeysToExclude
   * @memberof SwarmMessagesDatabase
   * @returns {Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P>>>}
   * @throws
   */
  protected async _performMessagesCachePageRequest(
    messagesCountToQuery: number,
    messagesReadAddressesOrKeysToExclude: Array<
      TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>
    >
  ): Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P>>> {
    let queryAttempt = 0;
    let messages:
      | Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P>>
      | undefined;
    const queryOptions = this._getDatabaseMessagesQueryOptions(
      messagesCountToQuery,
      messagesReadAddressesOrKeysToExclude
    );

    while (
      !messages &&
      !this._whetherMaxDatabaseQueriesAttemptsFailed(queryAttempt)
    ) {
      try {
        messages = await this.collectWithMeta(queryOptions);
      } catch (err) {
        console.error(
          new Error(
            `_performMessagesCachePageRequest::failed::attempt::${queryAttempt}`
          ),
          err
        );
        await this._requestTimeBrowserIdle();
      } finally {
        queryAttempt++;
      }
    }
    if (!messages) {
      throw new Error(
        'Failed to read a batch of messages from the database cause of unknown reason'
      );
    }
    return messages;
  }

  /**
   * Request idle callback and resolves
   * with a time browser will be do nothing
   *
   * @returns {Promise<number>} - time browser decide it will be in idle state.
   */
  protected _requestTimeBrowserIdle = async (): Promise<number> => {
    const { timeRemaining, didTimeout } = await resolveOnIdleCallback();

    if (didTimeout) {
      return 0;
    }
    // time browser decide it will be idle.
    return timeRemaining
      ? timeRemaining()
      : THROTTLING_UTILS_IDLE_CALLBACK_TIME_REMAINING_MAX_MS;
  };

  /**
   * how many items can be read during
   * the current idle time of the browser
   *
   * @param {number} timeAvailToRun
   * @returns {number}
   */
  protected _getItemsCountToRead = (timeAvailToRun: number): number => {
    // the maximum messages to read for max time remaining THROTTLING_UTILS_IDLE_CALLBACK_TIME_REMAINING_MAX_MS
    // is equal to SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_PAGE_DEFAULT. We need to calculate
    // messages to read for timeAvailToRun.
    const percentAcordingToFreeTime = round(
      timeAvailToRun / THROTTLING_UTILS_IDLE_CALLBACK_TIME_REMAINING_MAX_MS,
      2
    );

    return (
      SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_PAGE_DEFAULT *
      percentAcordingToFreeTime
    );
  };

  /**
   * Returns a uniqiue global address for the message
   * by it's description
   *
   * @param {ISwarmMessageStoreMessagingRequestWithMetaResult<P>} message
   * @returns {(TSwarmStoreDatabaseEntityUniqueAddress<P> | undefined)}
   */
  protected _getMessageAddressByDescription = (
    message: ISwarmMessageStoreMessagingRequestWithMetaResult<P>
  ): TSwarmStoreDatabaseEntityAddress<P> | undefined => {
    const { messageAddress } = message;

    if (!messageAddress || messageAddress instanceof Error) {
      return undefined;
    }
    return messageAddress;
  };

  /**
   * Returns message's key in Key-Value databse
   *
   * @param {ISwarmMessageStoreMessagingRequestWithMetaResult<P>} message
   * @returns {(string | undefined)}
   */
  protected _getMessageKeyByDescription = (
    message: ISwarmMessageStoreMessagingRequestWithMetaResult<P>
  ): TSwarmStoreDatabaseEntityKey<P> | undefined => {
    const { key } = message;

    if (!key || key instanceof Error) {
      return undefined;
    }
    return key;
  };

  /**
   * Map messages with meta to the data structure related
   * to the KeyValue store.
   *
   * @protected
   * @param {ISwarmMessageStoreMessagingRequestWithMetaResult<P>[]} messagesWithMeta
   * @returns {Map<string, ISwarmMessageStoreMessagingRequestWithMetaResult<P>>}
   * @memberof SwarmMessagesDatabase
   */
  protected _mapMessagesDescriptionsToKVStoreMap(
    messagesWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<P>[]
  ): TSwarmMessageDatabaseMessagesCache<
    ESwarmStoreConnector.OrbitDB,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
  > {
    const messagesMap = new Map<
      string,
      ISwarmMessageStoreMessagingRequestWithMetaResult<P>
    >();

    messagesWithMeta.forEach((messageDescription) => {
      const key = this._getMessageKeyByDescription(messageDescription);

      if (key) {
        messagesMap.set(key, messageDescription);
      }
    });
    return messagesMap;
  }

  /**
   * Map messages with descriptions to a data structure related
   * to a Feed store.
   *
   * @protected
   * @param {ISwarmMessageStoreMessagingRequestWithMetaResult<P>[]} messagesWithMeta
   * @returns {Set<ISwarmMessageStoreMessagingRequestWithMetaResult<P>>}
   * @memberof SwarmMessagesDatabase
   */
  protected _mapMessagesDescriptionsToFeedStoreSet(
    messagesWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<P>[]
  ): TSwarmMessageDatabaseMessagesCache<
    ESwarmStoreConnector.OrbitDB,
    ESwarmStoreConnectorOrbitDbDatabaseType.FEED
  > {
    const messagesMap = new Map<
      string,
      ISwarmMessageStoreMessagingRequestWithMetaResult<P>
    >();

    messagesWithMeta.forEach((messageDescription) => {
      const messageAddress = this._getMessageAddressByDescription(
        messageDescription
      );

      if (messageAddress) {
        messagesMap.set(messageAddress, messageDescription);
      }
    });
    return messagesMap;
  }

  /**
   * Map messages with meta to a structure related to the current
   * store type.
   *
   * @param {ISwarmMessageStoreMessagingRequestWithMetaResult<P>[]} messagesWithMeta
   * @returns {TSwarmMessageDatabaseMessagesCache<P, DbType>}
   */
  protected _mapMessagesWithMetaToStorageRelatedStructure = (
    messagesWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<P>[]
  ): TSwarmMessageDatabaseMessagesCache<P, DbType> => {
    if (this._isKeyValueDatabase) {
      return this._mapMessagesDescriptionsToFeedStoreSet(
        messagesWithMeta
      ) as TSwarmMessageDatabaseMessagesCache<P, DbType>;
    }
    return this._mapMessagesDescriptionsToKVStoreMap(
      messagesWithMeta
    ) as TSwarmMessageDatabaseMessagesCache<P, DbType>;
  };

  /**
   * Checks whether the count is more than the limit
   * of messages read.
   *
   * @param {number} messagesCount
   * @returns {boolean}
   */
  protected _whetherMessagesLimitReached = (messagesCount: number): boolean => {
    return (
      messagesCount >
      SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_LIMIT_DEFAULT
    );
  };

  protected _getMessagesReadKeysOrAddresses(
    messagesCache: TSwarmMessageDatabaseMessagesCache<P, DbType>
  ): Array<TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>> {
    if (this.dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE) {
      return (Array.from(messagesCache.keys()) as Array<
        TSwarmStoreDatabaseEntityKey<P>
      >) as Array<TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>>;
    } else if (this.dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED) {
      return (Array.from(messagesCache.keys()) as Array<
        TSwarmStoreDatabaseEntityAddress<P>
      >) as Array<TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>>;
    }
    return [];
  }

  /**
   * Performs swarm messages cache update by
   * quering database.
   * Query performed only when the brawser is
   * not busy per page.
   *
   * @protected
   * @memberof SwarmMessagesDatabase
   * @returns {Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P>>>}
   * @throws
   * @memberof SwarmMessagesDatabase
   */
  protected async _performMessagesReadingToUpdateCache(): Promise<
    TSwarmMessageDatabaseMessagesCache<P, DbType>
  > {
    // current page
    let pageToQueryIndex = 0;
    // count messages to read from the database.
    let messagesToReadAtTheBatch = 0;
    // limit of messages count in the cached was reached
    let whetherMessagesLimitToReadReached = false;
    // whether all messages were read from the databse
    let whetherFullMessagesRead = false;
    let messagesRead = (this._isKeyValueDatabase
      ? new Map<
          TSwarmStoreDatabaseEntityKey<P>,
          ISwarmMessageStoreMessagingRequestWithMetaResult<P>
        >()
      : new Map<
          TSwarmStoreDatabaseEntityAddress<P>,
          ISwarmMessageStoreMessagingRequestWithMetaResult<P>
        >()) as TSwarmMessageDatabaseMessagesCache<P, DbType>;

    while (!whetherMessagesLimitToReadReached && !whetherFullMessagesRead) {
      // time browser decide it will be idle.
      const timeAvailToRun = await this._requestTimeBrowserIdle();

      if (!timeAvailToRun) {
        // if there is no free time to run
        // waiting for the time
        continue;
      }

      // the maximum messages to read for max time remaining THROTTLING_UTILS_IDLE_CALLBACK_TIME_REMAINING_MAX_MS
      // is equal to SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_PAGE_DEFAULT. We need to calculate
      // messages to read for timeAvailToRun.
      const currentPageItemsToRead = this._getItemsCountToRead(timeAvailToRun);

      if (!currentPageItemsToRead) {
        // nothing to read at this iteration
        continue;
      }
      pageToQueryIndex = pageToQueryIndex + 1;
      messagesToReadAtTheBatch =
        getItemsCount(messagesRead) + currentPageItemsToRead;
      whetherMessagesLimitToReadReached = this._whetherMessagesLimitReached(
        messagesToReadAtTheBatch
      );

      if (whetherMessagesLimitToReadReached) {
        // add one more to define if the database
        // contains some more data
        messagesToReadAtTheBatch = messagesToReadAtTheBatch + 1;
      }

      const messagesBatch = await this._performMessagesCachePageRequest(
        messagesToReadAtTheBatch,
        this._getMessagesReadKeysOrAddresses(messagesRead)
      );

      messagesRead = this._mapMessagesWithMetaToStorageRelatedStructure(
        messagesBatch
      );
      if (
        whetherMessagesLimitToReadReached &&
        !this._whetherMessagesLimitReached(getItemsCount(messagesRead))
      ) {
        // if tried to read more messages than the limit
        // but got some less. So decide that all
        // messages read from the database.
        whetherFullMessagesRead = true;
      }
    }
    if (whetherFullMessagesRead) {
      this._setFullMessagesReadFromDatabaseToCache();
    } else {
      this._unsetFullMessagesReadFromDatabaseToCache();
    }
    return messagesRead;
  }

  /**
   * Updates messages in cache
   *
   * @param {TSwarmMessageDatabaseMessagesCache<P, DbType>} messages
   */
  protected _updateCacheWithMessages = (
    messages: TSwarmMessageDatabaseMessagesCache<P, DbType>
  ) => {
    this._messagesCached = messages;
  };

  /**
   * Request database for all messages.
   *
   * @protected
   * @returns
   * @memberof SwarmMessagesDatabase
   */
  protected async _updateMessagesCache() {
    if (this._isSwarmMessagesCacheUpdateInProgress) {
      // TODO - set flag to plan a new update
      this._setNewCacheUpdatePlanned();
      return;
    }
    this._unsetNewCacheUpdatePlanned();
    this._setMessagesCacheUpdateInProgress();
    try {
      const messages = await this._performMessagesReadingToUpdateCache();

      this._updateCacheWithMessages(messages);
    } catch (err) {
      console.error(`Failed to update messages cache: ${err.message}`);
    }
    this._unsetCacheUpdateInProgress();
    if (this._isSwarmMessagesCacheUpdateRequested) {
      this._updateMessagesCache();
    }
  }
}
