import {
  ISwarmStore,
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreEvents,
  ISwarmStoreOptions,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreOptionsWithConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseEntryOperation,
  TSwarmStoreDatabaseIteratorMethodArgument,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
  TSwarmStoreValueTypes,
} from '../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../swarm-store-class/swarm-store-class.const';
import {
  ISwarmMessageConstructor,
  ISwarmMessageDecrypted,
  ISwarmMessageInstanceDecrypted,
  ISwarmMessageInstanceEncrypted,
  TSwarmMessageConstructorBodyMessage,
  TSwarmMessageInstance,
  TSwarmMessageSerialized,
} from '../../swarm-message/swarm-message-constructor.types';
import { EventEmitter } from '../../basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import { ESwarmMessageStoreEventNames } from '../swarm-message-store.const';
import { TSwarmMessageUserIdentifierSerialized } from '../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { TCentralAuthorityUserIdentity } from '../../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { StorageProvider } from '../../storage-providers/storage-providers.types';
import { ISwarmStoreConnectorOrbitDbDatabaseValue } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { PromiseResolveType } from '../../../types/promise.types';
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
  ISwarmStoreWithEntriesCount,
} from '../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';
import {
  ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound,
  ISwarmStoreDBOGrandAccessCallbackBaseContext,
} from '../../swarm-store-class/swarm-store-connectors/swarm-store-connectors.types';

export interface ISwarmMessageStoreSwarmMessageMetadata<P extends ESwarmStoreConnector> {
  /**
   * Message uniq address in the swarm
   *
   * @type {TSwarmMessageStoreMessageId}
   * @memberof ISwarmMessageStoreSwarmMessageMetadata
   */
  messageAddress: TSwarmStoreDatabaseEntityAddress<P>;
  /**
   * Message key in Key-Value databse
   *
   * @type {string}
   * @memberof ISwarmMessageStoreSwarmMessageMetadata
   */
  key: TSwarmStoreDatabaseEntityKey<P> | undefined;
}

export type TSwarmMessagesStoreGrantAccessCallback<
  P extends ESwarmStoreConnector,
  TI extends TSwarmMessageSerialized | ISwarmMessageInstanceDecrypted,
  CTX extends Record<string, unknown> = Record<string, unknown>
> = ISwarmMessageStoreAccessControlGrantAccessCallback<P, TI, CTX> & {
  toString(): string;
};

export interface ISwarmMessageStoreEvents<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> extends ISwarmStoreEvents<P, T, DbType, DBO> {
  /**
   * new message stored in the local database
   * 1) the first argument - database name where the message was added
   * 2) the second argument - swarm message instance
   * 3) the third argument - the global unique address of the message in the swarm
   *
   * @type {[
   *     string,
   TSwarmMessageInstance,
   *     string
   *   ]}
   * @memberof ISwarmMessageStoreEvents
   */
  [ESwarmMessageStoreEventNames.NEW_MESSAGE]: [string, TSwarmMessageInstance, string];
  /**
   * failed to deserialize a new message stored
   *
   * @type {[
   *     string,
   *     string,
   *     Error,
   *     string
   *   ]}
   * @memberof ISwarmMessageStoreEvents
   */
  [ESwarmMessageStoreEventNames.NEW_MESSAGE_ERROR]: [string, string, Error, string];
}

export interface ISwarmMessageStoreAccessControlGrantAccessCallback<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized | TSwarmMessageInstance,
  CTX extends Record<string, unknown> = Record<string, unknown>
> {
  (
    this: CTX,
    // swarm message, or a swarm message's removed address for the DELETE operation or undefined
    message: T | string | undefined,
    // identifier of the user sender of the message
    userId: TCentralAuthorityUserIdentity,
    // a name of the database from where the message is comming from
    databaseName: string,
    // key for the value in the database
    key: TSwarmStoreDatabaseEntityKey<P> | undefined,
    // operation on the database
    op: TSwarmStoreDatabaseEntryOperation<P> | undefined,
    // Real or an abstract time when the message was added
    entryAddedTime: number
  ): Promise<boolean>;
  /**
   * Must be serializable because it can be stored in a persistant
   * storage in serialized format
   *
   * @returns {string}
   * @memberof ISwarmMessageStoreAccessControlGrantAccessCallback
   */
  toString(): string;
}

/**
 * grant the write access options to define access options
 * for the databases connected to
 *
 * @export
 * @interface ISwarmMessageStoreAccessControlOptions
 */
export interface ISwarmMessageStoreAccessControlOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  TI extends ISwarmMessageInstanceDecrypted | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, TI>
> {
  // async callback which is called each time before a new message will be wrote to the database
  grantAccess: GAC;
  // a list of the user identifiers for whom an unconditional write access will be given
  allowAccessFor?: TSwarmMessageUserIdentifierSerialized[];
}

