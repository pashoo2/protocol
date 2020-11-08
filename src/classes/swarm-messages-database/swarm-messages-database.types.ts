import {
  ISwarmMessageStore,
  ISwarmMessageStoreMessagingMethods,
  ISwarmMessageStoreMessagingRequestWithMetaResult,
} from '../swarm-message-store/swarm-message-store.types';
import { ESwarmStoreConnector, ESwarmStoreEventNames } from '../swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseOptions,
} from '../swarm-store-class/swarm-store-class.types';
import { OmitFirstArg } from '../../types/helper.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import {
  ISwarmMessageInstanceDecrypted,
  TSwarmMessageSerialized,
  ISwarmMessageInstanceEncrypted,
} from '../swarm-message/swarm-message-constructor.types';
import { ESwarmMessageStoreEventNames } from '../swarm-message-store/swarm-message-store.const';
import { TTypedEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import { ESwarmMessagesDatabaseCacheEventsNames } from './swarm-messages-database.const';
import { TSwarmMessageUserIdentifierSerialized } from '../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import {
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
} from '../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageInstance } from '../swarm-message/swarm-message-constructor.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  ISwarmMessageStoreMessageWithMeta,
} from '../swarm-message-store/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmStoreConnectorBasic, ISwarmStoreConnector } from '../swarm-store-class/swarm-store-class.types';

export type TSwarmMessageDatabaseMessagesCached<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P> | undefined,
  MD extends ISwarmMessageInstanceDecrypted
> = DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE // key is key in the database, value - message with meta
  ? Map<TSwarmStoreDatabaseEntityKey<P>, ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>> // key is message address, value - message with meta
  : Map<TSwarmStoreDatabaseEntityAddress<P>, ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>>;

export interface ISwarmMessagesDatabaseConnectCurrentUserOptions {
  userId: TSwarmMessageUserIdentifierSerialized;
}

export interface ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T>,
  MD extends ISwarmMessageInstanceDecrypted
