import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  TSwarmMessageConstructorBodyMessage,
} from '../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../../types/swarm-messages-channel.types';
import { ISwarmMessagesChannelsListDescription } from '../../../types/swarm-messages-channels-list.types';
import { TSwarmStoreDatabaseEntityKey } from '../../../../swarm-store-class/swarm-store-class.types';

/**
 * Return database key equals to the channel identity.
 *
 * @export
 * @template P
 * @template T
 * @param {Readonly<ISwarmMessageChannelDescriptionRaw<P, T, any, any>>} channelDescription
 * @returns {Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss']}
 */
export function getChannelsListDatabaseKeyForChannelDescription<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized
>(channelDescription: Readonly<ISwarmMessageChannelDescriptionRaw<P, T, any, any>>): TSwarmStoreDatabaseEntityKey<P> {
  return channelDescription.id as TSwarmStoreDatabaseEntityKey<P>;
}

/**
 * Returns type as a version and the channels list db swarm connection type.
 *
 * @export
 * @template P
 * @template T
 * @template DBO
 * @param {ISwarmMessagesChannelsListDescription} channelsListDescription
 * @returns {Pick<TSwarmMessageConstructorBodyMessage, 'typ'>['typ']}
 */
export function getSwarmMessageWithChannelDescriptionTypeByChannelListDescription(
  channelsListDescription: ISwarmMessagesChannelsListDescription
): Pick<TSwarmMessageConstructorBodyMessage, 'typ'>['typ'] {
  const { version } = channelsListDescription;
  return `${version}`;
}

/**
 * The issuer for a messages is
 * the channels list identifier.
 *
 * @export
 * @template P
 * @template T
 * @template DBO
 * @param {Readonly<ISwarmMessagesChannelsDescriptionsListConnectionOptions<P, T, DBO>>} channelsListDescription
 * @returns {Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss']}
 */
export function getSwarmMessageWithChannelDescriptionIssuerByChannelListDescription(
  channelsListDescription: Readonly<ISwarmMessagesChannelsListDescription>
): Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss'] {
  return channelsListDescription.id;
}

/**
 * Returns a database name for the swarm messages channels list
 *
 * @export
 * @param {Readonly<ISwarmMessagesChannelsListDescription>} channelsListDescription
 * @returns {string}
 */
export function getSwarmMessagesListDatbaseNameByChannelDescription(
  swarmMessagesListDescription: ISwarmMessagesChannelsListDescription
): string {
  return swarmMessagesListDescription.id;
}
