import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base';

import { ESwarmStoreConnector } from '../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType } from '../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageChannelDescriptionWithoutDatabaseOptionsRaw,
  TSwarmMessagesChannelId,
} from './swarm-messages-channel.types';

/**
 * Notification events names emitted by a channels list
 * or a channel itself.
 *
 * @export
 * @enum {number}
 */
export enum ESwarmMessagesChannelsListEventName {
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
export interface ISwarmMessagesChannelsListEvents<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>> {
  /**
   * Channel description has been updated
   *
   * @type {ISwarmMessageChannelDescriptionWithoutDatabaseOptionsRaw<P, DbType>} - new channel description
   * @memberof ISwarmMessagesChannelsListEvents
   */
  [ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_UPDATE]: [
    ISwarmMessageChannelDescriptionWithoutDatabaseOptionsRaw<P, DbType>
  ];
  /**
   * Description of a channel has been removed from the channels list.
   *
   * @type {[string]} - identity of the channel
   * @memberof ISwarmMessagesChannelsListEvents
   */
  [ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_REMOVED]: [TSwarmMessagesChannelId, number];
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
export interface ISwarmMessagesChannelNotificationEmitter<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> extends EventEmitter<ISwarmMessagesChannelsListEvents<P, DbType>> {}
