import { ISecretStoreCredentials } from '../secret-storage-class/secret-storage-class.types';
import { ISwarmStoreConnectorOrbitDBConnectionOptions } from './swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import { EventEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';
import {
  TSwarmStoreConnectorOrbitDbDatabaseMethodNames,
  TSwarmStoreConnectorOrbitDbDatabaseMathodArgument,
} from './swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import {
  ESwarmStoreProvider,
  ESwarmStoreEventNames,
} from './swarm-store-class.const';

export interface ISwarmStoreEvents {
  [ESwarmStoreEventNames.STATE_CHANGE]: boolean;
  [ESwarmStoreEventNames.ERROR]: Error;
  [ESwarmStoreEventNames.CLOSE]: void;
  [ESwarmStoreEventNames.UPDATE]: string;
  [ESwarmStoreEventNames.LOADING]: number;
  [ESwarmStoreEventNames.READY]: string;
}

/**
 * options of a swarm database
 *
 * @export
 * @interface ISwarmStoreDatabaseOptions
 */
export interface ISwarmStoreDatabaseOptions {
  // Database name
  dbName: string;
  // is a puclic database. Private by
  isPublic?: boolean;
}

/**
 * options of swarm databases want to connect
 *
 * @export
 * @interface ISwarmStoreDatabasesOptions
 */
export interface ISwarmStoreDatabasesOptions {
  // databases which must be started when the orbit db
  // instance will be ready to use
  databases: ISwarmStoreDatabaseOptions[];
  // a virtual directory name where to store all the data received
  directory?: string;
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
  P extends ESwarmStoreProvider
> = P extends ESwarmStoreProvider.OrbitDB
  ? ISwarmStoreConnectorOrbitDBConnectionOptions
  : never;

/**
 * options defines which provider to use
 *
 * @export
 * @interface ISwarmStoreProviderOptions
 */
export interface ISwarmStoreProviderOptions<P extends ESwarmStoreProvider> {
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
export interface ISwarmStoreMainOptions
  extends ISwarmStoreUserOptions,
    ISwarmStoreDatabasesOptions {}

/**
 * options used for connection to a swarm databases
 *
 * @export
 * @interface ISwarmStoreOptions
 * @extends {ISwarmStoreUserOptions}
 * @extends {ISwarmStoreDatabasesOptions}
 */
export interface ISwarmStoreOptions<P extends ESwarmStoreProvider>
  extends ISwarmStoreMainOptions,
    ISwarmStoreProviderOptions<P> {}

/**
 * store a status of each database
 *
 * key - database name
 * value - the last event from the database received from the provider
 * @export
 * @interface ISwarmStoreDatabasesStatus
 */
export interface ISwarmStoreDatabasesStatus
  extends Record<
    ISwarmStoreDatabaseOptions['dbName'],
    ESwarmStoreEventNames | undefined
  > {}

// methods available for a database providers
export type TSwarmStoreDatabaseMethod<
  P extends ESwarmStoreProvider
> = P extends ESwarmStoreProvider.OrbitDB
  ? TSwarmStoreConnectorOrbitDbDatabaseMethodNames
  : never;

// arguments avalilable for a database method
export type TSwarmStoreDatabaseMethodArgument<
  P extends ESwarmStoreProvider,
  M
> = P extends ESwarmStoreProvider.OrbitDB
  ? TSwarmStoreConnectorOrbitDbDatabaseMathodArgument<M>
  : never;

// arguments avalilable for a database
export type TSwarmStoreDatabaseMethodAnswer<
  P extends ESwarmStoreProvider,
  T
> = P extends ESwarmStoreProvider.OrbitDB ? T | Error : never;

// a value can be stored
export type TSwarmStoreValueTypes<
  P extends ESwarmStoreProvider
> = P extends ESwarmStoreProvider.OrbitDB ? any : never;

/**
 * this interface must be implemented by a swarm storage connectors
 *
 * @export
 * @interface ISwarmStoreConnector
 * @extends {EventEmitter<ISwarmStoreEvents>}
 * @template P
 */
export interface ISwarmStoreConnector<P extends ESwarmStoreProvider>
  extends EventEmitter<ISwarmStoreEvents> {
  // ready to use
  isReady: boolean;
  // disconnected from the swarm
  isClosed: boolean;
  // open connection with all databases
  connect(
    options: TSwarmStoreConnectorConnectionOptions<P>
  ): Promise<Error | void>;
  // close all the existing connections
  close(): Promise<Error | void>;
  // open a new connection to the database specified
  openDatabase(dbOptions: ISwarmStoreDatabaseOptions): Promise<void | Error>;
  // close connection to a database specified
  closeDatabase(
    dbName: ISwarmStoreDatabaseOptions['dbName']
  ): Promise<void | Error>;
  // send request to a swarm database
  request<V extends TSwarmStoreValueTypes<P>, A>(
    dbName: ISwarmStoreDatabaseOptions['dbName'],
    dbMethod: TSwarmStoreDatabaseMethod<P>,
    arg: TSwarmStoreDatabaseMethodArgument<P, V>
  ): Promise<TSwarmStoreDatabaseMethodAnswer<P, A>>;
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
export interface ISwarmStore<P extends ESwarmStoreProvider>
  extends Omit<ISwarmStoreConnector<P>, 'connect'> {
  // status of a database connected to
  dbStatuses: ISwarmStoreDatabasesStatus;
  // open connection with all databases
  connect(options: ISwarmStoreOptions<P>): Promise<Error | void>;
}