/**
 * Messages contructors per databases
 *
 * @export
 * @interface ISwarmMessageDatabaseConstructorsForDatabases
 * @template SMC
 */
export interface ISwarmMessageDatabaseConstructorsForDatabases<SMC extends ISwarmMessageConstructor> {
  [dbName: string]: SMC;
}

/**
 * Swarm message constructors,specified for a databases
 * and the default constructor for a messages.
 * Each private database must have it's own
 * message constructor with it's own instance of the swarm message
 * swarm message encrypted cache.
 *
 * @export
 * @interface ISwarmMessageDatabaseConstructors
 */
export interface ISwarmMessageDatabaseConstructors<SMC extends ISwarmMessageConstructor>
  extends Partial<ISwarmMessageDatabaseConstructorsForDatabases<SMC>> {
  default: SMC;
}

export interface ISwarmMessageStoreOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC> | undefined
> extends ISwarmStoreOptions<P, T, DbType, DBO, ConnectorBasic, PO> {
  accessControl: ACO;
  messageConstructors: ISwarmMessageDatabaseConstructors<PromiseResolveType<ReturnType<NonNullable<MCF>>>>;
  swarmMessageConstructorFabric: MCF;
  /**
   * Used for caching messages constructed
   * for keys and addresses.
   *
   * @type {IStorageCommon}
   * @memberof ISwarmMessageStoreOptions
   */
  cache?: StorageProvider<ISwarmMessageDecrypted>;
}

export interface ISwarmMessageStoreOptionsWithConnectorFabric<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain> | undefined,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC> | undefined
> extends ISwarmMessageStoreOptions<P, T, DbType, DBO, ConnectorBasic, PO, MSI, GAC, MCF, ACO>,
    ISwarmStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO> {}

export type TSwarmMessageStoreConnectReturnType<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC> | undefined,
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
    MSI,
    GAC,
    MCF,
    ACO
  >
> = ReturnType<ISwarmStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, O>['connect']>;

export type TSwarmMessageStoreEntryRaw<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>
> = P extends ESwarmStoreConnector ? ISwarmStoreConnectorOrbitDbDatabaseValue<T> : never;

export type ISwarmMessageStoreDeleteMessageArg<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> = DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.FEED
  ? TSwarmStoreDatabaseEntityAddress<P>
  : TSwarmStoreDatabaseEntityKey<P>; // swarm message address

export type ISwarmMessageStoreDatabaseType<P extends ESwarmStoreConnector> = P extends ESwarmStoreConnector.OrbitDB
  ? ESwarmStoreConnectorOrbitDbDatabaseType
  : undefined;

export interface ISwarmMessageStoreMessageMeta<P extends ESwarmStoreConnector> {
  /**
   * A name of a database where the name is from
   *
   * @type {string}
   * @memberof ISwarmMessageStoreMessageMeta
   */
  dbName: string;
  /**
   * The global unique address (hash) of the message in the swarm
   *
   * @type {TSwarmStoreDatabaseEntityUniqueAddress<P>}
   */
  messageAddress: Error | undefined | TSwarmStoreDatabaseEntityAddress<P>;
  /**
   * for key-value store it will be the key
   *
   * @type {string}
   * @memberof ISwarmMessageStoreMessageMeta
   */
  key?: Error | TSwarmStoreDatabaseEntityKey<P> | undefined;
}

export interface ISwarmMessageStoreMessagingRequestWithMetaResult<
  P extends ESwarmStoreConnector,
  MD extends ISwarmMessageInstanceDecrypted
> extends ISwarmMessageStoreMessageMeta<P> {
  /**
   * Message parsed.
   * Error if failed to parse the message.
   *
   * @type {(Error | TSwarmMessageInstance)}
   */
  message: Error | MD;
}

export interface ISwarmMessageStoreMessageWithMeta<P extends ESwarmStoreConnector, MD extends ISwarmMessageInstanceDecrypted> {
  /**
   * A name of a database where the name is from
   *
   * @type {string}
   * @memberof ISwarmMessageStoreMessageMeta
   */
  dbName: string;
  /**
   * The global unique address (hash) of the message in the swarm
   *
   * @type {TSwarmStoreDatabaseEntityUniqueAddress<P>}
   */
  messageAddress: TSwarmStoreDatabaseEntityAddress<P>;
  /**
   * for key-value store it will be the key
   *
   * @type {string}
   * @memberof ISwarmMessageStoreMessageMeta
   */
  key: TSwarmStoreDatabaseEntityKey<P> | undefined;
  /**
   * Message parsed.
   * Error if failed to parse the message.
   *
   * @type {(Error | TSwarmMessageInstance)}
   */
  message: MD;
}

