import { MarkOptional, MarkRequired } from 'ts-essentials';
import {
  ISwarmMessageChannelDescriptionRaw,
  ISwarmMessagesChannelConstructorOptions,
} from '../../../../../types/swarm-messages-channel-instance.types';
import {
  ISwarmMessagesDatabaseConnectOptions,
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseCacheOptions,
} from '../../../../../../swarm-messages-database/swarm-messages-database.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../../../../../swarm-messages-database/swarm-messages-database.messages-collector.types';
import {
  ISwarmMessageInstanceDecrypted,
  TSwarmMessageSerialized,
} from '../../../../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmMessageStore,
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../../../../../../swarm-message-store/types/swarm-message-store.types';
import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreConnectorBasic,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreConnector,
  ISwarmStoreOptionsConnectorFabric,
} from '../../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmMessagesChannelV1DatabaseHandlerConstructor } from '../../types/swarm-messages-channel-v1-class-messages-database-handler.types';
import { ISwarmMessagesChannelV1ClassChannelsListHandlerConstructor } from '../../types/swarm-messages-channel-v1-class-channels-list-handler.types';
import { IAsyncQueueBaseClassOptions } from '../../../../../../basic-classes/async-queue-class-base/async-queue-class-base.types';
import { IQueuedEncryptionClassBase } from '../../../../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { SWARM_MESSAGES_CHANNEL_ENCRYPION } from '../../../../../const/swarm-messages-channels-main.const';
import { SwarmMessagesChannelV1Class } from '../swarm-messages-channel-v1-class';
import { SwarmMessagesChannelV1ClassChannelsListHandler } from '../../subclasses/swarm-messages-channel-v1-class-channels-list-handler';
import { SwarmMessagesChannelV1DatabaseHandlerQueued } from '../../subclasses/swarm-messages-channel-v1-class-messages-database-handler-queued';
import assert from 'assert';
import {
  ISwarmMessagesChannelConstructor,
  ISwarmMessagesChannel,
} from '../../../../../types/swarm-messages-channel-instance.types';
import { getQueuedEncryptionClassByPasswordStringAndSalt } from 'classes/basic-classes/queued-encryption-class-base/fabrics/queued-encryption-class-base-fabric-by-password';
import { getSwarmMessagesChannelV1DefaultConstructorOptionsUtils } from '../../utils/swarm-messages-channel-v1-constructor-options-default-utils/swarm-messages-channel-v1-constructor-options-default-utils';
import { ISwarmMessagesChannelV1ConstructorOptionsDefaultUtilsDefaultConnectionUtils } from '../../utils/swarm-messages-channel-v1-constructor-options-default-utils/types/swarm-messages-channel-v1-constructor-options-default-utils.types';
import { ISwarmMessagesChannelV1DefaultFabricOptions } from './types/swarm-messges-channel-v1-fabric-async-default.types';

/**
 * Creates instance of swarm channel
 *
 * @export
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
 * @template CHD
 */
export async function getSwarmMessagesChannelV1InstanveWithDefaults<
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
    'passwordEncryptedChannelEncryptionQueue' | 'utils'
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
    'passwordEncryptedChannelEncryptionQueue' | 'utils'
  >
>(
  options: ISwarmMessagesChannelV1DefaultFabricOptions<
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
  >
): Promise<
  typeof options['SwarmMessagesChannelConstructorWithHelperConstuctorsSupport'] extends never
    ? ISwarmMessagesChannel<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD>
    : InstanceType<typeof options['SwarmMessagesChannelConstructorWithHelperConstuctorsSupport']>
> {
  const {
    channelConstructorMainOptions: channelConstructorOptions,
    channeDatabaseConnectorOptions,
    SwarmMessagesChannelConstructorWithHelperConstuctorsSupport,
    SwarmMessagesChannelV1ClassChannelsListHandlerConstructor,
    SwarmMessagesChannelV1DatabaseHandlerConstructor,
    encryptionQueueFabricByPasswordAndSalt,
    passwordForMessagesEncryption,
    encryptionQueueOptions,
    defaultConnectionUtils,
  } = options;
  const { swarmMessagesChannelDescription, passwordEncryptedChannelEncryptionQueue } = channelConstructorOptions;
  const SwarmMessagesChannelConstructorWithHelperConstuctorsSupportToUse =
    SwarmMessagesChannelConstructorWithHelperConstuctorsSupport || SwarmMessagesChannelV1Class;
  const SwarmMessagesChannelV1ClassChannelsListHandlerConstructorToUse =
    SwarmMessagesChannelV1ClassChannelsListHandlerConstructor || SwarmMessagesChannelV1ClassChannelsListHandler;
  const SwarmMessagesChannelV1DatabaseHandlerConstructorToUse =
    SwarmMessagesChannelV1DatabaseHandlerConstructor || SwarmMessagesChannelV1DatabaseHandlerQueued;
  const encryptionQueueFabricByPasswordAndSaltToUse =
    encryptionQueueFabricByPasswordAndSalt || getQueuedEncryptionClassByPasswordStringAndSalt;

  const constructorUtilsToUse =
    channelConstructorOptions.utils ||
    getSwarmMessagesChannelV1DefaultConstructorOptionsUtils<
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
    >(
      {
        ...channeDatabaseConnectorOptions,
        user: {
          userId: channelConstructorOptions.currentUserId,
        },
      } as Omit<OPT, 'dbOptions'>,
      defaultConnectionUtils
    );
  let channelConstructorOptionsResulted = {
    ...channelConstructorOptions,
    utils: constructorUtilsToUse,
  } as ISwarmMessagesChannelConstructorOptions<
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
  >;

  if (swarmMessagesChannelDescription.messageEncryption === SWARM_MESSAGES_CHANNEL_ENCRYPION.PASSWORD) {
    assert(passwordForMessagesEncryption, 'A password string must be provided for channels with messages encryption by password');
    const salt = swarmMessagesChannelDescription.id;
    const encryptionQueueForMessagesEncryption =
      passwordEncryptedChannelEncryptionQueue ||
      ((await encryptionQueueFabricByPasswordAndSaltToUse(
        passwordForMessagesEncryption,
        salt,
        encryptionQueueOptions
      )) as CHD['messageEncryption'] extends SWARM_MESSAGES_CHANNEL_ENCRYPION.PASSWORD ? IQueuedEncryptionClassBase : never);
    channelConstructorOptionsResulted = {
      ...channelConstructorOptionsResulted,
      passwordEncryptedChannelEncryptionQueue: encryptionQueueForMessagesEncryption,
    };
  }
  return new SwarmMessagesChannelConstructorWithHelperConstuctorsSupportToUse(
    channelConstructorOptionsResulted,
    SwarmMessagesChannelV1ClassChannelsListHandlerConstructorToUse,
    SwarmMessagesChannelV1DatabaseHandlerConstructorToUse
  );
}
