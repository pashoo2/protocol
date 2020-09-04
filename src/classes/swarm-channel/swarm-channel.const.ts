export enum SwarmChannelType {
  /**
   * Anyone can push messages on this
   * type of channels. And there is no
   * remote description for it.
   *
   * e.g. thread for a place on the map,
   * where all people can write some.
   */
  PUBSUB = 'PUBSUB',
  /**
   * Channel where users can announce a new channel
   * or change settings of an existing.
   * Must contain a meta shema and values for the
   * schema's fields to describe each channel in the list.
   * And can contain a list of blocked channels which
   * must be ignored in the feature.
   *
   *
   * e.g. list of a channels for some hash tag.
   */
  CHANNELS_LIST = 'CHANNELS_LIST',
  /**
   * Channel for messaging
   * between only two peers.
   */
  DIRECT = 'DIRECT',
  /**
   * Channel where only a one
   * person can put messages.
   *
   * e.g. peer can create
   * a channel where to
   * put information about itself.
   * Or some kind of blog.
   */
  OWNED = 'OWNED',
  /**
   * A channel for a group of peers, created and
   * managed by one person. The owner provided some
   * shared description with others. Must includes
   * a participants list, some  meta
   * information about the channel, kind - public
   * or private, if it's private a password must
   * provided to access any information about
   * the channel.
   *
   * e.g. can be a public channel for everyone.
   * Or private for a group of participants managed
   * by the owner.
   */
  MANAGED = 'MANAGED',
}

export enum SwarmChannelStatus {
  /**
   * the channel is initializing
   */
  INITIALIZING = 'INITIALIZING',
  /**
   * in process of closing the channel
   */
  CLOSING = 'CLOSING',
  /**
   * ready to do an operations
   */
  READY = 'READY',
  /**
   * waited for result of some async operation(s)
   */
  PENDING = 'PENDING',
}

export enum SwarmChannelEvents {
  /**
   * emitted on a new message.
   */
  MESSAGE = 'MESSAGE',
  /**
   * emitted each time a locally stored
   * description changed.
   */
  LOCAL_META_CHANGED = 'LOCAL_META_CHANGED',
  /**
   * emitted each time a shared metadata changed.
   */
  SHARED_META_CHANGED = 'SHARED_META_CHANGED',
  /**
   * a new participant added to the channel
   */
  PARTICIPANT_ADDED = 'PARTICIPANT_ADDED',
  /**
   * participant was removed from the participants
   * list.
   */
  PRTICIPANT_REMOVED = 'PRTICIPANT_REMOVED',
  /**
   * channel added to the list.
   * specific for the channels list channel type.
   */
  CHANNEL_ADDED = 'CHANNEL_ADDED',
  /**
   * channel added to the list.
   * specific for the channels list channel type.
   */
  CHANNEL_DESCRIPTION_CHANGED = 'CHANNEL_DESCRIPTION_CHANGED',
  /**
   * channel removed from the list.
   * specific for the channels list channel type.
   */
  CHANNEL_REMOVED = 'CHANNEL_REMOVED',
  /**
   * emitted each time when a status of the instance
   * changed.
   */
  STATUS_CHANGED = 'STATUS_CHANGED',
  ERROR = 'ERROR',
}

export const SWARM_CHANNEL_TYPES = new Set(Object.values(SwarmChannelType));
