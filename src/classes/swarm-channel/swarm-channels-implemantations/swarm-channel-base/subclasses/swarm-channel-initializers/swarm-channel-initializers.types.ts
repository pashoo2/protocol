import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { ISecretStorage } from 'classes/secret-storage-class/secret-storage-class.types';
import {
  ISwarmChannelBaseUsedInstances,
  ISwarmChannelBaseConstructorOptions,
} from '../../swarm-channel-base.types';
import { ISwarmMessageStore } from '../../../../../swarm-message-store/swarm-message-store.types';

export interface ISwarmChannelBaseInitializerOptions<
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB
> {
  instances: ISwarmChannelBaseUsedInstances<P>;
  channelOptions: ISwarmChannelBaseConstructorOptions;
}

/**
 * A result of a swarm channel's initialization.
 *
 * @export
 * @interface ISwarmChannelBaseInitializerResult
 * @template P
 */
export interface ISwarmChannelBaseInitializerResult<
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB
> {
  /**
   * Local database for storing meta information
   * about the channel locally.
   *
   * @type {ISecretStorage}
   * @memberof ISwarmChannelBaseInitializerResult
   */
  localMetaDb: ISecretStorage;

  /**
   * A database used for sharing messages
   * within the channel's memebers.
   *
   * @type {ISwarmMessageStore<P>}
   * @memberof ISwarmChannelBaseInitializerResult
   */
  messagesDb: ISwarmMessageStore<P>;

  /**
   * Swarm synced database used for storing
   * and sharing a metadata about the channel.
   *
   * @type {ISwarmMessageStore<P>}
   * @memberof ISwarmChannelBaseInitializerResult
   */
  sharedMetaDb?: ISwarmMessageStore<P>;
}

/**
 * Instance used for initializing a swarm channel.
 *
 * @export
 * @interface ISwarmChannelBaseInitializer
 * @template P
 */
export interface ISwarmChannelBaseInitializer<
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB
> {
  /**
   * Create and start a databases used for storing local and shared metadata,
   * messaging.
   *
   * @returns {Promise<ISwarmChannelBaseInitializerResult<P>>}
   * @memberof ISwarmChannelBaseInitializer
   */
  initialize(): Promise<ISwarmChannelBaseInitializerResult<P>>;
}

/**
 * Swarm message initializer constructor
 *
 * @export
 * @interface ISwarmChannelBaseInitializerConstructor
 * @template P
 */
export interface ISwarmChannelBaseInitializerConstructor<
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB
> {
  new (
    options: ISwarmChannelBaseInitializerOptions<P>
  ): ISwarmChannelBaseInitializer<P>;
}
