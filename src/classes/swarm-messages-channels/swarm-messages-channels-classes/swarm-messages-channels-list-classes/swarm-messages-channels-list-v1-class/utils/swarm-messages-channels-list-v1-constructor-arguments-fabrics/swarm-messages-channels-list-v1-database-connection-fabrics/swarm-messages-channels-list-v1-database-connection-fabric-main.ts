import {
  ESwarmStoreConnector,
  ESwarmStoreConnectorOrbitDbDatabaseType,
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
} from '../../../../../../../swarm-store-class/index';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../../../../../../swarm-message/index';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connectors.types';
import {
  ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric,
  TSwarmMessagesChannelsListDBOWithGrantAccess,
  DBOFULL,
} from '../../../../../../types/swarm-messages-channels-list-instance.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../../../../swarm-message-encrypted-cache/index';
import {
  ISwarmMessageStore,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from '../../../../../../../swarm-message-store/index';
import {
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseConnectOptions,
  ISwarmMessagesDatabaseConnector,
  ISwarmMessagesDatabaseMessagesCollector,
} from '../../../../../../../swarm-messages-database/index';
import { swarmMessagesDatabaseConnectedFabricMain as swarmMessagesDatabaseConnectedInstanceFabric } from '../../../../../../../swarm-messages-database/swarm-messages-database-fabrics/swarm-messages-database-intstance-fabric-main/index';
import { ISwarmMessagesDatabaseConnectedFabricMain } from '../../../../../../../swarm-messages-database/swarm-messages-database-fabrics/types/swarm-messages-database-intstance-fabric-main.types';

type DbType = ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;

export function getDatabaseConnectionByDatabaseOptionsFabricMain<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>,
  DBOF extends DBOFULL<P, T, MD, CTX, DBO> = DBOFULL<P, T, MD, CTX, DBO>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined = undefined,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T> = TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined = undefined,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBOF> = ISwarmStoreConnectorBasic<P, T, DbType, DBOF>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBOF, ConnectorBasic> = TSwarmStoreConnectorConnectionOptions<
    P,
    T,
    DbType,
    DBOF,
    ConnectorBasic
  >,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBOF, ConnectorBasic, CO> = ISwarmStoreProviderOptions<
    P,
    T,
    DbType,
    DBOF,
    ConnectorBasic,
    CO
  >,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBOF, ConnectorBasic, CO> = ISwarmStoreConnector<
    P,
    T,
    DbType,
    DBOF,
    ConnectorBasic,
    CO
  >,
  CFO extends ISwarmStoreOptionsConnectorFabric<
    P,
    T,
    DbType,
    DBOF,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain
  > = ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBOF, ConnectorBasic, CO, PO, ConnectorMain>,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBOF,
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
    DBOF,
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
    DBOF,
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
  > = ISwarmMessageStore<P, T, DbType, DBOF, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD> = ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM> = ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBOF, MD, SMSM> = ISwarmMessagesDatabaseCache<
    P,
    T,
    DbType,
    DBOF,
    MD,
    SMSM
  >,
  OPT extends ISwarmMessagesDatabaseConnectOptions<
    P,
    T,
    DbType,
    DBOF,
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
    DBOF,
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
  >
>(
  options: Omit<OPT, 'dbOptions'>,
  swarmMessagesDatabaseConnectedFabric: ISwarmMessagesDatabaseConnectedFabricMain<
    P,
    T,
    DbType,
    DBOF,
    MCF,
    MD,
    GAC,
    ACO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    O,
    SMS,
    SMSM,
    DCO,
    DCCRT,
    OPT
  > = swarmMessagesDatabaseConnectedInstanceFabric
): ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<
  P,
  T,
  MD,
  CTX,
  DBO,
  DBOF,
  MCF,
  GAC,
  ACO,
  ConnectorBasic,
  CO,
  PO,
  ConnectorMain,
  CFO,
  O,
  SMS,
  SMSM,
  DCO,
  DCCRT,
  OPT
> {
  async function swarmMessagesChannelsListDatabaseConnectionFabric(
    databaseOptions: DBOF
  ): Promise<
    ISwarmMessagesDatabaseConnector<
      P,
      T,
      DbType,
      DBOF,
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
  > {
    const optionsForSwamMessagesDatabaseConnectedFabric = {
      ...options,
      dbOptions: databaseOptions,
    } as OPT;
    return await swarmMessagesDatabaseConnectedFabric(optionsForSwamMessagesDatabaseConnectedFabric);
  }
  return swarmMessagesChannelsListDatabaseConnectionFabric;
}
