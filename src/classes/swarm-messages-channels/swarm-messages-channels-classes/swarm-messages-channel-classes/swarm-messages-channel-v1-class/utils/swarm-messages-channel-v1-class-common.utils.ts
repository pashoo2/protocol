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
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmMessageStore } from '../../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../../../../swarm-messages-database/swarm-messages-database.messages-collector.types';
import { ISwarmMessagesChannelConstructorOptions } from '../../../../types/swarm-messages-channel-instance.types';
import { ISwarmMessagesChannelV1ClassChannelsListHandlerConstructorOptions } from '../types/swarm-messages-channel-v1-class-channels-list-handler.types';
import { SWARM_MESSAGES_CHANNEL_ENCRYPION } from '../../../../const/swarm-messages-channels-main.const';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import {
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseConnectOptions,
} from '../../../../../swarm-messages-database/swarm-messages-database.types';

export function getOptionsForChannelsListHandlerByContstructorOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined,
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
    MD | T,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>,
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
    PO,
    CO,
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
  swarmMessagesChannelconstructorOptions: ISwarmMessagesChannelConstructorOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
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
): ISwarmMessagesChannelV1ClassChannelsListHandlerConstructorOptions<P, T, DbType, DBO, MD> {
  const {
    currentUserId,
    swarmMessagesChannelsListInstance,
    swarmMessagesChannelDescription,
  } = swarmMessagesChannelconstructorOptions;

  return {
    currentUserId,
    chanelsListInstance: swarmMessagesChannelsListInstance,
    channelDescription: swarmMessagesChannelDescription,
  };
}

/**
 * Returns a code to use it as the swarm messages "issuer" property's part
 * by swarm channel encryption type.
 *
 * @export
 * @param {SWARM_MESSAGES_CHANNEL_ENCRYPION} channelEncryptionType
 * @returns {string}
 */
export function getSwarmMessagesIssuerCodeBySwarmMessagesChannelEncryptionType(
  channelEncryptionType: SWARM_MESSAGES_CHANNEL_ENCRYPION
): string {
  switch (channelEncryptionType) {
    case SWARM_MESSAGES_CHANNEL_ENCRYPION.PASSWORD:
      return 'pwd';
    case SWARM_MESSAGES_CHANNEL_ENCRYPION.PRIVATE:
      return 'pri';
    case SWARM_MESSAGES_CHANNEL_ENCRYPION.PUBLIC:
      return 'pub';
    default:
      throw new Error(`An unknown swarm messages channel encryption type: ${channelEncryptionType}`);
  }
}

/**
 * Returns a code to use as a part of a swarm messages issuer string
 * by swarm messages databse type.
 *
 * @export
 * @template P
 * @param {TSwarmStoreDatabaseType<P>} channelDatabaseType
 * @returns {string}
 */
export function getSwarmMessagesIssuerCodeBySwarmMessagesChannelDatabaseType<P extends ESwarmStoreConnector>(
  channelDatabaseType: TSwarmStoreDatabaseType<P>
): string {
  switch (channelDatabaseType) {
    case ESwarmStoreConnectorOrbitDbDatabaseType.FEED:
      return 'fd';
    case ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE:
      return 'kv';
    default:
      throw new Error(`An unknown swarm messages channel database type: ${channelDatabaseType}`);
  }
}
