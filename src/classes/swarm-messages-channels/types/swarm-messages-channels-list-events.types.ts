import { ESwarmStoreConnector } from '../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessagesChannelId } from './swarm-messages-channel-instance.types';
import { TTypedEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import { ISwarmMessageChannelDescriptionRaw } from './swarm-messages-channel-instance.types';
import { TSwarmMessageSerialized } from '../../swarm-message/swarm-message-constructor.types';

/**
 * Notification events names emitted by a channels list
 * or a channel itself.
 *
 * @export
 * @enum {number}
 */
export enum ESwarmMessagesChannelsListEventName {
  /**
   * Swarm messages database related to the channels list has opened
   * so the channels list is ready to be used.
   */
  CHANNELS_LIST_READY = 'CHANNELS_LIST_READY',
  /**
   * Swarm messages database related to the channels list has closed.
   */
  CHANNELS_LIST_CLOSED = 'CHANNELS_LIST_CLOSED',
  /**
   * Channels list database is ready to be used.
   */
  CHANNELS_LIST_DATABASE_READY = 'CHANNELS_LIST_DATABASE_READY',
  /**
   * Channel description was updated or a new one has been added
   */
  CHANNEL_DESCRIPTION_UPDATE = 'CHANNEL_DESCRIPTION_UPDATE',
  /**
   * Channel description was removed from the list
   */
  CHANNEL_DESCRIPTION_REMOVED = 'CHANNEL_DESCRIPTION_REMOVED',
}

/**
 * Events which can be emitted by a channel list or by a channel itself.
 *
 * @export
 * @interface ISwarmMessagesChannelsListEvents
 * @template P
 * @template DbType
 */
export interface ISwarmMessagesChannelsListDatabaseEvents<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>
> {
  /**
   * Channels database connector is ready.
   *
   * @memberof ISwarmMessagesChannelsListDatabaseEvents
   */
  [ESwarmMessagesChannelsListEventName.CHANNELS_LIST_DATABASE_READY]: () => unknown;
  /**
   * Channel description has been updated
   *
   * @type {ISwarmMessageChannelDescriptionWithoutDatabaseOptionsRaw<P, DbType>} - new channel description
   * @memberof ISwarmMessagesChannelsListEvents
   */
  [ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_UPDATE]: (
    channelDescriptionUpdatadOrNew: ISwarmMessageChannelDescriptionRaw<P, T, DbType, TSwarmStoreDatabaseOptions<P, T, DbType>>
  ) => unknown;
  /**
   * Description of a channel has been removed from the channels list.
   *
   * @type {[string]} - identity of the channel
   * @memberof ISwarmMessagesChannelsListEvents
   */
  [ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_REMOVED]: (channelRemovedId: TSwarmMessagesChannelId) => unknown;
}

/**
 * Events which can be emitted by a channel list or by a channel itself.
 *
 * @export
 * @interface ISwarmMessagesChannelsListEvents
 * @template P
 * @template DbType
 */
export interface ISwarmMessagesChannelsListStatusEvents {
  /**
   * Swarm messages datatabase related to the channels list
   * has opened and the channels list is ready to be used.
   *
   * @type {void}
   * @memberof ISwarmMessagesChannelsListEvents
   */
  [ESwarmMessagesChannelsListEventName.CHANNELS_LIST_READY]: () => unknown;
  /**
   * Swarm messages database related to the channels list has closed, therefore
   * the channels list can not be used anymore.
   *
   * @type {void}
   * @memberof ISwarmMessagesChannelsListEvents
   */
  [ESwarmMessagesChannelsListEventName.CHANNELS_LIST_CLOSED]: () => unknown;
}

/**
 * Events which can be emitted by a channel list or by a channel itself.
 *
 * @export
 * @interface ISwarmMessagesChannelsListEvents
 * @template P
 * @template DbType
 */
export interface ISwarmMessagesChannelsListEvents<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>
> extends ISwarmMessagesChannelsListStatusEvents,
    ISwarmMessagesChannelsListDatabaseEvents<P, T, DbType> {}

/**
 * Event emitter notifies about a swarm messages channels list
 * status or updates of the channels existing within the list.
 *
 * @export
 * @interface ISwarmMessagesChannelsListEmitter
 * @extends {EventEmitter<ISwarmMessagesChannelsListEvents<P, DbType>>}
 * @template P
 * @template DbType
 */
export type ISwarmMessagesChannelsListNotificationEmitter<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>
> = TTypedEmitter<ISwarmMessagesChannelsListEvents<P, T, DbType>>;
