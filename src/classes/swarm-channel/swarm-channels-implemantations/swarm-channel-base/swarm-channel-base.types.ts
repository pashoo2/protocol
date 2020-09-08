import { ISecretStorage } from 'classes/secret-storage-class/secret-storage-class.types';
import { ISwarmMessageConstructor } from 'classes/swarm-message/swarm-message-constructor.types';
import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import {
  TSwarmChannelId,
  ISwarmChannelLocalMeta,
  ISwarmChannelSharedMeta,
} from '../../swarm-channel.types';
import { SwarmChannelType } from '../../swarm-channel.const';
import { ISwarmMessageStore } from '../../../swarm-message-store/swarm-message-store.types';

/**
 * Options which must be provided for initialization of
 * a swarm channel.
 *
 * @export
 * @interface ISwarmChannelBaseUsedInstances
 * @template P
 */
export interface ISwarmChannelBaseUsedInstances<
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB
> {
  /**
   * For messages construction
   *
   * @type {ISwarmMessageConstructor}
   * @memberof ISwarmChannelInitializationOptions
   */
  messageConstructor: ISwarmMessageConstructor;

  /**
   * For storing local metadata
   *
   * @type {ISecretStorage}
   * @memberof ISwarmChannelInitializationOptions
   */
  secretStorage: ISecretStorage;

  /**
   * Used for creation or opening an existing swarm's
   * databases for messaging and storing a shared meta.
   *
   * @type {ISwarmMessageStore<P>}
   * @memberof ISwarmChannelInitializationOptions
   */
  swarmMessageStoreConnector: ISwarmMessageStore<P>;
}

export interface ISwarmChannelBaseConstructorOptions {
  /**
   * id of a swarm channel
   *
   * @type {TSwarmChannelId}
   * @memberof ISwarmChannelBaseConstructorOptions
   */
  channelId: TSwarmChannelId;
  /**
   * swarm channel's type
   *
   * @type {SwarmChannelType}
   * @memberof ISwarmChannelBaseConstructorOptions
   */
  channelType: SwarmChannelType;
  /**
   * whether it's necessary to create a new
   * channel using this options.
   *
   * @type {boolean}
   * @memberof ISwarmChannelBaseConstructorOptions
   */
  isNecessaryToCreateANewChannel: boolean;
  /**
   * Crypto key will be used for channel's
   * messages encryption and decryption.
   *
   * @type {CryptoKey}
   * @memberof ISwarmChannelBaseConstructorOptions
   */
  encryptionCryptoKey?: CryptoKey;
  /**
   * Hash of the password.
   *
   * @type {string}
   * @memberof ISwarmChannelBaseConstructorOptions
   */
  passwordHash?: string;
  /**
   * Local metadata to set it in the local
   * database.
   *
   * @type {ISwarmChannelLocalMeta}
   * @memberof ISwarmChannelBaseConstructorOptions
   */
  localMeta?: ISwarmChannelLocalMeta;
  /**
   * Shared metadata about the channel, will be
   * shared with swarm users.
   *
   * @type {ISwarmChannelSharedMeta}
   * @memberof ISwarmChannelBaseConstructorOptions
   */
  sharedMeta?: ISwarmChannelSharedMeta;
}
