import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  TSwarmMessageConstructorBodyMessage,
} from '../../../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmMessageChannelDescriptionRaw,
  ISwarmMessagesChannelsDescriptionsListDescription,
} from '../../../../types/swarm-messages-channel.types';
import { TSwarmStoreDatabaseOptions } from '../../../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';

/**
 * Return database key equals to the channel identity.
 *
 * @export
 * @template P
 * @template T
 * @param {Readonly<ISwarmMessageChannelDescriptionRaw<P, T, any, any>>} channelDescription
 * @returns {Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss']}
 */
export function getDatabaseKeyForChannelDescription<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized>(
  channelDescription: Readonly<ISwarmMessageChannelDescriptionRaw<P, T, any, any>>
): Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss'] {
  return channelDescription.id;
}

/**
 * Returns type as a version and the channels list db swarm connection type.
 * Type can change from one version to another or a connection type.
 * Message can be handled differently depending on the connector type and
 * version of the channels list.
 *
 * @export
 * @template P
 * @template T
 * @template DBO
 * @param {Readonly<ISwarmMessagesChannelsDescriptionsListDescription<P, T, DBO>>} channelsListDescription
 * @returns {Pick<TSwarmMessageConstructorBodyMessage, 'typ'>['typ']}
 */
export function getSwarmMessageWithChannelDescriptionTypeByChannelListDescription<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>
>(
  channelsListDescription: Readonly<ISwarmMessagesChannelsDescriptionsListDescription<P, T, DBO>>
): Pick<TSwarmMessageConstructorBodyMessage, 'typ'>['typ'] {
  const { version, connectorType } = channelsListDescription;
  return `${connectorType}//${version}`;
}

/**
 * The issuer for a messages is
 * the channels list identifier.
 *
 * @export
 * @template P
 * @template T
 * @template DBO
 * @param {Readonly<ISwarmMessagesChannelsDescriptionsListDescription<P, T, DBO>>} channelsListDescription
 * @returns {Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss']}
 */
export function getSwarmMessageWithChannelDescriptionIssuerByChannelListDescription<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>
>(
  channelsListDescription: Readonly<ISwarmMessagesChannelsDescriptionsListDescription<P, T, DBO>>
): Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss'] {
  return channelsListDescription.id;
}
