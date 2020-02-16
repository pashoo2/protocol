import assert from 'assert';
import { getDateNowInSeconds } from '../../utils/common-utils/common-utils-date-time-synced';
import { extend } from '../../utils/common-utils/common-utils-objects';
import {
  SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_SERIALIZER,
  SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_UTILS,
} from './swarm-message-constructor.const';
import {
  ISwarmMessageConstructor,
  ISwarmMessageConstructorOptionsRequired,
  ISwarmMessageInstance,
  TSwarmMessageConstructorArgumentBody,
  TSwarmMessageConstructorOptions,
  TSwarmMessageSeriazlized,
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
import {
  IMessageValidatorOptions,
  ISwarmMessageSubclassValidator,
} from './swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator.types';

export class SwarmMessageConstructor implements ISwarmMessageConstructor {
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
  public construct = <
    T extends TSwarmMessageConstructorArgumentBody | TSwarmMessageSeriazlized
  >(
    message: T
  ): Promise<ISwarmMessageInstance> => {
    assert(message, 'Message must not be empty');
    if (typeof message === 'string') {
      return this.parse(message);
    } else if (typeof message === 'object') {
      return this.serialize(message as TSwarmMessageConstructorArgumentBody);
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

    const { utils, caConnection, instances } = options;

    assert(
      caConnection,
      'There is no connection to the central authority provided'
    );
    assert(
      typeof caConnection === 'object',
      'Connection to the central authority must be an object'
    );
    assert(
      caConnection.isRunning === true,
      'Connection to the central authority must be already running'
    );
    assert(
      typeof caConnection.getUserIdentity === 'function',
      'Connection to the central authority incorrectly implements the interface, cause there is no method to get the current user identity'
    );
    if (utils) {
      assert(typeof utils === 'object', 'The utils must be an object');
    }
    if (instances) {
      assert(typeof instances === 'object', 'The instances must be an object');
      if (instances.parser) {
        assert(
          typeof instances.parser === 'object',
          'A parser instance must be an object'
        );
      }
      if (instances.serizlizer) {
        assert(
          typeof instances.serizlizer === 'object',
          'A serizlizer instance must be an object'
        );
      }
      if (instances.validator) {
        assert(
          typeof instances.validator === 'object',
          'A validator instance must be an object'
        );
      }
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
  protected extendOptionsByDefaults(
    options: TSwarmMessageConstructorOptions
  ): ISwarmMessageConstructorOptionsRequired {
    return {
      ...options,
      validation: extend(options.validation || {}, {
        ...SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_VALIDATION,
        signatureValidationOpts: {
          ...SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_VALIDATION.signatureValidationOpts,
          caConnection: options.caConnection,
        },
      }),
      utils: options.utils
        ? extend(
            options.utils,
            SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_UTILS
          )
        : { ...SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_UTILS },
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
        : new SwarmMessageSubclassValidator(
            this.optionsForSwarmMessageValidator
          );
  }

  /**
   * runs a parser of swarm messges
   *
   * @protected
   * @memberof SwarmMessageConstructor
   * @throws
   */
  protected runSwarmMessageParser() {
    const { options } = this;
    const { instances } = options;

    this.parser =
      instances && instances.parser
        ? instances.parser
        : new SwarmMessageSubclassParser(this.optionsForSwarmMessageParser);
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
    this.constructorOptions = this.extendOptionsByDefaults(options);
    // validator must runs at first cause
    // it used by another instances
    this.runSwarmMessageValidator();
    this.runSwarmMessageSerizlizer();
    this.runSwarmMessageParser();
  }

  /**
   * parse a message serialized
   *
   * @protected
   * @param {string} msg
   * @memberof SwarmMessageConstructor
   * @throws
   */
  protected parse(
    msg: TSwarmMessageSeriazlized
  ): Promise<ISwarmMessageInstance> {
    if (!this.parser) {
      throw new Error('A swarm message parser instance is not defined');
    }
    return this.parser.parse(msg);
  }

  /**
   * parse a message serialized
   *
   * @protected
   * @param {string} msg
   * @memberof SwarmMessageConstructor
   * @throws
   */
  protected serialize(
    msg: TSwarmMessageConstructorArgumentBody
  ): Promise<ISwarmMessageInstance> {
    if (!this.serializer) {
      throw new Error('A swarm message serializer instance is not defined');
    }

    return this.serializer.serialize({
      ...msg,
      ts: getDateNowInSeconds(),
    });
  }
}
