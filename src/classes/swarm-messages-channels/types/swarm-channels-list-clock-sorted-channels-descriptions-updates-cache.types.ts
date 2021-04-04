import { ISwarmMessageChannelDescriptionRaw } from './swarm-messages-channel-instance.types';
import { ESwarmStoreConnector } from '../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../swarm-store-class/swarm-store-class.types';
import { IChannelDescriptionBySwarmMessageFabric } from './swarm-messages-channels-utils.types';

/**
 * Channel description updates history.
 *
 * [Channel id]: Map<ChannelDescriptionAddClockTime, ChannelDescription>
 * ChannelDescriptionAddClockTime - when the channel description was added (channel description was updated) into the database,
 * ChannelDescription - a description of the channel
 *
 * @export
 * @interface ISwarmChannelsListClockSortedDatabaseMessagesCachedChannelDescriptionUpdateHistory
 * @extends {Map<number, ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>>}
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 */
export interface ISwarmChannelsListClockSortedDatabaseMessagesCachedChannelDescriptionUpdateHistory<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> extends Map<number, ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>> {}

/**
 * History of channels descriptions updates.
 *
 * @export
 * @interface ISwarmChannelsListClockSortedDatabaseMessagesCachedMap
 * @extends {Map<TSwarmStoreDatabaseEntityKey<P>, ISwarmChannelsListClockSortedDatabaseMessagesCachedChannelDescriptionUpdateHistory<P, T, DbType, DBO>>}
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 */
export interface ISwarmChannelsListClockSortedDatabaseMessagesCachedMap<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> extends Map<
    TSwarmStoreDatabaseEntityKey<P>,
    ISwarmChannelsListClockSortedDatabaseMessagesCachedChannelDescriptionUpdateHistory<P, T, DbType, DBO>
  > {}

/**
 * Parameters for channel descriptions updates cache.
 *
 * @export
 * @interface ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructorParams
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @template MD
 */
export interface ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructorParams<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MD extends ISwarmMessageInstanceDecrypted
> {
  getChannelDescriptionBySwarmMessage: IChannelDescriptionBySwarmMessageFabric<P, T, DbType, DBO, MD>;
}

/**
 * Implements cache of swarm channels updates.
 *
 * @export
 * @interface ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 */
export interface ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MD extends ISwarmMessageInstanceDecrypted
> {
  /**
   * Returns channel description, that was added to the
   * database before the passed clock time.
   *
   * @param {TSwarmStoreDatabaseEntityKey<P>} channelId - channel id
   * @param {number} clockTime - a clock time, for which is necessary to find the closest update, that happened before it.
   * @returns {(ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> | undefined)}
   * @memberof ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache
   */
  getChannelDescriptionUpdatePreviousByClockTimeOrUndefined(
    channelId: TSwarmStoreDatabaseEntityKey<P>,
    clockTime: number
  ): ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> | undefined;

  /**
   * Add a swarm message contains a channel description
   * to the history of the channel descriptions updates.
   *
   * @param {TSwarmStoreDatabaseEntityKey<P>} channelId - an identity of the channel.
   * @param {number} clockTime - clock time when the message was added to the channels list.
   * @param {MD} swarmMessage - a swarm message contains channel descriptions.
   * @memberof ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache
   */
  addSwarmMessageWithChannelDescriptionUpdate(
    channelId: TSwarmStoreDatabaseEntityKey<P>,
    clockTime: number,
    swarmMessage: MD
  ): Promise<void>;
}

export interface ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructor<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MD extends ISwarmMessageInstanceDecrypted
> {
  new (
    params: ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructorParams<P, T, DbType, DBO, MD>
  ): ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache<P, T, DbType, DBO, MD>;
}
