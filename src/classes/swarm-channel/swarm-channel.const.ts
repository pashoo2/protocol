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
