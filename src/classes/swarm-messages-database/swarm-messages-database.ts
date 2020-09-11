import {
  ISwarmMessageDatabaseMessagingMethods,
  ISwarmMessagesDatabaseConnectOptions,
  TSwarmMessagesDatabaseType,
  ISwarmMessageDatabaseEvents,
  ISwarmMessagesDatabaseReady,
} from './swarm-messages-database.types';
import {
  ESwarmStoreConnector,
  ESwarmStoreEventNames,
} from '../swarm-store-class/swarm-store-class.const';
import assert from 'assert';
import { TSwarmStoreDatabaseOptions } from '../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStore } from '../swarm-message-store/swarm-message-store.types';
import { EventEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmMessageStoreEventNames } from '../swarm-message-store/swarm-message-store.const';
import { ISwarmMessageBody } from '../swarm-message/swarm-message-constructor.types';

export class SwarmMessagesDatabase<P extends ESwarmStoreConnector>
  implements ISwarmMessageDatabaseMessagingMethods<P> {
  get dbName(): string | undefined {
    return this._dbName;
  }

  get dbType(): TSwarmMessagesDatabaseType<P> | undefined {
    return this._dbType;
  }

  get isReady(): boolean {
    return this._isReady && !!this._swarmMessageStore;
  }

  get emitter(): EventEmitter<ISwarmMessageDatabaseEvents<P>> {
    return this._emitter;
  }

  /**
   * name of the databasESwarmStoreConnectorOrbitDbDatabaseTypee
   *
   * @protected
   * @type {string}
   * @memberof SwarmMessagesDatabase
   */
  protected _dbName?: string;

  protected _dbType?: TSwarmMessagesDatabaseType<P>;

  protected _emitter = new EventEmitter<ISwarmMessageDatabaseEvents<P>>();

  /**
   * An instance implemented ISwarmMessageStore
   * interface.
   *
   * @protected
   * @type {ISwarmMessageStore<P>}
   * @memberof SwarmMessagesDatabase
   */
  protected _swarmMessageStore?: ISwarmMessageStore<P>;

  /**
   * Options for the database which used for
   * database initialization via ISwarmMessageStore.
   *
   * @protectedimport { ISwarmMessagesDatabaseReady, } from './swarm-messages-database.types';
   * @type {TSwarmStoreDatabaseOptions}
   * @memberof SwarmMessagesDatabase
   */
  protected _dbOptions?: TSwarmStoreDatabaseOptions<P>;

  protected _isReady: boolean = false;

  async connect(
    options: ISwarmMessagesDatabaseConnectOptions<P>
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
    ...args: Parameters<ISwarmMessageDatabaseMessagingMethods<P>['addMessage']>
  ): ReturnType<ISwarmMessageDatabaseMessagingMethods<P>['addMessage']> => {
    if (!this._checkIsReady()) {
      throw new Error('The instance is not ready to use');
    }
    return this._swarmMessageStore.addMessage(this._dbName, ...args);
  };

  deleteMessage = (
    ...args: Parameters<
      ISwarmMessageDatabaseMessagingMethods<P>['deleteMessage']
    >
  ): ReturnType<ISwarmMessageDatabaseMessagingMethods<P>['deleteMessage']> => {
    if (!this._checkIsReady()) {
      throw new Error('The instance is not ready to use');
    }
    return this._swarmMessageStore.deleteMessage(this._dbName, ...args);
  };

  collect = (
    ...args: Parameters<ISwarmMessageDatabaseMessagingMethods<P>['collect']>
  ): ReturnType<ISwarmMessageDatabaseMessagingMethods<P>['collect']> => {
    if (!this._checkIsReady()) {
      throw new Error('The instance is not ready to use');
    }
    return this._swarmMessageStore.collect(this._dbName, ...args);
  };

  /**
   * Checks if the instance is ready to use
   *
   * @protected
   * @memberof SwarmMessagesDatabase
   */
  protected _checkIsReady(): this is ISwarmMessagesDatabaseReady<P> {
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
    return true;
  }

  protected _validateOptions(
    options: ISwarmMessagesDatabaseConnectOptions<P>
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
  }

  protected _setDbOptions(dbOptions: TSwarmStoreDatabaseOptions<P>): void {
    this._dbOptions = dbOptions;
    this._dbName = dbOptions.dbName;
    this._dbType = dbOptions.dbType as
      | TSwarmMessagesDatabaseType<P>
      | undefined;
  }

  protected _setOptions(
    options: ISwarmMessagesDatabaseConnectOptions<P>
  ): void {
    this._setDbOptions(options.dbOptions);
    this._swarmMessageStore = options.swarmMessageStore;
  }

  /**
   * Handle options provided for the connect
   * method.
   *
   * @protected
   * @param {ISwarmMessage_handleDatabaseClosedsDatabaseConnectOptions<P>} options
   * @memberof SwarmMessagesDatabase
   */
  protected _handleOptions(options: ISwarmMessagesDatabaseConnectOptions<P>) {
    this._validateOptions(options);
    this._setOptions(options);
  }

  protected _checkDatabaseProps(): this is Omit<
    ISwarmMessagesDatabaseReady<P>,
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
    this._emitter.emit(ESwarmStoreEventNames.LOADING, dbName, percentage);
  };

  protected _handleDatabaseUpdatedEvent = (dbName: string): void => {
    if (this._dbName !== dbName) return;
    this._emitter.emit(ESwarmStoreEventNames.UPDATE, dbName);
  };

  protected _handleDatabaseNewMessage = (
    dbName: string,
    message: ISwarmMessageBody,
    // the global unique address (hash) of the message in the swarm
    messageAddress: string,
    // for key-value store it will be the key
    key?: string
  ) => {
    if (this._dbName !== dbName) return;
    this._emitter.emit(
      ESwarmMessageStoreEventNames.NEW_MESSAGE,
      dbName,
      message,
      messageAddress,
      key
    );
  };

  protected _handleDatabaseDeleteMessage = (
    dbName: string,
    userID: string,
    // the global unique address (hash) of the DELETE message in the swarm
    messageAddress: string,
    // for key-value store it will be the key for the value,
    // for feed store it will be hash of the message which deleted by this one.
    keyOrHash?: string
  ) => {
    if (this._dbName !== dbName) return;
    this._emitter.emit(
      ESwarmMessageStoreEventNames.DELETE_MESSAGE,
      dbName,
      userID,
      messageAddress,
      keyOrHash
    );
  };

  protected _handleDatabaseMessageError = (
    dbName: string,
    // swarm message string failed to deserialize
    messageSerialized: string,
    // error occurred while deserializing the message
    error: Error,
    // the global unique address (hash) of the message in the swarm
    messageAddress: string,
    // for key-value store it will be the key
    key?: string
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
    this._emitter.emit(ESwarmStoreEventNames.CLOSE_DATABASE, this._dbName);
  }

  protected _handleDatabaseClosedEvent = (dbName: string): void => {
    if (this._dbName !== dbName) return;
    this._emitInstanceClosed();
    this._handleDatabaseClosed();
  };

  protected _emitDatabaseDropped(): void {
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
}
