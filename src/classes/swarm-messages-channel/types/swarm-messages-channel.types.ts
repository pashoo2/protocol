import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from 'classes/swarm-message/swarm-message-constructor.types';
import {
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorAccessConrotllerGrantAccessCallback,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseOptionsSerialized,
  TSwarmStoreDatabaseType,
} from 'classes/swarm-store-class/swarm-store-class.types';
import { SWARM_MESSAGES_CHANNEL_ENCRYPION } from '../swarm-messages-channel.const';
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
  ISwarmMessagesDatabaseConnector,
} from 'classes/swarm-messages-database/swarm-messages-database.types';
import { ISwarmMessagesDatabaseMessagesCollector } from 'classes/swarm-messages-database/swarm-messages-database.messages-collector.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISerializer } from 'types/serialization.types';
import {
  IGetDatabaseKeyForChannelDescription,
  IBodyCreatorOfSwarmMessageWithChannelDescription,
} from './swarm-messages-channel-utils.types';
import {
  IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription,
  IGetSwarmMessageWithChannelDescriptionTypeByChannelListDescription,
} from './swarm-messages-channel-utils.types';
import { IValidatorOfSwarmMessageWithChannelDescription } from './swarm-messages-channel-validation.types';
import { ISwarmMessagesChannelDescriptionFormatValidator } from './swarm-messages-channel-validation.types';

export type TSwarmMessagesChannelId = string;

// TODO - create implementations

export type TSwarmMessageChannelDatabaseOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> = Pick<DBO, 'isPublic' | 'write' | 'grantAccess'>;

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

/**
 * Implementation of the swarm messages channel, which is used for
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
> {
  /**
   * Channel raw description
   *
   * @type {Readonly<ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>>}
   * @memberof ISwarmMessagesChannel
   */
  readonly channelRawDescription: Readonly<ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>>;
  /**
   * Swarm messages database encrypted related to the channel.
   * It should be used for messaging
   *
   * @type {Readonly<
   *     ISwarmMessagesDatabaseConnector<
   *       P,
   *       T,
   *       DbType,
   *       DBO,
   *       ConnectorBasic,
   *       PO,
   *       CO,
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
  readonly channelSwarmMessagesDatabase: Readonly<
    ISwarmMessagesDatabaseConnector<
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
    >
  >;
  /**
   * Set a password which will be used for messages encryption
   * within the channel
   *
   * @param {string} password
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannel
   */
  setPasswordForMessagesEncryption(password: string): Promise<void>;
  /**
   * Drop the channel and it's database
   */
  drop(): Promise<void>;
}

/**
 * Database options for swarm messages channels list with required grant access callback
 */
export type TSwrmMessagesChannelsListDBOWithGrantAccess<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized
> = TSwarmStoreDatabaseOptions<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE> & {
  /**
   * Grant access callback supports for validation of a swarm messages decrypted
   *
   * @type {TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, ISwarmMessageInstanceDecrypted>}
   */
  grantAccess: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, ISwarmMessageInstanceDecrypted>;
};

/**
 * Description of a known channels descriptions collection.
 *
 * @export
 * @interface ISwarmMessagesChannelsDescriptionsListDescription
 */
export interface ISwarmMessagesChannelsDescriptionsListDescription<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>
> {
  /**
   * version of the description
   *
   * @type {string}
   * @memberof ISwarmMessagesChannelsDescriptionsListDescription
   */
  version: string;
  /**
   * Identifier
   *
   * @type {string}
   * @memberof ISwarmMessagesChannelsDescriptionsListDescription
   */
  id: string;
  /**
   * Name of the channels list
   */
  name: string;
  /**
   * Connector type used for the list
   *
   * @type {P}
   * @memberof ISwarmMessagesChannelsDescriptionsListDescription
   */
  connectorType: P;
  /**
   * Options for a swarm database which is used for storing list of channels descriptions
   *
   * @type {DBO}
   * @memberof ISwarmMessagesChannelsDescriptionsListDescription
   */
  dbOptions: DBO;
}

/**
 * Implementation of the channels descriptions list.
 *
 * @export
 * @interface ISwarmMessagesChannelsDescriptionsList
 * @template P
 * @template T
 * @template DBO
 */
