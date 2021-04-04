import { ISwarmMessagesChannel, ISwarmMessageChannelDescriptionRaw } from './swarm-messages-channel-instance.types';
import { ESwarmStoreConnector } from '../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreConnectorBasic,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreConnector,
  ISwarmStoreOptionsConnectorFabric,
} from '../../swarm-store-class/swarm-store-class.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmMessageStore } from '../../swarm-message-store/types/swarm-message-store.types';

export interface ISwarmMessagesChannelFabricByChannelDescription<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
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
  CHD extends ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> = ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>
> {
  (swarmMessagesChannelDescription: CHD): Promise<
    ISwarmMessagesChannel<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD>
  >;
}
