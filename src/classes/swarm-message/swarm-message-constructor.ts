import assert from 'assert';
import { extend, getDateNowInSeconds } from 'utils';

import {
  SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_SERIALIZER,
  SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_UTILS,
} from './swarm-message-constructor.const';
import {
  ISwarmMessageConstructor,
  ISwarmMessageConstructorOptionsRequired,
  TSwarmMessageInstance,
  TSwarmMessageConstructorArgumentBody,
  TSwarmMessageConstructorOptions,
  TSwarmMessageSerialized,
} from './swarm-message-constructor.types';
import { SwarmMessageSubclassParser } from './swarm-message-subclasses/swarm-message-subclass-parser/swarm-message-subclass-parser';
import {
  ISwarmMessageSubclassParser,
  ISwarmMessageSubclassParserOptions,
} from './swarm-message-subclasses/swarm-message-subclass-parser/swarm-message-subclass-parser.types';
import { SwarmMessageSerializer } from './swarm-message-subclasses/swarm-message-subclass-serializer/swarm-message-subclass-serializer';
import {
  ISwarmMessageSerializer,
  ISwarmMessageSerializerConstructorOptions,
} from './swarm-message-subclasses/swarm-message-subclass-serializer/swarm-message-subclass-serializer.types';
import { SwarmMessageSubclassValidator } from './swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator';
import { SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_VALIDATION } from './swarm-message-constructor.const';
import { ICentralAuthority } from '../central-authority-class/central-authority-class.types';
import { TSwarmMessageConstructorArgumentBodyPrivate } from './swarm-message-constructor.types';
import { ISwarmMessageEncryptedCache } from '../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import {
  IMessageValidatorOptions,
  ISwarmMessageSubclassValidator,
} from './swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator.types';

export class SwarmMessageConstructor implements ISwarmMessageConstructor {
  public caConnection?: ICentralAuthority;

  public encryptedCache?: ISwarmMessageEncryptedCache;

  protected constructorOptions?: ISwarmMessageConstructorOptionsRequired;

  protected validator?: ISwarmMessageSubclassValidator;

  protected serializer?: ISwarmMessageSerializer;

  protected parser?: ISwarmMessageSubclassParser;

  /**
   * return full object with options
   *
   * @readonly
   * @protected
   * @type {ISwarmMessageConstructorOptions}
   * @memberof SwarmMessageConstructor
   * @throws
   */
  protected get options(): ISwarmMessageConstructorOptionsRequired {
    if (!this.constructorOptions) {
      throw new Error('Options are not defined');
    }
    return this.constructorOptions;
  }

  /**
   * options for swarm message parser constructor
   *
   * @readonly
   * @protected
   * @type {ISwarmMessageSubclassParserOptions}
   * @memberof SwarmMessageConstructor
   * @throws
   */
  protected get optionsForSwarmMessageParser(): ISwarmMessageSubclassParserOptions {
    const { options, validator } = this;

    if (!validator) {
      throw new Error('A swarm message validator instance is not running');
    }
    return {
      validator,
      utils: options.utils,
      encryptedCache: this.encryptedCache,
    };
  }

  /**
   * options for swarm message serializer constructor
   *
   * @readonly
   * @protected
   * @type {ISwarmMessageSerializerConstructorOptions}
   * @memberof SwarmMessageConstructor
   * @throws
   */
  protected get optionsForSwarmMessageSerizlizer(): ISwarmMessageSerializerConstructorOptions {
    const { options, validator } = this;

    if (!validator) {
      throw new Error('A swarm message validator instance is not running');
    }
    return {
      ...SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_SERIALIZER,
      caConnection: options.caConnection,
      utils: options.utils,
      messageValidator: validator,
    };
  }

  /**
   * options for swarm message validator constructor
   *
   * @readonly
   * @protected
   * @type {IMessageValidatorOptions}
   * @memberof SwarmMessageConstructor
   * @throws
   */
  protected get optionsForSwarmMessageValidator(): IMessageValidatorOptions {
    const { options } = this;

    return options.validation;
  }

  constructor(options: TSwarmMessageConstructorOptions) {
    this.setOptions(options);
  }

