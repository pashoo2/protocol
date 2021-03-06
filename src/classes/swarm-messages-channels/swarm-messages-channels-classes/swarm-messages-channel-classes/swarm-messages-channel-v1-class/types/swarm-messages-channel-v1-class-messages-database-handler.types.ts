import { IQueuedEncryptionClassBase } from '../../../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import {
  ISwarmMessageStore,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from '../../../../../swarm-message-store/types/swarm-message-store.types';
import {
  ISwarmMessageInstanceDecrypted,
  TSwarmMessageSerialized,
} from '../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions } from '../../../../../swarm-messages-database/swarm-messages-database-fabrics/types/swarm-messages-database-instance-fabric-by-database-options.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../../../../swarm-messages-database/swarm-messages-database.messages-collector.types';
import {
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseConnectOptions,
} from '../../../../../swarm-messages-database/swarm-messages-database.types';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import {
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../../../../swarm-store-class/swarm-store-class.types';
import { SWARM_MESSAGES_CHANNEL_ENCRYPTION } from '../../../../const/swarm-messages-channels-main.const';
import { ISwarmMessagesChannel } from '../../../../types/swarm-messages-channel-instance.types';
import {
  ISwarmMessageDatabaseEvents,
  TSwarmMessageDatabaseMessagesCached,
} from '../../../../../swarm-messages-database/swarm-messages-database.types';
import { EventEmitter } from '../../../../../basic-classes/event-emitter-class-base/event-emitter-class-base.types';

/**
 * Helper class that helps in maintaining
 * a channel's swarm messages database.
 *
 * @export
 * @interface ISwarmMessagesChannelV1DatabaseHandler
 * @extends {(Pick<ISwarmMessagesChannel<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD>, 'addMessage' | 'deleteMessage' | 'collect' | 'collectWithMeta' | 'setPasswordForMessagesEncryption'>)}
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @template ConnectorBasic
 * @template CO
 * @template PO
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
export interface ISwarmMessagesChannelV1DatabaseHandler<
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
  MD extends ISwarmMessageInstanceDecrypted
> extends Pick<
    ISwarmMessagesChannel<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD>,
    'addMessage' | 'deleteMessage' | 'collect' | 'collectWithMeta'
  > {
  /**
   * Emit events related to swarm messages database status
   *
   * @type {Pick<
   *     ISwarmMessagesChannel<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD>,
   *     'emitterChannelMessagesDatabase'
   *   >}
   * @memberof ISwarmMessagesChannelV1DatabaseHandler
   */
  readonly emitter: EventEmitter<ISwarmMessageDatabaseEvents<P, T, DbType, DBO, MD>>;

  /**
   * Whether database connector is ready to be used for performing database operations.
   *
   * @type {boolean}
   * @memberof ISwarmMessagesChannelV1DatabaseHandler
   */
  readonly isDatabaseReady: boolean;

  /**
   * List of a messages with additional meta information.
   *
   * @type {TSwarmMessageDatabaseMessagesCached<P, DbType>}
   * @memberof ISwarmMessagesDatabaseProperties
   */
  readonly cachedMessages: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined;

  /**
   * Create new swarm messages database connector instance
   * for future usage in such operations as "addMessage", removeMessage"
   * and so on.
   *
   * @param {DBO} databaseOptions
   * @returns {void}
   * @memberof ISwarmMessagesChannelV1DatabaseHandler
   */
  restartDatabaseConnectorInstanceWithDbOptions(databaseOptions: DBO): Promise<void>;

  /**
   * Close the instance and database connection.
   *
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannelV1DatabaseHandler
   */
  close(): Promise<void>;

  /**
   * Drop the database locally and close the instance.
   */
  dropDatabaseLocally(): Promise<void>;
}

/**
 * Options for constructing instance of channel database
 * handler.
 *
 * @export
 * @interface ISwarmMessagesChannelV1DatabaseHandlerConstructorOptions
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
export interface ISwarmMessagesChannelV1DatabaseHandlerConstructorOptions<
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
  CHE extends SWARM_MESSAGES_CHANNEL_ENCRYPTION = SWARM_MESSAGES_CHANNEL_ENCRYPTION.PUBLIC
> {
  /**
   * Database's opitons which must be created.
   *
   * @type {DBO}
   * @memberof ISwarmMessagesChannelV1DatabaseHandlerConstructorOptions
   */
  databaseOptions: DBO;
  /**
   * Encryption key which will be used for encryption and decription
   * of all messages passed through the channel for messages channel
   * which uses a passwor encryption type.
   *
   * @type {CryptoKey}
   * @memberof ISwarmMessagesChannelV1DatabaseHandlerConstructorOptions
   */
  messagesEncryptionQueue: CHE extends SWARM_MESSAGES_CHANNEL_ENCRYPTION.PASSWORD ? IQueuedEncryptionClassBase : undefined;
  /**
   * Encryption type used for messaging
   *
   * @type {CHE}
   * @memberof ISwarmMessagesChannelV1DatabaseHandlerConstructorOptions
   */
  messageEncryptionType: CHE;
  /**
   * Swarm messages issuer string, which will be used as
   * a value for the 'iss' property of a swarm message.
   *
   * @type {string}
   * @memberof ISwarmMessagesChannelV1DatabaseHandlerConstructorOptions
   */
  messagesIssuer: string;
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
  swarmMessagesDatabaseConnectorInstanceByDBOFabric: ISwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions<
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
 * Helper class that helps in maintaining
 * a channel's swarm messages database.
 *
 * @export
 * @interface ISwarmMessagesChannelV1DatabaseHandler
 * @extends {(Pick<ISwarmMessagesChannel<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD>, 'addMessage' | 'deleteMessage' | 'collect' | 'collectWithMeta' | 'setPasswordForMessagesEncryption'>)}
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @template ConnectorBasic
 * @template CO
 * @template PO
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
export interface ISwarmMessagesChannelV1DatabaseHandlerConstructor<
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
  >,
  CHE extends SWARM_MESSAGES_CHANNEL_ENCRYPTION = SWARM_MESSAGES_CHANNEL_ENCRYPTION.PUBLIC
> {
  new (
    options: ISwarmMessagesChannelV1DatabaseHandlerConstructorOptions<
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
      OPT,
      CHE
    >
  ): ISwarmMessagesChannelV1DatabaseHandler<
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
    MD
  >;
}
