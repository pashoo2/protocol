import assert from 'assert';

import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base';
import { StatusedClassHelper } from 'utils/classes-helpers/statused-class-helper/statused-class-helper';

import {
  ISwarmChannel,
  TSwarmChannelEvents,
  TSwarmChannelId,
} from '../../swarm-channel.types';
import {
  SwarmChannelType,
  SwarmChannelEvents,
  SwarmChannelStatus,
} from '../../swarm-channel.const';
import {
  TSwarmChannelConstructorOptions,
  ISwarmChannelInitializationOptions,
} from '../../swarm-channel.types';
import {
  ISwarmChannelBaseConstructorOptions,
  ISwarmChannelBaseUsedInstances,
} from './swarm-channel-base.types';
import { SwarmChannelOptionsFactory } from './utils/swarm-channel-options-factory/swarm-channel-options-factory';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import {
  SWARM_CHANNEL_BASE_CHAMMEL_TYPE_DEFAULT,
  SWARM_CHANNEL_BASE_ID_DEFAULT,
} from './swarm-channel-base.const';

/**
 * Implemented SwarmChannel
 *
 * @export
 * @class SwarmChannelBase
 * @implements {ISwarmChannel<ET>}
 * @implements {*}
 * @implements {E}
 * @extends {TSwarmChannelEvents<ET>}
 * @extends {TSwarmChannelEvents}
 */
export class SwarmChannelBase<
  ET = any,
  E extends TSwarmChannelEvents<ET> = TSwarmChannelEvents,
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB
>
  extends StatusedClassHelper<
    SwarmChannelEvents.STATUS_CHANGED,
    SwarmChannelStatus
  >
  implements ISwarmChannel<ET, E> {
  public get events() {
    if (!this.__emitterExternal) {
      throw new Error('Event emitter was not set');
    }
    return this.__emitterExternal;
  }

  public get id(): TSwarmChannelId {
    return (
      this._optionsChannelConstructor?.channelId ||
      SWARM_CHANNEL_BASE_ID_DEFAULT
    );
  }

  public get type(): SwarmChannelType {
    return (
      this._optionsChannelConstructor?.channelType ||
      SWARM_CHANNEL_BASE_CHAMMEL_TYPE_DEFAULT
    );
  }

  /**
   * Instances used during the channel's life
   * cycle.
   *
   * @protected
   * @type {ISwarmChannelBaseUsedInstances<P>}import assert from 'assert';
   * @memberof SwarmChannelBase
   */
  protected _instancesUsed?: ISwarmChannelBaseUsedInstances<P>;

  /**
   * Classes used for the channel initialization.
   *
   * @protected
   * @memberof SwarmChannelBase
   */
  protected _swarmChannelInitializers = {};

  /**
   * Optionns which will be used during
   * the channel's initialization or
   * creation of a new channel.
   *
   * @protected
   * @type {ISwarmChannelBaseConstructorOptions}
   * @memberof SwarmChannelBase
   */
  protected _optionsChannelConstructor?: ISwarmChannelBaseConstructorOptions;

  constructor(...options: TSwarmChannelConstructorOptions) {
    super({
      statusChangesEmitter: new EventEmitter<E>(),
      statusChangedEventName: SwarmChannelEvents.STATUS_CHANGED,
    });
    this._handleOptions(options);
  }

  public initialize = async (
    initOptions: ISwarmChannelInitializationOptions<P>
  ): Promise<void> => {
    this._validateInitialOptions(initOptions);
    this._setInitialOptions(initOptions);
  };

  public close = async () => {
    // release status emitter
    this.stopStatusEmitter();
  };

  /**
   * Set options used by the channel's constructor
   * later.
   *
   * @protected
   * @param {ISwarmChannelBaseConstructorOptions} options
   * @memberof SwarmChannelBase
   */
  protected _setChannelInitializerOptions(
    options: ISwarmChannelBaseConstructorOptions
  ): void {
    this._optionsChannelConstructor = options;
  }

  /**
   * Handle options incoming.
   *
   * @protected
   * @param {TSwarmChannelConstructorOptions} options
   * @returns {Promise<void>}
   * @memberof SwarmChannelBase
   */
  protected async _handleOptions(
    options: TSwarmChannelConstructorOptions
  ): Promise<void> {
    this.setStatus(SwarmChannelStatus.STARTING);
    try {
      const factoryChannelInitializerOptions = new SwarmChannelOptionsFactory();
      const channelInitializerOptions = await factoryChannelInitializerOptions.handleOptions(
        options
      );

      this._setChannelInitializerOptions(channelInitializerOptions);
      this.setStatus(SwarmChannelStatus.STARTED);
    } catch (err) {
      console.error(
        new Error(`Failed to get options for channel's constructor`)
      );
      this.clearStatus();
    }
  }

  protected _validateInitialOptions(
    initOptions: ISwarmChannelInitializationOptions<P>
  ): void {
    assert(
      !!initOptions.messageConstructor,
      'An instance implemented the swarm messages constructor interface must be provided'
    );
    assert(
      !!initOptions.swarmMessageStoreConnector,
      'An instance implemented the secret storage interface must be provided'
    );
    assert(
      !!initOptions.swarmMessageStoreConnector,
      'An instance implemented swarm store connector must be provided'
    );
  }

  protected _setInstances(
    initOptions: ISwarmChannelInitializationOptions<P>
  ): void {
    this._instancesUsed = {
      messageConstructor: initOptions.messageConstructor,
      secretStorage: initOptions.secretStorage,
      swarmMessageStoreConnector: initOptions.swarmMessageStoreConnector,
    };
  }

  protected _setInitialOptions(
    initOptions: ISwarmChannelInitializationOptions<P>
  ): void {
    this._setInstances(initOptions);
  }
}
