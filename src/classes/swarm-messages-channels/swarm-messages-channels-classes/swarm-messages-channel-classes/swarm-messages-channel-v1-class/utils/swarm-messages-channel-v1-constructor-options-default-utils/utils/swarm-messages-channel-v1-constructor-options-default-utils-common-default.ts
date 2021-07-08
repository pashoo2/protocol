import {
  ESwarmStoreConnector,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../../../../../../swarm-store-class';
import { TSwarmMessageSerialized } from '../../../../../../../swarm-message';
import { SWARM_MESSAGES_CHANNEL_ENCRYPTION } from '../../../../../../const/swarm-messages-channels-main.const';
import {
  ISwarmMessageChannelDescriptionRaw,
  ISwarmMessagesChannelDatabaseNameGeneratorByChannelDescription,
  ISwarmMessagesChannelMessageIssuerByChannelDescription,
} from '../../../../../../types';

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
  getSwarmMessagesIssuerCodeBySwarmMessagesChannelEncryptionType: (encryption: SWARM_MESSAGES_CHANNEL_ENCRYPTION) => string,
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
