import {
  ISwarmChannelDescriptionFieldsBase,
  TSwarmChannelId,
} from '../../../../swarm-channel.types';
import { SwarmChannelType } from '../../../../swarm-channel.const';
import {
  TSwarmChannelConstructorOptions,
  TSwarmChannelPasswordHash,
} from '../../../../swarm-channel.types';
import {
  getPasswordHash,
  generatePasswordKey,
} from './../../utils/swarm-channel-pwd.utils/swarm-channel-pwd.utils';
import { OPTIONS_PWD_UTILS_DEFAULT } from './../../utils/swarm-channel-pwd.utils/swarm-channel-pwd.utils.const';
import { ISwarmChannelPwdUtilsOptions } from './../../utils/swarm-channel-pwd.utils/swarm-channel-pwd.utils.types';
import { SwarmChannelBaseOptionsValidator } from './../../subclasses/swarm-channel-validators/swarm-channel-base-validator/swarm-channel-base-validator';
import { ISwarmChannelBaseConstructorOptions } from '../../swarm-channel-base.types';
import {
  ISwarmChannelLocalMeta,
  ISwarmChannelSharedMeta,
} from '../../../../swarm-channel.types';
import assert from 'assert';
import {
  SWARM_CHANNEL_BASE_CHAMMEL_TYPE_DEFAULT,
  SWARM_CHANNEL_BASE_ID_DEFAULT,
} from './../../swarm-channel-base.const';

export class SwarmChannelOptionsFactory {
  /**
   * Options useful to construct a new channel or
   * open an existing one.
   *
   * @readonly
   * @type {(ISwarmChannelBaseConstructorOptions | undefined)}
   * @memberof SwarmChannelOptionsFactory
   */
  public get optionsSwarmChannelConstructor():
    | ISwarmChannelBaseConstructorOptions
    | undefined {
    return this._optionsSwarmChannelConstructor;
  }
  protected _optionsSwarmChannelConstructor?: ISwarmChannelBaseConstructorOptions;

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

  /**
   * Metadata about the channel which will be
   * stored locally.
   *
   * @protected
   * @type {ISwarmChannelLocalMeta}
   * @memberof SwarmChannelOptionsFactory
   */
  protected _localMeta?: ISwarmChannelLocalMeta;

  /**
   * Metadata about the channel which will be
   * shared across swarm users.
   *
   * @protected
   * @type {ISwarmChannelSharedMeta}
   * @memberof SwarmChannelOptionsFactory
   */
  protected _sharedMeta?: ISwarmChannelSharedMeta;

  protected _validator = new SwarmChannelBaseOptionsValidator();

  /**
   * Options for password utils.
   *
   * @readonly
   * @protected
   * @type {ISwarmChannelPwdUtilsOptions}
   * @memberof SwarmChannelOptionsFactory
   */
  protected get _pwdUtilsOptions(): ISwarmChannelPwdUtilsOptions {
    return OPTIONS_PWD_UTILS_DEFAULT;
  }

