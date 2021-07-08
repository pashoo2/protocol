import {
  IConnectionBridgeOptions,
  TConnectionBridgeCFODefault,
  ISwarmStoreDatabasesPersistentListFabric,
} from '../../../types/connection-bridge.types';
import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageInstance, ISwarmMessageInstanceEncrypted } from '../../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
} from '../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreConnectorConnectionOptions,
} from '../../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageSerialized } from '../../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmStoreConnectorBasic,
  ISwarmStoreConnector,
  TSwarmStoreConnectorBasicFabric,
} from '../../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageStoreOptionsWithConnectorFabric,
  ISwarmMessageStore,
} from '../../../../swarm-message-store/types/swarm-message-store.types';
import { ConnectionBridge } from '../../../connection-bridge';
import { ISerializer } from '../../../../../types/serialization.types';
import {
  TSwarmStoreDatabaseOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
} from '../../../../swarm-store-class/swarm-store-class.types';

export const createConnectionBridgeConnection = async <
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  CD extends boolean = true,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> = TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T = TSwarmMessageInstance | T,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | never = ISwarmMessageConstructorWithEncryptedCacheFabric,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<
    P,
    Exclude<MSI, ISwarmMessageInstanceEncrypted>
  > = TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  ACO extends ISwarmMessageStoreAccessControlOptions<
    P,
    T,
    Exclude<MSI, ISwarmMessageInstanceEncrypted>,
    GAC
  > = ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC>,
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
  SSDPLF extends ISwarmStoreDatabasesPersistentListFabric<
    P,
    T,
    DbType,
    DBO,
    Record<DBO['dbName'], DBO>
  > = ISwarmStoreDatabasesPersistentListFabric<P, T, DbType, DBO, Record<DBO['dbName'], DBO>>,
  SRLZR extends ISerializer = ISerializer,
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
    SMS,
    SSDPLF,
    SRLZR
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
    SMS,
    SSDPLF,
    SRLZR
  >
>(
  options: CBO,
  useSessionIfExists: boolean = false
) => {
  const connectionBridge = new ConnectionBridge<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    CBFO,
    MSI,
    GAC,
    MCF,
    ACO,
    O,
    CD,
    CBO,
    SMS
  >();
  let useSessionAuth: boolean = false;
  const optionsWithoutCredentials = {
    ...options,
    auth: {
      ...(options.auth ?? {}),
      credentials: undefined,
    },
  };

  if (useSessionIfExists) {
    useSessionAuth = await connectionBridge.checkSessionAvailable(optionsWithoutCredentials);
  }

  await connectionBridge.connect(useSessionAuth ? optionsWithoutCredentials : options);
  return connectionBridge;
};
