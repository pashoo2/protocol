import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreConnectorBasic,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreConnector,
  ISwarmStoreOptionsConnectorFabric,
} from '../../../swarm-store-class/swarm-store-class.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  ISwarmMessageStore,
} from '../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../swarm-messages-database.messages-collector.types';
import {
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseConnectOptions,
} from '../../swarm-messages-database.types';
import { ISwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions } from '../../swarm-messages-database-fabrics/types/swarm-messages-database-instance-fabric-by-database-options.types';
import { SwarmMessagesDatabaseWithKvDbMessagesUpdatesQueued } from './swarm-messages-database-with-kv-db-messages-updates-queued';
import { getSwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions } from '../../swarm-messages-database-fabrics/swarm-messages-database-instance-fabric-by-database-options';

export function getSwarmMessagesDatabaseWithKVDbMessagesUpdatesQueuedConnectedInstanceFabricByDatabaseOptions<
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
  >
>(
  options: Omit<OPT, 'dbOptions'>
): ISwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions<
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
> {
  return getSwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions<
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
    typeof SwarmMessagesDatabaseWithKvDbMessagesUpdatesQueued
  >(options, SwarmMessagesDatabaseWithKvDbMessagesUpdatesQueued);
}