  /**
   * Handle and validate options and return
   * options in format useful for constructing a new
   * channel.
   *
   * @protected
   * @param {TSwarmChannelConstructorOptions} options
   * @returns {Promise<ISwarmChannelBaseConstructorOptions>}
   * @memberof SwarmChannelOptionsFactory
   */
  public async handleOptions(
    options: TSwarmChannelConstructorOptions
  ): Promise<ISwarmChannelBaseConstructorOptions> {
    if (options.length === 1) {
      // options for a new channel without encryption
      const [optionsNewChannel] = options;

      this._handleOptionsForNewChannelWithoutEncryption(optionsNewChannel);
    } else if (options.length === 2) {
      if (typeof options[0] === 'object') {
        // options for a new channel with encryption
        const [optionsNewChannel, password] = options;

        await this._handleOptionsForNewChannelWithEncryption(
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

      await this._handleOptionsForExistingChannelWithEncryption(
        channelId,
        channelType,
        password
      );
    } else {
      throw new Error('An unknown options provided for starting the channel');
    }

    const optionsForSwarmChannelConstructor = this._getOptionsSwarmChannelConstructor();

    this._setOptionsSwarmChannelConstructor(optionsForSwarmChannelConstructor);
    return optionsForSwarmChannelConstructor;
  }

  protected _setOptionsSwarmChannelConstructor(
    optionsSwarmChannelConstructor: ISwarmChannelBaseConstructorOptions
  ): void {
    this._optionsSwarmChannelConstructor = optionsSwarmChannelConstructor;
  }

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

  /**
   * Check whether the options are valid for starting a new
   * channel with it.
   *
   * @protected
   * @param {{
   *         channelId: TSwarmChannelId;
   *         channelType: SwarmChannelType;
   *     }} {
   *         channelId,
   *         channelType,
   *     }
   * @memberof SwarmChannelOptionsFactory
   */
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

  protected _validateLocalMeta(localMeta: ISwarmChannelLocalMeta): void {
    this._validator.checkLocalMeta(localMeta);
  }

  protected _validateSharedMeta(sharedMeta: ISwarmChannelSharedMeta): void {
    this._validator.checkSharedMeta(sharedMeta);
  }

  /**
   * Validate and set a local meta
   *
   * @protected
   * @param {ISwarmChannelDescriptionFieldsBase} [optionsNewChannel]
   * @memberof SwarmChannelOptionsFactory
   */
  protected _setChannelLocalMeta(
    optionsNewChannel: ISwarmChannelDescriptionFieldsBase
  ): void {
    this._validateLocalMeta(optionsNewChannel.localMeta);
    this._localMeta = optionsNewChannel?.localMeta;
  }

  protected _setChannelSharedMeta(
    optionsNewChannel: ISwarmChannelDescriptionFieldsBase
  ): void {
    this._validateSharedMeta(optionsNewChannel.sharedMeta);
    this._sharedMeta = optionsNewChannel.sharedMeta;
  }

  /**
   * Handle options for creating a new channel without additional
   * encryption of channel's messages.
   *
   * @protected
   * @param {Required<ISwarmChannelDescriptionFieldsBase>} options
   * @memberof SwarmChannelBase
   * @returns {void}
   */
  protected _handleOptionsForNewChannelWithoutEncryption(
    optionsNewChannel: Required<ISwarmChannelDescriptionFieldsBase>
  ): void {
    this._validateOptionsNewChannel(optionsNewChannel);
    this._setOptionsToCreateNewChannelWithoutPasswordEncryption(
      optionsNewChannel
    );
    this._setChannelLocalMeta(optionsNewChannel);
    this._setChannelSharedMeta(optionsNewChannel);
  }

  /**
   * Handle options for creating a new channel with messages encryption.
   *
   * @protected
   * @param {Required<ISwarmChannelDescriptionFieldsBase>} optionsNewChannel
   * @param {string} password
   * @memberof SwarmChannelBase
   * @returns {Promise<void>}
   * @throws
   */
  protected async _handleOptionsForNewChannelWithEncryption(
    optionsNewChannel: Required<ISwarmChannelDescriptionFieldsBase>,
    password: string
  ): Promise<void> {
    this._validateOptionsNewChannel(optionsNewChannel);
    this._validatePasswordForChannelEncryption(password);
    await this._setOptionsToCreateNewChannelWithPasswordEncryption(
      optionsNewChannel,
      password
    );
    this._setChannelLocalMeta(optionsNewChannel);
    this._setChannelSharedMeta(optionsNewChannel);
  }

  /**
   * Handle options for an existing channel without
   * messages additional encryption.
   *
   * @protected
   * @param {TSwarmChannelId} channelId
   * @param {SwarmChannelType} channelType
   * @memberof SwarmChannelBase
   * @returns {void}
   */
  protected _handleOptionsForExistingChannelNoEcryption(
    channelId: TSwarmChannelId,
    channelType: SwarmChannelType
  ): void {
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
   * @returns {Promise<void>}
   * @throws
   * @memberof SwarmChannelBase
   */
  protected _handleOptionsForExistingChannelWithEncryption(
    channelId: TSwarmChannelId,
    channelType: SwarmChannelType,
    password: string
  ): Promise<void> {
    this._validateOptionsForStartingAnExistingChannel({
      channelId,
      channelType,
    });
    this._validatePasswordForChannelEncryption(password);
    return this._setOptionsToStartAnExistingChannelWithPasswordEncryption(
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

  /**
   * Set a crypto key generated from a password
   * and which is used for a messages encryption
   * within the channel.
   *
   * @protected
   * @param {CryptoKey} pwdCryptoKey
   * @memberof SwarmChannelOptionsFactory
   */
  protected _setPasswordKey(pwdCryptoKey: CryptoKey): void {
    this._validator.checPasswordCryptoKey(pwdCryptoKey);
    this._passwordKey = pwdCryptoKey;
  }

  /**
   * Set a hash of the password provided for messages
   * encryptions withing the channel.
   *
   * @protected
   * @param {TSwarmChannelPasswordHash} pwdHash
   * @memberof SwarmChannelOptionsFactory
   */
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
   * @throws
   * @return {Promise<void>}
   */
  protected async _handlePasswordForMessagesEncryption(
    password: string
  ): Promise<void> {
    const [passwordKey, passwordHash] = await Promise.all([
      this._getPasswordKey(password),
      this._getPasswordHash(password),
    ]);

    this._setPasswordKey(passwordKey);
    this._setPasswordHash(passwordHash);
  }

  /**
   * Set options for creation a new swarm channel with or without
   * additional messages encryption by a password provided
   *
   * @protected
   * @param {Required<ISwarmChannelDescriptionFieldsBase>} options
   * @param {string} [password]
   * @memberof SwarmChannelBase
   * @returns {void}
   */
  protected _setOptionsToCreateNewChannel(
    options: Required<ISwarmChannelDescriptionFieldsBase>
  ): void {
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
   * @returns {void}
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
   * @returns {void}
   */
  protected _setOptionsToCreateNewChannelWithPasswordEncryption(
    options: Required<ISwarmChannelDescriptionFieldsBase>,
    password: string
  ): Promise<void> {
    this._setOptionsToCreateNewChannel(options);
    return this._handlePasswordForMessagesEncryption(password);
  }

  /**
   * Set options useful for creation of a new channel.
   *
   * @protected
   * @param {TSwarmChannelId} channelId
   * @param {SwarmChannelType} channelType
   * @memberof SwarmChannelOptionsFactory
   * @returns {void}
   */
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
   * @returns {void}
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
   * @returns {Promise<void>}
   * @throws
   */
  protected _setOptionsToStartAnExistingChannelWithPasswordEncryption(
    channelId: TSwarmChannelId,
    channelType: SwarmChannelType,
    password: string
  ): Promise<void> {
    this._setOptionsStartExistingChannel(channelId, channelType);
    return this._handlePasswordForMessagesEncryption(password);
  }

  protected _validateOptionsSwarmChannelConstructor() {
    assert(!!this._id, 'Failed to get the channel id');
    assert(!!this._type, 'Failed to get channel type');
    if (this._passwordHash) {
      assert(
        !!this._passwordKey,
        'Password hash is defined, but there is not password key'
      );
    }
    if (this._passwordKey) {
      assert(
        !!this._passwordHash,
        'Password key is defined, but there is no password hash'
      );
    }
    if (this._isNecessaryToCreateNewChannel) {
      assert(
        !!this._localMeta,
        'A local meta must be provided for a new channel'
      );
      assert(
        !!this._sharedMeta,
        'A shared meta must be provided for a new channel'
      );
    }
  }

  /**
   * Accumulate options which will be used for a swarm channel's
   * construction.
   *
   * @protected
   * @returns {ISwarmChannelBaseConstructorOptions}
   * @memberof SwarmChannelOptionsFactory
   */
  protected _getOptionsSwarmChannelConstructor(): ISwarmChannelBaseConstructorOptions {
    this._validateOptionsSwarmChannelConstructor();
    return {
      channelId: this._id,
      channelType: this._type,
      isNecessaryToCreateANewChannel: this._isNecessaryToCreateNewChannel,
      localMeta: this._localMeta,
      sharedMeta: this._sharedMeta,
      passwordHash: this._passwordHash,
      encryptionCryptoKey: this._passwordKey,
    };
  }
}
