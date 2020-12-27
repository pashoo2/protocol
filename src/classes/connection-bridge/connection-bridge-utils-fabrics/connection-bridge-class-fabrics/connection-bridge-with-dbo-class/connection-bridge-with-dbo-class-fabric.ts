import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  TSwarmMessageInstance,
  ISwarmMessageConstructor,
} from '../../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
  TSwarmStoreConnectorBasicFabric,
} from '../../../../swarm-store-class/swarm-store-class.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ConstructorType } from '../../../../../types/helper.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import {
  TSwarmStoreDatabaseOptionsSerialized,
  ISwarmStoreDatabaseBaseOptions,
} from '../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric } from '../../../../swarm-message-store/types/swarm-message-store-db-options.types';
import {
  ISwarmStoreWithConnector,
  TSwarmStoreOptionsOfDatabasesKnownList,
} from '../../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageStoreWithEntriesCount,
  ISwarmMessageStoreEvents,
} from '../../../../swarm-message-store/types/swarm-message-store.types';
import { TConnectionBridgeCFODefault, TNativeConnectionType } from '../../../types/connection-bridge.types';
import { IConnectionBridgeWithDatabaseOptionsClassAndDBListPeristentStorageAndSwarmMessageCountOptions } from './connection-bridge-with-dbo-class-fabric.types';
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
} from '../../../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';
import { ISwarmStoreDatabasesPersistentListFabric } from '../../../types/connection-bridge.types';
import { ISwarmMessageStoreConnectorDbOptionsClassFabric } from '../../../types/connection-bridge-swarm-fabrics.types';
import { ConnectionBridgeWithDBOClassEntriesCount } from './connection-bridge-with-dbo-class';

export const createConnectionBridgeConnection = async <
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | T,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  DBOE extends DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  SMC extends ISwarmMessageConstructor,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, T, DbType, DBOE>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBOE, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBOE, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, T, DbType, DBOE, ConnectorBasic, CO>,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MSI, GAC>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBOE, ConnectorBasic, CO, PO, ConnectorMain>,
  CFOD extends TConnectionBridgeCFODefault<P, T, DbType, DBOE, ConnectorBasic, CO, PO, ConnectorMain, CFO>,
  CBFO extends TSwarmStoreConnectorBasicFabric<P, T, DbType, DBOE, ConnectorBasic>,
  CD extends boolean,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBOE,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFOD,
    MSI,
    GAC,
    MCF,
    ACO
  >,
  CBO extends IConnectionBridgeWithDatabaseOptionsClassAndDBListPeristentStorageAndSwarmMessageCountOptions<
    P,
    T,
    DbType,
    MSI,
    CTX,
    DBO,
    DBOE,
    DBOS,
    SMC,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    GAC,
    MCF,
    ACO,
    CFO,
    CFOD,
    CBFO,
    CD,
    O,
    SMS,
    SSDPLF,
    CTXC,
    SMSDBOGACF,
    DBOC
  >,
  SMS extends ISwarmMessageStoreWithEntriesCount<
    P,
    T,
    DbType,
    DBOE,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFOD,
    MSI,
    GAC,
    MCF,
    ACO,
    O
  > &
    ISwarmStoreWithConnector<P, T, DbType, DBOE, ConnectorBasic, CO, ConnectorMain>,
  SSDPLF extends ISwarmStoreDatabasesPersistentListFabric<P, T, DbType, DBOE, Record<DBOE['dbName'], DBOE>>,
  CTXC extends ConstructorType<CTX>,
  SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<SMC, CTXC>,
  DBOC extends ISwarmMessageStoreConnectorDbOptionsClassFabric<P, T, DbType, MSI, CTX, DBOE, DBOS, SMC, CTXC, SMSDBOGACF>,
  E extends ISwarmMessageStoreEvents<P, T, DbType, DBOE> = ISwarmMessageStoreEvents<P, T, DbType, DBOE>,
  DBL extends TSwarmStoreOptionsOfDatabasesKnownList<P, T, DbType, DBOE> = TSwarmStoreOptionsOfDatabasesKnownList<
    P,
    T,
    DbType,
    DBOE
  >,
  NC extends TNativeConnectionType<P> = TNativeConnectionType<P>
>(
  options: CBO,
  useSessionIfExists: boolean = false
) => {
  const connectionBridge = new ConnectionBridgeWithDBOClassEntriesCount<
    P,
    T,
    DbType,
    MSI,
    CTX,
    DBO,
    DBOE,
    DBOS,
    SMC,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    GAC,
    MCF,
    ACO,
    CFO,
    CFOD,
    CBFO,
    CD,
    O,
    CBO,
    SMS,
    SSDPLF,
    CTXC,
    SMSDBOGACF,
    DBOC,
    E,
    DBL,
    NC
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
