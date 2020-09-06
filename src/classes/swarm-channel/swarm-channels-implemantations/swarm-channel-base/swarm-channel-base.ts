import {
  ISwarmChannel,
  TSwarmChannelEvents,
  ISwarmChannelDescriptionFieldsBase,
  TSwarmChannelId,
} from '../../swarm-channel.types';
import {
  SwarmChannelType,
  SwarmChannelEvents,
  SwarmChannelStatus,
} from '../../swarm-channel.const';
import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base';
import { StatusedClassHelper } from '../../../../utils/classes-helpers/statused-class-helper/statused-class-helper';
import {
  TSwarmChannelConstructorOptions,
  TSwarmChannelId,
  TSwarmChannelPasswordHash,
} from '../../swarm-channel.types';
import { SwarmChannelBaseOptionsValidator } from './subclasses/swarm-channel-base-validator/swarm-channel-base-validator';
import {
  getPasswordHash,
  generatePasswordKey,
} from './utils/swarm-channel-pwd.utils/swarm-channel-pwd.utils';
import { OPTIONS_PWD_UTILS_DEFAULT } from './utils/swarm-channel-pwd.utils/swarm-channel-pwd.utils.const';
import { ISwarmChannelPwdUtilsOptions } from './utils/swarm-channel-pwd.utils/swarm-channel-pwd.utils.types';
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
    return this._id;
  }

  public get type(): SwarmChannelType {
    return this._type;
  }
  protected _type: SwarmChannelType = SWARM_CHANNEL_BASE_CHAMMEL_TYPE_DEFAULT;

  protected _id: TSwarmChannelId = SWARM_CHANNEL_BASE_ID_DEFAULT;

  /**
   * Crypto key used for encryption and decryprion of all
   *  the channel's messages.
   *
   * @protected
   * @type {CryptoKey}
   * @memberof SwarmChannelBase
   */
  protected _passwordKey?: CryptoKey;
  /**
   * Hash of the password value
   *
   * @protected
   * @type {string}
   * @memberof SwarmChannelBase
   */
  protected _passwordHash?: string;

  /**
   * If true than a new channel must be created whithin initialization process,
   * according to the options provided in constructor.
   *
   * @protected
   * @type {boolean}
   * @memberof SwarmChannelBase
   */
  protected _isNecessaryToCreateNewChannel: boolean = false;
  protected _validator = new SwarmChannelBaseOptionsValidator();

  protected get _pwdUtilsOptions(): ISwarmChannelPwdUtilsOptions {
    return OPTIONS_PWD_UTILS_DEFAULT;
  }

  constructor(...options: TSwarmChannelConstructorOptions) {
    super({
      statusChangesEmitter: new EventEmitter<E>(),
      statusChangedEventName: SwarmChannelEvents.STATUS_CHANGED,
    });
    this._handleOptions(options);
  }

  public close = async () => {
    // release status emitter
    this.stopStatusEmitter();
  };

  /**
   * Validate options for creation of a new swarm channel
   *
   * @protected
   * @param {Required<ISwarmChannelDescriptionFieldsBase>} options
   * @memberof SwarmChannelBase
   */
  protected _validateOptionsNewChannel(
    options: Required<ISwarmChannelDescriptionFieldsBase>
  ): void {
    this._validator.checkChannelDecription(options);
  }

  /**
   * Validate a password string, used for messages enc_passwordHashryption
   * and decryption.
   *
   * @protected
   * @param {string} password
   * @memberof SwarmChannelBase
   */
  protected _validatePasswordForChannelEncryption(password: string): void {
    this._validator.checkPassword(password);
  }

  protected _validateOptionsForStartingAnExistingChannel({
    channelId,
    channelType,
  }: {
    channelId: TSwarmChannelId;
    channelType: SwarmChannelType;
  }): void {
    this._validator.checkId(channelId);
    this._validator.checkType(channelType);
  }

  protected _handleOptions(options: TSwarmChannelConstructorOptions): void {
    if (options.length === 1) {
      // options for a new channel without encryption
      const [optionsNewChannel] = options;

      this._handleOptionsForNewChannelWithoutEncryption(optionsNewChannel);
    } else if (options.length === 2) {
      if (typeof options[0] === 'object') {
        // options for a new channel with encryption
        const [optionsNewChannel, password] = options;

        this._handleOptionsForNewChannelWithEncryption(
          optionsNewChannel,
          password
        );
      } else {
        // options for an existing channel without encryption
        const [channelId, channelType] = options as [
          TSwarmChannelId,
          SwarmChannelType
        ];

        this._handleOptionsForExistingChannelNoEcryption(
          channelId,
          channelType
        );
      }
    } else if (options.length === 3) {
      // options for an existing channel with encryption
      const [channelId, channelType, password] = options;

      this._handleOptionsForExistingChannelWithEncryption(
        channelId,
        channelType,
        password
      );
    } else {
      throw new Error('An unknown options provided for starting the channel');
    }
  }

  /**
   * Handle options for creating a new channel without additional
   * encryption of channel's messages.
   *
   * @protected
   * @param {Required<ISwarmChannelDescriptionFieldsBase>} options
   * @memberof SwarmChannelBase
   */
  protected _handleOptionsForNewChannelWithoutEncryption(
    optionsNewChannel: Required<ISwarmChannelDescriptionFieldsBase>
  ): void {
    this._validateOptionsNewChannel(optionsNewChannel);
    this._setOptionsToCreateNewChannelWithoutPasswordEncryption(
      optionsNewChannel
    );
  }

  /**
   * Handle options for creating a new channel with messages encryption.
   *
   * @protected
   * @param {Required<ISwarmChannelDescriptionFieldsBase>} optionsNewChannel
   * @param {string} password
   * @memberof SwarmChannelBase
   */
  protected _handleOptionsForNewChannelWithEncryption(
    optionsNewChannel: Required<ISwarmChannelDescriptionFieldsBase>,
    password: string
  ) {
    this._validateOptionsNewChannel(optionsNewChannel);
    this._validatePasswordForChannelEncryption(password);
    this._setOptionsToCreateNewChannelWithoutPasswordEncryption(
      optionsNewChannel
    );
  }

  /**
   * Handle options for an existing channel without
   * messages additional encryption.
   *
   * @protected
   * @param {TSwarmChannelId} channelId
   * @param {SwarmChannelType} channelType
   * @memberof SwarmChannelBase
   */
  protected _handleOptionsForExistingChannelNoEcryption(
    channelId: TSwarmChannelId,
    channelType: SwarmChannelType
  ) {
    this._validateOptionsForStartingAnExistingChannel({
      channelId,
      channelType,
    });
    this._setOptionsToStartAnExistingChannelWithoutPasswordEncryption(
      channelId,
      channelType
    );
  }

  /**
   * Options for an existing channel with encryption
   *
   * @protected
   * @param {TSwarmChannelId} channelId
   * @param {SwarmChannelType} channelType
   * @param {string} password
   * @memberof SwarmChannelBase
   */
  protected _handleOptionsForExistingChannelWithEncryption(
    channelId: TSwarmChannelId,
    channelType: SwarmChannelType,
    password: string
  ) {
    this._validateOptionsForStartingAnExistingChannel({
      channelId,
      channelType,
    });
    this._validatePasswordForChannelEncryption(password);
    this._setOptionsToStartAnExistingChannelWithPasswordEncryption(
      channelId,
      channelType,
      password
    );
  }

  protected _getPasswordHash(
    password: string
  ): Promise<TSwarmChannelPasswordHash> {
    return getPasswordHash(
      this._id,
      this._type,
      password,
      this._pwdUtilsOptions
    );
  }

  protected _getPasswordKey(password: string): Promise<CryptoKey> {
    return generatePasswordKey(
      this._id,
      this._type,
      password,
      this._pwdUtilsOptions
    );
  }

  protected _setPasswordKey(pwdCryptoKey: CryptoKey): void {
    this._validator.checPasswordCryptoKey(pwdCryptoKey);
    this._passwordKey = pwdCryptoKey;
  }

  protected _setPasswordHash(pwdHash: TSwarmChannelPasswordHash): void {
    this._validator.checkPasswordHash(pwdHash);
    this._passwordHash = pwdHash;
  }

  /**
   * Handle a password used for channel's messages
   * encryption.
   *
   * @protected
   * @param {string} password
   * @memberof SwarmChannelBase
   */
  protected async _handlePasswordForMessagesEncryption(
    password: string
  ): Promise<void> {
    this.setStatus(SwarmChannelStatus.STARTING);
    try {
      const [passwordKey, passwordHash] = await Promise.all([
        this._getPasswordKey(password),
        this._getPasswordHash(password),
      ]);

      this._setPasswordKey(passwordKey);
      this._setPasswordHash(passwordHash);
      this.setStatus(SwarmChannelStatus.STARTED);
    } catch (err) {
      console.error(
        new Error(`SwarmChannelBase::failed to handle password: ${err.message}`)
      );
      this.clearStatus();
    }
  }

  /**
   * Set options for creation a new swarm channel with or without
   * additional messages encryption by a password provided
   *
   * @protected
   * @param {Required<ISwarmChannelDescriptionFieldsBase>} options
   * @param {string} [password]
   * @memberof SwarmChannelBase
   */
  protected _setOptionsToCreateNewChannel(
    options: Required<ISwarmChannelDescriptionFieldsBase>
  ) {
    this._isNecessaryToCreateNewChannel = true;
    this._id = options.id;
    this._type = options.type;
  }

  /**
   * Set options which allows to create a new swarm channel
   * without messages additional encryption.
   *
   * @protected
   * @param {Required<ISwarmChannelDescriptionFieldsBase>} options
   * @memberof SwarmChannelBase
   */
  protected _setOptionsToCreateNewChannelWithoutPasswordEncryption(
    options: Required<ISwarmChannelDescriptionFieldsBase>
  ): void {
    this._setOptionsToCreateNewChannel(options);
  }

  /**
   * Set options which allows to create a new swarm channel
   * with messages additional encryption by a password.
   *
   * @protected
   * @param {Required<ISwarmChannelDescriptionFieldsBase>} options
   * @memberof SwarmChannelBase
   */
  protected _setOptionsToCreateNewChannelWithPasswordEncryption(
    options: Required<ISwarmChannelDescriptionFieldsBase>,
    password: string
  ): void {
    this._setOptionsToCreateNewChannel(options);
    this._handlePasswordForMessagesEncryption(password);
  }

  protected _setOptionsStartExistingChannel(
    channelId: TSwarmChannelId,
    channelType: SwarmChannelType
  ): void {
    this._isNecessaryToCreateNewChannel = false;
    this._id = channelId;
    this._type = channelType;
  }

  /**
   * Set options for starting an existing channel without
   * an additional messages encryption.
   *
   * @protected
   * @param {TSwarmChannelId} channelId
   * @param {SwarmChannelType} channelType
   * @memberof SwarmChannelBase
   */
  protected _setOptionsToStartAnExistingChannelWithoutPasswordEncryption(
    channelId: TSwarmChannelId,
    channelType: SwarmChannelType
  ): void {
    this._setOptionsStartExistingChannel(channelId, channelType);
  }

  /**
   * Set options for starting an existing channel's with the
   * given id and type. Every message will be encrypted by
   * the password.
   *
   * @protected
   * @param {TSwarmChannelId} channelId
   * @param {SwarmChannelType} channelType
   * @param {string} password
   * @memberof SwarmChannelBase
   */
  protected _setOptionsToStartAnExistingChannelWithPasswordEncryption(
    channelId: TSwarmChannelId,
    channelType: SwarmChannelType,
    password: string
  ): void {
    this._setOptionsStartExistingChannel(channelId, channelType);
    this._handlePasswordForMessagesEncryption(password);
  }
}
