import { EventEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';
import assert from 'assert';
import {
  ESwarmStoreConnector,
  SWARM_STORE_CONNECTORS,
  ESwarmStoreEventNames,
  ESwarmStoreDbStatus,
  SWARM_STORE_DATABASES_STATUSES_EMPTY,
} from './swarm-store-class.const';
import {
  ISwarmStoreConnector,
  ISwarmStoreDatabasesStatuses,
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseMethod,
  TSwarmStoreDatabaseMethodArgument,
  TSwarmStoreDatabaseMethodAnswer,
  TSwarmStoreConnectorEventRetransmitter,
  ISwarmStoreDatabaseOptions,
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
  E extends ISwarmStoreEvents = ISwarmStoreEvents
> extends EventEmitter<E> implements ISwarmStore<P> {
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

  protected connector: ISwarmStoreConnector<P> | undefined;

  protected dbStatusesExisting: ISwarmStoreDatabasesStatuses = SWARM_STORE_DATABASES_STATUSES_EMPTY;

  protected storeConnectorEventsHandlers:
    | Record<ESwarmStoreEventNames, TSwarmStoreConnectorEventRetransmitter>
    | undefined;

  // open connection with all databases
  public async connect(options: ISwarmStoreOptions<P>): Promise<Error | void> {
    try {
      this.validateOptions(options);

      const connectionWithConnector = this.createConnectionWithStorageConnector(
        options
      );

      this.startConnectionWithConnector(connectionWithConnector, options);
      this.createStatusTable(options);
      this.subscribeOnConnector();
    } catch (err) {
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

    try {
      this.closeConnector();
    } catch (err) {
      error = err;
    }
    this.unSubscribeFromConnector();
    this.reset();
    return error;
  }

  /**
   * open a new connection to the database specified
   *
   * @param {ISwarmStoreDatabaseOptions} dbOptions
   * @returns {(Promise<void | Error>)}
   * @memberof SwarmStore
   */
  public async openDatabase(
    dbOptions: ISwarmStoreDatabaseOptions
  ): Promise<void | Error> {
    const { connector } = this;

    if (!connector) {
      return new Error('Connector is not exists');
    }
    this.setEmptyStatusForDb(dbOptions.dbName);
    return connector.openDatabase(dbOptions);
  }

  /**
   * close an existing connection to the database
   * with the name specified
   * if exists
   *
   * @param {ISwarmStoreDatabaseOptions} dbOptions
   * @returns {(Promise<void | Error>)}
   * @memberof SwarmStore
   */
  public async closeDatabase(
    dbName: ISwarmStoreDatabaseOptions['dbName']
  ): Promise<void | Error> {
    const { connector } = this;

    if (!connector) {
      return new Error('Connector is not exists');
    }
    this.setClosedStatusForDb(dbName);
    return connector.closeDatabase(dbName);
  }

  /**
   * send request (get, set and so on) to a swarm database
   *
   * @template V
   * @template A
   * @param {ISwarmStoreDatabaseOptions['dbName']} dbName
   * @param {TSwarmStoreDatabaseMethod<P>} dbMethod
   * @param {TSwarmStoreDatabaseMethodArgument<P, V>} arg
   * @returns {(Promise<TSwarmStoreDatabaseMethodAnswer<P, A> | Error>)}
   * @memberof SwarmStore
   */
  public async request<V extends TSwarmStoreValueTypes<P>, A>(
    dbName: ISwarmStoreDatabaseOptions['dbName'],
    dbMethod: TSwarmStoreDatabaseMethod<P>,
    arg: TSwarmStoreDatabaseMethodArgument<P, V>
  ): Promise<TSwarmStoreDatabaseMethodAnswer<P, A> | Error> {
    const { connector } = this;

    if (!connector) {
      return new Error('Connector is not exists');
    }
    this.setClosedStatusForDb(dbName);
    return connector.request(dbName, dbMethod, arg);
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
  protected validateOptions(options: ISwarmStoreOptions<P>): void {
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
    assert(
      options.credentials.password,
      'A password must be provided in the credentials to access on an encrypyted data'
    );
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
   * create a connection with a connector
   * specified in options
   *
   * @protected
   * @param {ISwarmStoreOptions<P>} options
   * @returns {(ISwarmStoreConnector<P> | Error)}
   * @memberof SwarmStore
   */
  protected createConnectionWithStorageConnector(
    options: ISwarmStoreOptions<P>
  ): ISwarmStoreConnector<P> {
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
  protected startConnectionWithConnector(
    connector: ISwarmStoreConnector<P>,
    options: ISwarmStoreOptions<P>
  ): void {
    const connectionResult = connector.connect(
      options.providerConnectionOptions
    );

    assert(
      connectionResult instanceof Error,
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
  protected createStatusTable(options: ISwarmStoreOptions<P>) {
    const { databases } = options;
    const { dbStatusesExisting } = this;

    databases.forEach((dbOptions) => {
      this.setEmptyStatusForDb(dbOptions.dbName);
    });
  }

  protected dbReadyListener = (dbName: string) =>
    (this.dbStatusesExisting[dbName] = ESwarmStoreDbStatus.READY);

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
  protected subscribeOnDbEvents(isSubscribe: boolean = true): void {
    const { connector } = this;

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

  protected unsubscribeFromDbEvents() {
    this.subscribeOnDbEvents(false);
  }

  /**
   * subscribe on store connector all events
   * to retransmit it
   *
   * @protected
   * @memberof SwarmStore
   */
  protected subscribeConnectorAllEvents() {
    const { connector } = this;

    if (!connector) {
      throw new Error('There is no swarm connector');
    }

    const storeConnectorEventsHandlers = {} as Record<
      ESwarmStoreEventNames,
      TSwarmStoreConnectorEventRetransmitter
    >;

    Object.values(ESwarmStoreEventNames).forEach((eventName) => {
      storeConnectorEventsHandlers[eventName] = (...args) =>
        this.emit(eventName, ...args);
      connector.addListener(eventName, storeConnectorEventsHandlers[eventName]);
    });
    this.storeConnectorEventsHandlers = storeConnectorEventsHandlers;
  }

  protected unSubscribeConnectorAllEvents() {
    const { storeConnectorEventsHandlers, connector } = this;

    if (storeConnectorEventsHandlers && connector) {
      Object.keys(ESwarmStoreEventNames).forEach((eventName) => {
        connector.removeListener(
          eventName,
          storeConnectorEventsHandlers[eventName as ESwarmStoreEventNames]
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
  protected subscribeOnConnector() {
    this.subscribeOnDbEvents();
    this.subscribeConnectorAllEvents();
  }

  /**
   * subsribes on events from the connector
   *
   * @protected
   * @memberof SwarmStore
   */
  protected unSubscribeFromConnector() {
    this.unsubscribeFromDbEvents();
    this.unSubscribeConnectorAllEvents();
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
