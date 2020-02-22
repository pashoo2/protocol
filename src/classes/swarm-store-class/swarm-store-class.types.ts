import { ISecretStoreCredentials } from '../secret-storage-class/secret-storage-class.types';
import { ISwarmStoreConnectorOrbitDBConnectionOptions } from './swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import { EventEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmStoreDbStatus as ESwarmStoreDatabaseStatus } from './swarm-store-class.const';
import { SWARM_STORE_DATABASE_STATUS_ABSENT } from './swarm-store-class.const';
import {
  TSwarmStoreConnectorOrbitDbDatabaseMethodNames,
  TSwarmStoreConnectorOrbitDbDatabaseMathodArgument,
} from './swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import {
  ESwarmStoreConnector,
  ESwarmStoreEventNames,
} from './swarm-store-class.const';

export type TSwarmStoreConnectorEventRetransmitter = (...args: any[]) => void;

export interface ISwarmStoreEvents {
  [ESwarmStoreEventNames.STATE_CHANGE]: boolean;
  [ESwarmStoreEventNames.ERROR]: Error;
  [ESwarmStoreEventNames.CLOSE]: void;
  [ESwarmStoreEventNames.UPDATE]: string;
  [ESwarmStoreEventNames.LOADING]: number;
  [ESwarmStoreEventNames.DB_LOADING]: [string, number];
  [ESwarmStoreEventNames.READY]: string;
}

// arguments avalilable for a database method
export type TSwarmStoreDatabaseMethodArgument<
  P extends ESwarmStoreConnector,
  M
> = P extends ESwarmStoreConnector.OrbitDB
  ? TSwarmStoreConnectorOrbitDbDatabaseMathodArgument<M>
  : never;

// arguments avalilable for a database
export type TSwarmStoreDatabaseMethodAnswer<
  P extends ESwarmStoreConnector,
  T
> = P extends ESwarmStoreConnector.OrbitDB ? T : never;

// a value can be stored
export type TSwarmStoreValueTypes<
  P extends ESwarmStoreConnector
> = P extends ESwarmStoreConnector.OrbitDB ? any : never;

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
export interface ISwarmStoreOptions<P extends ESwarmStoreConnector>
  extends Required<ISwarmStoreMainOptions>,
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
    ISwarmStoreDatabaseOptions['dbName'],
    ESwarmStoreDatabaseStatus | typeof SWARM_STORE_DATABASE_STATUS_ABSENT
  > {}

// methods available for a database providers
export type TSwarmStoreDatabaseMethod<
  P extends ESwarmStoreConnector
> = P extends ESwarmStoreConnector.OrbitDB
  ? TSwarmStoreConnectorOrbitDbDatabaseMethodNames
  : never;

/**
 * this interface must be implemented by a swarm storage connectors
 *
 * @export
 * @interface ISwarmStoreConnector
 * @extends {EventEmitter<ISwarmStoreEvents>}
 * @template P
 */
export interface ISwarmStoreConnectorBase<P extends ESwarmStoreConnector> {
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
  // send request to a swarm database to perform
  // an operation such as read or seta value
  // on a database
  request<V extends TSwarmStoreValueTypes<P>, A>(
    dbName: ISwarmStoreDatabaseOptions['dbName'],
    dbMethod: TSwarmStoreDatabaseMethod<P>,
    arg: TSwarmStoreDatabaseMethodArgument<P, V>
  ): Promise<TSwarmStoreDatabaseMethodAnswer<P, A> | Error>;
}

export interface ISwarmStoreConnector<P extends ESwarmStoreConnector>
  extends EventEmitter<ISwarmStoreEvents>,
    ISwarmStoreConnectorBase<P> {}

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
export interface ISwarmStore<P extends ESwarmStoreConnector>
  extends Omit<ISwarmStoreConnectorBase<P>, 'connect'> {
  // status of a database connected to
  dbStatuses: ISwarmStoreDatabasesStatuses;
  // open connection with all databases
  connect(options: ISwarmStoreOptions<P>): Promise<Error | void>;
}
