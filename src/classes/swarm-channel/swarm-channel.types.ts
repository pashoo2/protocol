import { SwarmChannelType } from './swarm-channel.const';

/**
 * TODO - create a local list of
 * a channels with some common
 * meta information, such as
 * created date and a las message
 * date time.
 */

/**
 * A channel for messages sharing.
 *
 * @export
 * @interface ISwarmChannel
 */
export interface ISwarmChannel {
  /**
   * A unique identity of the channel.
   *
   * @type {string}
   * @memberof ISwarmChannel
   */
  id: string;

  /**
   * Type of the channel
   *
   * @type {ChannelType}
   * @memberof ISwarmChannel
   */
  type: SwarmChannelType;

  /**
   * Meta information about the channel
   * which stored locally.
   */
  localMeta?: {
    /**
     * Blacklist of users who can't to
     * put messages on the channel.
     *
     * @type {[]}
     */
    blacklist: [];
    /**
     * Admin user id, if exists.
     *
     * @type {string}
     */
    ownerId?: string;
    /**
     * A full name of the channel.
     *
     * @type {string}
     * @memberof ISwarmChannel
     */
    name?: string;

    /**
     * List of the user's identities
     * who are participate in the thread.
     *
     * @type {string[]}
     * @memberof ISwarmChannel
     */
    participants?: string[];
    /**
     * Is anyone can put messages.
     *
     * @type {boolean}
     */
    isPublic?: boolean;
    /**
     * Exported crypto key for encryption
     * and decryption channel's messages.
     *
     * @type {string}
     */
    passwordKey?: string;
  };
  /**
   * Meta information stored in the
   * in the swarm and shared between
   * all peers.
   */
  sharedMeta?: {
    // TODO
    name: string;
    ownerId: string;
    isPublic: boolean;
    participants: string[];
    // any description or a JSON
    description: string;
  };
  /**
   * Messages stored in the channel.
   */
  messagesList: [];
}