  /** */
  public construct = async <T extends TSwarmMessageConstructorArgumentBody | TSwarmMessageSerialized>(
    message: T
  ): Promise<TSwarmMessageInstance> => {
    assert(message, 'Message must not be empty');
    if (typeof message === 'string') {
      return await this.parse(message);
    } else if (typeof message === 'object') {
      return await this.serialize(message as TSwarmMessageConstructorArgumentBody | TSwarmMessageConstructorArgumentBodyPrivate);
    }
    throw new Error('A message must be an object or a string');
  };

  /**
   * Validates shallow the options used by
   * all the inner subclasses.
   *
   * @protected
   * @param {ISwarmMessageConstructorOptions} options
   * @memberof SwarmMessageConstructor
   * @throws
   */
  protected validateOptions(options: TSwarmMessageConstructorOptions) {
    assert(options, 'An options must be defined');
    assert(typeof options === 'object', 'The options must be an object');

    const { utils, caConnection, instances, validation } = options;

    assert(caConnection, 'There is no connection to the central authority provided');
    assert(typeof caConnection === 'object', 'Connection to the central authority must be an object');
    assert(caConnection.isRunning === true, 'Connection to the central authority must be already running');
    assert(
      typeof caConnection.getUserIdentity === 'function',
      'Connection to the central authority incorrectly implements the interface, cause there is no method to get the current user identity'
    );
    if (utils) {
      assert(typeof utils === 'object', 'The utils must be an object');
    }
    if (validation) {
      assert(typeof validation === 'object', 'The validation options must be an object');
      if (validation.formatValidatorOpts) {
        assert(typeof validation.formatValidatorOpts === 'object', 'The formatValidatorOpts options must be an object');
      }
      if (validation.signatureValidationOpts) {
        assert(typeof validation.signatureValidationOpts === 'object', 'The signatureValidationOpts options must be an object');
      }
    }

    let warnAboutNoCryptoCache = true;

    if (instances) {
      assert(typeof instances === 'object', 'The instances must be an object');
      if (instances.parser) {
        assert(typeof instances.parser === 'object', 'A parser instance must be an object');
      }
      if (instances.serizlizer) {
        assert(typeof instances.serizlizer === 'object', 'A serizlizer instance must be an object');
      }
      if (instances.validator) {
        assert(typeof instances.validator === 'object', 'A validator instance must be an object');
      }
      if (instances.encryptedCache) {
        assert(typeof instances.encryptedCache === 'object', 'Encrypted cache storage must be an object');
        assert(
          typeof instances.encryptedCache.connect === 'function' &&
            typeof instances.encryptedCache.add === 'function' &&
            typeof instances.encryptedCache.get === 'function',
          'Encrypted cache storage have a wrong implementation'
        );
        this.encryptedCache = instances.encryptedCache;
        warnAboutNoCryptoCache = false;
      }
    }
    if (warnAboutNoCryptoCache) {
      console.warn('The encrypted cache must be provided to support private messages as decrypted');
    }
  }

  /**
   * extends the options provided by the defaults
   *
   * @protected
   * @param {TSwarmMessageConstructorOptions} options
   * @returns {ISwarmMessageConstructorOptionsRequired}
   * @memberof SwarmMessageConstructor
   */
  protected extendOptionsByDefaults(options: TSwarmMessageConstructorOptions): ISwarmMessageConstructorOptionsRequired {
    return {
      ...options,
      validation: extend(options.validation || {}, {
        ...SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_VALIDATION,
        signatureValidationOpts: {
          ...SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_VALIDATION.signatureValidationOpts,
          caConnection: options.caConnection,
        },
      }),
      utils: extend(options.utils || {}, SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_UTILS),
    };
  }

  /**
   * runs a validator of swarm messges
   *
   * @protected
   * @memberof SwarmMessageConstructor
   * @throws
   */
  protected runSwarmMessageValidator() {
    const { options } = this;
    const { instances } = options;

    this.validator =
      instances && instances.validator
        ? instances.validator
        : new SwarmMessageSubclassValidator(this.optionsForSwarmMessageValidator);
  }

  /**
   * runs a parser of swarm messges
   *
   * @protected
   * @memberof SwarmMessageConstructor
   * @throws
   */
  protected async runSwarmMessageParser() {
    const { options } = this;
    const { instances } = options;
    const userRncryptionKeyPair = this.caConnection?.getUserEncryptionKeyPair();

    if (!userRncryptionKeyPair) {
      throw new Error("Failed to get user's crypto key pair");
    }
    if (userRncryptionKeyPair instanceof Error) {
      throw userRncryptionKeyPair;
    }

    this.parser =
      instances && instances.parser
        ? instances.parser
        : new SwarmMessageSubclassParser({
            ...this.optionsForSwarmMessageParser,
            decryptionKey: userRncryptionKeyPair.privateKey,
          });
  }

