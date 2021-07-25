import { MarkOptional } from 'ts-essentials';
import { ESwarmStoreConnector } from '../../../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreConnectorBasic,
  ISwarmStoreProviderOptions,
  ISwarmStoreConnector,
  ISwarmStoreOptionsConnectorFabric,
} from '../../../../../../../swarm-store-class/swarm-store-class.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
} from '../../../../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../../../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../../../../../../swarm-messages-database/swarm-messages-database.messages-collector.types';
import {
  ISwarmMessageChannelDescriptionRaw,
  ISwarmMessagesChannelConstructorOptions,
} from '../../../../../../types/swarm-messages-channel-instance.types';
import { ISwarmMessagesChannelConstructor } from '../../../../../../types/swarm-messages-channel-instance.types';
import { ISwarmMessagesChannelV1ClassChannelsListHandlerConstructor } from '../../../types/swarm-messages-channel-v1-class-channels-list-handler.types';
import { ISwarmMessagesChannelV1DatabaseHandlerConstructor } from '../../../types/swarm-messages-channel-v1-class-messages-database-handler.types';
import { SWARM_MESSAGES_CHANNEL_ENCRYPTION } from '../../../../../../const/swarm-messages-channels-main.const';
import { IAsyncQueueBaseClassOptions } from '../../../../../../../basic-classes/async-queue-class-base';
import { IQueuedEncryptionClassBase } from '../../../../../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { ISwarmMessagesChannelV1ConstructorOptionsDefaultUtilsDefaultConnectionUtils } from '../../../utils/swarm-messages-channel-v1-constructor-options-default-utils/types/swarm-messages-channel-v1-constructor-options-default-utils.types';
import {
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseConnectOptions,
} from '../../../../../../../swarm-messages-database/swarm-messages-database.types';
import {
  ISwarmMessageStoreOptionsWithConnectorFabric,
  ISwarmMessageStore,
} from '../../../../../../../swarm-message-store/types/swarm-message-store.types';

export interface ISwarmMessagesChannelV1DefaultFabricOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
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
  CHD extends ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>,
  CHCO extends MarkOptional<
    ISwarmMessagesChannelConstructorOptions<
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
      CHD
    >,
    'passwordEncryptedChannelEncryptionQueue' | 'utils' | 'swarmMessagesChannelDescription'
  >
> {
  channelConstructorMainOptions: CHCO;
  channelDatabaseConnectorOptions: CHCO['utils'] extends never ? Omit<OPT, 'dbOptions' | 'user'> : never;
  SwarmMessagesChannelConstructorWithHelperConstuctorsSupport:
    | ISwarmMessagesChannelConstructor<
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
        [
          ISwarmMessagesChannelV1ClassChannelsListHandlerConstructor<
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
          >,
          ISwarmMessagesChannelV1DatabaseHandlerConstructor<
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
            CHD['messageEncryption']
          >
        ]
      >
    | never;
  /**
   * Constructor of a swarm messages channel swarm channels list
   * handler helper class.
   *
   * @type {ISwarmMessagesChannelV1ClassChannelsListHandlerConstructor<
   *     P,
   *     T,
   *     DbType,
   *     DBO,
   *     ConnectorBasic,
   *     CO,
   *     PO,
   *     ConnectorMain,
   *     CFO,
   *     GAC,
   *     MCF,
   *     ACO,
   *     O,
   *     SMS,
   *     MD
   *   >}
   */
  SwarmMessagesChannelV1ClassChannelsListHandlerConstructor:
    | ISwarmMessagesChannelV1ClassChannelsListHandlerConstructor<
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
      >
    | never;
  /**
   * Constructor of swarm messages channel databse handler helper class.
   *
   * @type {ISwarmMessagesChannelV1DatabaseHandlerConstructor<
   *     P,
   *     T,
   *     DbType,
   *     DBO,
   *     ConnectorBasic,
   *     CO,
   *     PO,
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
   *     OPT,
   *     CHD['messageEncryption']
   *   >}
   */
  SwarmMessagesChannelV1DatabaseHandlerConstructor:
    | ISwarmMessagesChannelV1DatabaseHandlerConstructor<
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
        CHD['messageEncryption']
      >
    | never;
  /**
   * A password string will be used for messages encryption and decryption.
   *
   * @type {CHD['messageEncryption'] extends SWARM_MESSAGES_CHANNEL_ENCRYPTION.PASSWORD ? string : never}
   */
  passwordForMessagesEncryption: CHD['messageEncryption'] extends SWARM_MESSAGES_CHANNEL_ENCRYPTION.PASSWORD ? string : never;
  /**
   * Fabric which creates instance of encryption queue
   * by a password string and salt, with queue options
   * optional argument.
   */
  encryptionQueueFabricByPasswordAndSalt?: CHD['messageEncryption'] extends SWARM_MESSAGES_CHANNEL_ENCRYPTION.PASSWORD
    ? (passwordString: string, salt: string, queueOptions?: IAsyncQueueBaseClassOptions) => Promise<IQueuedEncryptionClassBase>
    : never;
  /**
   * Optional options for encryption queue.
   *
   * @type {CHD['messageEncryption'] extends SWARM_MESSAGES_CHANNEL_ENCRYPTION.PASSWORD ? IAsyncQueueBaseClassOptions : never}
   */
  encryptionQueueOptions?: CHD['messageEncryption'] extends SWARM_MESSAGES_CHANNEL_ENCRYPTION.PASSWORD
    ? IAsyncQueueBaseClassOptions
    : never;
  defaultConnectionUtils?: Partial<
    ISwarmMessagesChannelV1ConstructorOptionsDefaultUtilsDefaultConnectionUtils<
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
    >
  >;
}

export type ISwarmMessagesChannelV1DefaultFabricOptionsDefault<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO> = ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic> = TSwarmStoreConnectorConnectionOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic
  >,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO> = ISwarmStoreProviderOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO
  >,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO> = ISwarmStoreConnector<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO
  >,
  CFO extends ISwarmStoreOptionsConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain
  > = ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T> = TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined = undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined = undefined,
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
  > = ISwarmMessageStoreOptionsWithConnectorFabric<
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
  SMS extends ISwarmMessageStore<
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
    ACO,
    O
  > = ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD> = ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM> = ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM> = ISwarmMessagesDatabaseCache<
    P,
    T,
    DbType,
    DBO,
    MD,
    SMSM
  >,
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
  > = ISwarmMessagesDatabaseConnectOptions<
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
  CHD extends ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> = ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>,
  CHCO extends MarkOptional<
    ISwarmMessagesChannelConstructorOptions<
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
      CHD
    >,
    'passwordEncryptedChannelEncryptionQueue' | 'utils' | 'swarmMessagesChannelDescription'
  > = MarkOptional<
    ISwarmMessagesChannelConstructorOptions<
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
      CHD
    >,
    'passwordEncryptedChannelEncryptionQueue' | 'utils' | 'swarmMessagesChannelDescription'
  >
> = ISwarmMessagesChannelV1DefaultFabricOptions<
  P,
  T,
  MD,
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
  SMSM,
  DCO,
  DCCRT,
  OPT,
  CHD,
  CHCO
>;
