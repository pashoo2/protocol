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
  ISwarmMessagesDatabaseConnector,
} from 'classes/swarm-messages-database/swarm-messages-database.types';
import { ISwarmMessagesDatabaseMessagesCollector } from 'classes/swarm-messages-database/swarm-messages-database.messages-collector.types';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../swarm-message-store/types/swarm-message-store.types';

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

export interface ISwarmMessagesChannelDescriptionWithMetadata<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends ISwarmMessageInstanceDecrypted,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> extends Readonly<ISwarmMessageStoreMessagingRequestWithMetaResult<P, I>> {
  readonly channelDescription: Error | ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>;
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
