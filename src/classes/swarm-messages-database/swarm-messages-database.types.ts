import {
  ISwarmMessageStore,
  ISwarmMessageStoreMessagingMethods,
} from '../swarm-message-store/swarm-message-store.types';
import {
  ESwarmStoreConnector,
  ESwarmStoreEventNames,
} from '../swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseEntityKey,
} from '../swarm-store-class/swarm-store-class.types';
import { OmitFirstArg } from '../../types/helper.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmMessageInstanceDecrypted } from '../swarm-message/swarm-message-constructor.types';
import { ESwarmMessageStoreEventNames } from '../swarm-message-store/swarm-message-store.const';
import { TTypedEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../swarm-message-store/swarm-message-store.types';
import { TSwarmStoreValueTypes } from '../swarm-store-class/swarm-store-class.types';
import { ESwarmMessagesDatabaseEventsNames } from './swarm-messages-database.const';

/**
 * Options which are necessary for opening
 * the database.
 *
 * @export
 * @interface ISwarmMessagesDatabaseConnectOptions
 * @template P
 */
export interface ISwarmMessagesDatabaseConnectOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>
> {
  swarmMessageStore: ISwarmMessageStore<P>;
  dbOptions: TSwarmStoreDatabaseOptions<P, T>;
}

export interface ISwarmMessageDatabaseEvents<P extends ESwarmStoreConnector> {
  [ESwarmStoreEventNames.UPDATE]: (dbName: string) => void;
  [ESwarmStoreEventNames.DB_LOADING]: (
    dbName: string,
    percentage: number
  ) => void;
  [ESwarmMessageStoreEventNames.NEW_MESSAGE]: (
    dbName: string,
    message: ISwarmMessageInstanceDecrypted,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityKey<P>,
    // for key-value store it will be the key
    key?: string
  ) => void;
  [ESwarmMessageStoreEventNames.NEW_MESSAGE_ERROR]: (
    dbName: string,
    // swarm message string failed to deserialize
    messageSerialized: string,
    // error occurred while deserializing the message
    error: Error,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityKey<P>,
    // for key-value store it will be the key
    key?: string
  ) => void;
  [ESwarmStoreEventNames.READY]: (dbName: string) => void;
  [ESwarmStoreEventNames.CLOSE_DATABASE]: (dbName: string) => void;
  [ESwarmStoreEventNames.DROP_DATABASE]: (dbName: string) => void;
  [ESwarmMessageStoreEventNames.DELETE_MESSAGE]: (
    dbName: string,
    // the user who removed the message
    userId: string,
    // the global unique address (hash) of the DELETE message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityKey<P>,
    // for key-value store it will be the key for the value,
    // for feed store it will be hash of the message which deleted by this one.
    keyOrAddress?: string
  ) => void;
  /**
   * Emits when swarm messages cache started to update
   *
   * @memberof ISwarmMessageDatabaseEvents
   */
  [ESwarmMessagesDatabaseEventsNames.CACHE_UPDATING]: () => void;
  /**
   * Swarm messages were requested from the database and the cache was updated
   * with the messages.
   *
   * @memberof ISwarmMessageDatabaseEvents
   */
  [ESwarmMessagesDatabaseEventsNames.CACHE_UPDATED]: (
    newMessagesList: ISwarmMessageStoreMessagingRequestWithMetaResult<P>[] // new messages list
  ) => void;
}

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
  collectWithMeta: OmitFirstArg<
    ISwarmMessageStoreMessagingMethods<P>['collectWithMeta']
  >;
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
   * @type {TTypedEmitter<ISwarmMessageDatabaseEvents<P>>}
   * @memberof ISwarmMessagesDatabaseProperties
   */
  emitter: TTypedEmitter<ISwarmMessageDatabaseEvents<P>>;

  /**
   * List of a messages with additional meta information.
   *
   * @type {ISwarmMessageStoreMessagingRequestWithMetaResult<P>[]}
   * @memberof ISwarmMessagesDatabaseProperties
   */
  messagesList: ISwarmMessageStoreMessagingRequestWithMetaResult<P>[];
}

/**
 * Single database which can be used for information
 * sharing within the swarm via swarm messages.
 *
 * @export
 * @interface ISwarmMessagesDatabase
 */
export interface ISwarmMessagesDatabase<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>
>
  extends ISwarmMessageStoreMessagingMethods<P>,
    ISwarmMessagesDatabaseProperties<P> {
  /**
   * Method used for connecting to the database.
   *
   * @param {ISwarmMessagesDatabaseConnectOptions<P>} options
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesDatabase
   */
  open(options: ISwarmMessagesDatabaseConnectOptions<P, T>): Promise<void>;

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

/**
 * Properties of a databse which is ready to use.
 *
 * @export
 * @interface ISwarmMessagesDatabaseReady
 * @template P
 */
export interface ISwarmMessagesDatabaseReady<P extends ESwarmStoreConnector> {
  _dbName: string;
  _isReady: true;
  _swarmMessageStore: ISwarmMessageStore<P>;
}
