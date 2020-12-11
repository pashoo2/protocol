import { TSecretStorageAuthorizazionOptions } from '../secret-storage-class/secret-storage-class.types';
import {
  ESwarmStoreConnectorOrbitDbDatabaseMethodNames,
  ISwarmStoreConnectorOrbitDbConnecectionBasicFabric,
  ISwarmStoreConnectorOrbitDBConnectionOptions,
  ISwarmStoreConnectorOrbitDBEvents,
  ISwarmStoreConnectorOrbitDBOptions,
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
  TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument,
  TSwarmStoreConnectorOrbitDbDatabaseEntityIndex,
  TSwarmStoreConnectorOrbitDbDatabaseMethodArgument,
  TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad,
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
import { TSwarmMessageUserIdentifierSerialized } from '../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { ISerializer } from '../../types/serialization.types';
import { IOptionsSerializerValidatorValidators } from '../basic-classes/options-serializer-validator-class/options-serializer-validator-class.types';

export type TSwarmStoreDatabaseType<P extends ESwarmStoreConnector> = ESwarmStoreConnectorOrbitDbDatabaseType;

export type TSwarmStoreOrbitDBDatabaseEntityUniqueIndex<
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
> = DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
  ? TSwarmStoreDatabaseEntityKey<ESwarmStoreConnector.OrbitDB>
  : TSwarmStoreDatabaseEntityAddress<ESwarmStoreConnector.OrbitDB>;

export type TSwarmStoreDatabaseEntityUniqueIndex<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> = P extends ESwarmStoreConnector.OrbitDB ? TSwarmStoreOrbitDBDatabaseEntityUniqueIndex<DbType> : never;

export type TSwarmStoreConnectorBasicFabric<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>
> = P extends ESwarmStoreConnector.OrbitDB
  ? ISwarmStoreConnectorOrbitDbConnecectionBasicFabric<T, DbType, DBO, ConnectorBasic>
  : never;

export type TSwarmStoreConnectorEventRetransmitter = (...args: any[]) => void;

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

export type TSwarmStoreConnectorConstructorOptions<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>
> = P extends ESwarmStoreConnector.OrbitDB ? ISwarmStoreConnectorOrbitDBOptions<ItemType, DbType> : never;

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
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>
> {
  [ESwarmStoreEventNames.STATE_CHANGE]: boolean;
  [ESwarmStoreEventNames.ERROR]: Error;
  [ESwarmStoreEventNames.CLOSE]: void;
  [ESwarmStoreEventNames.UPDATE]: string;
  [ESwarmStoreEventNames.LOADING]: number;
  [ESwarmStoreEventNames.DB_LOADING]: [string, number];
  [ESwarmStoreEventNames.READY]: string;
  [ESwarmStoreEventNames.DATABASES_LIST_UPDATED]: ISwarmStoreDatabasesCommonStatusList<P, ItemType, DbType, DBO>;
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
  T extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>
> = P extends ESwarmStoreConnector.OrbitDB
  ? ISwarmStoreConnectorOrbitDbDatabaseOptions<T, DbType>
  : ISwarmStoreDatabaseBaseOptions & ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, T>;

export type TSwarmStoreDatabaseOptionsSerialized = string;

/**
 * options of swarm databases want to connect
 *
 * @export
 * @interface ISwarmStoreDatabasesOptions
 */
export interface ISwarmStoreDatabasesOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>
> {
  // databases which must be started when the orbit db
  // instance will be ready to use
  databases: TSwarmStoreDatabaseOptions<P, T, DbType>[];
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
  userId?: TSwarmMessageUserIdentifierSerialized;
  // credentials used for data encryption
  credentials?: TSecretStorageAuthorizazionOptions;
}

export type TSwarmStoreConnectorConnectionOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>
> = P extends ESwarmStoreConnector.OrbitDB ? ISwarmStoreConnectorOrbitDBConnectionOptions<T, DbType, DBO, ConnectorBasic> : never;

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
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>
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
export interface ISwarmStoreMainOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>
> extends ISwarmStoreUserOptions,
    ISwarmStoreDatabasesOptions<P, T, DbType> {}

export interface ISwarmStoreOptionsConnectorFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO>
> {
  (options: CO): ConnectorMain;
}

export type TSwarmStoreOptionsSerialized = string;

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
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>
> extends Required<ISwarmStoreMainOptions<P, ItemType, DbType>>,
    Required<ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>> {}

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
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain> | undefined
> extends ISwarmStoreOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO> {
  connectorFabric: CFO;
}

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
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>
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
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>
> extends EventEmitter<ISwarmStoreConnectorOrbitDBEvents<P, ItemType, DbType, DBO>> {
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

export interface ISwarmStoreConnector<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>
> extends EventEmitter<ISwarmStoreEvents<P, ItemType, DbType, DBO>>,
    ISwarmStoreConnectorBase<P, ItemType, DbType, DBO, ConnectorBasic, PO> {}

export type TSwarmStoreOptionsOfDatabasesKnownList<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>
> = Record<DBO['dbName'], DBO>;

export interface ISwarmStoreDatabasesCommonStatusList<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>
> {
  readonly options: TSwarmStoreOptionsOfDatabasesKnownList<P, ItemType, DbType, DBO>;
  readonly opened: Record<string, boolean>;
}

export interface ISwarmStoreWithConnector<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO>
> {
  getConnectorOrError(): ConnectorMain | Error;
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
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  O extends ISwarmStoreOptionsWithConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO>
> extends Omit<ISwarmStoreConnectorBase<P, ItemType, DbType, DBO, ConnectorBasic, PO>, 'connect'> {
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
  databases: ISwarmStoreDatabasesCommonStatusList<P, ItemType, DbType, DBO> | undefined;
  // open connection with all databases
  connect(options: O): Promise<Error | void>;
}

export interface ISwarmStoreOptionsClassConstructorParams<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>
> {
  optionsSerializer?: ISerializer;
  optionsValidators?: IOptionsSerializerValidatorValidators<
    ISwarmStoreOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
    TSwarmStoreOptionsSerialized
  >;
  swarmStoreOptions: ISwarmStoreOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO> | TSwarmStoreOptionsSerialized;
}

export interface ISwarmStoreOptionsClass<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>
> {
  options: Readonly<ISwarmStoreOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>>;
  toString(): TSwarmStoreOptionsSerialized;
}

export interface ISwarmStoreOptionsClassConstructor<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>
> {
  new (params: ISwarmStoreOptionsClassConstructorParams<P, ItemType, DbType, DBO, ConnectorBasic, PO>): ISwarmStoreOptionsClass<
    P,
    ItemType,
    DbType,
    DBO,
    ConnectorBasic,
    PO
  >;
}

export type TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>,
  I extends unknown = never
> = (
  // value
  payload: T | I,
  userId: TSwarmMessageUserIdentifierSerialized,
  // key of the value
  key?: string,
  // operation which is processed (like delete, add or something else)
  operation?: TSwarmStoreDatabaseEntryOperation<P>
) => Promise<boolean>;

export interface ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>,
  I extends unknown = never
> {
  /**
   * check whether to grant access for the user with
   * the id to the entity wich is have the payload
   *
   * @memberof ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions
   * @returns boolean
   */
  grantAccess?: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, I>;
}
