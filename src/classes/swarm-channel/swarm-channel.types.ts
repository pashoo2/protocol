import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base';
import { TUesrIdentity } from '../../types/users.types';
import {
  SwarmChannelType,
  SwarmChannelStatus,
  SwarmChannelEvents,
} from './swarm-channel.const';
import {
  ISwarmMessageInstanceDecrypted,
  TSwarmMessageConstructorBodyMessage,
} from '../swarm-message/swarm-message-constructor.types';

export type TSwarmChannelId = string;

export type TSwarmChannelPassworCryptodKeyExported = string;

export type TSwarmChannelPasswordHash = string;

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
   * @type {TUesrIdentity[]}
   * @memberof ISwarmChannelLocalMeta
   */
  blacklist: TUesrIdentity[];
  /**
   * A crypto key exported in a string.
   *
   * @type {string}
   * @memberof ISwarmChannelLocalMeta
   */
  passworCryptodKeyExported?: TSwarmChannelPassworCryptodKeyExported;
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
  ownerId: TUesrIdentity;
  /**
   * Whether a public channel or not.
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
  participants: TUesrIdentity[];
  /**
   * Description of the channel.
   * May be JSON stringified
   * object.
   *
   * @type {string}
   */
  description: string;
  /**
   * If specified that all messages of the channel are
   * encrypted by a crypto key.
   * It must be calculated with a crypto hash
   * alhorithm.
   *
   * @type {boolean}
   * @memberof ISwarmChannelSharedMeta
   */
  passwordHash?: TSwarmChannelPasswordHash;
}

/**
 * A channel for messages sharing.
 *
 * @export
 * @interface ISwarmChannel
 */
export interface ISwarmChannelDescriptionFieldsMain {
  /**
   * A unique identity of the channel.
   *
   * @type {string}
   * @memberof ISwarmChannel
   */
  id: TSwarmChannelId;

  /**
   * Type of the channel
   *
   * @type {ChannelType}
   * @memberof ISwarmChannel
   */
  type: SwarmChannelType;
}

/**
 * A channel for messages sharing.
 *
 * @export
 * @interface ISwarmChannel
 */
export interface ISwarmChannelDescriptionFieldsBase
  extends ISwarmChannelDescriptionFieldsMain {
  /**
   * Meta information about the channel
   * which stored locally.
   *
   * @type {Partial<ISwarmChannelLocalMeta>}
   * @memberof ISwarmChannelDescriptionFieldsBase
   */
  localMeta: ISwarmChannelLocalMeta;
  /**
   * Meta information stored in the
   * in the swarm and shared between
   * all peers.
   *
   * @type {Partial<ISwarmChannelSharedMeta>}
   * @memberof ISwarmChannelDescriptionFieldsBase
   */
  sharedMeta: ISwarmChannelSharedMeta;
}

export type TSwarmChannelEvents<A = any> = { [key in SwarmChannelEvents]: A };

/**
 * Fields which are described
 * the current status of the messages channel
 *
 * @export
 * @interface ISwarmChannelStateFields
 * @template ET - events arguments types available
 * @template E - description of events types
 */
export interface ISwarmChannelStateFields<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ET = any,
  E extends TSwarmChannelEvents<ET> = TSwarmChannelEvents
> {
  /**
   * Messages stored in the channel.
   */
  messagesList: ISwarmMessageInstanceDecrypted[];
  status: SwarmChannelStatus;
  events: EventEmitter<E>;
  isEncrypted: boolean;
}

