import {
  ESwarmStoreConnector,
  ESwarmStoreConnectorOrbitDbDatabaseType,
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
} from '../../../../../../../swarm-store-class';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../../../../../../swarm-message';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import {
  ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric,
  TSwrmMessagesChannelsListDBOWithGrantAccess,
  DBOFULL,
} from '../../../../../../types/swarm-messages-channels-list.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../../../../swarm-message-encrypted-cache';
import {
  ISwarmMessageStore,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from '../../../../../../../swarm-message-store';
import {
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseConnectOptions,
  ISwarmMessagesDatabaseConnector,
  ISwarmMessagesDatabaseMessagesCollector,
} from '../../../../../../../swarm-messages-database';
import { swarmMessagesDatabaseConnectedFabric } from '../../../../../../../swarm-messages-database/swarm-messages-database-fabric';

type DbType = ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;

export function getDatabaseConnectionFabricByDatabaseOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined = undefined,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T> = TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined = undefined,
  ConnectorBasic extends ISwarmStoreConnectorBasic<
    P,
    T,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
    DBOFULL<P, T, MD, CTX, DBO>
  > = ISwarmStoreConnectorBasic<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, DBOFULL<P, T, MD, CTX, DBO>>,
  CO extends TSwarmStoreConnectorConnectionOptions<
    P,
    T,
    DbType,
    DBOFULL<P, T, MD, CTX, DBO>,
    ConnectorBasic
  > = TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBOFULL<P, T, MD, CTX, DBO>, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<
    P,
    T,
    DbType,
    DBOFULL<P, T, MD, CTX, DBO>,
    ConnectorBasic,
    CO
  > = ISwarmStoreProviderOptions<P, T, DbType, DBOFULL<P, T, MD, CTX, DBO>, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<
    P,
    T,
    DbType,
    DBOFULL<P, T, MD, CTX, DBO>,
    ConnectorBasic,
    CO
  > = ISwarmStoreConnector<P, T, DbType, DBOFULL<P, T, MD, CTX, DBO>, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<
    P,
    T,
    DbType,
    DBOFULL<P, T, MD, CTX, DBO>,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain
  > = ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBOFULL<P, T, MD, CTX, DBO>, ConnectorBasic, CO, PO, ConnectorMain>,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBOFULL<P, T, MD, CTX, DBO>,
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
    DBOFULL<P, T, MD, CTX, DBO>,
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
    DBOFULL<P, T, MD, CTX, DBO>,
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
  > = ISwarmMessageStore<
    P,
    T,
    DbType,
    DBOFULL<P, T, MD, CTX, DBO>,
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
  >,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD> = ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM> = ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBOFULL<P, T, MD, CTX, DBO>, MD, SMSM> = ISwarmMessagesDatabaseCache<
    P,
    T,
    DbType,
    DBOFULL<P, T, MD, CTX, DBO>,
    MD,
    SMSM
  >,
  OPT extends ISwarmMessagesDatabaseConnectOptions<
    P,
    T,
    DbType,
    DBOFULL<P, T, MD, CTX, DBO>,
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
    DBOFULL<P, T, MD, CTX, DBO>,
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
  options: Omit<OPT, 'dbOptions'>
): ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<
  P,
  T,
  MD,
  CTX,
  DBOFULL<P, T, MD, CTX, DBO>
> {
  return async (
    databaseOptions: DBOFULL<P, T, MD, CTX, DBO>
  ): Promise<
    ISwarmMessagesDatabaseConnector<
      P,
      T,
      DbType,
      DBOFULL<P, T, MD, CTX, DBO>,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >
  > => {
    return await swarmMessagesDatabaseConnectedFabric({
      ...options,
      dbOptions: databaseOptions,
    });
  };
}
