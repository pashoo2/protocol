import { join } from 'path';
import { extend } from 'utils';

import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/swarm-store-class.const';
import {
  ISwarmMessageInstanceDecrypted,
  TSwarmMessageSerialized,
} from '../../../../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import {
  ISwarmMessageStore,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from '../../../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../../../../../swarm-messages-database/swarm-messages-database.messages-collector.types';
import { ISwarmMessagesChannelConstructorUtils } from '../../../../../types/swarm-messages-channel-instance.types';
import {
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseConnectOptions,
} from '../../../../../../swarm-messages-database/swarm-messages-database.types';
import {
  getSwarmMessagesIssuerCodeBySwarmMessagesChannelDatabaseType,
  getSwarmMessagesIssuerCodeBySwarmMessagesChannelEncryptionType,
} from '../swarm-messages-channel-v1-class-common.utils';
import { ISwarmMessagesChannelV1ConstructorOptionsDefaultUtilsDefaultConnectionUtils } from './types/swarm-messages-channel-v1-constructor-options-default-utils.types';
import { SWARM_MESSAGES_CHANNEL_V1_CONSTRUCTOR_OPTIONS_DEFAULT_UTILS_DEFAULT_CONNECTION_UTILS } from './const/swarm-messages-channel-v1-constructor-options-default-utils.const';

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
  options: Omit<OPT, 'dbOptions'>,
  defaultUtils?: Partial<
    ISwarmMessagesChannelV1ConstructorOptionsDefaultUtilsDefaultConnectionUtils<
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
    >
  >
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
  const {
    getSwarmMessagesDatabaseConnectorInstanceDefaultFabric,
    getSwarmMessageIssuerByChannelDescriptionUtilityDefault,
    getDatabaseNameByChannelDescriptionUtilityDefault,
  } = extend(defaultUtils || {}, SWARM_MESSAGES_CHANNEL_V1_CONSTRUCTOR_OPTIONS_DEFAULT_UTILS_DEFAULT_CONNECTION_UTILS);
  const swarmMessagesDatabaseConnectedByDatabaseOptionsDefaultFabric =
    getSwarmMessagesDatabaseConnectorInstanceDefaultFabric(options);
  const getSwarmMessagesChannelMessagesIssuerByChannelDescription = getSwarmMessageIssuerByChannelDescriptionUtilityDefault(
    getSwarmMessagesIssuerCodeBySwarmMessagesChannelEncryptionType,
    getSwarmMessagesIssuerCodeBySwarmMessagesChannelDatabaseType,
    join
  );
  const getSwarmMessagesChannelDatabaseNameByChannelDescription = getDatabaseNameByChannelDescriptionUtilityDefault(
    getSwarmMessagesChannelMessagesIssuerByChannelDescription,
    join
  );
  return {
    getDatabaseNameByChannelDescription: getSwarmMessagesChannelDatabaseNameByChannelDescription,
    getSwarmMessageIssuerByChannelDescription: getSwarmMessagesChannelMessagesIssuerByChannelDescription,
    swarmMessagesDatabaseConnectorInstanceByDBOFabric: swarmMessagesDatabaseConnectedByDatabaseOptionsDefaultFabric,
  };
}
