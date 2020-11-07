import {
  ISwarmMessageDatabaseEvents,
  ISwarmMessageDatabaseMessagingMethods,
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
} from '../swarm-message-store/swarm-message-store.types';
import { getEventEmitterInstance } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmMessageStoreEventNames } from '../swarm-message-store/swarm-message-store.const';
import { TSwarmMessageSerialized, TSwarmMessageInstance } from '../swarm-message/swarm-message-constructor.types';
import { TTypedEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import {
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import validateUserIdentifier from '../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier';
import { TSwarmMessageUserIdentifierSerialized } from '../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { SwarmMessagesDatabaseCache } from './swarm-messages-database-subclasses/swarm-messages-database-cache';
import {
  ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions,
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
} from './swarm-messages-database.types';
import { isConstructor } from '../../utils/common-utils/common-utils-classes';
import {
  ESwarmMessagesDatabaseCacheEventsNames,
  SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_UPDATE_RETRY_DELAY_MS,
  SWARM_MESSAGES_DATABASE_MESSAGES_EMITTED_UNIQ_ID_ADDRESS_PREFIX,
} from './swarm-messages-database.const';
import { ISwarmMessageStoreMessageWithMeta } from '../swarm-message-store/swarm-message-store.types';
import { delay } from '../../utils/common-utils/common-utils-timer';
import { SWARM_MESSAGES_DATABASE_MESSAGES_MAX_ATTEMPTS_CACHE_UPDATE } from './swarm-messages-database.const';
import {
  ISwarmStoreConnectorBasic,
  ISwarmStoreConnector,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
} from '../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmMessageInstanceEncrypted } from '../swarm-message/swarm-message-constructor.types';
import { OmitFirstArg } from '../../types/helper.types';

export class SwarmMessagesDatabase<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, ConnectorBasic, PO>,
  DBO extends TSwarmStoreDatabaseOptions<P, T>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, ConnectorBasic, PO, DBO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MSI, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    ConnectorBasic,
    PO,
    CO,
    DBO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<P, T, DbType, ConnectorBasic, PO, DBO, CO, CFO, ConnectorMain, MSI, GAC, MCF, ACO, O>
> implements ISwarmMessageDatabaseMessagingMethods<P, T, DbType, Exclude<MSI, T>, SMS> {
  get dbName(): DBO['dbName'] | undefined {
    return this._dbName;
  }

  get dbType(): DbType {
    return this._dbType as DbType;
  }

  get isReady(): boolean {
    return this._isReady && !!this._swarmMessageStore;
  }

  get emitter(): TTypedEmitter<ISwarmMessageDatabaseEvents<P, T, DbType, DBO, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>> {
    return this._emitter;
  }

  get isMessagesListContainsAllMessages(): boolean {
    return !!this._swarmMessagesCache?.whetherMessagesListContainsAllMessages;
  }

  get whetherMessagesListUpdateInProgress(): boolean {
    return !!this._swarmMessagesCache?.isUpdating;
  }

  get cachedMessages():
    | TSwarmMessageDatabaseMessagesCached<P, DbType, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>
    | undefined {
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
    ISwarmMessageDatabaseEvents<P, T, DbType, DBO, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>
  >();

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
  protected _swarmMessagesCache?: ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MSI>;

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

  protected _cacheOptions?: ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions<P, T, DbType, DBO, MSI>;

  protected _isReady: boolean = false;

  protected _newMessagesEmitted = new Set<string>();

  /**
   * Swarm messages cached
   *
   * @protected
   * @type {(TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined)}
   * @memberof SwarmMessagesDatabase
   */
  protected _messagesCached:
    | TSwarmMessageDatabaseMessagesCached<P, DbType, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>
    | undefined;

  async connect(options: ISwarmMessagesDatabaseConnectOptions<P, T, DbType, DBO, Exclude<MSI, T>, SMS>): Promise<void> {
    this._handleOptions(options);
    await this._openDatabaseInstance();
    await this._startSwarmMessagesCache();
    this._setListeners();
    this._setIsReady();
    this._updateMessagesCache();
  }

  close = async (): Promise<void> => {
    if (!this.isReady) {
      console.warn('SwarmMessageDatabase instance was already closed');
      return;
    }
    this._unsetIsReady();
    await this._closeSwarmDatabaseInstance();
    await this._closeSwarmMessagesCahceInstance();
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

  // eslint-disable-next-line @typescript-eslint/member-ordering
  addMessage = ((...args: Parameters<OmitFirstArg<SMS['addMessage']>>): ReturnType<SMS['addMessage']> => {
    if (!this._checkIsReady()) {
      throw new Error('The instance is not ready to use');
    }
    // TODO - remove cast to any https://github.com/microsoft/TypeScript/issues/28010
    return (this._swarmMessageStore.addMessage as any)(this._dbName, ...args);
  }) as OmitFirstArg<SMS['addMessage']>;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  deleteMessage = ((messageAddressOrKey: ISwarmMessageStoreDeleteMessageArg<P>): ReturnType<SMS['deleteMessage']> => {
    if (!this._checkIsReady()) {
      throw new Error('The instance is not ready to use');
    }
    return this._swarmMessageStore.deleteMessage(this._dbName, messageAddressOrKey) as ReturnType<SMS['deleteMessage']>;
  }) as OmitFirstArg<SMS['deleteMessage']>;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  collect = ((...args: Parameters<OmitFirstArg<SMS['collect']>>): ReturnType<SMS['collect']> => {
    if (!this._checkIsReady()) {
      throw new Error('The instance is not ready to use');
    }
    // TODO - remove cast to any https://github.com/microsoft/TypeScript/issues/28010
    return (this._swarmMessageStore.collect as any)(this._dbName, ...args);
  }) as OmitFirstArg<SMS['collect']>;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  collectWithMeta = ((
    ...args: Parameters<OmitFirstArg<SMS['collectWithMeta']>>
  ): ReturnType<OmitFirstArg<SMS['collectWithMeta']>> => {
    if (!this._checkIsReady()) {
      throw new Error('The instance is not ready to use');
    }
    // TODO - remove cast to any https://github.com/microsoft/TypeScript/issues/28010
    return (this._swarmMessageStore.collectWithMeta as any)(this._dbName, ...args);
  }) as OmitFirstArg<SMS['collectWithMeta']>;

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
    ConnectorBasic,
    PO,
    CO,
    DBO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO,
    O
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

  protected _validateOptions(options: ISwarmMessagesDatabaseConnectOptions<P, T, DbType, DBO, Exclude<MSI, T>, SMS>): void {
    assert(!!options, 'An options object must be provided');
    assert(typeof options === 'object', 'Options must be an object');
    assert(!!options.dbOptions, 'An options for database must be provided');
    assert(typeof options.dbOptions === 'object', 'An options for database must be an object');
    assert(!!options.swarmMessageStore, 'An instance implemented SwarmMessageStore interface must be provided');
    assert(options.swarmMessageStore.isReady, 'An implementation of the ISwarmMessageStore interface must be ready to use');
    assert(!!options.user, 'The current user options must be defined');
    assert(typeof options.user === 'object', 'The current user options should be an object');
    validateUserIdentifier(options.user.userId);
  }

  protected _setDbOptions(dbOptions: TSwarmStoreDatabaseOptions<P, T>): void {
    this._dbOptions = dbOptions;
    this._dbName = dbOptions.dbName;
    this._dbType = dbOptions.dbType as DbType;
  }

  protected _setUserOptions(optionsUser: ISwarmMessagesDatabaseConnectCurrentUserOptions): void {
    this._currentUserOptons = optionsUser;
  }

  protected _setOptions(options: ISwarmMessagesDatabaseConnectOptions<P, T, DbType, DBO, Exclude<MSI, T>, SMS>): void {
    this._setDbOptions(options.dbOptions);
    this._swarmMessageStore = options.swarmMessageStore;
    this._setUserOptions(options.user);
  }

  protected _validateCacheOptions(
    options?: ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions<P, T, DbType, DBO, MSI>
  ): void {
    if (!options) {
      return;
    }
    assert(typeof options === 'object', 'Swarm messages cache options must be an object');
    if (options.cacheConstructor) {
      assert(isConstructor(options.cacheConstructor), 'cacheConstructor option should be a constructor');
    }
  }

  protected _setCacheOptions(
    options: ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions<P, T, DbType, DBO, MSI>
  ): void {
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
  protected _handleOptions(options: ISwarmMessagesDatabaseConnectOptions<P, T, DbType, DBO, Exclude<MSI, T>, SMS>): void {
    this._validateOptions(options);
    this._setOptions(options);
    if (options.cacheOptions) {
      this._validateCacheOptions(options.cacheOptions);
      this._setCacheOptions(options.cacheOptions);
    }
  }

  protected _checkDatabaseProps(): this is Omit<
    ISwarmMessagesDatabaseReady<P, T, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>,
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

  protected _setMessagesCached = (
    messagesCached: TSwarmMessageDatabaseMessagesCached<P, DbType, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>
  ) => {
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

  protected _getSwarmMessageWithMeta<MD extends Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>(
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
   * @param {Exclude<MSI, T | ISwarmMessageInstanceEncrypted>} message
   * @param {TSwarmStoreDatabaseEntityAddress<P>} messageAddress
   * @param {TSwarmStoreDatabaseEntityKey<P>} [key]
   * @returns {Promise<void>}
   * @memberof SwarmMessagesDatabase
   */
  protected _addMessageToCache(
    dbName: DBO['dbName'],
    message: Exclude<MSI, T | ISwarmMessageInstanceEncrypted>,
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
   * @param {Exclude<MSI, T | ISwarmMessageInstanceEncrypted>} [message] - optional cause for DELETE messages
   * a message object by itself may be not exists.
   * @returns {string}
   */
  protected _getMessageUniqueIdForEmittedAsNewList = (
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>,
    message?: Exclude<MSI, T | ISwarmMessageInstanceEncrypted>
  ): string => {
    return message ? message.sig : `${SWARM_MESSAGES_DATABASE_MESSAGES_EMITTED_UNIQ_ID_ADDRESS_PREFIX}::${messageAddress}`;
  };

  /**
   * Add message to the list of a messages uniq id's which
   * were emitted as a new before
   *
   * @param {TSwarmStoreDatabaseEntityAddress<P>} messageAddress
   * @param {TSwarmStoreDatabaseEntityKey<P>} [key]
   * @param {Exclude<MSI, T | ISwarmMessageInstanceEncrypted>} [message] - optional cause for DELETE messages
   * a message object by itself may be not exists.
   */
  protected _addMessageToListOfEmitted = (
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>,
    message?: Exclude<MSI, T | ISwarmMessageInstanceEncrypted>
  ): void => {
    this._newMessagesEmitted.add(this._getMessageUniqueIdForEmittedAsNewList(messageAddress, key, message));
  };

  /**
   * Checks whether the message is already been emitted as a new message
   *
   * @param {TSwarmStoreDatabaseEntityAddress<P>} messageAddress
   * @param {TSwarmStoreDatabaseEntityKey<P>} [key]
   * @param {Exclude<MSI, T | ISwarmMessageInstanceEncrypted>} [message] - optional cause for DELETE messages
   * a message object by itself may be not exists.
   * @returns {boolean}
   */
  protected _isMessageAlreadyEmitted = (
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>,
    message?: Exclude<MSI, T | ISwarmMessageInstanceEncrypted>
  ): boolean => {
    return this._newMessagesEmitted.has(this._getMessageUniqueIdForEmittedAsNewList(messageAddress, key, message));
  };

  protected _handleDatabaseNewMessage = (
    dbName: DBO['dbName'],
    message: Exclude<MSI, T | ISwarmMessageInstanceEncrypted>,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ) => {
    if (this._dbName !== dbName) return;

    if (this._isMessageAlreadyEmitted(messageAddress, key, message)) {
      return;
    }

    this._emitter.emit(ESwarmMessageStoreEventNames.NEW_MESSAGE, dbName, message, messageAddress, key);
    this._addMessageToListOfEmitted(messageAddress, key, message);
    this._handleCacheUpdateOnNewMessage(message, messageAddress, key);
  };

  protected _handleDatabaseDeleteMessage = (
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
  ) => {
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
    this._handleCacheUpdateOnDeleteMessage(userID, messageAddress, messageDeletedAddress, keyOrHash);
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
  ) => {
    if (this._dbName !== dbName) return;
    this._emitter.emit(ESwarmMessageStoreEventNames.NEW_MESSAGE_ERROR, dbName, messageSerialized, error, messageAddress, key);
  };

  protected _handleDatabaseReadyEvent = (dbName: DBO['dbName']): void => {
    if (this._dbName !== dbName) return;
    this._emitter.emit(ESwarmStoreEventNames.READY, dbName);
    this._setIsReady();
  };

  protected _emitInstanceClosed() {
    if (!this._dbName) {
      throw new Error('SwarmMessagesDatabase::_emitInstanceClosed: failed cause there is no database name defined');
    }
    this._emitter.emit(ESwarmStoreEventNames.CLOSE_DATABASE, this._dbName);
  }

  protected _handleDatabaseClosedEvent = (dbName: DBO['dbName']): void => {
    if (this._dbName !== dbName) return;
    this._emitInstanceClosed();
    this._handleDatabaseClosed();
  };

  protected _emitDatabaseDropped(): void {
    if (!this._dbName) {
      throw new Error('SwarmMessagesDatabase::_emitDatabaseDropped: failed cause there is no database name defined');
    }
    this._emitter.emit(ESwarmStoreEventNames.DROP_DATABASE, this._dbName);
  }

  protected _handleDatabaseDroppedEvent = (dbName: DBO['dbName']): void => {
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
    this._emitter.emit(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING);
  };

  protected _handleCacheUpdated = (messagesCached: TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined): void => {
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

    const { emitter } = this._swarmMessagesCache;
    const method = isSetListeners ? 'addListener' : 'removeListener';

    emitter[method](ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING as any, this._handleCacheUpdating);
    emitter[method](ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED as any, this._handleCacheUpdated);
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
      throw new Error(`Failed top open the database: ${result.message}`);
    }
  }

  protected _getSwarmMessagesCacheOptions(): ISwarmMessagesDatabaseCacheOptions<P, DbType> {
    if (!this._dbType) {
      throw new Error('Failed to defined database type');
    }
    if (!this._dbName) {
      throw new Error('Database name should not be empty');
    }
    return {
      dbInstance: this,
      dbType: this._dbType,
      dbName: this._dbName,
    };
  }

  protected async _startSwarmMessagesCache(): Promise<void> {
    const SwarmMessagesCacheConstructor = this._cacheOptions?.cacheConstructor || SwarmMessagesDatabaseCache;
    const swarmMessagesCacheOptions = this._getSwarmMessagesCacheOptions();
    const swarmMessagesCache = new SwarmMessagesCacheConstructor(swarmMessagesCacheOptions) as ISwarmMessagesDatabaseCache<
      P,
      T,
      DbType,
      DBO,
      MSI
    >;

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
      throw new Error(`Failed to close the database ${dbName}: ${result.message}`);
    }
  }

  protected _closeSwarmMessagesCahceInstance(): Promise<void> {
    if (!this._swarmMessagesCache) {
      throw new Error('There is no active instance for caching swarm messages');
    }
    return this._swarmMessagesCache.close();
  }

  protected async _dropSwarmDatabaseInstance() {
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
   * @param {Exclude<MSI, T | ISwarmMessageInstanceEncrypted>} message
   * @param {TSwarmStoreDatabaseEntityUniqueAddress<P>} messageAddress
   * @param {string} [key]
   * @memberof SwarmMessagesDatabase
   */
  protected _handleCacheUpdateOnNewMessage(
    message: Exclude<MSI, T | ISwarmMessageInstanceEncrypted>,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ) {
    if (this._checkIsReady()) {
      this._addMessageToCache(this._dbName, message, messageAddress, key);
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
    // deleted message address
    messageDeletedAddress: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityAddress<P> | undefined
      : TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key for the value,
    // for feed store it will be hash of the message which deleted by this one.
    keyOrHash: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined
  ) {
    if (this._checkIsReady()) {
      this._removeMessageFromCache(messageDeletedAddress, keyOrHash);
    }
  }
}
