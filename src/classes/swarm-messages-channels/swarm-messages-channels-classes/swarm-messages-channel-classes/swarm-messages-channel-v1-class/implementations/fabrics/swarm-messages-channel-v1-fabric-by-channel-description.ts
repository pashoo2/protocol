import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreConnectorBasic,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreConnector,
  ISwarmStoreOptionsConnectorFabric,
} from '../../../../../../swarm-store-class/swarm-store-class.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  ISwarmMessageStore,
} from '../../../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import {
  ISwarmMessageChannelDescriptionRaw,
  ISwarmMessagesChannel,
} from '../../../../../types/swarm-messages-channel-instance.types';
import { ISwarmMessagesChannelFabricByChannelDescription } from 'classes/swarm-messages-channels/types/swarm-messages-channel-instance.fabrics.types';
import { MarkOptional, MarkRequired } from 'ts-essentials';
import { ISwarmMessagesChannelConstructorOptions } from '../../../../../types/swarm-messages-channel-instance.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../../../../../swarm-messages-database/swarm-messages-database.messages-collector.types';
import { ISwarmMessagesChannelV1DefaultFabricOptions } from './types/swarm-messges-channel-v1-fabric-async-default.types';
import {
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseConnectOptions,
} from '../../../../../../swarm-messages-database/swarm-messages-database.types';
import { getSwarmMessagesChannelV1InstanveWithDefaults } from 'classes/swarm-messages-channels/swarm-messages-channels-classes/swarm-messages-channel-classes/swarm-messages-channel-v1-class/implementations/fabrics/swarm-messges-channel-v1-fabric-async-default';

export function getSwarmMessagesChannelFabricByChannelDescriptionFabric<
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
): ISwarmMessagesChannelFabricByChannelDescription<
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
  CHD
> {
  async function swarmMessagesChannelFabricByChannelDescription(
    swarmMessagesChannelDescription: CHD
  ): Promise<ISwarmMessagesChannel<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD>> {
    const defaultFabricOptionsExtendedBySwarmChannelDescription: ISwarmMessagesChannelV1DefaultFabricOptions<
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
      MarkRequired<CHCO, 'swarmMessagesChannelDescription'>
    > = {
      ...options,
      channelConstructorMainOptions: {
        ...options.channelConstructorMainOptions,
        swarmMessagesChannelDescription,
      } as MarkRequired<CHCO, 'swarmMessagesChannelDescription'>,
    };
    return await getSwarmMessagesChannelV1InstanveWithDefaults(defaultFabricOptionsExtendedBySwarmChannelDescription);
  }

  return swarmMessagesChannelFabricByChannelDescription;
}