export interface ISwarmMessagesChannelsDescriptionsList<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>
> {
  /**
   * Description of the swarm messages channel list
   *
   * @type {Readonly<ISwarmMessagesChannelsDescriptionsListDescription<P, T, DBO>>}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  readonly description: Readonly<ISwarmMessagesChannelsDescriptionsListDescription<P, T, DBO>>;
  /**
   * Add new channel in the list by it's description
   *
   * @param {ISwarmMessageChannelDescriptionRaw<P, T, any, any>} channelDescriptionRaw
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  addChannel(channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): Promise<void>;
  /**
   * Remove channel description from the list by it's identity
   *
   * @param {TSwarmMessagesChannelId} channelId
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  removeChannelById(channelId: TSwarmMessagesChannelId): Promise<void>;
  /**
   * Update channel's description by channel's identifier
   *
   * @param {TSwarmMessagesChannelId} channelId
   * @param {Omit<ISwarmMessageChannelDescriptionRaw<P, T, any, any>, 'id'>} channelDescriptionRaw
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  updateChannelDescriptionById(
    channelId: TSwarmMessagesChannelId,
    channelDescriptionRaw: Omit<ISwarmMessageChannelDescriptionRaw<P, T, any, any>, 'id'>
  ): Promise<void>;
  /**
   * Get description of the channel by it's identifier
   *
   * @param {TSwarmMessagesChannelId} channelId
   * @returns {(Promise<ISwarmMessageChannelDescriptionRaw<P, T, any, any> | undefined>)}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  getChannelDescriptionById(
    channelId: TSwarmMessagesChannelId
  ): Promise<ISwarmMessageChannelDescriptionRaw<P, T, any, any> | undefined>;
  /**
   * Get all known channels descriptions and identifiers
   *
   * @returns {Record<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any>>}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  getAllChannelsDescriptions(): Promise<Record<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any>>>;
}

export interface ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T>
> {
  /**
   * Fabric which creates a connection to the swarm messages database by a database options
   *
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  (dbo: DBO): Promise<
    ISwarmMessagesDatabaseConnector<
      P,
      T,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
      DBO,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >
  >;
}

/**
 * Utilities used by the swarm messages channels list instance
 *
 * @export
 * @interface ISwarmMessagesChannelsDescriptionsListConstructorArguments
 * @template P
 * @template T
 * @template DBO
 */
export interface ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T>
> {
  /**
   * Validator of channel description format
   *
   * @type {ISwarmMessagesChannelDescriptionFormatValidator<P, T, any, any>}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  swarmMessagesChannelDescriptionFormatValidator: ISwarmMessagesChannelDescriptionFormatValidator<P, T, any, any>;
  /**
   * Fabric which creates a connection to the swarm messages database by a database options
   *
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  databaseConnectionFabric: ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, DBO>;
  /**
   * Validator of a swarm messages wich contains description of a swarm messages channel
   * or DELETE operation of a swarm messages channel.
   *
   * @type {IValidatorOfSwarmMessageWithChannelDescription<P, T, DBO>}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  channelDescriptionSwarmMessageValidator: IValidatorOfSwarmMessageWithChannelDescription<P, T, DBO>;
  /**
   * This utility will be used by the channelDescriptionSwarmMessageValidator validator
   * and till swarm message with a channel description construction
   * to get issuer value for the message's body.
   *
   * @type {IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription<
   *     P,
   *     T,
   *     DBO
   *   >}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils
   */
  getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription: IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription<
    P,
    T,
    DBO
  >;
  /**
   * This utility will be used by the channelDescriptionSwarmMessageValidator validator
   * and till swarm message with a channel description construction
   * to get issuer value for the message's body.
   *
   * @type {IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription<
   *     P,
   *     T,
   *     DBO
   *   >}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils
   */
  getTypeForSwarmMessageWithChannelDescriptionByChannelDescription: IGetSwarmMessageWithChannelDescriptionTypeByChannelListDescription<
    P,
    T,
    DBO
  >;
  /**
   * Interface for utility which have to return key in a swarm database
   * for a swarm messages channel description.
   *
   * @type {IGetDatabaseKeyForChannelDescription<P, T>}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils
   */
  getDatabaseKeyForChannelDescription: IGetDatabaseKeyForChannelDescription<P, T>;
  /**
   * This utility will be used for creation of a swarm message body with a channel
   * description.
   */
  createSwarmMessageBodyForChannelDescription: IBodyCreatorOfSwarmMessageWithChannelDescription<P, T, DBO>;
}

/**
 * Arguments for the swarm messages channels descriptions list constructor
 *
 * @export
 * @interface ISwarmMessagesChannelsDescriptionsListConstructorArguments
 * @template P
 * @template T
 * @template DBO
 */
export interface ISwarmMessagesChannelsDescriptionsListConstructorArguments<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> {
  /**
   * Description for the channels descriptions list
   *
   * @type {Readonly<ISwarmMessagesChannelsDescriptionsListDescription<P, T, DBO>>}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  description: Readonly<ISwarmMessagesChannelsDescriptionsListDescription<P, T, DBO>>;
  /**
   * Used for channels descriptions serialization
   *
   * @type {ISerializer}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  serializer: ISerializer;

  /**
   * Utilities used by the swarm messages channels list instance constucted
   * by the constructor.
   *
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  utilities: ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils<P, T, DBO>;
}

export interface ISwarmMessagesChannelsDescriptionsListConstructor<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> {
  new (
    constructorArguments: ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, DBO, DBOS>
  ): ISwarmMessagesChannelsDescriptionsList<P, T, DBO>;
}
