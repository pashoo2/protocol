import { ISecretStoreCredentials } from '../secret-storage-class/secret-storage-class.types';
import {
  ESwarmStoreConnectorOrbitDbDatabaseMethodNames,
  ISwarmStoreConnectorOrbitDBConnectionOptions,
  ISwarmStoreConnectorOrbitDBEvents,
} from './swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import { EventEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';
import {
  ESwarmStoreConnector,
  ESwarmStoreDbStatus as ESwarmStoreDatabaseStatus,
  ESwarmStoreEventNames,
  SWARM_STORE_DATABASE_STATUS_ABSENT,
} from './swarm-store-class.const';
import {
  ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions,
  ISwarmStoreConnectorOrbitDbDatabaseOptions,
  ISwarmStoreConnectorOrbitDbDatabaseValue,
  TSwarmStoreConnectorOrbitDbDatabaseMethodArgument,
  TSwarmStoreConnectorOrbitDbDatabaseMethodNames,
  TSwarmStoreConnectorOrbitDbDatabaseStoreHash,
  TSwarmStoreConnectorOrbitDbDatabaseStoreKey,
} from './swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { IStorageCommon } from 'types/storage.types';
import {
  EOrbitDbFeedStoreOperation,
  ESwarmStoreConnectorOrbitDbDatabaseType,
} from './swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmMessageSerialized } from '../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument,
  TSwarmStoreConnectorOrbitDbDatabaseEntityIndex,
  TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad,
} from './swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';

export type TSwarmStoreDatabaseType<P extends ESwarmStoreConnector> = ESwarmStoreConnectorOrbitDbDatabaseType;

export type TSwarmStoreDatabaseEntityUniqueIndex<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> = P extends ESwarmStoreConnector.OrbitDB
  ? DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    ? TSwarmStoreDatabaseEntityAddress<P>
    : TSwarmStoreDatabaseEntityKey<P>
  : never;

export type TSwarmStoreConnectorEventRetransmitter = (...args: any[]) => void;

export interface ISwarmStoreConnectorRequestLoadAnswer {
  /**
   * how many new items loaded during the request
   *
   * @type {number}
   * @memberof ISwarmStoreConnectorLoadAnswer
   */
  count: number;
  /**
   * overall items loaded
   *
   * @type {number}
   * @memberof ISwarmStoreConnectorRequestLoadAnswer
   */
  loadedCount: number;
  /**
   * how many overall items exists in the database
   *
   * @type {number}
   * @memberof ISwarmStoreConnectorLoadAnswer
   */
  overallCount: number;
}

export interface ISwarmStoreEvents<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>
> {
  [ESwarmStoreEventNames.STATE_CHANGE]: boolean;
  [ESwarmStoreEventNames.ERROR]: Error;
  [ESwarmStoreEventNames.CLOSE]: void;
  [ESwarmStoreEventNames.UPDATE]: string;
  [ESwarmStoreEventNames.LOADING]: number;
  [ESwarmStoreEventNames.DB_LOADING]: [string, number];
  [ESwarmStoreEventNames.READY]: string;
  [ESwarmStoreEventNames.DATABASES_LIST_UPDATED]: ISwarmStoreDatabasesCommonStatusList<P, ItemType, DBO>;
}

// arguments avalilable for a database method
export type TSwarmStoreDatabaseMethodArgument<
  P extends ESwarmStoreConnector,
  M,
  DbType extends TSwarmStoreDatabaseType<P>
> = P extends ESwarmStoreConnector.OrbitDB ? TSwarmStoreConnectorOrbitDbDatabaseMethodArgument<M, DbType> : never;

export type TSwarmStoreDatabaseEntryOperation<P extends ESwarmStoreConnector> = P extends ESwarmStoreConnector.OrbitDB
  ? EOrbitDbFeedStoreOperation
  : never;

// arguments avalilable for a database method
export type TSwarmStoreDatabaseIteratorMethodArgument<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> = P extends ESwarmStoreConnector.OrbitDB ? ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType> : never;

export type TSwarmStoreDatabaseLoadMethodAnswer<P extends ESwarmStoreConnector.OrbitDB> = P extends ESwarmStoreConnector.OrbitDB
  ? ISwarmStoreConnectorRequestLoadAnswer
  : never;

