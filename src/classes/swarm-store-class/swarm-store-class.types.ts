import { ISecretStoreCredentials } from '../secret-storage-class/secret-storage-class.types';
import { ISwarmStoreConnectorOrbitDBConnectionOptions } from './swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
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

export type TSwarmStoreDatabaseType<
  P extends ESwarmStoreConnector
> = ESwarmStoreConnectorOrbitDbDatabaseType;

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

export interface ISwarmStoreEvents {
  [ESwarmStoreEventNames.STATE_CHANGE]: boolean;
  [ESwarmStoreEventNames.ERROR]: Error;
  [ESwarmStoreEventNames.CLOSE]: void;
  [ESwarmStoreEventNames.UPDATE]: string;
  [ESwarmStoreEventNames.LOADING]: number;
  [ESwarmStoreEventNames.DB_LOADING]: [string, number];
  [ESwarmStoreEventNames.READY]: string;
  [ESwarmStoreEventNames.DATABASES_LIST_UPDATED]: ISwarmStoreDatabasesCommonStatusList;
}

// arguments avalilable for a database method
export type TSwarmStoreDatabaseMethodArgument<
  P extends ESwarmStoreConnector,
  M,
  DbType extends TSwarmStoreDatabaseType<P>
> = P extends ESwarmStoreConnector.OrbitDB
  ? TSwarmStoreConnectorOrbitDbDatabaseMethodArgument<M, DbType>
  : never;

export type TSwarmStoreDatabaseEntryOperation<
  P extends ESwarmStoreConnector
> = P extends ESwarmStoreConnector.OrbitDB ? EOrbitDbFeedStoreOperation : never;

// arguments avalilable for a database method
export type TSwarmStoreDatabaseIteratorMethodArgument<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> = P extends ESwarmStoreConnector.OrbitDB
  ? ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>
  : any;

export type TSwarmStoreDatabaseLoadMethodAnswer<
  P extends ESwarmStoreConnector.OrbitDB
> = P extends ESwarmStoreConnector.OrbitDB
  ? ISwarmStoreConnectorRequestLoadAnswer
  : never;

export type TSwarmStoreDatabaseCloseMethodAnswer<
  P extends ESwarmStoreConnector.OrbitDB
> = P extends ESwarmStoreConnector.OrbitDB ? void : never;

// arguments avalilable for a database
export type TSwarmStoreDatabaseIteratorMethodAnswer<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>
> = P extends ESwarmStoreConnector.OrbitDB
  ?
      | Error
      | Array<ISwarmStoreConnectorOrbitDbDatabaseValue<T> | Error | undefined>
  : never;

// TODO - typescript issue
// string cannot be assigned to P extends ESwarmStoreConnector.OrbitDB ? TSwarmMessageSerialized : any;
/**
 * Type of a raw value can be stored in the database
 */
export type TSwarmStoreValueTypes<
  P extends ESwarmStoreConnector
> = TSwarmMessageSerialized;

// arguments avalilable for a database
export type TSwarmStoreDatabaseMethodAnswer<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>
> = P extends ESwarmStoreConnector.OrbitDB ? T : any;

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

export type TSwarmStoreDatabaseEntityKey<
  P extends ESwarmStoreConnector = never
> = P extends ESwarmStoreConnector.OrbitDB
  ? TSwarmStoreConnectorOrbitDbDatabaseStoreKey
  : string;

export type TSwarmStoreDatabaseEntityAddress<
  P extends ESwarmStoreConnector
> = P extends ESwarmStoreConnector.OrbitDB
  ? TSwarmStoreConnectorOrbitDbDatabaseStoreHash
  : string;

/**
 * options of a swarm database
 *
 * @export
 * @interface ISwarmStoreDatabaseOptions
 */
export type TSwarmStoreDatabaseOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>
> = P extends ESwarmStoreConnector.OrbitDB
  ? ISwarmStoreConnectorOrbitDbDatabaseOptions<T>
  : ISwarmStoreDatabaseBaseOptions;
/**
 * options of swarm databases want to connect
 *
 * @export
 * @interface ISwarmStoreDatabasesOptions
 */
export interface ISwarmStoreDatabasesOptions<
  P extends ESwarmStoreConnector = never,
  T extends TSwarmStoreValueTypes<P> = never
