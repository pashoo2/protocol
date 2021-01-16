import {
  ISwarmMessageStore,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreMessageWithMeta,
  ISwarmMessageStoreMessagingMethods,
  ISwarmMessageStoreMessagingRequestWithMetaResult,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from '../swarm-message-store/types/swarm-message-store.types';
import { ESwarmStoreConnector, ESwarmStoreEventNames } from '../swarm-store-class/swarm-store-class.const';
import {
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../swarm-store-class/swarm-store-class.types';
import { OmitFirstArg } from '../../types/helper.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import {
  ISwarmMessageInstanceDecrypted,
  ISwarmMessageInstanceEncrypted,
  TSwarmMessageInstance,
  TSwarmMessageSerialized,
} from '../swarm-message/swarm-message-constructor.types';
import { ESwarmMessageStoreEventNames } from '../swarm-message-store/swarm-message-store.const';
import { TTypedEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import { ESwarmMessagesDatabaseCacheEventsNames } from './swarm-messages-database.const';
import { TSwarmMessageUserIdentifierSerialized } from '../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmMessagesDatabaseMessagesCollector } from './swarm-messages-database.messages-collector.types';
import {
  TSwarmStoreDatabaseEntityUniqueIndex,
  TSwarmStoreDatabaseIteratorMethodArgument,
} from '../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageConstructorBodyMessage } from '../swarm-message/swarm-message-constructor.types';
import { ISwarmMessageStoreDeleteMessageArg } from '../swarm-message-store/types/swarm-message-store.types';

export type TSwarmMessageDatabaseMessagesCached<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted
> = Map<TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>, ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>>;

export interface ISwarmMessagesDatabaseConnectCurrentUserOptions {
  userId: TSwarmMessageUserIdentifierSerialized;
}

export interface ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>,
  SMDCC extends ISwarmMessagesDatabaseCacheConstructor<
    P,
    T,
    DbType,
    DBO,
    MD,
    SMSM,
    DCO,
    DCCRT
  > = ISwarmMessagesDatabaseCacheConstructor<P, T, DbType, DBO, MD, SMSM, DCO, DCCRT>
> {
  cacheConstructor: SMDCC;
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
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    MD | T,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>
> {
  user: ISwarmMessagesDatabaseConnectCurrentUserOptions;
  swarmMessageStore: SMS;
  dbOptions: DBO;
  cacheOptions: ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions<P, T, DbType, DBO, MD, SMSM, DCO, DCCRT>;
  swarmMessagesCollector: SMSM;
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
  [ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING_STARTED]: () => unknown;
  [ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING_OVER]: (
    allMessagesInCahce: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined
  ) => unknown;
  /**
   * Swarm messages were requested from the database and the cache was updated
   * with the messages.
   *
   * @memberof ISwarmMessageDatabaseEvents
   */
  [ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED]: (
    /*
     we can't emit only updated messages because if a message has been removed from the store
     we don't know with guarantee which one it has.
    */
    messages: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined
  ) => unknown;
}

export interface ISwarmMessageDatabaseEvents<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
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
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  MI extends TSwarmMessageInstance,
  SMS extends ISwarmMessageStoreMessagingMethods<P, T, DbType, MI>
> {
  addMessage(message: MI, key?: TSwarmStoreDatabaseEntityKey<P>): Promise<TSwarmStoreDatabaseEntityAddress<P>>;
  addMessage(message: T, key?: TSwarmStoreDatabaseEntityKey<P>): Promise<TSwarmStoreDatabaseEntityAddress<P>>;
  addMessage(
    message: TSwarmMessageConstructorBodyMessage,
    key?: TSwarmStoreDatabaseEntityKey<P>
  ): Promise<TSwarmStoreDatabaseEntityAddress<P>>;
  deleteMessage(messageAddressOrKey: ISwarmMessageStoreDeleteMessageArg<P, DbType>): Promise<void>;
  collect: OmitFirstArg<SMS['collect']>;
  collectWithMeta(
    options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>
  ): Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, Exclude<MI, ISwarmMessageInstanceEncrypted>> | undefined>>;
}

export interface ISwarmMessagesDatabaseProperties<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
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
  emitter: TTypedEmitter<ISwarmMessageDatabaseEvents<P, T, DbType, DBO, MD>>;

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

export interface ISwarmMessagesDatabaseBaseImplementation<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T
> extends ISwarmMessageStoreMessagingMethods<P, T, DbType, Exclude<MSI, T>>,
    ISwarmMessagesDatabaseProperties<P, T, DbType, DBO, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>> {}

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
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    MD | T,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>,
  OPT extends ISwarmMessagesDatabaseConnectOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    GAC,
    MCF,
    ACO,
    O,
    SMS,
    MD,
    SMSM,
    DCO,
    DCCRT
  >
> extends ISwarmMessagesDatabaseBaseImplementation<P, T, DbType, DBO, MD | T> {
  /**
   * Method used for connecting to the database.
   *
   * @param {ISwarmMessagesDatabaseConnectOptions<P>} options
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesDatabase
   */
  open(options: OPT): Promise<void>;

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
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    MD | T,
    GAC,
    MCF,
    ACO
  >,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>
> {
  _dbName: string;
  _isReady: true;
  _swarmMessageStore: ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>;
  _currentUserId: TSwarmMessageUserIdentifierSerialized;
  _swarmMessagesCache: ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>;
}

export interface ISwarmMessagesDatabaseCacheOptions<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>
> {
  dbType: DbType;
  dbName: string;
  /**
   * Instance which will be queried be for fetching messages stored.
   *
   * @type {SMSM}
   * @memberof ISwarmMessagesDatabaseCacheOptions
   */
  dbInstance: SMSM;
}

export interface ISwarmMessagesDatabaseCache<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MD extends ISwarmMessageInstanceDecrypted,
  // TODO - this type should be provided in the constructor's options
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>
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

/**
 * Constructor for swarm messages cache
 *
 * @export
 * @interface ISwarmMessagesDatabaseCacheConstructor
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @template MD
 * @template SMSM
 */
export interface ISwarmMessagesDatabaseCacheConstructor<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM> = ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM> = ISwarmMessagesDatabaseCache<
    P,
    T,
    DbType,
    DBO,
    MD,
    SMSM
  >
> {
  new (options: DCO): DCCRT;
}

/**
 * Ameta information of a message
 *
 * @export
 * @interface ISwarmMessagesDatabaseMesssageMeta
 * @template P
 * @template DbType
 */
export interface ISwarmMessagesDatabaseMesssageMeta<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>> {
  /**
   * Message's uniq address
   *
   * @type {(DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
   *     ? // TODO - why undefined is necessary
   *       TSwarmStoreDatabaseEntityAddress<P> | undefined
   *     : TSwarmStoreDatabaseEntityAddress<P>)}
   * @memberof ISwarmMessagesDatabaseMesssageMeta
   */
  messageUniqAddress: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    ? // TODO - why undefined is necessary
      TSwarmStoreDatabaseEntityAddress<P> | undefined
    : TSwarmStoreDatabaseEntityAddress<P>;
  /**
   * A database's key under which the message is stored.
   *
   * @type {DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined}
   * @memberof ISwarmMessagesDatabaseMesssageMeta
   */
  key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined;
}

export interface ISwarmMessagesDatabaseConnector<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    MD | T,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>,
  OPT extends ISwarmMessagesDatabaseConnectOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    GAC,
    MCF,
    ACO,
    O,
    SMS,
    MD,
    SMSM,
    DCO,
    DCCRT
  >
> extends ISwarmMessageDatabaseMessagingMethods<P, T, DbType, MD, SMS>,
    ISwarmMessagesDatabaseProperties<P, T, DbType, DBO, MD> {
  /**
   * Options should be defined to connect with the databse
   *
   * @param {ISwarmMessagesDatabaseConnectOptions<
   *       P,
   *       T,
   *       DbType,
   *       DBO,
   *       ConnectorBasic,
   *       PO,
   *       CO,
   *       ConnectorMain,
   *       CFO,
   *       MSI,
   *       GAC,
   *       MCF,
   *       ACO,
   *       O,
   *       SMS,
   *       MD,
   *       SMSM
   *     >} options
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesDatabaseConnector
   */
  connect(options: OPT): Promise<void>;
  close(): Promise<void>;
}
