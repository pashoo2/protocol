import {
  ISwarmMessagesDatabaseConnectOptions,
  ISwarmMessagesDatabaseMessagesCollector,
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
} from '../swarm-messages-database.types';
import {
  ISwarmMessageStore,
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../../swarm-message-store/swarm-message-store.types';
import { TSwarmMessageSerialized, TSwarmMessageInstance } from '../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType } from '../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmStoreConnectorBasic,
  ISwarmStoreConnector,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
} from '../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmMessageInstanceEncrypted } from '../../swarm-message/swarm-message-constructor.types';
import { SwarmMessagesDatabase } from '../swarm-messages-database';
import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { TConnectToSwarmMessagesDatabaseReturnType } from './swarm-messages-database-fabric.types';
import { ISwarmMessagesDatabaseMessagesCollectorFabric } from '../swarm-messages-database.types';

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
  MSI extends TSwarmMessageInstance | T = TSwarmMessageInstance | T,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined = undefined,
  MD extends Exclude<MSI, T | ISwarmMessageInstanceEncrypted> &
    Exclude<Exclude<MSI, T>, ISwarmMessageInstanceEncrypted> = Exclude<MSI, T | ISwarmMessageInstanceEncrypted> &
    Exclude<Exclude<MSI, T>, ISwarmMessageInstanceEncrypted>,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI> = TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MSI, GAC> | undefined = undefined,
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
  SMS extends ISwarmMessageStore<
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
    ACO,
    O
  > = ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>,
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
  SMDMCF extends ISwarmMessagesDatabaseMessagesCollectorFabric<
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
    ACO,
    O,
    SMS,
    MD,
    SMSM
  > = ISwarmMessagesDatabaseMessagesCollectorFabric<
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
    ACO,
    O,
    SMS,
    MD,
    SMSM
  >,
  OPT extends ISwarmMessagesDatabaseConnectOptions<
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
    ACO,
    O,
    SMS,
    MD,
    SMSM,
    DCO,
    DCCRT,
    SMDMCF
  > = ISwarmMessagesDatabaseConnectOptions<
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
    ACO,
    O,
    SMS,
    MD,
    SMSM,
    DCO,
    DCCRT,
    SMDMCF
  >
>(
  options: OPT
): Promise<
  TConnectToSwarmMessagesDatabaseReturnType<
    P,
    T,
    DbType,
    DBO,
    MSI,
    MCF,
    MD,
    GAC,
    ACO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    O,
    SMS,
    SMSM,
    DCO,
    DCCRT,
    SMDMCF
  >
> => {
  const db = new SwarmMessagesDatabase<
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
    ACO,
    O,
    SMS,
    MD,
    SMSM,
    DCO,
    DCCRT,
    SMDMCF,
    OPT
  >();

  await db.connect(options);
  return db;
};
