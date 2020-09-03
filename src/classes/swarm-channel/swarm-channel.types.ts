import {
  SwarmChannelType,
  SwarmChannelStatus,
  SwarmChannelEvents,
} from './swarm-channel.const';
import {
  ISwarmMessageInstanceDecrypted,
  TSwarmMessageConstructorBodyMessage,
} from '../swarm-message/swarm-message-constructor.types';
import TypedEventEmitter from '../basic-classes/event-emitter-class-base/event-emitter-class-base.types';

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
  name: string;
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
  ownerId: string;
  /**
   * List of the user's identities
   * who are participate in the thread.
   *
   * @type {string[]}
   * @memberof ISwarmChannel
   */
  participants: string[];
  /**
   * Is anyone can put messages.
   *
   * @type {boolean}
   */
  isPublic: boolean;
  /**
   * Exported crypto key for encryption
   * and decryption channel's messages.
   *
   * @type {string}
   */
  passwordKey: string;
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
  ownerId: string;
  /**
   * Whether a public channel
   * or not.
   *
   * @type {boolean}
   */
  isPublic: boolean;
  /**
   * Participants of the channel.
   * Should be empty if it's a public
   * channel.
   *
   * @type {string[]}
   */
  participants: string[];
  /**
   * Description of the channel.
   * May be JSON stringified
   * object.
   *
   * @type {string}
   */
  description: string;
}

/**
 * A channel for messages sharing.
 *
 * @export
 * @interface ISwarmChannel
 */
export interface ISwarmChannelDescriptionFieldsBase {
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
  localMeta?: Partial<ISwarmChannelLocalMeta>;
  /**
   * Meta information stored in the
   * in the swarm and shared between
   * all peers.
   */
  sharedMeta?: Partial<ISwarmChannelSharedMeta>;
}

export type TSwarmChannel<A> = { [key in SwarmChannelEvents]: A };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ISwarmChannelFields<
  A = any,
  E extends TSwarmChannel<A> = TSwarmChannel<A>
> {
  /**
   * Messages stored in the channel.
   */
  messagesList: ISwarmMessageInstanceDecrypted[];
  status: SwarmChannelStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: TypedEventEmitter<E>;
}

export interface ISwarmChannelMethodsBase {
  /**
   * Update local's metadata about the channel
   *
   * @param {Partial<ISwarmChannelLocalMeta>} localMeta
   * @returns {Promise<void>}
   * @memberof ISwarmChannelBaseMethods
   */
  updateLocalMeta?(localMeta: Partial<ISwarmChannelLocalMeta>): Promise<void>;
  /**
   * Update shared metadata of the channel.
   *
   * @param {Partial<ISwarmChannelSharedMeta>} sharedMeta
   * @returns {Promise<void>}
   * @memberof ISwarmChannelBaseMethods
   */
  updateSharedMeta?(
    sharedMeta: Partial<ISwarmChannelSharedMeta>
  ): Promise<void>;
  /**
   * Add a new participant for the channel.
   *
   * @param {string} id
   * @returns {Promise<void>}
   * @memberof ISwarmChannelMethodsBase
   */
  addParticipant?(id: string): Promise<void>;
  /**
   * Remove a participant from the list.
   *
   * @param {string} id
   * @returns {Promise<void>}
   * @memberof ISwarmChannelMethodsBase
   */
  removeParticipant?(id: string): Promise<void>;
  /**
   * Add new channel to the channel's list.
   * Specific for the channels list channel type.
   *
   * @param {string} channelName
   * @param {Partial<ISwarmChannelSharedMeta>} meta
   * @returns {Promise<void>}
   * @memberof ISwarmChannelMethodsBase
   */
  addNewChannel(
    channelId: string,
    meta: Partial<ISwarmChannelSharedMeta>
  ): Promise<void>;
  /**
   * Remove channel from the list of a channels.
   * Specific for the channels list channel type.
   *
   * @param {string} channelId
   * @returns {Promise<void>}
   * @memberof ISwarmChannelMethodsBase
   */
  removeChannel(channelId: string): Promise<void>;
  /**
   * Add a message to the channel.
   *
   * @param {TSwarmMessageConstructorBodyMessage} swarmMessage
   * @param {string} [key]
   * @returns {Promise<void>}
   * @memberof ISwarmChannelBaseMethods
   */
  addMessage?(
    swarmMessage: TSwarmMessageConstructorBodyMessage,
    key?: string
  ): Promise<void>;
  /**
   * Close the channel and stop listening all of it's
   * events.
   *
   * @returns {Promise<void>}
   * @memberof ISwarmChannelBaseMethods
   */
  close(): Promise<void>;
}
