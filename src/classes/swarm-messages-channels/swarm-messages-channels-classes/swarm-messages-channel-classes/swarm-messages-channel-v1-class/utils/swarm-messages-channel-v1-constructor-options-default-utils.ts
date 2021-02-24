import { join } from 'path';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreConnectorBasic,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreConnector,
  ISwarmStoreOptionsConnectorFabric,
} from '../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  ISwarmMessageStore,
} from '../../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../../../../swarm-messages-database/swarm-messages-database.messages-collector.types';
import { ISwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions } from '../../../../../swarm-messages-database/swarm-messages-database-fabrics/types/swarm-messages-database-instance-fabric-by-database-options.types';
import { getSwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions } from '../../../../../swarm-messages-database/swarm-messages-database-fabrics/swarm-messages-database-instance-fabric-by-database-options/swarm-messages-database-instance-fabric-by-database-options';
import {
  ISwarmMessageChannelDescriptionRaw,
  ISwarmMessagesChannelDatabaseNameGeneratorByChannelDescription,
} from '../../../../types/swarm-messages-channel-instance.types';
import {
  ISwarmMessagesChannelConstructorUtils,
  ISwarmMessagesChannelMessageIssuerByChannelDescription,
} from '../../../../types/swarm-messages-channel-instance.types';
import {
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseConnectOptions,
} from '../../../../../swarm-messages-database/swarm-messages-database.types';
import { SWARM_MESSAGES_CHANNEL_ENCRYPION } from '../../../../const/swarm-messages-channels-main.const';
import {
  getSwarmMessagesIssuerCodeBySwarmMessagesChannelEncryptionType,
  getSwarmMessagesIssuerCodeBySwarmMessagesChannelDatabaseType,
} from './swarm-messages-channel-v1-class-common.utils';

/**
 * Return default swarm messages database fabric
 * for swarm messages channel v1
 *
 * @export
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @template ConnectorBasic
 * @template CO
 * @template PO
 * @template ConnectorMain
 * @template CFO
 * @template GAC
 * @template MCF
 * @template ACO
 * @template O
 * @template SMS
 * @template MD
 * @template SMSM
 * @template DCO
 * @template DCCRT
 * @template OPT
 * @param {Omit<OPT, 'dbOptions'>} options
 * @returns {ISwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions<
 *   P,
 *   T,
 *   DbType,
 *   DBO,
 *   ConnectorBasic,
 *   CO,
 *   PO,
 *   ConnectorMain,
 *   CFO,
 *   GAC,
 *   MCF,
 *   ACO,
 *   O,
 *   SMS,
 *   MD,
 *   SMSM,
 *   DCO,
 *   DCCRT,
 *   OPT
 * >}
 */
export function getSwarmMessagesDatabaseConnectorInstanceDefaultFabric<
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
    OPT
  >(options);
}

/**
 * This is fabric of a default utility that provided
 * swarm messages issuer.
 *
 * @export
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @returns {ISwarmMessagesChannelMessageIssuerByChannelDescription<P, T, DbType, DBO>}
 */
export function getSwarmMessageIssuerByChannelDescriptionUtilityDefault<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
>(
  getSwarmMessagesIssuerCodeBySwarmMessagesChannelEncryptionType: (encryption: SWARM_MESSAGES_CHANNEL_ENCRYPION) => string,
  getSwarmMessagesIssuerCodeBySwarmMessagesChannelDatabaseType: (dbType: DbType) => string,
  joinParts: (...paths: string[]) => string
): ISwarmMessagesChannelMessageIssuerByChannelDescription<P, T, DbType, DBO> {
  function getSwarmMessageIssuerByChannelDescription(
    channelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>
  ): string {
    const { id, version, dbType, messageEncryption } = channelDescription;
    const encryptionTypeCode = getSwarmMessagesIssuerCodeBySwarmMessagesChannelEncryptionType(messageEncryption);
    const databaseTypeCode = getSwarmMessagesIssuerCodeBySwarmMessagesChannelDatabaseType(dbType);
    return joinParts('ch', id, version, databaseTypeCode, encryptionTypeCode);
  }
  return getSwarmMessageIssuerByChannelDescription;
}

/**
 * Returns database name by swarm messages channel description.
 *
 * @export
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @param {ISwarmMessagesChannelMessageIssuerByChannelDescription<P, T, DbType, DBO>} getSwarmMessagesIssuerByChannelDescription
 * @returns {ISwarmMessagesChannelDatabaseNameGeneratorByChannelDescription<P, T, DbType, DBO>}
 */
export function getDatabaseNameByChannelDescriptionUtilityDefault<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
>(
  getSwarmMessagesIssuerByChannelDescription: ISwarmMessagesChannelMessageIssuerByChannelDescription<P, T, DbType, DBO>,
  joinParts: (...paths: string[]) => string
): ISwarmMessagesChannelDatabaseNameGeneratorByChannelDescription<P, T, DbType, DBO> {
  return function getDatabaseNameByChannelDescription(
    channelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>
  ): string {
    const swarmMessagesIssuer = getSwarmMessagesIssuerByChannelDescription(channelDescription);
    return joinParts('db', swarmMessagesIssuer);
  };
}

/**
 * Returns utilities to use as utilities as a swarm messages constructor options
 * part.
 *
 * @export
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @template ConnectorBasic
 * @template CO
 * @template PO
 * @template ConnectorMain
 * @template CFO
 * @template GAC
 * @template MCF
 * @template ACO
 * @template O
 * @template SMS
 * @template MD
 * @template SMSM
 * @template DCO
 * @template DCCRT
 * @template OPT
 * @param {Omit<OPT, 'dbOptions'>} options
 * @returns {ISwarmMessagesChannelConstructorUtils<
 *   P,
 *   T,
 *   DbType,
 *   DBO,
 *   ConnectorBasic,
 *   CO,
 *   PO,
 *   ConnectorMain,
 *   CFO,
 *   GAC,
 *   MCF,
 *   ACO,
 *   O,
 *   SMS,
 *   MD,
 *   SMSM,
 *   DCO,
 *   DCCRT,
 *   OPT
 * >}
 */
export function getSwarmMessagesChannelV1DefaultConstructorOptionsUtils<
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
): ISwarmMessagesChannelConstructorUtils<
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
  const swarmMessagesDatabaseConnectedByDatabaseOptionsDefaultFabric = getSwarmMessagesDatabaseConnectorInstanceDefaultFabric<
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
  >(options);
  const getSwarmMessagesChannelMessagesIssuerByChannelDescription = getSwarmMessageIssuerByChannelDescriptionUtilityDefault<
    P,
    T,
    DbType,
    DBO
  >(
    getSwarmMessagesIssuerCodeBySwarmMessagesChannelEncryptionType,
    getSwarmMessagesIssuerCodeBySwarmMessagesChannelDatabaseType,
    join
  );
  const getSwarmMessagesChannelDatabaseNameByChannelDescription = getDatabaseNameByChannelDescriptionUtilityDefault<
    P,
    T,
    DbType,
    DBO
  >(getSwarmMessagesChannelMessagesIssuerByChannelDescription, join);
  return {
    getDatabaseNameByChannelDescription: getSwarmMessagesChannelDatabaseNameByChannelDescription,
    getSwarmMessageIssuerByChannelDescription: getSwarmMessagesChannelMessagesIssuerByChannelDescription,
    swarmMessagesDatabaseConnectorInstanceByDBOFabric: swarmMessagesDatabaseConnectedByDatabaseOptionsDefaultFabric,
  };
}
