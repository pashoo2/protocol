import { SwarmChannelType } from './swarm-channel.const';
import { ISwarmMessageInstanceDecrypted } from '../swarm-message/swarm-message-constructor.types';

/**
 * TODO - create a local list of
 * a channels with some common
 * meta information, such as
 * created date and a last message's
 * date time.
 */

/**
 * A metadata inforamtion about the
 * channel stored locally.
 *
 * @export
 * @interface ISwarmChannelLocalMeta
 */
export interface ISwarmChannelLocalMeta {
  /**
   * A full name of the channel.
   *
   * @type {string}
   * @memberof ISwarmChannel
   */
  name?: string;
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
}

/**
 * Information about the channel shared with
 * others.
 *
 * @export
 * @interface ISwarmChannelSharedMeta
 */
export interface ISwarmChannelSharedMeta {
  /**
   * Channel's name
   *
   * @type {string}
   */
  name: string;
  /**
   * Id of the owner's
   * user.
   *
   * @type {string}
   */
  ownerId?: string;
  /**
   * Whether a public channel
   * or not.
   *
   * @type {boolean}
   */
  isPublic?: boolean;
  /**
   * Participants of the channel.
   * Should be empty if it's a public
   * channel.
   *
   * @type {string[]}
   */
  participants?: string[];
  /**
   * Description of the channel.
   * May be JSON stringified
   * object.
   *
   * @type {string}
   */
  description?: string;
}

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
  localMeta?: ISwarmChannelLocalMeta;
  /**
   * Meta information stored in the
   * in the swarm and shared between
   * all peers.
   */
  sharedMeta?: ISwarmChannelSharedMeta;
  /**
   * Messages stored in the channel.
   */
  messagesList: ISwarmMessageInstanceDecrypted[];
}