  /**
   * runs a parser of swarm messges
   *
   * @protected
   * @memberof SwarmMessageConstructor
   * @throws
   */
  protected runSwarmMessageSerizlizer() {
    const { options } = this;
    const { instances } = options;

    this.serializer =
      instances && instances.serizlizer
        ? instances.serizlizer
        : new SwarmMessageSerializer(this.optionsForSwarmMessageSerizlizer);
  }

  /**
   * set options for the instance
   *
   * @protected
   * @param {TSwarmMessageConstructorOptions} options
   * @memberof SwarmMessageConstructor
   */
  protected setOptions(options: TSwarmMessageConstructorOptions) {
    this.validateOptions(options);
    this.caConnection = options.caConnection;
    this.constructorOptions = this.extendOptionsByDefaults(options);
    // validator must runs at first cause
    // it used by another instances
    this.runSwarmMessageValidator();
    this.runSwarmMessageSerizlizer();
    void this.runSwarmMessageParser();
  }

  /**
   * add message to the cache if it's a private
   * message
   *
   * @protected
   * @param {TSwarmMessageInstance} msg
   * @memberof SwarmMessageConstructor
   */
  protected async addPrivateMessageToCache(msg: TSwarmMessageInstance) {
    if (msg.isPrivate) {
      await this.addPrivateMessageBodyToCache(msg.sig, msg.bdy as TSwarmMessageConstructorArgumentBodyPrivate);
    }
  }

  /**
   * parse a message serialized
   *
   * @protected
   * @param {string} msg
   * @memberof SwarmMessageConstructor
   * @throws
   */
  protected async parse(msg: TSwarmMessageSerialized): Promise<TSwarmMessageInstance> {
    if (!this.parser) {
      throw new Error('A swarm message parser instance is not defined');
    }

    const messageParsed = await this.parser.parse(msg);

    if (messageParsed instanceof Error) {
      return messageParsed;
    }
    await this.addPrivateMessageToCache(messageParsed);
    return messageParsed;
  }

  /**
   * parse a message serialized
   *
   * @protected
   * @param {string} msg
   * @memberof SwarmMessageConstructor
   * @throws
   */
  protected async serialize(
    msg: TSwarmMessageConstructorArgumentBody | TSwarmMessageConstructorArgumentBodyPrivate
  ): Promise<TSwarmMessageInstance> {
    if (!this.serializer) {
      throw new Error('A swarm message serializer instance is not defined');
    }

    const receiverId = (msg as TSwarmMessageConstructorArgumentBodyPrivate).receiverId;
    let cryptoKey: CryptoKey | undefined;

    if (receiverId) {
      if (!this.caConnection) {
        throw new Error('There is no connection with the CentralAuthority');
      }

      const receiverPubKey = await this.caConnection.getSwarmUserEncryptionPubKey(receiverId);

      if (receiverPubKey instanceof Error) {
        console.error("Failed to get the user's public key");
        throw receiverPubKey;
      }
      if (!receiverPubKey) {
        throw new Error('There is no public crypto key of the receiver');
      }
      cryptoKey = receiverPubKey;
    }

    const bodyWithTs = {
      ...msg,
      ts: getDateNowInSeconds(),
    };
    const swarmMessageSerialized = await this.serializer.serialize(bodyWithTs, cryptoKey);
    const { sig, isPrivate } = swarmMessageSerialized;

    if (isPrivate) {
      await this.addPrivateMessageBodyToCache(sig, bodyWithTs as TSwarmMessageConstructorArgumentBodyPrivate);
    }
    return swarmMessageSerialized;
  }

  /**
   * add private message body decrypted to the encrypted
   * cache to restore the body in the feature.
   *
   * @private
   * @memberof SwarmMessageConstructor
   */
  private async addPrivateMessageBodyToCache(sig: string, msgBody: TSwarmMessageConstructorArgumentBodyPrivate) {
    if (this.encryptedCache && this.encryptedCache.isRunning) {
      await this.encryptedCache.add(sig, JSON.stringify(msgBody));
    }
  }
}
