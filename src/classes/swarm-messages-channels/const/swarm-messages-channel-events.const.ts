import { ESwarmStoreEventNames, ESwarmMessageStoreEventNames, ESwarmMessagesDatabaseCacheEventsNames } from 'classes';
import { ESwarmMessagesChannelEventName } from 'classes/swarm-messages-channels/types/swarm-messages-channel-events.types';
// TODO - if import this from 'classes' it will cause that 'ESwarmMessagesChannelsListEventName' is undefined
import { ESwarmMessagesChannelsListEventName } from '../types/swarm-messages-channels-list-events.types';

export enum ESwarmMessagesChannelEventNames {
  // events related to the actual channel state updates
  CHANNEL_OPEN = ESwarmMessagesChannelEventName.CHANNEL_OPEN,
  CHANNEL_CLOSED = ESwarmMessagesChannelEventName.CHANNEL_CLOSED,
  // channels list that the channel list belongs to
  CHANNEL_DESCRIPTION_UPDATE = ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_UPDATE,
  CHANNEL_DESCRIPTION_REMOVED = ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_REMOVED,
  // messages store
  STORE_READY = ESwarmStoreEventNames.READY,
  STORE_CLOSE_DATABASE = ESwarmStoreEventNames.CLOSE_DATABASE,
  STORE_DROP_DATABASE = ESwarmStoreEventNames.DROP_DATABASE,

  // event related to the messages list
  // swarm database
  DB_UPDATE = ESwarmStoreEventNames.UPDATE,
  DB_LOADING = ESwarmStoreEventNames.DB_LOADING,
  // cached messages
  CACHE_UPDATING_STARTED = ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING_STARTED,
  CACHE_UPDATING_OVER = ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING_OVER,
  CACHE_UPDATED = ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED,
  // messages store
  STORE_NEW_MESSAGE = ESwarmMessageStoreEventNames.NEW_MESSAGE,
  STORE_NEW_MESSAGE_PARSE_ERROR = ESwarmMessageStoreEventNames.NEW_MESSAGE_ERROR,
  STORE_DELETE_MESSAGE = ESwarmMessageStoreEventNames.DELETE_MESSAGE,
}