> {
  cacheConstructor?: ISwarmMessagesDatabaseCacheConstructor<P, T, DbType, DBO, MD>;
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
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T>,
  MI extends TSwarmMessageInstance,
  SMS extends ISwarmMessageStoreMessagingMethods<P, T, DbType, MI>,
  MD extends Exclude<MI, ISwarmMessageInstanceEncrypted>
> {
  user: ISwarmMessagesDatabaseConnectCurrentUserOptions;
  swarmMessageStore: SMS;
  dbOptions: DBO;
  cacheOptions?: ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions<P, T, DbType, DBO, MD>;
}

export interface ISwarmMessageDatabaseCacheEvents<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted
> {
  /**
   * Emits when swarm messages cache started to update
   *
   * @memberof ISwarmMessageDatabaseEvents
   */
  [ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING]: () => unknown;
  /**
   * Swarm messages were requested from the database and the cache was updated
   * with the messages.
   *
   * @memberof ISwarmMessageDatabaseEvents
   */
  [ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED]: (
    messages: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined // new messages list
  ) => unknown;
}

export interface ISwarmMessageDatabaseEvents<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T>,
  MD extends ISwarmMessageInstanceDecrypted
> extends ISwarmMessageDatabaseCacheEvents<P, DbType, MD> {
  [ESwarmStoreEventNames.UPDATE]: (dbName: DBO['dbName']) => unknown;
  [ESwarmStoreEventNames.DB_LOADING]: (dbName: DBO['dbName'], percentage: number) => unknown;
  [ESwarmMessageStoreEventNames.NEW_MESSAGE]: (
    dbName: DBO['dbName'],
    message: MD,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ) => unknown;
  [ESwarmMessageStoreEventNames.NEW_MESSAGE_ERROR]: (
    dbName: DBO['dbName'],
    // swarm message string failed to deserialize
    messageSerialized: T,
    // error occurred while deserializing the message
    error: Error,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ) => unknown;
  [ESwarmStoreEventNames.READY]: (dbName: DBO['dbName']) => unknown;
  [ESwarmStoreEventNames.CLOSE_DATABASE]: (dbName: DBO['dbName']) => unknown;
  [ESwarmStoreEventNames.DROP_DATABASE]: (dbName: DBO['dbName']) => unknown;
  [ESwarmMessageStoreEventNames.DELETE_MESSAGE]: (
    dbName: DBO['dbName'],
    // the user who removed the message
    userId: TSwarmMessageUserIdentifierSerialized,
    // the global unique address (hash) of the DELETE message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // the global unique address (hash) of the DELETED message in the swarm
    messageDeletedAddress: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityAddress<P> | undefined
      : TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key for the value,
    // for feed store it will be hash of the message which deleted by this one.
    key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined
  ) => unknown;
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
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  MI extends TSwarmMessageInstance,
  SMS extends ISwarmMessageStoreMessagingMethods<P, ItemType, DbType, MI>
> {
  addMessage: OmitFirstArg<SMS['addMessage']>;
  deleteMessage: OmitFirstArg<SMS['deleteMessage']>;
  collect: OmitFirstArg<SMS['collect']>;
  collectWithMeta: OmitFirstArg<SMS['collectWithMeta']>;
}

export interface ISwarmMessagesDatabaseProperties<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>,
  MD extends ISwarmMessageInstanceDecrypted
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
  emitter: TTypedEmitter<ISwarmMessageDatabaseEvents<P, ItemType, DbType, DBO, MD>>;

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
  cachedMessages: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined;
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
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, ConnectorBasic, PO>,
  DBO extends TSwarmStoreDatabaseOptions<P, T>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, ConnectorBasic, PO, DBO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MSI, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    ConnectorBasic,
    PO,
    CO,
    DBO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<P, T, DbType, ConnectorBasic, PO, DBO, CO, CFO, ConnectorMain, MSI, GAC, MCF, ACO, O>
> extends ISwarmMessageStoreMessagingMethods<P, T, DbType, Exclude<MSI, T>>,
    ISwarmMessagesDatabaseProperties<P, T, DbType, DBO, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>> {
  /**
   * Method used for connecting to the database.
   *
   * @param {ISwarmMessagesDatabaseConnectOptions<P>} options
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesDatabase
   */
  open(
    options: ISwarmMessagesDatabaseConnectOptions<
      P,
      T,
      DbType,
      DBO,
      Exclude<MSI, T>,
      SMS,
      Exclude<Exclude<MSI, T>, ISwarmMessageInstanceEncrypted>
    >
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
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, ConnectorBasic, PO>,
  DBO extends TSwarmStoreDatabaseOptions<P, T>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, ConnectorBasic, PO, DBO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MSI, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    ConnectorBasic,
    PO,
    CO,
    DBO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO
  >
> {
  _dbName: string;
  _isReady: true;
  _swarmMessageStore: ISwarmMessageStore<P, T, DbType, ConnectorBasic, PO, DBO, CO, CFO, ConnectorMain, MSI, GAC, MCF, ACO, O>;
  _currentUserId: TSwarmMessageUserIdentifierSerialized;
  _swarmMessagesCache: ISwarmMessagesDatabaseCache<P, T, DbType, DBO, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>;
}

export interface ISwarmMessagesDatabaseCacheOptionsDbInstance<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted
> {
  collectWithMeta: OmitFirstArg<ISwarmMessageStoreMessagingMethods<P, T, DbType, MD>['collectWithMeta']>;
}

export interface ISwarmMessagesDatabaseCacheOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted
> {
  dbType: DbType;
  dbName: string;
  dbInstance: ISwarmMessagesDatabaseCacheOptionsDbInstance<P, T, DbType, MD>;
}

export interface ISwarmMessagesDatabaseCache<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T>,
  MD extends ISwarmMessageInstanceDecrypted
> {
  /**
   * Is the instance ready to be used.
   *
   * @type {boolean}
   * @memberof ISwarmMessagesDatabaseCache
   */
  readonly isReady: boolean;
  /**
   * Messages cached updated from the database
   * and added with addMessage method
   *
   * @type {TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined}
   * @memberof ISwarmMessagesDatabaseCache
   */
  readonly cache: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined;
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
  readonly emitter: TTypedEmitter<ISwarmMessageDatabaseEvents<P, T, DbType, DBO, MD>>;
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
  update(): Promise<TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined>;
  /**
   * Add the message with some meta information to the cache.
   * Cache updated by the "update" method will rewrite the
   * messages added and by it's database entries if they are
   * exists or with nothing if not.
   *
   * @param {ISwarmMessageStoreMessageWithMeta<P>} swarmMessageWithMeta
   * @returns {Promise<boolean>} - whether the messages was set in the cache or already exists in the cache
   * @memberof ISwarmMessagesDatabaseCache
   */
  addMessage(swarmMessageWithMeta: ISwarmMessageStoreMessageWithMeta<P, MD>): Promise<boolean>;
  /**
   * Delete the messages from the current messages cache.
   * Cache updated by the "update" method will rewrite the
   * messages added and by it's database entries if they are
   * exists or with nothing if not.
   *
   * @param {DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.FEED
   *       ? TSwarmStoreDatabaseEntityAddress<P>
   *       : TSwarmStoreDatabaseEntityKey<P>} messageUniqAddressOrKey
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesDatabaseCache
   */
  deleteMessage(
    // for a non key-value stores
    messageUniqAddressOrKey: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityAddress<P> | undefined
      : TSwarmStoreDatabaseEntityAddress<P>,
    key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined
  ): Promise<void>;
}

export interface ISwarmMessagesDatabaseCacheConstructor<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T>,
  MD extends ISwarmMessageInstanceDecrypted
> {
  new (options: ISwarmMessagesDatabaseCacheOptions<P, T, DbType, MD>): ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD>;
}

export interface ISwarmMessagesDatabaseMesssageMeta<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>> {
  messageUniqAddress: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    ? TSwarmStoreDatabaseEntityAddress<P> | undefined
    : TSwarmStoreDatabaseEntityAddress<P>;
  key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined;
}
