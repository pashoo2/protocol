import {
  ISwarmMessageDatabaseMessagingMethods,
  ISwarmMessagesDatabaseConnectOptions,
  TSwarmMessagesDatabaseType,
  TSwarmMessageDatabaseEvents,
} from './swarm-messages-database.types';
import {
  ESwarmStoreConnector,
  ESwarmStoreEventNames,
} from '../swarm-store-class/swarm-store-class.const';
import assert from 'assert';
import { TSwarmStoreDatabaseOptions } from '../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStore } from '../swarm-message-store/swarm-message-store.types';
import { EventEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';

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

  get emitter(): EventEmitter<TSwarmMessageDatabaseEvents<P>> {
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

  protected _emitter = new EventEmitter<TSwarmMessageDatabaseEvents<P>>();

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
   * @protected
   * @type {TSwarmStoreDatabaseOptions}
   * @memberof SwarmMessagesDatabase
   */
  protected _dbOptions?: TSwarmStoreDatabaseOptions<P>;

  protected _isReady: boolean = false;

  async connect(
    options: ISwarmMessagesDatabaseConnectOptions<P>
  ): Promise<void> {
    this._handleOptions(options);
    this._setListeners();
  }

  async close(): Promise<void> {
    if (!this.isReady) {
      console.warn('SwarmMessageDatabase instance was already closed');
      return;
    }
    this._unsetIsReady();
    await this._closeSwarmDatabaseInstance();
    this._emitInstanceClosed();
    this._handleDatabaseClosed();
  }

  async drop(): Promise<void> {
    if (!this.isReady) {
      console.warn('SwarmMessageDatabase instance was already closed');
      return;
    }
    this._unsetIsReady();
    await this._dropSwarmDatabaseInstance();
    this._emitDatabaseDropped();
    this._handleDatabaseClosed();
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

  /**_unsetListeners
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

  protected _checkDatabaseProps() {
    const swarmMessageStore = this._swarmMessageStore;

    if (!swarmMessageStore) {
      throw new Error(
        'A SwarmMessageStore interface implementation is not defined'
      );
    }

    const { dbName: _dbName } = this;

    if (!_dbName) {
      throw new Error('A database name is not defined');
    }
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

  protected _handleDatabaseNewEntryEvent = (
    dbName: string,
    entry: any,
    entryAddress: string,
    heads: any,
    dbType?: TSwarmMessagesDatabaseType<P>
  ) => {
    if (this._dbName !== dbName) return;
    this._emitter.emit(
      ESwarmStoreEventNames.LOADING,
      dbName,
      entry,
      entryAddress,
      heads,
      dbType
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
   * Set listeners to listen events of the SwarmMessageStore
   * implementation.
   *
   * @protected
   * @memberof SwarmMessagesDatabase
   */
  protected _setListeners(): void {
    this._swarmMessageStore?.addListener(
      ESwarmStoreEventNames.DB_LOADING,
      this._handleDatabaseLoadingEvent
    );
    this._swarmMessageStore?.addListener(
      ESwarmStoreEventNames.UPDATE,
      this._handleDatabaseUpdatedEvent
    );
    this._swarmMessageStore?.addListener(
      ESwarmStoreEventNames.NEW_ENTRY,
      this._handleDatabaseNewEntryEvent
    );
    this._swarmMessageStore?.addListener(
      ESwarmStoreEventNames.READY,
      this._handleDatabaseReadyEvent
    );
    this._swarmMessageStore?.addListener(
      ESwarmStoreEventNames.CLOSE_DATABASE,
      this._handleDatabaseClosedEvent
    );
    this._swarmMessageStore?.addListener(
      ESwarmStoreEventNames.DROP_DATABASE,
      this._handleDatabaseDroppedEvent
    );
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
    this._swarmMessageStore?.addListener(
      ESwarmStoreEventNames.DB_LOADING,
      this._handleDatabaseLoadingEvent
    );
    this._swarmMessageStore?.addListener(
      ESwarmStoreEventNames.UPDATE,
      this._handleDatabaseUpdatedEvent
    );
    this._swarmMessageStore?.addListener(
      ESwarmStoreEventNames.NEW_ENTRY,
      this._handleDatabaseNewEntryEvent
    );
    this._swarmMessageStore?.addListener(
      ESwarmStoreEventNames.READY,
      this._handleDatabaseReadyEvent
    );
    this._swarmMessageStore?.addListener(
      ESwarmStoreEventNames.CLOSE_DATABASE,
      this._handleDatabaseClosedEvent
    );
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
    this._checkDatabaseProps();

    const dbName = this._dbName;
    const result = await this._swarmMessageStore?.closeDatabase(dbName!);

    if (result instanceof Error) {
      throw new Error(
        `Failed to close the database ${dbName}: ${result.message}`
      );
    }
  }

  protected async _dropSwarmDatabaseInstance() {
    this._checkDatabaseProps();

    const dbName = this._dbName;
    const result = await this._swarmMessageStore?.dropDatabase(dbName!);

    if (result instanceof Error) {
      throw new Error(
        `Failed to drop the database ${dbName}: ${result.message}`
      );
    }
  }
}
