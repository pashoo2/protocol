import { ESwarmStoreConnector, TSwarmStoreDatabaseType } from '../../swarm-store-class';
import {
  ESwarmMessagesChannelsListEventName,
  ISwarmMessagesChannelsListEvents,
} from './swarm-messages-channels-list-events.types';
import {
  ISwarmMessageChannelDescriptionWithoutDatabaseOptionsRaw,
  TSwarmMessagesChannelId,
} from './swarm-messages-channel-instance.types';
import { TTypedEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base.types';

export enum ESwarmMessagesChannelEventName {
  /**
   * Channel instance has initialized and can be used.
   */
  CHANNEL_OPEN = 'CHANNEL_OPEN',
  /**
   * Channel instance has closed and cannot be used anymore.
   */
  CHANNEL_CLOSED = 'CHANNEL_CLOSED',
}

export interface ISwarmMessagesChannelEvents<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>>
  extends ISwarmMessagesChannelsListEvents<P, DbType> {
  /**
   * Channel and it's swarm messages database have been initialized
   * and operations can be performed with this channel instance.
   *
   * @memberof ISwarmMessagesChannelEvents
   */
  [ESwarmMessagesChannelEventName.CHANNEL_OPEN]: (channelId: TSwarmMessagesChannelId) => unknown;
  /**
   * Channel has been closed and cannot be used anymore to perform operations.
   *
   * @memberof ISwarmMessagesChannelEvents
   */
  [ESwarmMessagesChannelEventName.CHANNEL_CLOSED]: (channelId: TSwarmMessagesChannelId) => unknown;
  /**
   * Channel description has been updated
   *
   * @memberof ISwarmMessagesChannelEvents
   */
  [ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_UPDATE]: (
    channelDescription: ISwarmMessageChannelDescriptionWithoutDatabaseOptionsRaw<P, DbType>
  ) => unknown;
  /**
   * Description of a channel has been removed from the channels list.
   *
   * @memberof ISwarmMessagesChannelEvents
   */
  [ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_REMOVED]: (channelId: TSwarmMessagesChannelId) => unknown;
}

/**
 * Event emitter notifies about a swarm messages channel description updates.
 *
 * @export
 * @interface ISwarmMessagesChannelsListEmitter
 * @extends {EventEmitter<ISwarmMessagesChannelsListEvents<P, DbType>>}
 * @template P
 * @template DbType
 */
export type ISwarmMessagesChannelNotificationEmitter<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> = TTypedEmitter<ISwarmMessagesChannelEvents<P, DbType>>;
