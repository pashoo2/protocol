import { IConnectionBridgeOptions, TConnectionBridgeCFODefault, IConnectionBridge } from '../connection-bridge.types';
import { ESwarmStoreConnector } from '../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageInstance } from '../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
} from '../../swarm-message-store/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { TSwarmStoreDatabaseType, TSwarmStoreConnectorConnectionOptions } from '../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageSerialized } from '../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmStoreConnectorBasic,
  ISwarmStoreConnector,
  TSwarmStoreConnectorBasicFabric,
} from '../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageStoreOptionsWithConnectorFabric,
  ISwarmMessageStore,
} from '../../swarm-message-store/swarm-message-store.types';
import {
  TSwarmStoreDatabaseOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
} from '../../swarm-store-class/swarm-store-class.types';

export interface IConnectionBridgeFabric<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  CD extends boolean = true,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> = TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T = TSwarmMessageInstance | T,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric = ISwarmMessageConstructorWithEncryptedCacheFabric,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI> = TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MSI, GAC> = ISwarmMessageStoreAccessControlOptions<P, T, MSI, GAC>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO> = ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  CBFO extends TSwarmStoreConnectorBasicFabric<P, T, DbType, DBO, ConnectorBasic> = TSwarmStoreConnectorBasicFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic
  >,
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
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    TConnectionBridgeCFODefault<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO>,
    MSI,
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
    TConnectionBridgeCFODefault<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO>,
    MSI,
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
    TConnectionBridgeCFODefault<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO>,
    MSI,
    GAC,
    MCF,
    ACO,
    O
  > = ISwarmMessageStore<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    TConnectionBridgeCFODefault<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO>,
    MSI,
    GAC,
    MCF,
    ACO,
    O
  >,
  CBO extends IConnectionBridgeOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    MSI,
    GAC,
    MCF,
    ACO,
    CFO,
    CBFO,
    CD,
    O,
    SMS
  > = IConnectionBridgeOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    MSI,
    GAC,
    MCF,
    ACO,
    CFO,
    CBFO,
    CD,
    O,
    SMS
  >
> {
  (options: CBO): Promise<
    IConnectionBridge<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, CBFO, MSI, GAC, MCF, ACO, O, CD, CBO, SMS>
  >;
}
