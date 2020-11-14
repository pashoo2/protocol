import { ISwarmStore, ISwarmStoreEvents, ISwarmStoreOptions } from '../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageInstance,
  ISwarmMessageInstanceDecrypted,
  ISwarmMessageConstructor,
} from '../swarm-message/swarm-message-constructor.types';
import { EventEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmMessageStoreEventNames } from './swarm-message-store.const';
import { TSwarmMessageUserIdentifierSerialized } from '../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { TSwarmStoreDatabaseIteratorMethodArgument, TSwarmStoreDatabaseType } from '../swarm-store-class/swarm-store-class.types';
import {
  TSwarmMessageSerialized,
  TSwarmMessageConstructorBodyMessage,
  ISwarmMessageInstanceEncrypted,
} from '../swarm-message/swarm-message-constructor.types';
import { TCentralAuthorityUserIdentity } from '../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { IStorageCommon } from 'types/storage.types';
import { TSwarmStoreDatabaseEntryOperation, TSwarmStoreValueTypes } from '../swarm-store-class/swarm-store-class.types';
import { StorageProvider } from '../storage-providers/storage-providers.types';
import { ISwarmStoreConnectorOrbitDbDatabaseValue } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import {
  TSwarmStoreDatabaseOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
} from '../swarm-store-class/swarm-store-class.types';
import { PromiseResolveType } from '../../types/helper.types';
import { ISwarmStoreConnector, ISwarmStoreOptionsWithConnectorFabric } from '../swarm-store-class/swarm-store-class.types';
import { TSwarmStoreConnectorConnectionOptions, ISwarmStoreConnectorBasic } from '../swarm-store-class/swarm-store-class.types';
import { TSwarmStoreDatabaseEntityAddress, TSwarmStoreDatabaseEntityKey } from '../swarm-store-class/swarm-store-class.types';
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
  ISwarmStoreWithEntriesCount,
} from '../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';

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
  MSI extends TSwarmMessageSerialized | TSwarmMessageInstance
> =
  | TSwarmMessageStoreAccessControlGrantAccessCallback<P, MSI>
  | TSwarmMessageStoreAccessControlGrantAccessCallback<P, MSI>
  | undefined;

export interface ISwarmMessageStoreEvents<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>
> extends ISwarmStoreEvents<P, ItemType, DBO> {
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

export type TSwarmMessageStoreAccessControlGrantAccessCallback<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized | TSwarmMessageInstance
> = (
  // swarm message
  message: T,
  // identifier of the user sender of the message
  userId: TCentralAuthorityUserIdentity,
  // a name of the database from where the message is comming from
  // TODO - can it be gotten from the database entry??
  dbName: string,
  // key for the value in the database
  key?: TSwarmStoreDatabaseEntityKey<P>,
  // operation on the database
  op?: TSwarmStoreDatabaseEntryOperation<P>
) => Promise<boolean>;

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
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI> | undefined
> {
  // async callback which is called each time before a new message will be wrote to the database
  grantAccess: GAC;
  // a list of the user identifiers for whom an unconditional write access will be given
  allowAccessFor?: TSwarmMessageUserIdentifierSerialized[];
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
export interface ISwarmMessageDatabaseConstructors<SMC extends ISwarmMessageConstructor> {
  [dbName: string]: SMC;
  default: SMC;
}

export interface ISwarmMessageStoreOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, ConnectorBasic>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MSI, GAC> | undefined
> extends ISwarmStoreOptions<P, T, DbType, ConnectorBasic, PO> {
  accessControl: ACO;
  messageConstructors: ISwarmMessageDatabaseConstructors<PromiseResolveType<ReturnType<NonNullable<MCF>>>>;
  databasesListStorage: IStorageCommon;
  swarmMessageConstructorFabric: MCF;
  /**
   * Used for caching messages constructed
   * for keys and addresses.
   *
   * @type {IStorageCommon}
   * @memberof ISwarmMessageStoreOptions
   */
  cache?: StorageProvider<Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>;
}

export interface ISwarmMessageStoreOptionsWithConnectorFabric<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, ConnectorBasic, PO>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, ConnectorBasic, PO, DBO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MSI, GAC> | undefined
> extends ISwarmMessageStoreOptions<P, T, DbType, ConnectorBasic, PO, MSI, GAC, MCF, ACO>,
    ISwarmStoreOptionsWithConnectorFabric<P, T, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain, CFO> {}

export type TSwarmMessageStoreConnectReturnType<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, ConnectorBasic, PO, DBO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | ItemType,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, MSI, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    ItemType,
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
> = ReturnType<ISwarmStore<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, CFO, O>['connect']>;

export type TSwarmMessageStoreEntryRaw<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>
> = P extends ESwarmStoreConnector ? ISwarmStoreConnectorOrbitDbDatabaseValue<T> : never;

export type ISwarmMessageStoreDeleteMessageArg<P extends ESwarmStoreConnector> = P extends ESwarmStoreConnector.OrbitDB
  ? TSwarmStoreDatabaseEntityAddress<P> // swarm message address
  : never; // instance of the message to remove

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
  ItemType extends TSwarmMessageSerialized,
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
  addMessage(dbName: string, message: MI, key?: TSwarmStoreDatabaseEntityKey<P>): Promise<TSwarmStoreDatabaseEntityAddress<P>>;

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
    message: ItemType,
    key?: TSwarmStoreDatabaseEntityKey<P>
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
    key?: TSwarmStoreDatabaseEntityKey<P>
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
  deleteMessage(dbName: string, messageAddressOrKey: ISwarmMessageStoreDeleteMessageArg<P>): Promise<void>;
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
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, ConnectorBasic, PO, DBO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | ItemType,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, MSI, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    ItemType,
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
> extends ISwarmStore<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, CFO, O>,
    EventEmitter<ISwarmMessageStoreEvents<P, ItemType, DBO>>,
    ISwarmMessageStoreMessagingMethods<P, ItemType, DbType, Exclude<MSI, ItemType>> {
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
  ): TSwarmMessageStoreConnectReturnType<
    P,
    ItemType,
    DbType,
    ConnectorBasic,
    PO,
    DBO,
    CO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO,
    O
  >;
}

export interface ISwarmMessageStoreOptionsWithEntriesCount<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, ConnectorBasic, PO, DBO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | ItemType,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, MSI, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    ItemType,
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
> extends ISwarmMessageStore<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>,
    ISwarmStoreWithEntriesCount<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, CFO, O> {}
