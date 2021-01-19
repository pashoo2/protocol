import {
  ISwarmMessagesDatabaseConnectOptions,
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
} from '../swarm-messages-database.types';
import {
  ISwarmMessageStore,
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../../swarm-message-store/types/swarm-message-store.types';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType } from '../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmStoreConnectorBasic,
  ISwarmStoreConnector,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
} from '../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { SwarmMessagesDatabase } from '../swarm-messages-database';
import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { TConnectToSwarmMessagesDatabaseReturnType } from './swarm-messages-database-fabric.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../swarm-messages-database.messages-collector.types';

/**
 * Constructor of SwarmMessagesDatabase instances
 *
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @template MSI
 * @template MCF
 * @template MD
 * @template GAC
 * @template ACO
 * @template ConnectorBasic
 * @template PO
 * @template CO
 * @template ConnectorMain
 * @template CFO
 * @template O
 * @template SMS
 * @template SMSM
 * @param {ISwarmMessagesDatabaseConnectOptions<
 *     P,
 *     T,
 *     DbType,
 *     DBO,
 *     ConnectorBasic,
 *     PO,
 *     CO,
 *     ConnectorMain,
 *     CFO,
 *     MSI,
 *     GAC,
 *     MCF,
 *     ACO,
 *     O,
 *     SMS,
 *     MD,
 *     SMSM
 *   >} options - options for the SwarmMessagesDatabase connection
 * @returns {Promise<
 *   TConnectToSwarmMessagesDatabaseReturnType<
 *     P,
 *     T,
 *     DbType,
 *     DBO,
 *     MSI,
 *     MCF,
 *     MD,
 *     GAC,
 *     ACO,
 *     ConnectorBasic,
 *     PO,
 *     CO,
 *     ConnectorMain,
 *     CFO,
 *     O,
 *     SMS
 *   >
 * >}
 */
export const swarmMessagesDatabaseConnectedFabric = async <
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> = TSwarmStoreDatabaseOptions<P, T, DbType>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined = undefined,
  MD extends ISwarmMessageInstanceDecrypted = ISwarmMessageInstanceDecrypted,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T> = TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined = undefined,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO> = ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
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
    CFO,
    MD | T,
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
    DBO,
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
  > = ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD> = ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM> = ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM> = ISwarmMessagesDatabaseCache<
    P,
    T,
    DbType,
    DBO,
    MD,
    SMSM
  >,
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
  > = ISwarmMessagesDatabaseConnectOptions<
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
  options: OPT
): Promise<
  TConnectToSwarmMessagesDatabaseReturnType<
    P,
    T,
    DbType,
    DBO,
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
    DCCRT
  >
> => {
  const db = new SwarmMessagesDatabase<
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
  >();

  await db.connect(options);
  return db;
};