export type TSwarmStoreDatabaseCloseMethodAnswer<P extends ESwarmStoreConnector.OrbitDB> = P extends ESwarmStoreConnector.OrbitDB
  ? void
  : never;

// arguments avalilable for a database
export type TSwarmStoreDatabaseIteratorMethodAnswer<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>
> = P extends ESwarmStoreConnector.OrbitDB
  ? Error | Array<ISwarmStoreConnectorOrbitDbDatabaseValue<T> | Error | undefined>
  : never;

// TODO - typescript issue
// string cannot be assigned to P extends ESwarmStoreConnector.OrbitDB ? TSwarmMessageSerialized : any;
/**
 * Type of a raw value can be stored in the database
 */
export type TSwarmStoreValueTypes<P extends ESwarmStoreConnector> = TSwarmMessageSerialized;

// arguments avalilable for a database
export type TSwarmStoreDatabaseMethodAnswer<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>
> = P extends ESwarmStoreConnector.OrbitDB ? ISwarmStoreConnectorOrbitDbDatabaseValue<T> : never;

export interface ISwarmStoreDatabaseBaseOptions {
  // Database name
  dbName: string;
  // is a puclic database. Private by
  isPublic?: boolean;
  // how many records to preload
  preloadCount?: number;
  /**
   * use encrypted storage for the database
   *
   * @type {boolean} [false]
   * @memberof ISwarmStoreDatabaseBaseOptions
   */
  useEncryptedStorage?: boolean;
}

export type TSwarmStoreDatabaseEntityKey<P extends ESwarmStoreConnector = never> = P extends ESwarmStoreConnector.OrbitDB
  ? TSwarmStoreConnectorOrbitDbDatabaseStoreKey
  : never;

export type TSwarmStoreDatabaseEntityAddress<P extends ESwarmStoreConnector> = P extends ESwarmStoreConnector.OrbitDB
  ? TSwarmStoreConnectorOrbitDbDatabaseStoreHash
  : never;

/**
 * options of a swarm database
 *
 * @export
 * @interface ISwarmStoreDatabaseOptions
 */
export type TSwarmStoreDatabaseOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>
> = P extends ESwarmStoreConnector.OrbitDB ? ISwarmStoreConnectorOrbitDbDatabaseOptions<T> : ISwarmStoreDatabaseBaseOptions;

/**
 * options of swarm databases want to connect
 *
 * @export
 * @interface ISwarmStoreDatabasesOptions
 */
export interface ISwarmStoreDatabasesOptions<P extends ESwarmStoreConnector, T extends TSwarmStoreValueTypes<P>> {
  // databases which must be started when the orbit db
  // instance will be ready to use
  databases: TSwarmStoreDatabaseOptions<P, T>[];
  // a virtual directory name where to store all the data received
  directory: string;
}

/**
 * options about the current user which
 * will be connected to swarm databases
 *
 * @export
 * @interface ISwarmStoreUserOptions
 */
export interface ISwarmStoreUserOptions {
  // the current user identity
  userId?: string;
  // credentials used for data encryption
  credentials?: ISecretStoreCredentials;
}

export type TSwarmStoreConnectorConnectionOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType>
> = P extends ESwarmStoreConnector.OrbitDB ? ISwarmStoreConnectorOrbitDBConnectionOptions<T, DbType, ConnectorBasic> : never;

/**
 * options defines which provider to use
 *
 * @export
 * @interface ISwarmStoreProviderOptions
 */
export interface ISwarmStoreProviderOptions<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>
> {
  provider: P;
  providerConnectionOptions: PO;
}

/**
 * this options excluded options specific
 * for a provider connection
 *
 * @export
 * @interface ISwarmStoreMainOptions
 * @extends {ISwarmStoreUserOptions}
 * @extends {ISwarmStoreDatabasesOptions}
 */
export interface ISwarmStoreMainOptions<P extends ESwarmStoreConnector = never, T extends TSwarmStoreValueTypes<P> = never>
  extends ISwarmStoreUserOptions,
    ISwarmStoreDatabasesOptions<P, T> {}

export interface ISwarmStoreOptionsConnectorFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, ConnectorBasic, PO, DBO>
> {
  (options: CO): ConnectorMain;
}

/**
 * options used for connection to a swarm databases
 *
 * @export
 * @interface ISwarmStoreOptions
 * @extends {ISwarmStoreUserOptions}
 * @extends {ISwarmStoreDatabasesOptions}
 */
