import {
  ISwarmChannel,
  TSwarmChannelEvents,
  ISwarmChannelDescriptionFieldsBase,
  TSwarmChannelId,
  TSwarmChannelPasswordKey,
} from '../../swarm-channel.types';
import { SwarmChannelType } from '../../swarm-channel.const';
import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base';
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
  E extends TSwarmChannelEvents<ET> = TSwarmChannelEvents
> implements ISwarmChannel<ET, E> {
  events = new EventEmitter<E>();
  id: TSwarmChannelId = SWARM_CHANNEL_BASE_ID_DEFAULT;
  type: SwarmChannelType = SWARM_CHANNEL_BASE_CHAMMEL_TYPE_DEFAULT;
  /**
   * Crypto key used for encryption and decryprion of all
   *  the channel's messages.
   *
   * @protected
   * @type {CryptoKey}
   * @memberof SwarmChannelBase
   */
  protected passwordKey?: CryptoKey;

  /**
   * If true than a new channel must be created whithin initialization process,
   * according to the options provided in constructor.
   *
   * @protected
   * @type {boolean}
   * @memberof SwarmChannelBase
   */
  protected _isNecessaryToCreateNewChannel: boolean = false;
  constructor(
    ...options:
      | [Required<ISwarmChannelDescriptionFieldsBase>]
      | [TSwarmChannelId, SwarmChannelType]
      | [TSwarmChannelId, SwarmChannelType, TSwarmChannelPasswordKey]
  ) {
    if (options.length === 1) {
      this._setOptionsToCreateNewChannel(options[0]);
    } else {
      const [id, type, pwdKey] = options;

      this._setOptionsToInitializeExisting(id, type, pwdKey);
    }
  }

  protected _setOptionsToInitializeExisting(
    id: TSwarmChannelId,
    type: SwarmChannelType,
    pwdKey?: TSwarmChannelPasswordKey
  ) {
    this.id = id;
    this.type = type;
    // TODO - calculate password hash and compare it with a password hash from shared meta
    this.passwordKey = pwdKey;
  }

  protected validateOptions(
    options: Required<ISwarmChannelDescriptionFieldsBase>
  ) {}

  protected _setOptionsToCreateNewChannel(
    options: Required<ISwarmChannelDescriptionFieldsBase>
  ) {
    this._isNecessaryToCreateNewChannel = true;
    this.id = options.id;
    this.type = options.type;
  }
}