> {
  // databases which must be started when the orbit db
  // instance will be ready to use
  databases: P extends never
    ? ISwarmStoreDatabaseBaseOptions
    : TSwarmStoreDatabaseOptions<P, T>[];
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
  P extends ESwarmStoreConnector
> = P extends ESwarmStoreConnector.OrbitDB
  ? ISwarmStoreConnectorOrbitDBConnectionOptions
  : never;

/**
 * options defines which provider to use
 *
 * @export
 * @interface ISwarmStoreProviderOptions
 */
export interface ISwarmStoreProviderOptions<P extends ESwarmStoreConnector> {
  provider: P;
  providerConnectionOptions: TSwarmStoreConnectorConnectionOptions<P>;
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
  P extends ESwarmStoreConnector = never,
  T extends TSwarmStoreValueTypes<P> = never
> extends ISwarmStoreUserOptions, ISwarmStoreDatabasesOptions<P, T> {}

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
  T extends TSwarmStoreValueTypes<P>
>
  extends Required<ISwarmStoreMainOptions<P, T>>,
    Required<ISwarmStoreProviderOptions<P>> {}

/**
 * store a status of each database
 *
 * key - database name
 * value - the last event from the database received from the provider
 * @export
 * @interface ISwarmStoreDatabasesStatus
 */
export interface ISwarmStoreDatabasesStatuses
  extends Record<
    string,
    ESwarmStoreDatabaseStatus | typeof SWARM_STORE_DATABASE_STATUS_ABSENT
  > {}

// methods available for a database providers
export type TSwarmStoreDatabaseMethod<
  P extends ESwarmStoreConnector
> = P extends ESwarmStoreConnector.OrbitDB
  ? TSwarmStoreConnectorOrbitDbDatabaseMethodNames
  : never;

export type TSwarmStoreDatabaseRequestMethodReturnType<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>
> =
  | Error
  | TSwarmStoreDatabaseLoadMethodAnswer<P>
  | TSwarmStoreDatabaseCloseMethodAnswer<P>
  | TSwarmStoreDatabaseMethodAnswer<P, ItemType>
  | TSwarmStoreDatabaseIteratorMethodAnswer<P, ItemType>;

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
  DbType extends TSwarmStoreDatabaseType<P>
> {
  // ready to use
  isReady: boolean;
  // disconnected from the swarm
  isClosed: boolean;
  // open connection with all databases
  connect(
    options: TSwarmStoreConnectorConnectionOptions<P>,
    dataBasePersistantStorage?: IStorageCommon
  ): Promise<Error | void>;
  // close all the existing connections
  close(): Promise<Error | void>;
  // open a new connection to the database specified
  openDatabase<T extends ItemType>(
    dbOptions: TSwarmStoreDatabaseOptions<P, T>
  ): Promise<void | Error>;
  // close connection to a database specified
  closeDatabase(
    dbName: TSwarmStoreDatabaseOptions<P, ItemType>['dbName']
  ): Promise<void | Error>;
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
    dbName: TSwarmStoreDatabaseOptions<P, A>['dbName'],
    dbMethod: TSwarmStoreDatabaseMethod<P>,
    arg: TSwarmStoreDatabaseMethodArgument<P, A, DT>
  ): Promise<TSwarmStoreDatabaseRequestMethodReturnType<P, A>>;
}

export interface ISwarmStoreConnector<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>
>
  extends EventEmitter<ISwarmStoreEvents>,
    ISwarmStoreConnectorBase<P, ItemType, DbType> {}

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
  O extends ISwarmStoreOptions<P, ItemType> = ISwarmStoreOptions<P, ItemType>
> extends Omit<ISwarmStoreConnectorBase<P, ItemType, DbType>, 'connect'> {
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
  databases?: ISwarmStoreDatabasesCommonStatusList;
  // open connection with all databases
  connect(options: O): Promise<Error | void>;
}

export interface ISwarmStoreOptionsOfDatabasesKnownList
  extends Record<
    ISwarmStoreDatabaseBaseOptions['dbName'],
    ISwarmStoreDatabaseBaseOptions
  > {}

export interface ISwarmStoreDatabasesCommonStatusList {
  readonly options: ISwarmStoreOptionsOfDatabasesKnownList;
  readonly opened: Record<string, boolean>;
}
