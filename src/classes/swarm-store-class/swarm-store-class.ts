import { EventEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';
import assert from 'assert';
import {
  TSwarmStoreDatabaseRequestMethodReturnType,
  ISwarmStoreOptionsOfDatabasesKnownList,
  ISwarmStoreDatabaseBaseOptions,
  ISwarmStoreDatabasesCommonStatusList,
} from './swarm-store-class.types';
import {
  ESwarmStoreConnector,
  ESwarmStoreEventNames,
  ESwarmStoreDbStatus,
  SWARM_STORE_CONNECTORS,
  SWARM_STORE_DATABASES_STATUSES_EMPTY,
  SWARM_STORE_DATABASES_PERSISTENT_LIST_DIRECTORY_DEFAULT,
} from './swarm-store-class.const';
import { IStorageCommon } from 'types/storage.types';
import { calculateHash } from 'utils/hash-calculation-utils';
import { TSwarmStoreDatabaseType } from './swarm-store-class.types';
import {
  ISwarmStoreConnector,
  ISwarmStoreDatabasesStatuses,
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseMethod,
  TSwarmStoreDatabaseMethodArgument,
  TSwarmStoreConnectorEventRetransmitter,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreEvents,
  ISwarmStore,
  ISwarmStoreOptions,
} from './swarm-store-class.types';

/**
 * This is decentralized storage.
 * Allows to create a new database,
 * store a value, grant access,
 * validate, store a data on it.
 *
 * @export
 * @class SwarmStore
 * @extends {EventEmitter<ISwarmStoreEvents>}
 * @implements {ISwarmStore<P>}
 * @template P
 */
export class SwarmStore<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  E extends ISwarmStoreEvents = ISwarmStoreEvents
> extends EventEmitter<E> implements ISwarmStore<P, ItemType, DbType> {
  public get isReady(): boolean {
    return !!this.connector && this.connector.isReady;
  }

  public get isClosed(): boolean {
    return !!this.connector && this.connector.isClosed;
  }

  public get dbStatuses(): ISwarmStoreDatabasesStatuses {
    if (this.isReady && !this.isClosed) {
      return this.dbStatusesExisting;
    }
    return SWARM_STORE_DATABASES_STATUSES_EMPTY;
  }

  public get databases(): ISwarmStoreDatabasesCommonStatusList {
    const { databasesKnownOptionsList, databasesOpenedList } = this;

    return {
      get options() {
        return databasesKnownOptionsList;
      },
      get opened() {
        return databasesOpenedList;
      },
    };
  }

  protected connector: ISwarmStoreConnector<P, ItemType, DbType> | undefined;

  protected dbStatusesExisting: ISwarmStoreDatabasesStatuses = SWARM_STORE_DATABASES_STATUSES_EMPTY;

  protected storeConnectorEventsHandlers:
    | Record<ESwarmStoreEventNames, TSwarmStoreConnectorEventRetransmitter>
    | undefined;

  /**
   * List of databases options opened during this session
   * or during previous sessions
   * (if an instanceof databasePersistantListStorage provided)
   * and which were not dropped.
   * If a database not opened because it's failed,
   * then it's options won't be added to the list.
   *
   * @protected
   * @type {ISwarmStoreOptionsOfDatabasesKnownList}
   * @memberof SwarmStore
   */
  protected databasesKnownOptionsList: ISwarmStoreOptionsOfDatabasesKnownList = {};

  /**
   * Databases opened during this session.
   *
   * @protected
   * @type {Record<string, boolean>}
   * @memberof SwarmStore
   */
  protected databasesOpenedList: Record<string, boolean> = {};

  /**
   * storage with list of all databases opened and not dropped.
   *
   * @protected
   * @type {IStorageCommon}
   * @memberof SwarmStore
   */
  protected databasePersistantListStorage?: IStorageCommon;

  /**
   * A directory name under which all the databases
   * will be listed.
   *
   * @protected
   * @type {string} []
   * @memberof SwarmStore
   */
  protected databasesLisPersistantKey?: string;

  /**
   * Open connection with all databases listed in the options.
   * If a databasePersistantListStorage provided, then a list with
   * all databases opened and not dropped will be saved.
   *
   * @param {ISwarmStoreOptions<P, ItemType>} options
   * @param {IStorageCommon} [databasePersistantListStorage]
   * @returns {(Promise<Error | void>)}
   * @memberof SwarmStore
   */
  public async connect(
    options: ISwarmStoreOptions<P, ItemType>,
    databasePersistantListStorage?: IStorageCommon
  ): Promise<Error | void> {
    let connectionWithConnector:
      | ISwarmStoreConnector<P, ItemType, DbType>
      | undefined;
    try {
      this.validateOptions(options);
      if (databasePersistantListStorage) {
        await this.handleDatabasePersistentList(
          databasePersistantListStorage,
          this.getDatabasePersistentListDirectory(options)
        );
      }
      connectionWithConnector = this.createConnectionWithStorageConnector(
        options
      );
      this.createStatusTable(options);
      this.subscribeOnConnector(connectionWithConnector);
      await this.startConnectionWithConnector(connectionWithConnector, options);
    } catch (err) {
      if (connectionWithConnector) {
        this.unSubscribeFromConnector(connectionWithConnector);
      }
      return err;
    }
  }

  /**
   * cloase all connections
   *
   * @returns {(Promise<Error | undefined>)}
   * @memberof SwarmStore
   */
  public async close(): Promise<Error | undefined> {
    let error: Error | undefined;
    const { connector } = this;

    try {
      await this.closeConnector();
    } catch (err) {
      error = err;
    }
    this.reset();
    if (connector) {
      this.unSubscribeFromConnector(connector);
    }
    // this.removeAllListeners();
    return error;
  }

  /**
   * open a new connection to the database specified
   *
   * @param {TSwarmStoreDatabaseOptions} dbOptions
   * @returns {(Promise<void | Error>)}
   * @memberof SwarmStore
   */
  public async openDatabase(
    dbOptions: TSwarmStoreDatabaseOptions<P, ItemType>
  ): Promise<void | Error> {
    const { connector } = this;

    if (!connector) {
      return new Error('Connector is not exists');
    }
    this.setEmptyStatusForDb(dbOptions.dbName);

    const result = await connector.openDatabase(dbOptions);

    if (!(result instanceof Error)) {
      this.handleDatabaseOpened(dbOptions);
    } else {
      this.handleDatabaseClosed(dbOptions);
    }
    return result;
  }

  /**
   * close an existing connection to the database
   * with the name specified
   * if exists
   *
   * @param {TSwarmStoreDatabaseOptions} dbOptions
   * @returns {(Promise<void | Error>)}
   * @memberof SwarmStore
   */
  public async closeDatabase(dbName: string): Promise<void | Error> {
    const { connector } = this;

    if (!connector) {
      return new Error('Connector is not exists');
    }
    this.setClosedStatusForDb(dbName);

    const result = connector.closeDatabase(dbName);

    if (!(result instanceof Error)) {
      const dbOptions = this.getDatabaseOptions(dbName);

      if (dbOptions) {
        this.handleDatabaseClosed(dbOptions);
      }
    }
    return result;
  }

  public async dropDatabase(dbName: string): Promise<void | Error> {
    const { connector } = this;

    if (!connector) {
      return new Error('Connector is not exists');
    }
    this.setClosedStatusForDb(dbName);

    const dropDatabaseResult = await connector.dropDatabase(dbName);

    if (dropDatabaseResult instanceof Error) {
      return dropDatabaseResult;
    }

    const dbOptions = this.getDatabaseOptions(dbName);

    if (dbOptions) {
      this.handleDatabaseDropped(dbOptions);
    }
  }

  /**
   * send request (get, set and so on) to a swarm database
   *
   * @template V
   * @template A
   * @param {TSwarmStoreDatabaseOptions['dbName']} dbName
   * @param {TSwarmStoreDatabaseMethod<P>} dbMethod
   * @param {TSwarmStoreDatabaseMethodArgument<P, V>} arg
   * @returns {(Promise<TSwarmStoreDatabaseMethodAnswer<P, A> | Error>)}
   * @memberof SwarmStore
   */
  public async request<A extends ItemType, DT extends DbType>(
    dbName: TSwarmStoreDatabaseOptions<P, A>['dbName'],
    dbMethod: TSwarmStoreDatabaseMethod<P>,
    arg: TSwarmStoreDatabaseMethodArgument<P, A, DbType>
  ): Promise<TSwarmStoreDatabaseRequestMethodReturnType<P, A>> {
    const { connector } = this;

    if (!connector) {
      return new Error('Connector is not exists');
    }
    this.setClosedStatusForDb(dbName);
    return connector.request<A, DT>(dbName, dbMethod, arg);
  }

  /**
   * throws an error if options provided
   * are not valid
   *
   * @protected
   * @param {ISwarmStoreOptions<P>} options
   * @memberof SwarmStore
   * @throws
   */
  protected validateOptions(options: ISwarmStoreOptions<P, ItemType>): void {
    assert(options, 'An options must be specified');
    assert(
      typeof options === 'object',
      'The options specified is not an object'
    );
    assert(
      options.databases instanceof Array,
      'The options for databases must be an array'
    );
    options.databases.forEach((optionsDb) => {
      assert(optionsDb, 'Database options must be specified');
      assert(
        typeof optionsDb === 'object',
        'Database options must be an object'
      );
      assert(
        typeof optionsDb.dbName === 'string',
        'Database name must be a string'
      );
    });
    assert(
      typeof options.directory === 'string',
      'Directory must be a string if specified'
    );
    assert(options.provider, 'Provider must be specified');
    assert(
      Object.values(ESwarmStoreConnector).includes(options.provider),
      `There is unknown provider specified "${options.provider}"`
    );
    assert(
      options.providerConnectionOptions &&
        typeof options.providerConnectionOptions === 'object',
      'Options specifically for the provider must be set and be an object'
    );
    assert(options.userId, 'The user identity must be provided');
    assert(
      typeof options.userId === 'string',
      'The user identity must be a string'
    );
    assert(options.credentials, 'A credentials must be provided');
    assert(
      typeof options.credentials === 'object',
      'Credentials must be an object'
    );
    assert(
      options.credentials.login,
      "User's login must be provided in the credentials to access on an encrypyted data"
    );
  }

  /**
   * returns a key of opened databases list
   * options
   *
   * @protected
   * @param {string} [directory]
   * @returns {Promise<string>}
   * @memberof SwarmStore
   * @throws
   */
  protected async getDatabasesListKey(directory?: string): Promise<string> {
    const hash = await calculateHash(
      `${directory || ''}/databases_opened_list`
    );

    if (hash instanceof Error) {
      throw hash;
    }
    return `${hash}/`;
  }

  /**
   * returns a connector constructor specified
   * or undefined if there is no constructor
   * for for a connector with a name provided
   *
   * @protected
   * @param {ESwarmStoreConnector} connectorName
   * @returns
   * @memberof SwarmStore
   */
  protected getStorageConnector(connectorName: ESwarmStoreConnector) {
    return SWARM_STORE_CONNECTORS[connectorName];
  }

  /**
   * returns options of a database if opened before
   *
   * @protected
   * @param {string} dbName - name of a database
   * @returns {ISwarmStoreDatabaseBaseOptions | undefined}
   * @memberof SwarmStore
   */
  protected getDatabaseOptions(
    dbName: string
  ): undefined | ISwarmStoreDatabaseBaseOptions {
    return this.databases?.options[dbName];
  }

  /**
   * Directry for the database persistent list.
   * Better if it will be uniq per users
   *
   * @protected
   * @param {ISwarmStoreOptions<P, ItemType>} options
   * @returns {string}
   * @memberof SwarmStore
   */
  protected getDatabasePersistentListDirectory(
    options: ISwarmStoreOptions<P, ItemType>
  ): string {
    return `${options.userId}/${options.directory ||
      SWARM_STORE_DATABASES_PERSISTENT_LIST_DIRECTORY_DEFAULT}`;
  }

  /**
   * Preload the databases list.
   *
   * @protected
   * @param {IStorageCommon} databasePersistantListStorage
   * @param {string} ['' = directory] - will be used as a key for the databasePersistantListStorage storage
   * @memberof SwarmStore
   * @returns Promise<void>
   * @throws
   */
  protected async handleDatabasePersistentList(
    databasePersistantListStorage: IStorageCommon,
    directory?: string
  ): Promise<void> {
    this.databasePersistantListStorage = databasePersistantListStorage;

    const key = await this.getDatabasesListKey(directory);
    this.databasesLisPersistantKey = key;
    await this.preloadOpenedDatabasesList();
  }

  /**
   * Stringify list of databases options
   * known
   *
   * @protected
   * @param {ISwarmStoreOptionsOfDatabasesKnownList} databasesKnownOptionsList
   * @returns {string}
   * @memberof SwarmStore
   * @throws
   */
  protected stringifyDatabaseOptionsList(
    databasesKnownOptionsList: ISwarmStoreOptionsOfDatabasesKnownList
  ): string {
    return JSON.stringify(databasesKnownOptionsList);
  }

  /**
   * Parse databases list loaded from storage
   *
   * @protected
   * @param {string} databasesKnownOptionsList
   * @returns {ISwarmStoreOptionsOfDatabasesKnownList}
   * @memberof SwarmStore
   * @throws
   */
  protected parseDatabaseOptionsList(
    databasesKnownOptionsList: string
  ): ISwarmStoreOptionsOfDatabasesKnownList {
    return JSON.parse(databasesKnownOptionsList);
  }

  /**
   * preload a list of databases opened
   * during previous sessions.
   *
   * @protected
   * @memberof SwarmStore
   * @returns Promise<void>
   * @throws
   */
  protected async preloadOpenedDatabasesList(): Promise<void> {
    const databasesOptionsList =
      this.databasesLisPersistantKey &&
      (await this.databasePersistantListStorage?.get(
        this.databasesLisPersistantKey
      ));
    if (databasesOptionsList) {
      if (databasesOptionsList instanceof Error) {
        throw databasesOptionsList;
      }
      this.databasesKnownOptionsList = this.parseDatabaseOptionsList(
        databasesOptionsList
      );
    }
  }

  /**
   * emit event with a databases list
   *
   * @protected
   * @memberof SwarmStore
   */
  protected emitDatabasesListUpdated() {
    this.emit(ESwarmStoreEventNames.DATABASES_LIST_UPDATED, this.databases);
  }

  /**
   * Add a database opened to lists.
   *
   * @protected
   * @param {ISwarmStoreDatabaseBaseOptions} dbOpenedOptions
   * @memberof SwarmStore
   * @returns {(Promise<void>)}
   * @throws
   */
  protected async handleDatabaseOpened(
    dbOpenedOptions: ISwarmStoreDatabaseBaseOptions
  ): Promise<void> {
    this.databasesOpenedList[dbOpenedOptions.dbName] = true;
    await this.addDatabaseOpenedOptions(dbOpenedOptions);
    this.emitDatabasesListUpdated();
  }

  /**
   * Delete a database dropped from lists
   * of opened during the session databases.
   *
   * @protected
   * @param {ISwarmStoreDatabaseBaseOptions} dbOpenedOptions
   * @memberof SwarmStore
   * @returns {(Promise<void>)}
   * @throws
   */
  protected async handleDatabaseClosed(
    dbOpenedOptions: ISwarmStoreDatabaseBaseOptions
  ): Promise<void> {
    delete this.databasesOpenedList[dbOpenedOptions.dbName];
    this.emitDatabasesListUpdated();
  }

  protected emitDatbaseDropped(dbName: string): void {
    this.emit(ESwarmStoreEventNames.DROP_DATABASE, dbName);
  }

  /**
   * Delete a database dropped from lists.
   *
   * @protected
   * @param {ISwarmStoreDatabaseBaseOptions} dbOpenedOptions
   * @memberof SwarmStore
   * @returns {(Promise<void>)}
   * @throws
   */
  protected async handleDatabaseDropped(
    dbOpenedOptions: ISwarmStoreDatabaseBaseOptions
  ): Promise<void> {
    const { dbName } = dbOpenedOptions;

    delete this.databasesOpenedList[dbName];
    await this.removeDatabaseOpenedOptions(dbOpenedOptions);
    this.emitDatbaseDropped(dbName);
    this.emitDatabasesListUpdated();
  }

  /**
   * add a database opened options to the list
   * of known databases options and store it
   * if a storage instance was provided.
   *
   * @protected
   * @param {ISwarmStoreDatabaseBaseOptions} dbOpenedOptions
   * @memberof SwarmStore
   */
  protected async addDatabaseOpenedOptions(
    dbOpenedOptions: ISwarmStoreDatabaseBaseOptions
  ) {
    this.databasesKnownOptionsList[dbOpenedOptions.dbName] = dbOpenedOptions;
    await this.storeDatabasesKnownOptionsList();
  }

  /**
   * Remove a database options from the list
   * of known databases options and store it
   * if a persistant storage instance was provided.
   *
   * @protected
   * @param {ISwarmStoreDatabaseBaseOptions} dbOpenedOptions
   * @memberof SwarmStore
   */
  protected async removeDatabaseOpenedOptions(
    dbOpenedOptions: ISwarmStoreDatabaseBaseOptions
  ) {
    delete this.databasesKnownOptionsList[dbOpenedOptions.dbName];
    await this.storeDatabasesKnownOptionsList();
  }

  /**
   * Store options of databases known to the storage
   * if it was provided for the connect.
   *
   * @protected
   * @memberof SwarmStore
   */
  protected async storeDatabasesKnownOptionsList() {
    const {
      databasesKnownOptionsList,
      databasesLisPersistantKey,
      databasePersistantListStorage,
    } = this;

    if (databasePersistantListStorage && databasesLisPersistantKey) {
      const list = this.stringifyDatabaseOptionsList(databasesKnownOptionsList);
      await databasePersistantListStorage.set(databasesLisPersistantKey, list);
    }
  }

  /**
   * create a connection with a connector
   * specified in options
   *
   * @protected
   * @param {ISwarmStoreOptions<P>} options
   * @returns {(ISwarmStoreConnector<P> | Error)}
   * @memberof SwarmStore
   */
  protected createConnectionWithStorageConnector(
    options: ISwarmStoreOptions<P, ItemType>
  ): ISwarmStoreConnector<P, ItemType, DbType> {
    const { provider } = options;
    const Constructor = this.getStorageConnector(options.provider);

    if (!Constructor) {
      throw new Error(`A constructor was not found for the ${provider}`);
    }

    const connection = new Constructor(options);

    assert(
      connection instanceof Constructor,
      `Failed to create connection with the provider ${provider}`
    );
    return connection as ISwarmStoreConnector<P, ItemType, DbType>;
  }

  /**
   * connect with the connector specified
   *
   * @protected
   * @param {ISwarmStoreConnector<P>} connector
   * @param {ISwarmStoreOptions<P>} options
   * @memberof SwarmStore
   */
  protected async startConnectionWithConnector(
    connector: ISwarmStoreConnector<P, ItemType, DbType>,
    options: ISwarmStoreOptions<P, ItemType>
  ): Promise<void> {
    const connectionResult = await connector.connect(
      options.providerConnectionOptions
    );

    assert(
      !(connectionResult instanceof Error),
      `Failed to connect through the provider ${options.provider}`
    );
    this.connector = connector;
  }

  /**
   * set empty status for a database
   * if a status was not set before
   *
   * @protected
   * @param {string} dbName
   * @memberof SwarmStore
   */
  protected setEmptyStatusForDb = (dbName: string) => {
    const { dbStatusesExisting } = this;

    if (!dbStatusesExisting[dbName]) {
      dbStatusesExisting[dbName] = ESwarmStoreDbStatus.EMPTY;
    }
  };

  protected setClosedStatusForDb = (dbName: string) => {
    this.dbStatusesExisting[dbName] = ESwarmStoreDbStatus.CLOSE;
  };

  /**
   * create the table with a current status for
   * a databases, which will be started
   *
   * @protected
   * @param {ISwarmStoreOptions<P>} options
   * @memberof SwarmStore
   */
  protected createStatusTable(options: ISwarmStoreOptions<P, ItemType>) {
    const { databases } = options;

    databases.forEach((dbOptions) => {
      this.setEmptyStatusForDb(dbOptions.dbName);
    });
  }

  protected dbReadyListener = (dbName: string) => {
    this.dbStatusesExisting[dbName] = ESwarmStoreDbStatus.READY;
  };

  protected dbUpdateListener = (dbName: string) =>
    (this.dbStatusesExisting[dbName] = ESwarmStoreDbStatus.UPDATE);

  protected dbCloseListener = (dbName: string) =>
    (this.dbStatusesExisting[dbName] = ESwarmStoreDbStatus.CLOSE);

  protected dbLoadingListener = ([dbName, percent]: [string, number]) => {
    if (percent < 100) {
      this.dbStatusesExisting[dbName] = ESwarmStoreDbStatus.LOADING;
    } else {
      this.dbStatusesExisting[dbName] = ESwarmStoreDbStatus.LOADED;
    }
  };

  /**
   * subscribe on events emitted for databases
   *
   * @protected
   * @param {boolean} [isSubscribe=true]
   * @memberof SwarmStore
   */
  protected subscribeOnDbEvents(
    connector: ISwarmStoreConnector<P, ItemType, DbType>,
    isSubscribe: boolean = true
  ): void {
    if (!connector) {
      if (isSubscribe) {
        throw new Error('There is no connection to a connector');
      }
      return;
    }

    const methodName = isSubscribe ? 'addListener' : 'removeListener';

    connector[methodName](ESwarmStoreEventNames.READY, this.dbReadyListener);
    connector[methodName](ESwarmStoreEventNames.UPDATE, this.dbUpdateListener);
    connector[methodName](
      ESwarmStoreEventNames.CLOSE_DATABASE,
      this.dbCloseListener
    );
    connector[methodName](
      ESwarmStoreEventNames.DB_LOADING,
      this.dbLoadingListener
    );
  }

  protected unsubscribeFromDbEvents(
    connector: ISwarmStoreConnector<P, ItemType, DbType>
  ) {
    this.subscribeOnDbEvents(connector, false);
  }

  /**
   * subscribe on store connector all events
   * to retransmit it
   *
   * @protected
   * @memberof SwarmStore
   */
  protected subscribeConnectorAllEvents(
    connector: ISwarmStoreConnector<P, ItemType, DbType>
  ) {
    if (!connector) {
      throw new Error('There is no swarm connector');
    }

    const storeConnectorEventsHandlers = {} as Record<
      ESwarmStoreEventNames,
      TSwarmStoreConnectorEventRetransmitter
    >;

    Object.values(ESwarmStoreEventNames).forEach((eventName) => {
      storeConnectorEventsHandlers[eventName] = this.emit.bind(this, eventName);
      connector.addListener(eventName, storeConnectorEventsHandlers[eventName]);
    });
    this.storeConnectorEventsHandlers = storeConnectorEventsHandlers;
  }

  protected unSubscribeConnectorAllEvents(
    connector: ISwarmStoreConnector<P, ItemType, DbType>
  ) {
    const { storeConnectorEventsHandlers } = this;

    if (storeConnectorEventsHandlers && connector) {
      Object.values(ESwarmStoreEventNames).forEach((eventName) => {
        connector.removeListener(
          eventName,
          storeConnectorEventsHandlers[eventName]
        );
      });
    }
  }

  /**
   * subsribes on events from the connector
   *
   * @protected
   * @memberof SwarmStore
   */
  protected subscribeOnConnector(
    connector: ISwarmStoreConnector<P, ItemType, DbType>
  ) {
    this.subscribeOnDbEvents(connector);
    this.subscribeConnectorAllEvents(connector);
  }

  /**
   * subsribes on events from the connector
   *
   * @protected
   * @memberof SwarmStore
   */
  protected unSubscribeFromConnector(
    connector: ISwarmStoreConnector<P, ItemType, DbType>
  ) {
    this.unsubscribeFromDbEvents(connector);
    this.unSubscribeConnectorAllEvents(connector);
  }

  /**
   * close the existing connection
   * with a swarm store
   *
   * @protected
   * @memberof SwarmStore
   */
  protected async closeConnector(): Promise<void> {
    const { connector } = this;

    if (connector) {
      const result = await connector.close();

      if (result instanceof Error) {
        throw new Error('Failed to close the connection with the connector');
      }
    }
  }

  /**
   * reset some options to defaults
   *
   * @protected
   * @memberof SwarmStore
   */
  protected reset(): void {
    Object.keys(this.dbStatusesExisting).forEach(this.setClosedStatusForDb);
  }
}
