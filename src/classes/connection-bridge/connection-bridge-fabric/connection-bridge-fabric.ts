import { IConnectionBridgeOptions } from '../connection-bridge.types';
import { ESwarmStoreConnector } from '../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageInstance } from '../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
} from '../../swarm-message-store/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { TSwarmStoreDatabaseType, TSwarmStoreConnectorConnectionOptions } from '../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageSerialized } from '../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmStoreConnectorBasic,
  ISwarmStoreConnector,
  TSwarmStoreConnectorBasicFabric,
} from '../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreOptionsWithConnectorFabric } from '../../swarm-message-store/swarm-message-store.types';
import { ConnectionBridge } from '../connection-bridge';
import {
  TSwarmStoreDatabaseOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
} from '../../swarm-store-class/swarm-store-class.types';

export const createConnectrionBridgeConnection = async <
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized = TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P> = TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> = TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO> = ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic> = TSwarmStoreConnectorConnectionOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic
  >,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO> = ISwarmStoreProviderOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO
  >,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO> = ISwarmStoreConnector<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO
  >,
  CFO extends ISwarmStoreOptionsConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain
  > = ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  CBFO extends TSwarmStoreConnectorBasicFabric<P, T, DbType, DBO, ConnectorBasic> = TSwarmStoreConnectorBasicFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic
  >,
  MSI extends TSwarmMessageInstance | T = TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI> = TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined =
    | ISwarmMessageConstructorWithEncryptedCacheFabric
    | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MSI, GAC> | undefined =
    | ISwarmMessageStoreAccessControlOptions<P, T, MSI, GAC>
    | undefined,
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
    PO,
    CO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO
  >,
  CD extends boolean = true,
  CBO extends IConnectionBridgeOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    MSI,
    GAC,
    MCF,
    ACO,
    CFO,
    CBFO,
    CD
  > = IConnectionBridgeOptions<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, MSI, GAC, MCF, ACO, CFO, CBFO, CD>
>(
  options: CBO,
  useSessionCredentials: boolean = false
) => {
  const connectionBridge = new ConnectionBridge<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    CBFO,
    MSI,
    GAC,
    MCF,
    ACO,
    O,
    CD,
    CBO
  >();
  let useSessionAuth: boolean = false;
  const optionsWithoutCredentials = {
    ...options,
    auth: {
      ...options.auth,
      credentials: undefined,
    },
  };

  if (useSessionCredentials) {
    useSessionAuth = await connectionBridge.checkSessionAvailable(optionsWithoutCredentials);
  }

  await connectionBridge.connect(useSessionAuth ? optionsWithoutCredentials : options);
  return connectionBridge;
};
