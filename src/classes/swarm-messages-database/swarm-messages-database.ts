import {
  ISwarmMessageDatabaseEvents,
  ISwarmMessagesDatabaseConnectCurrentUserOptions,
  ISwarmMessagesDatabaseConnectOptions,
  ISwarmMessagesDatabaseReady,
  TSwarmMessageDatabaseMessagesCached,
} from './swarm-messages-database.types';
import { ESwarmStoreConnector, ESwarmStoreEventNames } from '../swarm-store-class/swarm-store-class.const';
import assert from 'assert';
import {
  ISwarmMessageStore,
  ISwarmMessageStoreDeleteMessageArg,
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../swarm-message-store/types/swarm-message-store.types';
import { getEventEmitterInstance } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmMessageStoreEventNames } from '../swarm-message-store/swarm-message-store.const';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../swarm-message/swarm-message-constructor.types';
import { TTypedEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import {
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import validateUserIdentifier from '../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier';
import { TSwarmMessageUserIdentifierSerialized } from '../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { ISwarmMessagesDatabaseCacheOptions, ISwarmMessagesDatabaseCache } from './swarm-messages-database.types';
import { isConstructor } from '../../utils/common-utils/common-utils-classes';
import {
  ESwarmMessagesDatabaseCacheEventsNames,
  SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_UPDATE_RETRY_DELAY_MS,
  SWARM_MESSAGES_DATABASE_MESSAGES_EMITTED_UNIQ_ID_ADDRESS_PREFIX,
} from './swarm-messages-database.const';
import { ISwarmMessageStoreMessageWithMeta } from '../swarm-message-store/types/swarm-message-store.types';
import { delay } from '../../utils/common-utils/common-utils-timer';
import { SWARM_MESSAGES_DATABASE_MESSAGES_MAX_ATTEMPTS_CACHE_UPDATE } from './swarm-messages-database.const';
import {
  ISwarmStoreConnectorBasic,
  ISwarmStoreConnector,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
} from '../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmMessagesDatabaseConnector } from './swarm-messages-database.types';
import { ISwarmMessagesDatabaseMessagesCollector } from './swarm-messages-database.messages-collector.types';
import { TSwarmStoreDatabaseIteratorMethodArgument } from '../swarm-store-class/swarm-store-class.types';

export class SwarmMessagesDatabase<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    MD | T,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>,
  OPT extends ISwarmMessagesDatabaseConnectOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    GAC,
    MCF,
    ACO,
    O,
    SMS,
    MD,
    SMSM,
    DCO,
    DCCRT
  >
> implements
    ISwarmMessagesDatabaseConnector<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      PO,
      CO,
      ConnectorMain,
      CFO,
      GAC,
      MCF,
      ACO,
      O,
      SMS,
      MD,
      SMSM,
      DCO,
      DCCRT,
      OPT
    > {
  get dbName(): DBO['dbName'] | undefined {
    return this._dbName;
  }

  get dbType(): DbType {
    return this._dbType as DbType;
  }

  get isReady(): boolean {
    return this._isReady && !!this._swarmMessageStore;
  }

  get emitter(): TTypedEmitter<ISwarmMessageDatabaseEvents<P, T, DbType, DBO, MD>> {
    return this._emitter;
  }

  get isMessagesListContainsAllMessages(): boolean {
    return Boolean(this._swarmMessagesCache?.whetherMessagesListContainsAllMessages);
  }

  get whetherMessagesListUpdateInProgress(): boolean {
    return Boolean(this._swarmMessagesCache?.isUpdating);
  }

  get cachedMessages(): TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined {
    return this._messagesCached;
  }

  protected get _currentUserId(): TSwarmMessageUserIdentifierSerialized | undefined {
    return this._currentUserOptons?.userId;
  }

  /**
   * Is this instance is Key-Value database
   *
   * @readonly
   * @protected
   * @memberof SwarmMessagesDatabase
   */
  protected get _isKeyValueDatabase(): boolean {
    return this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;
  }

  protected get _swarmMessagesCacheClassFromOptions(): OPT['cacheOptions']['cacheConstructor'] {
    const SwarmMessagesCacheConstructor = this._cacheOptions?.cacheConstructor;

    if (!SwarmMessagesCacheConstructor) {
      throw new Error('SwarmMessagesCacheConstructor should be defined in options');
    }
    return SwarmMessagesCacheConstructor;
  }

  /**
   * name of the databasESwarmStoreConnectorOrbitDbDatabaseTypee
   *
   * @protected
   * @type {string}
   * @memberof SwarmMessagesDatabase
   */
  protected _dbName?: DBO['dbName'];

  protected _dbType?: DbType;

  protected _emitter = getEventEmitterInstance<ISwarmMessageDatabaseEvents<P, T, DbType, DBO, MD>>();

  /**
   * An instance implemented ISwarmMessageStore
   * interface.
   *
   * @protected
   * @type {ISwarmMessageStore<P>}
   * @memberof SwarmMessagesDatabase
   */
  protected _swarmMessageStore?: SMS;

  /**
   * Implementation of a swarm messages cahce
   *
   * @protected
   * @type {ISwarmMessagesDatabaseCache<P, DbType>}
   * @memberof SwarmMessagesDatabase
   */
  protected _swarmMessagesCache: DCCRT | undefined;

  /**
   * Options for the database which used for
   * database initialization via ISwarmMessageStore.
   *
   * @protectedimport { ISwarmMessagesDatabaseReady, } from './swarm-messages-database.types';
   * @type {TSwarmStoreDatabaseOptions}
   * @memberof SwarmMessagesDatabase
   */
  protected _dbOptions?: DBO;

  protected _currentUserOptons?: ISwarmMessagesDatabaseConnectCurrentUserOptions;

  protected _swarmMessagesCollector?: SMSM;

  protected _cacheOptions?: OPT['cacheOptions'];

  protected _isReady: boolean = false;

  protected _newMessagesEmitted = new Set<string>();

  /**
   * Swarm messages cached
   *
   * @protected
   * @type {(TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined)}
   * @memberof SwarmMessagesDatabase
   */
  protected _messagesCached: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined;

  async connect(options: OPT): Promise<void> {
    this._handleOptions(options);
    await this._openDatabaseInstance();
    await this._startSwarmMessagesCache();
    this._setListeners();
    this._setIsReady();
    this._updateMessagesCache();
  }

  async close(): Promise<void> {
    if (!this.isReady) {
      console.warn('SwarmMessageDatabase instance was already closed');
      return;
    }
    this._unsetIsReady();
    await this._closeSwarmDatabaseInstance();
    await this._closeSwarmMessagesCahceInstance();
    this._emitInstanceClosed();
    await this._handleDatabaseClosed();
  }

  async drop(): Promise<void> {
    if (!this.isReady) {
      console.warn('SwarmMessageDatabase instance was already closed');
      return;
    }
    this._unsetIsReady();
    await this._dropSwarmDatabaseInstance();
    this._emitDatabaseDropped();
    await this._handleDatabaseClosed();
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  addMessage(
    message: Parameters<SMS['addMessage']>[1],
    key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined
  ): ReturnType<SMS['addMessage']> {
    if (!this._checkIsReady()) {
      throw new Error('The instance is not ready to use');
    }
    return this._swarmMessageStore.addMessage(this._dbName, message, key) as ReturnType<SMS['addMessage']>;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  deleteMessage(messageAddressOrKey: ISwarmMessageStoreDeleteMessageArg<P, DbType>): ReturnType<SMS['deleteMessage']> {
    if (!this._checkIsReady()) {
      throw new Error('The instance is not ready to use');
    }
    return this._swarmMessageStore.deleteMessage(this._dbName, messageAddressOrKey) as ReturnType<SMS['deleteMessage']>;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  collect(options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>): ReturnType<SMS['collect']> {
    if (!this._checkIsReady()) {
      throw new Error('The instance is not ready to use');
    }
    return this._swarmMessageStore.collect(this._dbName, options) as ReturnType<SMS['collect']>;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  collectWithMeta(options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>): ReturnType<SMS['collectWithMeta']> {
    if (!this._checkIsReady()) {
      throw new Error('The instance is not ready to use');
    }
    return this._swarmMessageStore.collectWithMeta(this._dbName, options) as ReturnType<SMS['collectWithMeta']>;
  }

  /**
   * Checks if the instance is ready to use
   *
   * @protected
   * @memberof SwarmMessagesDatabase
   */
  protected _checkIsReady(): this is ISwarmMessagesDatabaseReady<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    GAC,
    MCF,
    ACO,
    O,
    MD,
    SMSM
  > {
    if (!this._isReady) {
      throw new Error('The instance is not ready to use');
    }
    if (!this._swarmMessageStore) {
      throw new Error('Implementation of the SwarmMessgaeStore interface is not provided');
    }
    if (!this._dbName) {
      throw new Error('Database name is not defined for the instance');
    }
    if (!this._currentUserId) {
      throw new Error('Identity of the current user is not defined');
    }
    if (!this._swarmMessagesCache) {
      throw new Error('Swarm messages cahce is not exists');
    }
    return true;
  }

  protected _validateOptions(options: OPT): void {
    assert(!!options, 'An options object must be provided');
    assert(typeof options === 'object', 'Options must be an object');
    assert(!!options.dbOptions, 'An options for database must be provided');
    assert(typeof options.dbOptions === 'object', 'An options for database must be an object');
    assert(!!options.swarmMessageStore, 'An instance implemented SwarmMessageStore interface must be provided');
    assert(options.swarmMessageStore.isReady, 'An implementation of the ISwarmMessageStore interface must be ready to use');
    assert(!!options.user, 'The current user options must be defined');
    assert(typeof options.user === 'object', 'The current user options should be an object');
    assert(options.swarmMessagesCollector, 'Swarm messages collector should be passed in options');
    validateUserIdentifier(options.user.userId);
  }

  protected _setDbOptions(dbOptions: DBO): void {
    this._dbOptions = dbOptions;
    this._dbName = dbOptions.dbName;
    this._dbType = dbOptions.dbType;
  }

  protected _setUserOptions(optionsUser: ISwarmMessagesDatabaseConnectCurrentUserOptions): void {
    this._currentUserOptons = optionsUser;
  }

  protected _setOptions(options: OPT): void {
    this._setDbOptions(options.dbOptions);
    this._swarmMessageStore = options.swarmMessageStore;
    this._swarmMessagesCollector = options.swarmMessagesCollector;
    this._setUserOptions(options.user);
  }

  protected _validateCacheOptions(options?: OPT['cacheOptions']): void {
    if (!options) {
      return;
    }
    assert(typeof options === 'object', 'Swarm messages cache options must be an object');
    if (options.cacheConstructor) {
      assert(isConstructor(options.cacheConstructor), 'cacheConstructor option should be a constructor');
    }
  }

  protected _setCacheOptions(options: OPT['cacheOptions']): void {
    this._cacheOptions = options;
  }

  /**
   * Handle options provided for the connect
   * method.
   *
   * @protected
   * @param {ISwarmMessage_handleDatabaseClosedsDatabaseConnectOptions<P>} options
   * @memberof SwarmMessagesDatabase
   */
  protected _handleOptions(options: OPT): void {
    this._validateOptions(options);
    this._setOptions(options);
    if (options.cacheOptions) {
      this._validateCacheOptions(options.cacheOptions);
      this._setCacheOptions(options.cacheOptions);
    }
  }

  protected _checkDatabaseProps(): this is Omit<
    ISwarmMessagesDatabaseReady<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, GAC, MCF, ACO, O, MD, SMSM>,
    'isReady'
  > {
    const swarmMessageStore = this._swarmMessageStore;

    if (!swarmMessageStore) {
      throw new Error('A SwarmMessageStore interface implementation is not defined');
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

  protected _setMessagesCached = (messagesCached: TSwarmMessageDatabaseMessagesCached<P, DbType, MD>): void => {
    this._messagesCached = messagesCached;
  };

  protected _updateMessagesCache(attempt = 0): void {
    if (!this._isReady) {
      console.warn(`The database ${this._dbName}:${this._dbType} is not ready`);
      return;
    }
    if (this._checkIsReady()) {
      this._swarmMessagesCache.update().catch(async (err) => {
        if (attempt > SWARM_MESSAGES_DATABASE_MESSAGES_MAX_ATTEMPTS_CACHE_UPDATE) {
          console.error(`Failed to update messages cache ${err.message}`);
          await delay(SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_UPDATE_RETRY_DELAY_MS);
          this._updateMessagesCache(attempt++);
        }
      });
    }
  }

  protected _getSwarmMessageWithMeta(
    dbName: DBO['dbName'],
    message: MD,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ): ISwarmMessageStoreMessageWithMeta<P, MD> {
    return {
      dbName,
      message,
      messageAddress,
      key,
    };
  }

  /**
   * Add message to the cache by it's description.
   *
   * @protected
   * @param {string} dbName
   * @param {MD} message
   * @param {TSwarmStoreDatabaseEntityAddress<P>} messageAddress
   * @param {TSwarmStoreDatabaseEntityKey<P>} [key]
   * @returns {Promise<void>}
   * @memberof SwarmMessagesDatabase
   */
  protected _addMessageToCache(
    dbName: DBO['dbName'],
    message: MD,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ): Promise<boolean> {
    if (this._checkIsReady()) {
      return this._swarmMessagesCache.addMessage(this._getSwarmMessageWithMeta(dbName, message, messageAddress, key));
    }
    throw new Error('Swarm messages cache is not ready');
  }

  protected _removeMessageFromCache(
    messageAddress: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityAddress<P> | undefined
      : TSwarmStoreDatabaseEntityAddress<P>,
    key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined
  ): Promise<void> {
    if (this._checkIsReady()) {
      if (!messageAddress && !key) {
        throw new Error('Messages address or message key requered to remove message from the cache');
      }
      return this._swarmMessagesCache.deleteMessage(messageAddress, key);
    }
    throw new Error('Swarm messages cache is not ready');
  }

  protected _handleDatabaseLoadingEvent = (dbName: DBO['dbName'], percentage: number): void => {
    if (this._dbName !== dbName) return;
    this._emitter.emit(ESwarmStoreEventNames.DB_LOADING, dbName, percentage);
  };

  protected _handleDatabaseUpdatedEvent = (dbName: DBO['dbName']): void => {
    if (this._dbName !== dbName) return;

    this._emitter.emit(ESwarmStoreEventNames.UPDATE, dbName);
    this._updateMessagesCache();
  };

  /**
   * Returns a unique value for the message to set it in
   * the list of messages received.
   *
   * @param {TSwarmStoreDatabaseEntityAddress<P>} messageAddress
   * @param {TSwarmStoreDatabaseEntityKey<P>} [key]
   * @param {MD} [message] - optional cause for DELETE messages
   * a message object by itself may be not exists.
   * @returns {string}
   */
  protected _getMessageUniqueIdForEmittedAsNewList = (
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>,
    message?: MD
  ): string => {
    return message ? message.sig : `${SWARM_MESSAGES_DATABASE_MESSAGES_EMITTED_UNIQ_ID_ADDRESS_PREFIX}::${messageAddress}`;
  };

  /**
   * Add message to the list of a messages uniq id's which
   * were emitted as a new before
   *
   * @param {TSwarmStoreDatabaseEntityAddress<P>} messageAddress
   * @param {TSwarmStoreDatabaseEntityKey<P>} [key]
   * @param {MD} [message] - optional cause for DELETE messages
   * a message object by itself may be not exists.
   */
  protected _addMessageToListOfEmitted = (
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>,
    message?: MD
  ): void => {
    this._newMessagesEmitted.add(this._getMessageUniqueIdForEmittedAsNewList(messageAddress, key, message));
  };

  /**
   * Checks whether the message is already been emitted as a new message
   *
   * @param {TSwarmStoreDatabaseEntityAddress<P>} messageAddress
   * @param {TSwarmStoreDatabaseEntityKey<P>} [key]
   * @param {MD} [message] - optional cause for DELETE messages
   * a message object by itself may be not exists.
   * @returns {boolean}
   */
  protected _isMessageAlreadyEmitted = (
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>,
    message?: MD
  ): boolean => {
    return this._newMessagesEmitted.has(this._getMessageUniqueIdForEmittedAsNewList(messageAddress, key, message));
  };

  protected _handleDatabaseNewMessage = async (
    dbName: DBO['dbName'],
    message: MD,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ): Promise<void> => {
    if (this._dbName !== dbName) return;

    if (this._isMessageAlreadyEmitted(messageAddress, key, message)) {
      return;
    }

    this._emitter.emit(ESwarmMessageStoreEventNames.NEW_MESSAGE, dbName, message, messageAddress, key);
    this._addMessageToListOfEmitted(messageAddress, key, message);
    await this._handleCacheUpdateOnNewMessage(message, messageAddress, key);
  };

  protected _handleDatabaseDeleteMessage = async (
    dbName: DBO['dbName'],
    userID: TSwarmMessageUserIdentifierSerialized,
    // the global unique address (hash) of the DELETE message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // the global unique address (hash) of the DELETED message in the swarm
    messageDeletedAddress: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityAddress<P> | undefined
      : TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key for the value,
    // for feed store it will be hash of the message which deleted by this one.
    keyOrHash: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined
  ): Promise<void> => {
    if (this._dbName !== dbName) return;

    const keyToCheckAlreadyEmitted = this._isKeyValueDatabase ? keyOrHash : undefined;

    if (this._isMessageAlreadyEmitted(messageAddress, keyToCheckAlreadyEmitted)) {
      return;
    }

    this._emitter.emit(
      ESwarmMessageStoreEventNames.DELETE_MESSAGE,
      dbName,
      userID,
      messageAddress,
      messageDeletedAddress,
      keyOrHash
    );
    this._addMessageToListOfEmitted(messageAddress, keyToCheckAlreadyEmitted);
    await this._handleCacheUpdateOnDeleteMessage(userID, messageAddress, messageDeletedAddress, keyOrHash);
  };

  protected _handleDatabaseMessageError = (
    dbName: DBO['dbName'],
    // swarm message string failed to deserialize
    messageSerialized: T,
    // error occurred while deserializing the message
    error: Error,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ): void => {
    if (this._dbName === dbName) {
      this._emitter.emit(ESwarmMessageStoreEventNames.NEW_MESSAGE_ERROR, dbName, messageSerialized, error, messageAddress, key);
    }
  };

  protected _handleDatabaseReadyEvent = (dbName: DBO['dbName']): void => {
    if (this._dbName !== dbName) return;
    this._emitter.emit(ESwarmStoreEventNames.READY, dbName);
    this._setIsReady();
  };

  protected _emitInstanceClosed(): void {
    if (!this._dbName) {
      throw new Error('SwarmMessagesDatabase::_emitInstanceClosed: failed cause there is no database name defined');
    }
    this._emitter.emit(ESwarmStoreEventNames.CLOSE_DATABASE, this._dbName);
  }

  protected _handleDatabaseClosedEvent = async (dbName: DBO['dbName']): Promise<void> => {
    if (this._dbName !== dbName) return;
    this._emitInstanceClosed();
    await this._handleDatabaseClosed();
  };

  protected _emitDatabaseDropped(): void {
    if (!this._dbName) {
      throw new Error('SwarmMessagesDatabase::_emitDatabaseDropped: failed cause there is no database name defined');
    }
    this._emitter.emit(ESwarmStoreEventNames.DROP_DATABASE, this._dbName);
  }

  protected _handleDatabaseDroppedEvent = async (dbName: DBO['dbName']): Promise<void> => {
    if (this._dbName !== dbName) return;
    this._emitDatabaseDropped();
    await this._handleDatabaseClosed();
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
  protected _setSwarmMessagesStoreListeners(isSetListeners: boolean = true): void {
    const method = isSetListeners ? 'addListener' : 'removeListener';

    this._swarmMessageStore?.[method](ESwarmStoreEventNames.DB_LOADING, this._handleDatabaseLoadingEvent);
    this._swarmMessageStore?.[method](ESwarmStoreEventNames.UPDATE, this._handleDatabaseUpdatedEvent);
    this._swarmMessageStore?.[method](ESwarmMessageStoreEventNames.NEW_MESSAGE, this._handleDatabaseNewMessage);
    this._swarmMessageStore?.[method](ESwarmMessageStoreEventNames.DELETE_MESSAGE, this._handleDatabaseDeleteMessage);
    this._swarmMessageStore?.[method](ESwarmStoreEventNames.READY, this._handleDatabaseReadyEvent);
    this._swarmMessageStore?.[method](ESwarmStoreEventNames.CLOSE_DATABASE, this._handleDatabaseClosedEvent);
    this._swarmMessageStore?.[method](ESwarmStoreEventNames.DROP_DATABASE, this._handleDatabaseDroppedEvent);
  }

  protected _handleCacheUpdating = (): void => {
    this._emitter.emit(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING_STARTED);
  };

  protected _handleCacheUpdatingEnded = (
    messagesCached: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined
  ): void => {
    if (!messagesCached) {
      console.warn('_handleCacheUpdated::have no messages cached been updated during the process of a full cache update');
      return;
    }
    this._setMessagesCached(messagesCached);
    this.emitter.emit(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, messagesCached);
  };

  protected _handleCacheUpdated = (messagesCached: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined): void => {
    if (!messagesCached) {
      console.warn('_handleCacheUpdated::have no messages cached been updated');
      return;
    }
    this._setMessagesCached(messagesCached);
    this.emitter.emit(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, messagesCached);
  };

  /**
   * Set listeners for swarm messages cache events
   *
   * @protected
   * @param {boolean} [isSetListeners=true]
   * @memberof SwarmMessagesDatabase
   */
  protected _setCacheListeners(isSetListeners: boolean = true): void {
    if (!this._swarmMessagesCache) {
      throw new Error('Swarm messages cache is not defined');
    }

    const emitter = this._swarmMessagesCache.emitter;

    if (isSetListeners) {
      emitter.addListener(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING_STARTED, this._handleCacheUpdating);
      emitter.addListener(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING_OVER, this._handleCacheUpdatingEnded);
      emitter.addListener(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, this._handleCacheUpdated);
    } else {
      emitter.removeListener(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING_STARTED, this._handleCacheUpdating);
      emitter.removeListener(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING_OVER, this._handleCacheUpdatingEnded);
      emitter.removeListener(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, this._handleCacheUpdated);
    }
  }

  protected _setListeners(isSetListeners: boolean = true): void {
    this._setSwarmMessagesStoreListeners(isSetListeners);
    this._setCacheListeners(isSetListeners);
  }

  protected async _openDatabaseInstance(): Promise<void> {
    if (!this._swarmMessageStore) {
      throw new Error('Swarm message store must be provided');
    }
    if (!this._dbOptions) {
      throw new Error('There is no options provided for the database');
    }

    const result = await this._swarmMessageStore.openDatabase(this._dbOptions);

    if (result instanceof Error) {
      console.log('Failed to open the database');
      throw result;
    }
  }

  protected _getSwarmMessageStoreCollectMessages(): SMSM {
    if (!this._swarmMessagesCollector) {
      throw new Error('Swarm messages collector should be defined');
    }
    return this._swarmMessagesCollector;
  }

  protected _getSwarmMessagesCacheOptions(): DCO {
    if (!this._dbType) {
      throw new Error('Failed to defined database type');
    }
    if (!this._dbName) {
      throw new Error('Database name should not be empty');
    }
    return {
      dbInstance: this._getSwarmMessageStoreCollectMessages(),
      dbType: this._dbType,
      dbName: this._dbName,
    } as DCO;
  }

  protected async _startSwarmMessagesCache(): Promise<void> {
    const SwarmMessagesCacheConstructor = this._swarmMessagesCacheClassFromOptions;
    const swarmMessagesCacheOptions = this._getSwarmMessagesCacheOptions();
    const swarmMessagesCache = new SwarmMessagesCacheConstructor(swarmMessagesCacheOptions);

    await swarmMessagesCache.start();
    this._swarmMessagesCache = swarmMessagesCache;
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

  protected _unsetSwarmStoreListeners(): void {
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
  protected async _handleDatabaseClosed(): Promise<void> {
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
      throw new Error(`Failed to close the database ${dbName}: ${result.message}`);
    }
  }

  protected _closeSwarmMessagesCahceInstance(): Promise<void> {
    if (!this._swarmMessagesCache) {
      throw new Error('There is no active instance for caching swarm messages');
    }
    return this._swarmMessagesCache.close();
  }

  protected async _dropSwarmDatabaseInstance(): Promise<void> {
    if (!this._checkDatabaseProps()) {
      throw new Error('Database props are not valid');
    }

    const dbName = this._dbName;
    const result = await this._swarmMessageStore?.dropDatabase(dbName);

    if (result instanceof Error) {
      throw new Error(`Failed to drop the database ${dbName}: ${result.message}`);
    }
  }

  /**
   * Handle what to do with a cache of the messages
   * if a new message added to the storage.
   *
   * @protected
   * @param {MD} message
   * @param {TSwarmStoreDatabaseEntityUniqueAddress<P>} messageAddress
   * @param {string} [key]
   * @memberof SwarmMessagesDatabase
   */
  protected async _handleCacheUpdateOnNewMessage(
    message: MD,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ): Promise<void> {
    if (this._checkIsReady()) {
      await this._addMessageToCache(this._dbName, message, messageAddress, key);
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
  protected async _handleCacheUpdateOnDeleteMessage(
    userID: TSwarmMessageUserIdentifierSerialized,
    // the global unique address (hash) of the DELETE message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // deleted message address
    messageDeletedAddress: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityAddress<P> | undefined
      : TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key for the value,
    // for feed store it will be hash of the message which deleted by this one.
    keyOrHash: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined
  ): Promise<void> {
    if (this._checkIsReady()) {
      await this._removeMessageFromCache(messageDeletedAddress, keyOrHash);
    }
  }
}