export interface ISwarmStoreOptions<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>
> extends Required<ISwarmStoreMainOptions<P, ItemType>>,
    Required<ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>> {}

/**
 * options used for connection to a swarm databases
 *
 * @export
 * @interface ISwarmStoreOptions
 * @extends {ISwarmStoreUserOptions}
 * @extends {ISwarmStoreDatabasesOptions}
 */
export interface ISwarmStoreOptionsWithConnectorFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, ConnectorBasic, PO, DBO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>
> extends ISwarmStoreOptions<P, ItemType, DbType, ConnectorBasic, PO> {
  connectorFabric: CFO;
}

/**
 * store a status of each database
 *
 * key - database name
 * value - the last event from the database received from the provider
 * @export
 * @interface ISwarmStoreDatabasesStatus
 */
export interface ISwarmStoreDatabasesStatuses
  extends Record<string, ESwarmStoreDatabaseStatus | typeof SWARM_STORE_DATABASE_STATUS_ABSENT> {}

// methods available for a database providers
export type TSwarmStoreDatabaseMethod<P extends ESwarmStoreConnector> = P extends ESwarmStoreConnector.OrbitDB
  ? TSwarmStoreConnectorOrbitDbDatabaseMethodNames
  : never;

export type TSwarmStoreDatabaseRequestMethodEntitiesReturnType<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>
> = Error | TSwarmStoreDatabaseMethodAnswer<P, ItemType> | TSwarmStoreDatabaseIteratorMethodAnswer<P, ItemType>;

export type TSwarmStoreDatabaseRequestMethodReturnType<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>
> =
  | Error
  | TSwarmStoreDatabaseLoadMethodAnswer<P>
  | TSwarmStoreDatabaseCloseMethodAnswer<P>
  | TSwarmStoreDatabaseRequestMethodEntitiesReturnType<P, ItemType>;

/**
 * this interface must be implemented by a swarm storage connectors
 *
 * @export
 * @interface ISwarmStoreConnector
 * @extends {EventEmitter<ISwarmStoreEvents>}
 * @template P
 */
export interface ISwarmStoreConnectorBase<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>
> {
  // ready to use
  isReady: boolean;
  // disconnected from the swarm
  isClosed: boolean;
  // open connection with all databases
  connect(options: PO, dataBasePersistantStorage?: IStorageCommon): Promise<Error | void>;
  // close all the existing connections
  close(): Promise<Error | void>;
  // open a new connection to the database specified
  openDatabase(dbOptions: DBO): Promise<void | Error>;
  // close connection to a database specified
  closeDatabase(dbName: DBO['dbName']): Promise<void | Error>;
  /**
   * drop the local copy of the database connected to
   * and close connection with the database.
   *
   * @param {string} dbName
   * @returns {(Promise<Error | boolean>)}
   * @memberof ISwarmStoreConnectorBase
   */
  dropDatabase(dbName: string): Promise<void | Error>;
  // send request to a swarm database to perform
  // an operation such as read or seta value
  // on a database
  request<A extends ItemType, DT extends DbType>(
    dbName: DBO['dbName'],
    dbMethod: TSwarmStoreDatabaseMethod<P>,
    arg: TSwarmStoreDatabaseMethodArgument<P, A, DT>
  ): Promise<TSwarmStoreDatabaseRequestMethodReturnType<P, A>>;
}

