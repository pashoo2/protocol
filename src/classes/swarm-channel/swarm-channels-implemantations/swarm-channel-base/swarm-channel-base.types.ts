import {
  TSwarmChannelId,
  ISwarmChannelLocalMeta,
  ISwarmChannelSharedMeta,
} from '../../swarm-channel.types';
import { SwarmChannelType } from '../../swarm-channel.const';

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