/**
 * Methods for messaging between swarm users.
 *
 * @export
 * @interface ISwarmMessageStoreMessagingMethods
 * @template P
 */
export interface ISwarmMessageStoreMessagingMethods<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  MI extends TSwarmMessageInstance
> {
  /**
   * add message to a database with the given name
   *
   * @param {string} dbName - name of the database
   * @param {ISwarmMessageStoreOptions<P>} message - message to add
   * @param {TSwarmStoreDatabaseEntityUniqueAddress<P>} key - key for the message under which the message will be stored
   * @returns {Promise<TSwarmMessageStoreMessageId>} - unique message's identifier in the database
   * @memberof ISwarmMessageStore
   * @throws
   */
  addMessage(
    dbName: string,
    message: MI,
    key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined
  ): Promise<TSwarmStoreDatabaseEntityAddress<P>>;

  /**
   * add message serialized to a database with the given name
   *
   * @param {string} dbName - name of the database
   * @param {ISwarmMessageStoreOptions<P>} message - message to add
   * @returns {Promise<TSwarmMessageStoreMessageId>} - unique message's identifier in the database
   * @memberof ISwarmMessageStore
   * @throws
   */
  addMessage(
    dbName: string,
    message: T,
    key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined
  ): Promise<TSwarmStoreDatabaseEntityAddress<P>>;

  /**
   * construct and add message to a database with the given name.
   *
   * @param {string} dbName - name of the database
   * @param {ISwarmMessageStoreOptions<P>} message - message to add
   * @returns {Promise<TSwarmMessageStoreMessageId>} - unique message's identifier in the database
   * @memberof ISwarmMessageStore
   * @throws
   */
  addMessage(
    dbName: string,
    message: TSwarmMessageConstructorBodyMessage,
    key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined
  ): Promise<TSwarmStoreDatabaseEntityAddress<P>>;

  /**
   * Message removed from the database
   * or marked as removed, It will not
   * be accessed with iterator.
   *
   * @param dbName
   * @param messageAddressOrKey - a message's key for a key value store.
   * A message's address in the swarm for a non key value store.
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStore
   * @throws
   */
  deleteMessage(dbName: string, messageAddressOrKey: ISwarmMessageStoreDeleteMessageArg<P, DbType>): Promise<void>;
  /**
   * read all messages existing (not removed) in the database
   * with the name provided.
   *
   * @param dbName
   * @param messageAddress
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStore
   * @throws
   */
  collect(
    dbName: string,
    options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>
  ): Promise<(TSwarmMessageInstance | Error)[]>;

  /**
   * Collect messages with some metadata info.
   *
   * @param {string} dbName
   * @param {TSwarmStoreDatabaseIteratorMethodArgument<P>} options
   * @returns {Promise<(ISwarmMessageStoreMessagingRequestWithMetaResult<P> | undefined)[]>}
   * @memberof ISwarmMessageStoreMessagingMethods
   */
  collectWithMeta(
    dbName: string,
    options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>
  ): Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, Exclude<MI, ISwarmMessageInstanceEncrypted>> | undefined>>;
}

/**
 * Allows to write messages to the swarm storage
 * and creating a new swarm databases.
 *
 * @export
 * @interface ISwarmMessageStore
 * @extends {Omit<ISwarmStore<P>, 'connect'>}
 * @extends {EventEmitter<ISwarmMessageStoreEvents>}
 * @template P
 */
export interface ISwarmMessageStore<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO
  >
> extends ISwarmStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, O>,
    EventEmitter<ISwarmMessageStoreEvents<P, T, DbType, DBO>>,
    ISwarmMessageStoreMessagingMethods<P, T, DbType, Exclude<MSI, T>> {
  /**
   * connect to the swarm storage
   *
   * @param {ISwarmMessageStoreOptions<P>} options
   * @returns {TSwarmMessageStoreConnectReturnType<P>}
   * @memberof ISwarmMessageStore
   * @throws
   */
  connect(
    options: O
  ): TSwarmMessageStoreConnectReturnType<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>;
}

export interface ISwarmMessageStoreConstructor<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO
  >
> {
  new (): ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>;
}

export interface ISwarmMessageStoreWithEntriesCount<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, T, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC> | undefined,
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
    MSI,
    GAC,
    MCF,
    ACO
  >
> extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>,
    ISwarmStoreWithEntriesCount<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, O> {}

/**
 * Grand access callback function which has already been bound to a context.
 *
 * @export
 * @interface ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound
 * @extends {TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, MSI>}
 * @template P
 * @template T
 * @template I
 * @template CTX context in which the function will be executed
 */
export interface ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext
> extends ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P, T, CTX> {
  (
    this: CTX,
    // value
    payload: MD | T
  ): Promise<boolean>;
}
