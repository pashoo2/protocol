import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from 'classes/swarm-message/swarm-message-constructor.types';
import {
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from 'classes/swarm-store-class/swarm-store-class.types';
import { SWARM_MESSAGES_CHANNEL_ENCRYPION } from '../const/swarm-messages-channels-main.const';
import { TSwarmMessageUserIdentifierSerialized } from 'classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import {
  ISwarmMessageStore,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from 'classes/swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from 'classes/swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import {
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseConnectOptions,
} from 'classes/swarm-messages-database/swarm-messages-database.types';
import { ISwarmMessagesDatabaseMessagesCollector } from 'classes/swarm-messages-database/swarm-messages-database.messages-collector.types';
import {
  ISwarmMessageStoreDeleteMessageArg,
  ISwarmMessageStoreMessagingRequestWithMetaResult,
} from '../../swarm-message-store/types/swarm-message-store.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmMessagesChannelsDescriptionsList } from './swarm-messages-channels-list-instance.types';
import {
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseIteratorMethodArgument,
} from '../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions } from '../../swarm-messages-database/swarm-messages-database-fabrics/types/swarm-messages-database-instance-fabric-by-database-options.types';
import { ISwarmMessagesChannelNotificationEmitter } from './swarm-messages-channel-events.types';
import { TCentralAuthorityUserIdentity } from '../../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import { IQueuedEncryptionClassBase } from '../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { ISwarmMessageDatabaseEvents } from '../../swarm-messages-database/swarm-messages-database.types';
import { EventEmitter } from '../../basic-classes/event-emitter-class-base/event-emitter-class-base';

export type TSwarmMessagesChannelId = string;

export type TSwarmMessageChannelDatabaseOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> = Pick<DBO, 'isPublic' | 'write' | 'grantAccess'>;

/**
 * Parameters of a channel used for messaging
 * without it's database options
 *
 * @export
 * @interface ISwarmMessageChannelDescriptionRaw
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 */
export interface ISwarmMessageChannelDescriptionWithoutDatabaseOptionsRaw<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> {
  /**
   * unique indentifier of the channel
   *
   * @type {string}
   * @memberof ISwarmMessageChannelDescriptionRaw
   */
  readonly id: TSwarmMessagesChannelId;
  /**
   * Channel version
   *
   * @type {string}
   * @memberof ISwarmMessageChannelDescriptionRaw
   */
  readonly version: string;
  /**
   * Channel name
   *
   * @type {string}
   * @memberof ISwarmMessageChannelDescriptionRaw
   */
  readonly name: string;
  /**
   * Channel description
   *
   * @type {string}
   * @memberof ISwarmMessageChannelDescriptionRaw
   */
  readonly description: string;
  /**
   * Tags which represents the channel
   */
  readonly tags: string[];
  /**
   * Database type used for the channel
   *
   * @type {DbType}
   * @memberof ISwarmMessageChannelDescriptionRaw
   */
  readonly dbType: DbType;
  /**
   * Messages encryption used for the channel
   *
   * @type {SWARM_MESSAGES_CHANNEL_ENCRYPION}
   * @memberof ISwarmMessageChannelDescriptionRaw
   */
  readonly messageEncryption: SWARM_MESSAGES_CHANNEL_ENCRYPION;
  /**
   * Only this users can rewrite the channel description
   *
   * @type {Array<TSwarmMessageUserIdentifierSerialized>}
   * @memberof ISwarmMessageChannelDescriptionRaw
   */
  readonly admins: Array<TSwarmMessageUserIdentifierSerialized>;
}

/**
 * Description of a channel used for messaging
 *
 * @export
 * @interface ISwarmMessageChannelDescriptionRaw
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 */
export interface ISwarmMessageChannelDescriptionRaw<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> extends ISwarmMessageChannelDescriptionWithoutDatabaseOptionsRaw<P, DbType> {
  dbOptions: TSwarmMessageChannelDatabaseOptions<P, T, DbType, DBO>;
}

/**
 * Description of a channel used for messaging
 *
 * @export
 * @interface ISwarmMessageChannelDescriptionRaw
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 */
export interface ISwarmMessageChannelDescriptionRaw<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> {
  /**
   * unique indentifier of the channel
   *
   * @type {string}
   * @memberof ISwarmMessageChannelDescriptionRaw
   */
  id: TSwarmMessagesChannelId;
  /**
   * Channel version
   *
   * @type {string}
   * @memberof ISwarmMessageChannelDescriptionRaw
   */
  version: string;
  /**
   * Channel name
   *
   * @type {string}
   * @memberof ISwarmMessageChannelDescriptionRaw
   */
  name: string;
  /**
   * Channel description
   *
   * @type {string}
   * @memberof ISwarmMessageChannelDescriptionRaw
   */
  description: string;
  /**
   * Tags which represents the channel
   */
  tags: string[];
  /**
   * Database type used for the channel
   *
   * @type {DbType}
   * @memberof ISwarmMessageChannelDescriptionRaw
   */
  dbType: DbType;
  /**
   * Database options which will be used for the channel's database
   *
   * @type {DBO}
   * @memberof ISwarmMessageChannelDescriptionRaw
   */
  dbOptions: TSwarmMessageChannelDatabaseOptions<P, T, DbType, DBO>;
  /**
   * Messages encryption used for the channel
   *
   * @type {SWARM_MESSAGES_CHANNEL_ENCRYPION}
   * @memberof ISwarmMessageChannelDescriptionRaw
   */
  messageEncryption: SWARM_MESSAGES_CHANNEL_ENCRYPION;
  /**
   * Only this users can rewrite the channel description
   *
   * @type {Array<TSwarmMessageUserIdentifierSerialized>}
   * @memberof ISwarmMessageChannelDescriptionRaw
   */
  admins: Array<TSwarmMessageUserIdentifierSerialized>;
}

export interface ISwarmMessagesChannelDescriptionWithMetadata<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> extends Readonly<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>> {
  readonly channelDescription: Error | ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>;
}

/**
 * Swarm messages channel, which is used for
 * messaging between peers.
 *
 * @export
 * @interface ISwarmMessagesChannel
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @template ConnectorBasic
 * @template PO
 * @template CO
 * @template ConnectorMain
 * @template CFO
 * @template GAC
 * @template MCF
 * @template ACO
 * @template O
 * @template SMS
 * @template MD
 * @template SMSM
 * @template DCO
 * @template DCCRT
 * @template OPT
 */
export interface ISwarmMessagesChannel<
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
  MD extends ISwarmMessageInstanceDecrypted
> extends ISwarmMessageChannelDescriptionWithoutDatabaseOptionsRaw<P, DbType> {
  /**
   * Channel's desciption was removed from a channels list
   * related.
   * Channel becomes inactive - couldn't receive or send
   * any messages through it.
   *
   * @type {boolean}
   * @memberof ISwarmMessagesChannel
   */
  readonly markedAsRemoved: boolean;
  /**
   * Events nofifies about the channel's state changes.
   *
   * @type {ISwarmMessagesChannelNotificationEmitter<P, DbType>}
   * @memberof ISwarmMessagesChannel
   */
  readonly emitterChannelState: ISwarmMessagesChannelNotificationEmitter<P, DbType>;

  /**
   * Events which emitted by the channel's swarm messages database.
   *
   * @type {EventEmitter<ISwarmMessageDatabaseEvents<P, T, DbType, DBO, MD>>}
   * @memberof ISwarmMessagesChannel
   */
  readonly emitterChannelMessagesDatabase: EventEmitter<ISwarmMessageDatabaseEvents<P, T, DbType, DBO, MD>>;

  /**
   * Error describes a reason why the channel is inactive.
   * If channel is active then it's empty.
   *
   * @type {(Error | undefined)}
   * @memberof ISwarmMessagesChannel
   */
  readonly channelInactiveReasonError: Error | undefined;

  /**
   * Close the instance and a swarm messages database related.
   *
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannel
   */
  close(): Promise<void>;

  /**
   * Add swarm message to the channel.
   *
   * @param {Parameters<SMS['addMessage']>[1]} message
   * @param {DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined} key
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannel
   */
  addMessage(
    message: Omit<MD['bdy'], 'iss'>,
    key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined
  ): Promise<void>;

  /**
   * Delete a swarm message from the databsae.
   *
   * @param {ISwarmMessageStoreDeleteMessageArg<P, DbType>} messageAddressOrKey
   * @returns {ReturnType<SMS['deleteMessage']>}
   * @memberof ISwarmMessagesChannel
   */
  deleteMessage(messageAddressOrKey: ISwarmMessageStoreDeleteMessageArg<P, DbType>): Promise<void>;

  /**
   * Collect messages directly from the storage (not from a cache).
   *
   * @param {TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>} options
   * @returns {Array<Error | MD>}
   * @memberof ISwarmMessagesChannel
   */
  collect(options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>): Promise<Array<Error | MD>>;

  /**
   * Collect messages with metadata from the storage (not from a cache).
   *
   * @param {TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>} options
   * @returns {ReturnType<SMS['collectWithMeta']>}
   * @memberof ISwarmMessagesChannel
   */
  collectWithMeta(
    options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>
  ): Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined>>;

  /**
   * Update channel's description.
   *
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannel
   */
  updateChannelDescription(channelRawDescription: Readonly<ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>>): Promise<void>;

  /**
   * Delete channel's messages locally and stop
   * listening for any channel's updates.
   *
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannel
   */
  deleteLocally(): Promise<void>;

  /**
   * Delete the channel's description from channels list remotely,
   * all messages from the channel locally and remotely also.
   *
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannel
   */
  dropDescriptionAndDeleteRemotely(): Promise<void>;
}

/**
 * Generates channel's swarm messages database name by the channel's description.
 *
 * @export
 * @interface ISwarmMessagesChannelDatabaseNameGeneratorByChannelDescription
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 */
export interface ISwarmMessagesChannelDatabaseNameGeneratorByChannelDescription<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> {
  (swarmMessagesChannelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>): string;
}

/**
 * Returns issuer string for a swarm messages which are sent through the channel
 * by the channel's description.
 *
 * @export
 * @interface ISwarmMessagesChannelMessageIssuerByChannelDescription
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 */
export interface ISwarmMessagesChannelMessageIssuerByChannelDescription<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> {
  (swarmMessagesChannelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>): string;
}

/**
 * Returns issuer string for a swarm messages which are sent through the channel
 * by the channel's description.
 *
 * @export
 * @interface ISwarmMessagesChannelDatabaseNameGeneratorByChannelDescription
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 */
export interface ISwarmMessagesChannelConstructorUtils<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined,
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
    MD | T,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>,
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
    CO,
    PO,
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
> {
  /**
   * Constructor of a database instance by a database options.
   *
   * @type {Readonly<
   *     ISwarmMessagesDatabaseConnector<
   *       P,
   *       T,
   *       DbType,
   *       DBO,
   *       ConnectorBasic,
   CO,
   PO,
   *       ConnectorMain,
   *       CFO,
   *       GAC,
   *       MCF,
   *       ACO,
   *       O,
   *       SMS,
   *       MD,
   *       SMSM,
   *       DCO,
   *       DCCRT,
   *       OPT
   *     >
   *   >}
   * @memberof ISwarmMessagesChannel
   */
  swarmMessagesDatabaseConnectorInstanceByDBOFabric: ISwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
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
    DCCRT,
    OPT
  >;
  /**
   * Resolves issuer for swarm messages
   *
   * @type {ISwarmMessagesChannelMessageIssuerByChannelDescription<P, T, DbType, DBO>}
   * @memberof ISwarmMessagesChannelConstructorUtils
   */
  getSwarmMessageIssuerByChannelDescription: ISwarmMessagesChannelMessageIssuerByChannelDescription<P, T, DbType, DBO>;
  /**
   * Resolves a channel's database's name
   *
   * @type {ISwarmMessagesChannelDatabaseNameGeneratorByChannelDescription<P, T, DbType, DBO>}
   * @memberof ISwarmMessagesChannelConstructorUtils
   */
  getDatabaseNameByChannelDescription: ISwarmMessagesChannelDatabaseNameGeneratorByChannelDescription<P, T, DbType, DBO>;
}

/**
 * Options for swarm messages channel instance constructor.
 *
 * @export
 * @interface ISwarmMessagesChannelConstructorOptions
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @template ConnectorBasic
 * @template PO
 * @template CO
 * @template ConnectorMain
 * @template CFO
 * @template GAC
 * @template MCF
 * @template ACO
 * @template O
 * @template SMS
 * @template MD
 * @template SMSM
 * @template DCO
 * @template DCCRT
 * @template OPT
 */
export interface ISwarmMessagesChannelConstructorOptions<
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
  >,
  CHD extends ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> = ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>
> {
  /**
   * Identity of the current user.
   *
   * @type {TCentralAuthorityUserIdentity}
   * @memberof ISwarmMessagesChannelConstructorOptions
   */
  currentUserId: TCentralAuthorityUserIdentity;

  /**
   * A description of the channel.
   *
   * @type {ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>}
   * @memberof ISwarmMessagesChannelConstructorArguments
   */
  swarmMessagesChannelDescription: CHD;

  /**
   * Swarm messages channels list where to add the channel.
   *
   * @type {ISwarmMessagesChannelsDescriptionsList<P, T, MD>}
   * @memberof ISwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions
   */
  swarmMessagesChannelsListInstance: ISwarmMessagesChannelsDescriptionsList<P, T, MD>;

  /**
   * Encryption queue if the channel's messages must be encrypted by a password.
   * As a salt for the password that is used for messages encryption within the channel
   * the channel's id must be used.
   *
   * @type {IQueuedEncryptionClassBase}
   *
   * @memberof ISwarmMessagesChannelConstructorOptions
   */
  passwordEncryptedChannelEncryptionQueue: CHD['messageEncryption'] extends SWARM_MESSAGES_CHANNEL_ENCRYPION.PASSWORD
    ? IQueuedEncryptionClassBase
    : never;

  /**
   * Various utilities which will be used by the swarm messages channel during it's work
   * or initialization.
   *
   * @type {ISwarmMessagesChannelConstructorUtils<
   *     P,
   *     T,
   *     DbType,
   *     DBO,
   *     ConnectorBasic,
   *     PO,
   *     CO,
   *     ConnectorMain,
   *     CFO,
   *     GAC,
   *     MCF,
   *     ACO,
   *     O,
   *     SMS,
   *     MD,
   *     SMSM,
   *     DCO,
   *     DCCRT,
   *     OPT
   *   >}
   * @memberof ISwarmMessagesChannelConstructorOptions
   */
  utils: ISwarmMessagesChannelConstructorUtils<
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
    DCCRT,
    OPT
  >;
}

/**
 * Constructor of a swarm messages channel.
 *
 * @export
 * @interface ISwarmMessagesChannelConstructor
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @template ConnectorBasic
 * @template PO
 * @template CO
 * @template ConnectorMain
 * @template CFO
 * @template GAC
 * @template MCF
 * @template ACO
 * @template O
 * @template SMS
 * @template MD
 * @template SMSM
 * @template DCO
 * @template DCCRT
 * @template OPT
 */
export interface ISwarmMessagesChannelConstructor<
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
  >,
  ADDT extends Array<any> = never
> {
  new (
    options: ISwarmMessagesChannelConstructorOptions<
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
      DCCRT,
      OPT
    >,
    ...additionalParameter: ADDT
  ): ISwarmMessagesChannel<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD>;
}