export interface ISwarmStoreConnectorBasic<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType> = TSwarmStoreDatabaseOptions<P, ItemType>
> extends EventEmitter<ISwarmStoreConnectorOrbitDBEvents<P, ItemType, DBO>> {
  dbName: string;
  isClosed: boolean;
  isReady: boolean;

  /**
   * Close the insatnce
   *
   * @param {*} [opt]
   * @returns {(Promise<Error | void>)}
   * @memberof ISwarmStoreConnectorOrbitDBDatabase
   */
  [ESwarmStoreConnectorOrbitDbDatabaseMethodNames.close](opt?: any): Promise<Error | void>;

  /**
   * Load items count from a persistent storage to the memory
   *
   * @param {TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad} count
   * @returns {(Promise<ISwarmStoreConnectorRequestLoadAnswer | Error>)}
   * @memberof ISwarmStoreConnectorBasic
   */
  [ESwarmStoreConnectorOrbitDbDatabaseMethodNames.load](
    count: TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad
  ): Promise<ISwarmStoreConnectorRequestLoadAnswer | Error>;

  /**
   * Add the new entry to the database
   *
   * @param {TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument<ItemType>} addArg
   * @returns {(Promise<string | Error>)}
   * @memberof ISwarmStoreConnectorOrbitDBDatabase
   */
  [ESwarmStoreConnectorOrbitDbDatabaseMethodNames.add](
    addArg: TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument<ItemType>
  ): Promise<string | Error>;

  /**
   * Read entry from the database by the given argument.
   * for the key value store a key must be used.
   * for the feed store a hash of the value
   * must be used.
   *
   * @param {TSwarmStoreConnectorOrbitDbDatabaseEntityIndex} keyOrHash
   * @returns {(Promise<
   *     Error | ISwarmStoreConnectorOrbitDbDatabaseValue<ItemType> | undefined
   *   >)}
   * @memberof ISwarmStoreConnectorOrbitDBDatabase
   */
  [ESwarmStoreConnectorOrbitDbDatabaseMethodNames.get](
    keyOrHash: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex
  ): Promise<Error | ISwarmStoreConnectorOrbitDbDatabaseValue<ItemType> | undefined>;

  /**
   * Remove a value located in the key provided if it is a key value
   * database.
   * Remove an entry by it's address for a non key-value database.
   *
   * @param {TSwarmStoreConnectorOrbitDbDatabaseEntityIndex} keyOrEntryAddress
   * @returns {(Promise<E): TSwarmMessageStoreConnectReturnType<P, T, DbType, ConnectorBasic, ConnectorMain, O> {rror | void>)}
   * @memberof ISwarmStoreConnectorOrbitDBDatabase
   */
  [ESwarmStoreConnectorOrbitDbDatabaseMethodNames.remove](
    keyOrEntryAddress: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex
  ): Promise<Error | void>;

  /**
   * Iterate over the database values which are follows conditions
   * from the options.
   *
   * @param {ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>} [options]
   * @returns {(Promise<
   *     | Error
   *     | Array<
   *         | ISwarmStoreConnectorOrbitDbDatabaseValue<ItemType>
   *         | Error
   *         | undefined
   *       >
   *   >)}
   * @memberof ISwarmStoreConnectorOrbitDBDatabase
   */
  [ESwarmStoreConnectorOrbitDbDatabaseMethodNames.iterator](
    options?: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>
  ): Promise<Error | Array<ISwarmStoreConnectorOrbitDbDatabaseValue<ItemType> | Error | undefined>>;

  /**
   * Connect to the database
   *
   * @returns {(Promise<Error | void>)}
   * @memberof ISwarmStoreConnectorOrbitDBDatabase
   */
  connect(): Promise<Error | void>;
  /**
   * Drop the database and clear all local stored entries.
   *
   * @returns {(Promise<Error | void>)}
   * @memberof ISwarmStoreConnectorOrbitDBDatabase
   */
  drop(): Promise<Error | void>;
}

export interface ISwarmStoreConnectorBasicWithEntriesCount<
  TSwarmStoreConnectorType extends ESwarmStoreConnector,
  TStoreValue extends TSwarmStoreValueTypes<TSwarmStoreConnectorType>,
  DbType extends TSwarmStoreDatabaseType<TSwarmStoreConnectorType>
> extends ISwarmStoreConnectorBasic<TSwarmStoreConnectorType, TStoreValue, DbType> {
  /**
   * Items loaded from a persistance store
   * to the memory
   *
   * @type {number}
   * @memberof ISwarmStoreConnectorBasicWithEntriesCount
   */
  countEntriesLoaded: number;

  /**
   * All enrties count exists in the persistent storage
   *
   * @type {number}
   * @memberof ISwarmStoreConnectorBasicWithEntriesCount
   */
  countEntriesAllExists: number;
}

