import assert from 'assert';
import { checkIsError } from 'utils';

import { TSwarmStoreDatabaseRequestMethodReturnType, ISwarmStoreDatabasesCommonStatusList } from './swarm-store-class.types';
import {
  ESwarmStoreConnector,
  ESwarmStoreEventNames,
  ESwarmStoreDbStatus,
  SWARM_STORE_CONNECTORS,
  SWARM_STORE_DATABASES_STATUSES_EMPTY,
} from './swarm-store-class.const';
import { calculateHash } from '@pashoo2/crypto-utilities';
import { getEventEmitterClass } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';
import {
  ISwarmStoreOptionsWithConnectorFabric,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
} from './swarm-store-class.types';
import {
  TSwarmStoreDatabaseType,
  ISwarmStoreConnectorBasic,
  ISwarmStoreWithConnector,
  ISwarmStoreConnectorDatabasesPersistentList,
} from './swarm-store-class.types';
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
    DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
    ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
    PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
    CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
    ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
    CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
    O extends ISwarmStoreOptionsWithConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO>,
    E extends ISwarmStoreEvents<P, ItemType, DbType, DBO>
  >
  extends getEventEmitterClass<any>()
  implements
    ISwarmStore<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, O>,
    ISwarmStoreWithConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO, ConnectorMain>
{
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

  public get databases(): ISwarmStoreDatabasesCommonStatusList<P, ItemType, DbType, DBO> {
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

  protected connector: ConnectorMain | undefined;

  protected dbStatusesExisting: ISwarmStoreDatabasesStatuses = SWARM_STORE_DATABASES_STATUSES_EMPTY;

  protected storeConnectorEventsHandlers: Record<ESwarmStoreEventNames, TSwarmStoreConnectorEventRetransmitter> | undefined;

  /**
   * List of databases options opened during this session
   * or during previous sessions
   * (if an instanceof databasePersistantListStorage provided)
   * and which were not dropped.
   * If a database not opened because it's failed,
   * then it's options won't be added to the list.
   *
   * @protected
   * @type {TSwarmStoreOptionsOfDatabasesKnownList}
   * @memberof SwarmStore
   */
  protected get databasesKnownOptionsList(): Record<DBO['dbName'], DBO> | undefined {
    return this.persistentDatbasesList?.databasesKnownOptionsList;
  }

  /**
   * Databases opened during this session.
   *
   * @protected
   * @type {Record<string, boolean>} - whether opened or closed
   * @memberof SwarmStore
   */
  protected databasesOpenedList: Record<DBO['dbName'], boolean> = {} as Record<DBO['dbName'], boolean>;

  /**
   * Storage with list of all databases opened and not dropped.
   * It's exists only if passed in the arguments.
   *
   * @protected
   * @type {ISwarmStoreConnectorDatabasesPersistentList<
   *     P,
   *     ItemType,
   *     DbType,
   *     DBO,
   *     Record<DBO['dbName'], DBO>
   *   >}
   * @memberof SwarmStore
   */
  protected persistentDatbasesList?: ISwarmStoreConnectorDatabasesPersistentList<
    P,
    ItemType,
    DbType,
    DBO,
    Record<DBO['dbName'], DBO>
  >;

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
  public async connect(options: O): Promise<Error | void> {
    let connectionWithConnector: ConnectorMain | undefined;
    try {
      this.validateOptions(options);
      if (options.persistentDatbasesList) {
        await this.setDatabasePersistentListAndPreloadDatabasesList(options.persistentDatbasesList);
      }
      connectionWithConnector = this.createConnectionWithStorageConnector(options);
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
    // TODO - add class which will handle only dbOptions: ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidator<P, ItemType, DbType, DBO, DBOS>
    // to support grandAccessCallback context binding
    dbOptions: DBO
  ): Promise<void | Error> {
    const connector = this.getConnectorOrError();

    if (checkIsError(connector)) {
      return new Error('Connector is not exists');
    }
    this.setEmptyStatusForDb(dbOptions.dbName);

    const result = await connector.openDatabase(dbOptions);

    if (!(result instanceof Error)) {
      await this.handleDatabaseOpened(dbOptions);
    } else {
      await this.handleDatabaseClosed(dbOptions);
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
    const connector = this.getConnectorOrError();

    if (checkIsError(connector)) {
      return new Error('Connector is not exists');
    }
    this.setClosedStatusForDb(dbName);

    const result = connector.closeDatabase(dbName);

    if (!(result instanceof Error)) {
      const dbOptions = await this.getDatabaseOptions(dbName);

      if (dbOptions) {
        await this.handleDatabaseClosed(dbOptions);
      }
    }
    return await result;
  }

  public async dropDatabase(dbName: string): Promise<void | Error> {
    const connector = this.getConnectorOrError();

    if (checkIsError(connector)) {
      return new Error('Connector is not exists');
    }
    this.setClosedStatusForDb(dbName);

    const dropDatabaseResult = await connector.dropDatabase(dbName);

    if (dropDatabaseResult instanceof Error) {
      return dropDatabaseResult;
    }

    const dbOptions = await this.getDatabaseOptions(dbName);

    if (dbOptions) {
      await this.handleDatabaseDropped(dbOptions);
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
    dbName: DBO['dbName'],
    dbMethod: TSwarmStoreDatabaseMethod<P>,
    arg: TSwarmStoreDatabaseMethodArgument<P, A, DbType>
  ): Promise<TSwarmStoreDatabaseRequestMethodReturnType<P, A>> {
    const connector = this.getConnectorOrError();

    if (checkIsError(connector)) {
      return new Error('Connector is not exists');
    }
    return await connector.request<A, DT>(dbName, dbMethod, arg);
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
  protected validateOptions(options: O): void {
    assert(options, 'An options must be specified');
    assert(typeof options === 'object', 'The options specified is not an object');
    assert(options.databases instanceof Array, 'The options for databases must be an array');
    options.databases.forEach((optionsDb) => {
      assert(optionsDb, 'Database options must be specified');
      assert(typeof optionsDb === 'object', 'Database options must be an object');
      assert(typeof optionsDb.dbName === 'string', 'Database name must be a string');
    });
    assert(typeof options.directory === 'string', 'Directory must be a string if specified');
    assert(options.provider, 'Provider must be specified');
    assert(options.connectorFabric, 'Connector fabric must be specified');
    assert(
      Object.values(ESwarmStoreConnector).includes(options.provider),
      `There is unknown provider specified "${options.provider}"`
    );
    assert(
      options.providerConnectionOptions && typeof options.providerConnectionOptions === 'object',
      'Options specifically for the provider must be set and be an object'
    );
    assert(options.userId, 'The user identity must be provided');
    assert(typeof options.userId === 'string', 'The user identity must be a string');
    assert(options.credentials, 'A credentials must be provided');
    assert(typeof options.credentials === 'object', 'Credentials must be an object');
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
    const hash = await calculateHash(`${directory || ''}/databases_opened_list`);

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
  protected async getDatabaseOptions(dbName: DBO['dbName']): Promise<DBO | undefined> {
    if (!this.persistentDatbasesList) {
      return undefined;
    }
    return await this.persistentDatbasesList.getDatabaseOptions(dbName);
  }

  getConnectorOrError(): ConnectorMain | Error {
    const { connector } = this;

    if (!connector) {
      return new Error('Connector is not exists');
    }
    return connector;
  }

  /**
   * Preload the databases list from the persistentDatabase list
   * and set the persistentDatabase list as the current.
   *
   * @protected
   * @param {IStorageCommon} databasePersistantListStorage
   * @param {string} ['' = directory] - will be used as a key for the databasePersistantListStorage storage
   * @memberof SwarmStore
   * @returns Promise<void>
   * @throws
   */
  protected async setDatabasePersistentListAndPreloadDatabasesList(
    persistentDatbasesList: ISwarmStoreConnectorDatabasesPersistentList<P, ItemType, DbType, DBO, Record<DBO['dbName'], DBO>>
  ): Promise<void> {
    await persistentDatbasesList.loadDatabasesListFromPersistentStorage();
    this.persistentDatbasesList = persistentDatbasesList;
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

  protected setDatabaseHasBeenOpened(dbName: DBO['dbName']) {
    this.databasesOpenedList[dbName] = true;
  }

  protected deleteDatabaseFromOpenedList(dbName: DBO['dbName']) {
    delete this.databasesOpenedList[dbName];
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
  protected async handleDatabaseOpened(dbOpenedOptions: DBO): Promise<void> {
    this.setDatabaseHasBeenOpened(dbOpenedOptions.dbName);
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
  protected async handleDatabaseClosed(dbOpenedOptions: DBO): Promise<void> {
    this.deleteDatabaseFromOpenedList(dbOpenedOptions.dbName);
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
  protected async handleDatabaseDropped(dbOpenedOptions: DBO): Promise<void> {
    const { dbName } = dbOpenedOptions;

    this.deleteDatabaseFromOpenedList(dbOpenedOptions.dbName);
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
  protected async addDatabaseOpenedOptions(dbOpenedOptions: DBO) {
    await this.persistentDatbasesList?.addDatabase(dbOpenedOptions.dbName, dbOpenedOptions);
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
  protected async removeDatabaseOpenedOptions(dbOpenedOptions: DBO) {
    await this.persistentDatbasesList?.removeDatabase(dbOpenedOptions.dbName);
  }

  protected getOptionsForConnectorFabric(options: O): CO {
    return {
      provider: options.provider,
      providerConnectionOptions: options.providerConnectionOptions,
    } as CO;
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
  protected createConnectionWithStorageConnector(options: O): ConnectorMain {
    const { connectorFabric } = options;
    const connectorFabricOptions = this.getOptionsForConnectorFabric(options);
    const connection = connectorFabric(connectorFabricOptions);

    assert(connection, `Failed to create connection with the provider`);
    return connection;
  }

  /**
   * connect with the connector specified
   *
   * @protected
   * @param {ISwarmStoreConnector<P>} connector
   * @param {ISwarmStoreOptions<P>} options
   * @memberof SwarmStore
   */
  protected async startConnectionWithConnector(connector: ConnectorMain, options: O): Promise<void> {
    const connectionResult = await connector.connect(options.providerConnectionOptions);

    assert(!(connectionResult instanceof Error), `Failed to connect through the provider ${options.provider}`);
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
  protected createStatusTable(options: O) {
    const { databases } = options;

    databases.forEach((dbOptions) => {
      this.setEmptyStatusForDb(dbOptions.dbName);
    });
  }

  protected dbReadyListener = (dbName: string) => {
    this.dbStatusesExisting[dbName] = ESwarmStoreDbStatus.READY;
  };

  protected dbUpdateListener = (dbName: string) => (this.dbStatusesExisting[dbName] = ESwarmStoreDbStatus.UPDATE);

  protected dbCloseListener = (dbName: string) => (this.dbStatusesExisting[dbName] = ESwarmStoreDbStatus.CLOSE);

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
  protected subscribeOnDbEvents(connector: ConnectorMain, isSubscribe: boolean = true): void {
    if (!connector) {
      if (isSubscribe) {
        throw new Error('There is no connection to a connector');
      }
      return;
    }

    const methodName = isSubscribe ? 'addListener' : 'removeListener';

    connector[methodName](ESwarmStoreEventNames.READY, this.dbReadyListener);
    connector[methodName](ESwarmStoreEventNames.UPDATE, this.dbUpdateListener);
    connector[methodName](ESwarmStoreEventNames.CLOSE_DATABASE, this.dbCloseListener);
    connector[methodName](ESwarmStoreEventNames.DB_LOADING, this.dbLoadingListener);
  }

  protected unsubscribeFromDbEvents(connector: ConnectorMain) {
    this.subscribeOnDbEvents(connector, false);
  }

  /**
   * subscribe on store connector all events
   * to retransmit it
   *
   * @protected
   * @memberof SwarmStore
   */
  protected subscribeConnectorAllEvents(connector: ConnectorMain) {
    if (!connector) {
      throw new Error('There is no swarm connector');
    }

    const storeConnectorEventsHandlers = {} as Record<ESwarmStoreEventNames, TSwarmStoreConnectorEventRetransmitter>;

    Object.values(ESwarmStoreEventNames).forEach((eventName) => {
      storeConnectorEventsHandlers[eventName] = this.emit.bind(this, eventName);
      connector.addListener(eventName, storeConnectorEventsHandlers[eventName]);
    });
    this.storeConnectorEventsHandlers = storeConnectorEventsHandlers;
  }

  protected unSubscribeConnectorAllEvents(connector: ConnectorMain) {
    const { storeConnectorEventsHandlers } = this;

    if (storeConnectorEventsHandlers && connector) {
      Object.values(ESwarmStoreEventNames).forEach((eventName) => {
        connector.removeListener(eventName, storeConnectorEventsHandlers[eventName]);
      });
    }
  }

  /**
   * subsribes on events from the connector
   *
   * @protected
   * @memberof SwarmStore
   */
  protected subscribeOnConnector(connector: ConnectorMain) {
    this.subscribeOnDbEvents(connector);
    this.subscribeConnectorAllEvents(connector);
  }

  /**
   * subsribes on events from the connector
   *
   * @protected
   * @memberof SwarmStore
   */
  protected unSubscribeFromConnector(connector: ConnectorMain) {
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
