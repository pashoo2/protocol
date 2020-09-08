import {
  ISwarmMessageStore,
  ISwarmMessageStoreMessagingMethods,
} from '../swarm-message-store/swarm-message-store.types';
import {
  ESwarmStoreConnector,
  ESwarmStoreEventNames,
} from '../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseOptions } from '../swarm-store-class/swarm-store-class.types';
import { OmitFirstArg } from '../../types/helper.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { EventEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';

/**
 * Options which are necessary for opening
 * the database.
 *
 * @export
 * @interface ISwarmMessagesDatabaseConnectOptions
 * @template P
 */
export interface ISwarmMessagesDatabaseConnectOptions<
  P extends ESwarmStoreConnector
> {
  swarmMessageStore: ISwarmMessageStore<P>;
  dbOptions: TSwarmStoreDatabaseOptions<P>;
}

export type TSwarmMessageDatabaseEvents<P extends ESwarmStoreConnector> = {
  [ESwarmStoreEventNames.UPDATE]: (dbName: string) => void;
  [ESwarmStoreEventNames.DB_LOADING]: (
    dbName: string,
    percentage: number
  ) => void;
  [ESwarmStoreEventNames.NEW_ENTRY]: (
    dbName: string,
    entry: any,
    entryAddress: string,
    heads: any,
    dbType?: TSwarmMessagesDatabaseType<P>
  ) => void;
  [ESwarmStoreEventNames.READY]: (dbName: string) => void;
  [ESwarmStoreEventNames.CLOSE_DATABASE]: (dbName: string) => void;
  [ESwarmStoreEventNames.DROP_DATABASE]: (dbName: string) => void;
};

/**
 * Methods used for data exchanging within swarm
 * via swarm messages.
 *
 * @export
 * @interface ISwarmMessageDatabaseMessagingMethods
 * @template P
 */
export interface ISwarmMessageDatabaseMessagingMethods<
  P extends ESwarmStoreConnector
> {
  addMessage: OmitFirstArg<ISwarmMessageStoreMessagingMethods<P>['addMessage']>;
  deleteMessage: OmitFirstArg<
    ISwarmMessageStoreMessagingMethods<P>['deleteMessage']
  >;
  collect: OmitFirstArg<ISwarmMessageStoreMessagingMethods<P>['collect']>;
}

export type TSwarmMessagesDatabaseType<
  P extends ESwarmStoreConnector
> = P extends ESwarmStoreConnector.OrbitDB
  ? ESwarmStoreConnectorOrbitDbDatabaseType
  : undefined;

export interface ISwarmMessagesDatabaseProperties<
  P extends ESwarmStoreConnector
> {
  /**
   * Is the database ready to use.
   *
   * @type {boolean}
   * @memberof ISwarmMessagesDatabaseProperties
   */
  isReady: boolean;

  /**
   * Name of the database.
   *
   * @type {(string | undefined)}
   * @memberof ISwarmMessagesDatabaseProperties
   */
  dbName: string | undefined;

  /**
   * Type of the database if exist for database
   * connection type.
   *
   * @type {TSwarmMessagesDatabaseType<P>}
   * @memberof ISwarmMessagesDatabaseProperties
   */
  dbType?: TSwarmMessagesDatabaseType<P>;

  /**
   * Event emitter which emits various events
   * of the database.
   *
   * @type {EventEmitter<TSwarmMessageDatabaseEvents<P>>}
   * @memberof ISwarmMessagesDatabaseProperties
   */
  emitter: EventEmitter<TSwarmMessageDatabaseEvents<P>>;
}

/**
 * Single database which can be used for information
 * sharing within the swarm via swarm messages.
 *
 * @export
 * @interface ISwarmMessagesDatabase
 */
export interface ISwarmMessagesDatabase<P extends ESwarmStoreConnector>
  extends ISwarmMessageStoreMessagingMethods<P>,
    ISwarmMessagesDatabaseProperties<P> {
  /**
   * Method used for connecting to the database.
   *
   * @param {ISwarmMessagesDatabaseConnectOptions<P>} options
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesDatabase
   */
  open(options: ISwarmMessagesDatabaseConnectOptions<P>): Promise<void>;

  /**
   * Close the connection with the database.
   *
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesDatabase
   */
  close(): Promise<void>;

  /**
   * Close the connections with the database
   * and remove all data stored locally.
   *
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesDatabase
   */
  drop(): Promise<void>;
}