export interface ISwarmStoreConnectorBaseWithEntriesCount<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>
> extends ISwarmStoreConnectorBase<P, ItemType, DbType, ConnectorBasic, PO, DBO> {
  /**
   * Returns items loaded from a persistance store
   * to the memory for the database.
   *
   * @param {TSwarmStoreDatabaseOptions<P, ItemType>['dbName']} dbName
   * @returns {(Promise<number | Error>)}
   * @memberof ISwarmStoreConnectorBaseWithEntriesCount
   */
  getCountEntriesLoaded(dbName: DBO['dbName']): Promise<number | Error>;

  /**
   * Returns enrties count exists in the persistent storage
   * for the datbase passed in the argument.
   *
   * @param {TSwarmStoreDatabaseOptions<P, ItemType>['dbName']} dbName
   * @returns {(Promise<number | Error>)}
   * @memberof ISwarmStoreConnectorBaseWithEntriesCount
   */
  getCountEntriesAllExists(dbName: DBO['dbName']): Promise<number | Error>;
}

export interface ISwarmStoreConnector<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>
> extends EventEmitter<ISwarmStoreEvents<P, ItemType, DBO>>,
    ISwarmStoreConnectorBase<P, ItemType, DbType, ConnectorBasic, PO, DBO> {}

export interface ISwarmStoreConnectorWithEntriesCount<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>
> extends ISwarmStoreConnector<P, ItemType, DbType, ConnectorBasic, PO, DBO> {
  /**
   * Returns items loaded from a persistance store
   * to the memory for the database.
   *
   * @param {TSwarmStoreDatabaseOptions<P, ItemType>['dbName']} dbName
   * @returns {(Promise<number | Error>)}
   * @memberof ISwarmStoreConnectorBaseWithEntriesCount
   */
  getCountEntriesLoaded(dbName: DBO['dbName']): Promise<number | Error>;

  /**
   * Returns enrties count exists in the persistent storage
   * for the datbase passed in the argument.
   *
   * @param {TSwarmStoreDatabaseOptions<P, ItemType>['dbName']} dbName
   * @returns {(Promise<number | Error>)}
   * @memberof ISwarmStoreConnectorBaseWithEntriesCount
   */
  getCountEntriesAllExists(dbName: DBO['dbName']): Promise<number | Error>;
}

export type TSwarmStoreOptionsOfDatabasesKnownList<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>
> = Record<DBO['dbName'], DBO>;

export interface ISwarmStoreDatabasesCommonStatusList<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>
> {
  readonly options: TSwarmStoreOptionsOfDatabasesKnownList<P, ItemType, DBO>;
  readonly opened: Record<string, boolean>;
}

/**
 * Implements connection to a swarm
 * databases.
 * After the instance will be connected
 * to databases it allows to send request
 * to databases connected to.
 * Status of connection to a specific
 * databases is available on subscription
 * to the instance's methods.
 *
 * @export
 * @interface ISwarmStore
 */
export interface ISwarmStore<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, ConnectorBasic, PO, DBO>,
  O extends ISwarmStoreOptionsWithConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain, CFO>
> extends Omit<ISwarmStoreConnectorBase<P, ItemType, DbType, ConnectorBasic, PO, DBO>, 'connect'> {
  // status of a database connected to
  dbStatuses: ISwarmStoreDatabasesStatuses;
  /**
   * List with all databases opened any time.
   * It is persistant only if
   * a databasePersistantListStorage instance
   * provided while connecting.
   *
   * @type {ISwarmStoreDatabasesCommonStatusList}
   * @memberof ISwarmStore
   */
  databases: ISwarmStoreDatabasesCommonStatusList<P, ItemType, DBO> | undefined;
  // open connection with all databases
  connect(options: O): Promise<Error | void>;
}

export interface ISwarmStoreWithEntriesCount<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, ConnectorBasic, PO, DBO>,
  O extends ISwarmStoreOptionsWithConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain, CFO>
> extends ISwarmStore<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, CFO, ConnectorMain, O> {
  /**
   * Returns items loaded from a persistance store
   * to the memory for the database.
   *
   * @param {TSwarmStoreDatabaseOptions<P, ItemType>['dbName']} dbName
   * @returns {(Promise<number | Error>)}
   * @memberof ISwarmStoreConnectorBaseWithEntriesCount
   */
  getCountEntriesLoaded(dbName: DBO['dbName']): Promise<number | Error>;

  /**
   * Returns enrties count exists in the persistent storage
   * for the datbase passed in the argument.
   *
   * @param {TSwarmStoreDatabaseOptions<P, ItemType>['dbName']} dbName
   * @returns {(Promise<number | Error>)}
   * @memberof ISwarmStoreConnectorBaseWithEntriesCount
   */
  getCountEntriesAllExists(dbName: DBO['dbName']): Promise<number | Error>;
}