export interface ISwarmChannelMethodsBase {
  /**
   * Initialize channel.
   * If it a full metadata was provided for the constructor
   * then a new channel will be created locally and in the swarm.
   * A new local database will be created for storing a local metadata,
   * one swarm database will be created for storing a shared metadata,
   * and another will be created for storing channel's messages.
   *
   * If only id and type was provided then:
   * - in the case when no local metadata
   * found, then the channel will be initialized by
   * a swarn metadata (new databases(local, shared metadata and for messaging)
   * will be initialized);
   * - in the case when a local metada found, the
   * channel will be started normally(with no initialization
   * of a new databases, just the existing ones will be used).
   *
   * @returns {Promise<void>}
   * @memberof ISwarmChannelMethodsBase
   * @throws
   */
  initialize(): Promise<void>;
  /**
   * Update local's metadata about the channel
   *
   * @param {Partial<ISwarmChannelLocalMeta>} localMeta
   * @returns {Promise<void>}
   * @memberof ISwarmChannelBaseMethods
   */
  updateLocalMeta(localMeta: Partial<ISwarmChannelLocalMeta>): Promise<void>;
  /**
   * Update shared metadata of the channel.
   *
   * @param {Partial<ISwarmChannelSharedMeta>} sharedMeta
   * @returns {Promise<void>}
   * @memberof ISwarmChannelBaseMethods
   */
  updateSharedMeta(sharedMeta: Partial<ISwarmChannelSharedMeta>): Promise<void>;
  /**
   * Add a message to the channel.
   *
   * @param {TSwarmMessageConstructorBodyMessage} swarmMessage
   * @param {string} [key]
   * @returns {Promise<void>}
   * @memberof ISwarmChannelBaseMethods
   */
  addMessage(
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
  /**
   * Add a new participant for the channel.
   *
   * @param {TUesrIdentity} id
   * @returns {Promise<void>}
   * @memberof ISwarmChannelMethodsBase
   */
  addParticipant?(id: TUesrIdentity): Promise<void>;
  /**
   * Remove a participant from the list.
   *
   * @param {TUesrIdentity} id
   * @returns {Promise<void>}
   * @memberof ISwarmChannelMethodsBase
   */
  removeParticipant?(id: TUesrIdentity): Promise<void>;
  /**
   * Add new channel to the channel's list.
   * Specific for the channels list channel type.
   *
   * @param {string} channelName
   * @param {Partial<ISwarmChannelSharedMeta>} meta
   * @returns {Promise<void>}
   * @memberof ISwarmChannelMethodsBase
   */
  addNewChannel?(
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
  removeChannel?(channelId: string): Promise<void>;
}

/**
 * A channel which available to post messages into.
 *
 * @export
 * @interface ISwarmChannel
 * @extends {ISwarmChannelMethodsBase}
 * @extends {ISwarmChannelDescriptionFieldsBase}
 * @extends {ISwarmChannelStateFields}
 * @template ET - types available as arguments for events
 * @template E - description of messages and their arguments
 */
export interface ISwarmChannel<
  ET = any,
  E extends TSwarmChannelEvents<ET> = TSwarmChannelEvents
>
  extends ISwarmChannelMethodsBase,
    ISwarmChannelDescriptionFieldsBase,
    ISwarmChannelStateFields<ET, E> {
  /**
   * Create a new channel which wasn't initialized in the past and not exists in the swarm.
   * On ititialization it will create a new desctiptions in the swarm and locally.
   */
  new (
    description: Required<ISwarmChannelDescriptionFieldsBase>
  ): ISwarmChannel<ET, E>;
  /**
   * If a password is used for messages encryption within the channel.
   */
  new (
    description: Required<ISwarmChannelDescriptionFieldsBase>,
    password: string
  ): ISwarmChannel<ET, E>;
  /**
   * Create a channel which was initialized in the past and have
   * some metadata stored locally or in the swarm.
   * If there is no locally stored metada, metadata for the channel
   * will be read from the swarm.
   *
   * Password for the channel must be provided only when the user
   * open a channel or created a new one.
   */
  new (id: TSwarmChannelId, type: SwarmChannelType): ISwarmChannel<ET, E>;
  /**
   * Password for the channel must be provided only when the user
   * opens a channel which requered messages encryption for all messages
   * whithin the channel.
   * If the channel was opened before a crypto key for the password
   * will be stored locally and is not neccessary to be provided.
   */
  new (
    id: TSwarmChannelId,
    type: SwarmChannelType,
    password: string
  ): ISwarmChannel<ET, E>;
}
