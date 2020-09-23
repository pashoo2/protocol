import {
  ISwarmMessageStore,
  ISwarmMessageStoreMessagingMethods,
  ISwarmMessageStoreMessagingRequestWithMetaResult,
} from '../swarm-message-store/swarm-message-store.types';
import {
  ESwarmStoreConnector,
  ESwarmStoreEventNames,
} from '../swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreValueTypes,
} from '../swarm-store-class/swarm-store-class.types';
import { OmitFirstArg } from '../../types/helper.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmMessageInstanceDecrypted } from '../swarm-message/swarm-message-constructor.types';
import { ESwarmMessageStoreEventNames } from '../swarm-message-store/swarm-message-store.const';
import { TTypedEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import { ESwarmMessagesDatabaseCacheEventsNames } from './swarm-messages-database.const';
import { TSwarmMessageUserIdentifierSerialized } from '../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { TSwarmStoreDatabaseEntityUniqueIndex } from '../swarm-store-class/swarm-store-class.types';

export type TSwarmMessageDatabaseMessagesCached<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P> | undefined
> = P extends ESwarmStoreConnector.OrbitDB
  ? DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE // key is key in the database, value - message with meta
    ? Map<
        TSwarmStoreDatabaseEntityKey<P>,
        ISwarmMessageStoreMessagingRequestWithMetaResult<P>
      > // key is message address, value - message with meta
    : Map<
        TSwarmStoreDatabaseEntityAddress<P>,
        ISwarmMessageStoreMessagingRequestWithMetaResult<P>
      >
  : any;

export interface ISwarmMessagesDatabaseConnectCurrentUserOptions {
  userId: TSwarmMessageUserIdentifierSerialized;
}

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
  T extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>
> {
  user: ISwarmMessagesDatabaseConnectCurrentUserOptions;
  swarmMessageStore: ISwarmMessageStore<P, DbType>;
  dbOptions: TSwarmStoreDatabaseOptions<P, T>;
}

export interface ISwarmMessageDatabaseCacheEvents<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> {
  /**
   * Emits when swarm messages cache started to update
   *
   * @memberof ISwarmMessageDatabaseEvents
   */
  [ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING]: () => void;
  /**
   * Swarm messages were requested from the database and the cache was updated
   * with the messages.
   *
   * @memberof ISwarmMessageDatabaseEvents
   */
  [ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED]: (
    messages: TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined // new messages list
  ) => void;
}

export interface ISwarmMessageDatabaseEvents<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> extends ISwarmMessageDatabaseCacheEvents<P, DbType> {
  [ESwarmStoreEventNames.UPDATE]: (dbName: string) => void;
  [ESwarmStoreEventNames.DB_LOADING]: (
    dbName: string,
    percentage: number
  ) => void;
  [ESwarmMessageStoreEventNames.NEW_MESSAGE]: (
    dbName: string,
    message: ISwarmMessageInstanceDecrypted,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ) => void;
  [ESwarmMessageStoreEventNames.NEW_MESSAGE_ERROR]: (
    dbName: string,
    // swarm message string failed to deserialize
    messageSerialized: string,
    // error occurred while deserializing the message
    error: Error,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ) => void;
  [ESwarmStoreEventNames.READY]: (dbName: string) => void;
  [ESwarmStoreEventNames.CLOSE_DATABASE]: (dbName: string) => void;
  [ESwarmStoreEventNames.DROP_DATABASE]: (dbName: string) => void;
  [ESwarmMessageStoreEventNames.DELETE_MESSAGE]: (
    dbName: string,
    // the user who removed the message
    userId: string,
    // the global unique address (hash) of the DELETE message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key for the value,
    // for feed store it will be hash of the message which deleted by this one.
    keyOrAddress?: TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>
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
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> {
  addMessage: OmitFirstArg<
    ISwarmMessageStoreMessagingMethods<P, DbType>['addMessage']
  >;
  deleteMessage: OmitFirstArg<
    ISwarmMessageStoreMessagingMethods<P, DbType>['deleteMessage']
  >;
  collect: OmitFirstArg<
    ISwarmMessageStoreMessagingMethods<P, DbType>['collect']
  >;
  collectWithMeta: OmitFirstArg<
    ISwarmMessageStoreMessagingMethods<P, DbType>['collectWithMeta']
  >;
}

export interface ISwarmMessagesDatabaseProperties<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
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
   * @type {DbType}
   * @memberof ISwarmMessagesDatabaseProperties
   */
  dbType?: DbType;

  /**
   * Event emitter which emits various events
   * of the database.
   *
   * @type {TTypedEmitter<ISwarmMessageDatabaseEvents<P>>}
   * @memberof ISwarmMessagesDatabaseProperties
   */
  emitter: TTypedEmitter<ISwarmMessageDatabaseEvents<P, DbType>>;

  /**
   * Whether the messages cache update is in progress.
   *
   * @type {boolean}
   * @memberof ISwarmMessagesDatabaseProperties
   */
  whetherMessagesListUpdateInProgress: boolean;

  /**
   * Cause the list of cached messages is limited
   * by messages stored count, this flag indicated
   * whether some more messages are stored in the
   * databse, which didn't fit into the cache.
   *
   * @type {boolean}
   * @memberof ISwarmMessagesDatabaseProperties
   */
  isMessagesListContainsAllMessages: boolean;

  /**
   * List of a messages with additional meta information.
   *
   * @type {TSwarmMessageDatabaseMessagesCached<P, DbType>}
   * @memberof ISwarmMessagesDatabaseProperties
   */
  cachedMessages: TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined;
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
  T extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>
>
  extends ISwarmMessageStoreMessagingMethods<P, DbType>,
    ISwarmMessagesDatabaseProperties<P, DbType> {
  /**
   * Method used for connecting to the database.
   *
   * @param {ISwarmMessagesDatabaseConnectOptions<P>} options
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesDatabase
   */
  open(
    options: ISwarmMessagesDatabaseConnectOptions<P, T, DbType>
  ): Promise<void>;

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
export interface ISwarmMessagesDatabaseReady<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> {
  _dbName: string;
  _isReady: true;
  _swarmMessageStore: ISwarmMessageStore<P, DbType>;
  _currentUserId: TSwarmMessageUserIdentifierSerialized;
}

export interface ISwarmMessagesDatabaseCacheOptionsDbInstance<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> {
  collectWithMeta: OmitFirstArg<
    ISwarmMessageStoreMessagingMethods<P, DbType>['collectWithMeta']
  >;
}

export interface ISwarmMessagesDatabaseCacheOptions<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> {
  dbType: DbType;
  dbInstance: ISwarmMessagesDatabaseCacheOptionsDbInstance<P, DbType>;
}

export interface ISwarmMessagesDatabaseCache<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> {
  /**
   * Is the instance ready to be used.
   *
   * @type {boolean}
   * @memberof ISwarmMessagesDatabaseCache
   */
  readonly isReady: boolean;
  /**
   * Messages cached.
   *
   * @type {TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined}
   * @memberof ISwarmMessagesDatabaseCache
   */
  readonly cache: TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined;
  /**
   * Whether the cache is updating or not.
   *
   * @type {boolean}
   * @memberof ISwarmMessagesDatabaseCache
   */
  readonly isUpdating: boolean;
  /**
   * Emits events which are related to operations with the cache
   *
   * @type {TTypedEmitter<ISwarmMessageDatabaseEvents<P, DbType>>}
   * @memberof ISwarmMessagesDatabaseCache
   */
  readonly emitter: TTypedEmitter<ISwarmMessageDatabaseEvents<P, DbType>>;
  /**
   * Whether the cache contained all messages from the database
   * or it's limit was reaached and update were stopped.
   *
   * @type {boolean}
   * @memberof ISwarmMessagesDatabaseCache
   */
  readonly whetherMessagesListContainsAllMessages: boolean;
  /**
   * Start the instance
   *
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesDatabaseCache
   */
  start(): Promise<void>;
  /**
   * Close the instance
   *
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesDatabaseCache
   */
  close(): Promise<void>;
  /**
   * Start a new update of the messages cache or
   * just plan a new one.
   *
   * @returns {(Promise<TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined>)}
   * @memberof ISwarmMessagesDatabaseCache
   */
  update(): Promise<TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined>;
}

export interface ISwarmMessagesDatabaseCacheConstructor<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> {
  new (
    options: ISwarmMessagesDatabaseCacheOptions<P, DbType>
  ): ISwarmMessagesDatabaseCache<P, DbType>;
}
