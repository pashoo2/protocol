import assert from 'assert';
import { ISwarmMessageInstance } from '../../swarm-message-constructor.types';
import {
  ISwarmMessageRaw,
  ISwarmMessage,
  TSwarmMessageSeriazlized,
} from '../../swarm-message-constructor.types';
import {
  ISwarmMessageSubclassParserOptions,
  ISwarmMessageSubclassParser,
} from './swarm-message-subclass-parser.types';

export class SwarmMessageSubclassParser implements ISwarmMessageSubclassParser {
  protected constructorOptions?: ISwarmMessageSubclassParserOptions;

  protected get options(): ISwarmMessageSubclassParserOptions {
    if (!this.options) {
      throw new Error('The options is not defined for the instance');
    }
    return this.options;
  }

  constructor(options: ISwarmMessageSubclassParserOptions) {
    this.setOptions(options);
  }

  /**
   * parses the message serialized to a
   * deserizlized message object
   *
   * @memberof SwarmMessageSubclassParser
   */
  public parse = async (
    message: TSwarmMessageSeriazlized
  ): Promise<ISwarmMessageInstance> => {
    const messageRaw = await this.parseMessageToRaw(message);
    const messageParsed = this.parseMessageRaw(messageRaw);

    return this.getSwarmMessageInstance(messageParsed, message);
  };

  protected validateOptions(options: ISwarmMessageSubclassParserOptions): void {
    assert(options, 'Options must be provided');
    assert(
      typeof options === 'object',
      'The options provided must be an object'
    );

    const { utils, validator } = options;

    assert(utils, 'Utils must be provided');
    assert(typeof utils === 'object', 'Utils must be an object');
    assert(
      typeof utils.messageBodyRawParser === 'function',
      'messageBodyRawParser utility must be a function'
    );
    assert(
      typeof utils.messageParser === 'function',
      'messageParser utility must be a function'
    );
    assert(validator, 'Validator is not provided');
    assert(
      typeof validator.valiadateSwarmMessageRaw === 'function',
      'Validator incorrectly implements the interface, cause the valiadateSwarmMessageRaw method is absent'
    );
    assert(
      typeof validator.valiadateSwarmMessage === 'function',
      'Validator incorrectly implements the interface, cause the valiadateSwarmMessage method is absent'
    );
  }

  protected setOptions(options: ISwarmMessageSubclassParserOptions): void {
    this.validateOptions(options);
    this.constructorOptions = options;
  }

  /**
   * parses the messgae to the raw message format
   * and validates it.
   *
   * @protected
   * @param {TSwarmMessageSeriazlized} mesage
   * @returns {ISwarmMessageRaw}
   * @memberof SwarmMessageSubclassParser
   * @throws
   */
  protected async parseMessageToRaw(
    mesage: TSwarmMessageSeriazlized
  ): Promise<ISwarmMessageRaw> {
    const { utils, validator } = this.options;
    const { messageParser } = utils;
    const messageRaw = messageParser(mesage);

    await validator.valiadateSwarmMessageRaw(messageRaw);
    return messageRaw;
  }

  /**
   * parses a swarm message form the raw format
   * and validates it.
   *
   * @protected
   * @param {ISwarmMessageRaw} messageRaw
   * @returns {ISwarmMessage}
   * @memberof SwarmMessageSubclassParser
   * @throws
   */
  protected parseMessageRaw(messageRaw: ISwarmMessageRaw): ISwarmMessage {
    const { utils, validator } = this.options;
    const { messageBodyRawParser } = utils;
    const { bdy: bodyRaw } = messageRaw;
    const bodyRawParsed = messageBodyRawParser(bodyRaw);
    const swarmMessage: ISwarmMessage = {
      ...messageRaw,
      bdy: bodyRawParsed,
    };

    validator.valiadateSwarmMessage(swarmMessage);
    return swarmMessage;
  }

  protected getSwarmMessageInstance(
    msg: ISwarmMessage,
    msgSerizlized: TSwarmMessageSeriazlized
  ): ISwarmMessageInstance {
    return {
      ...msg,
      toString: function(a: TSwarmMessageSeriazlized) {
        return a;
      }.bind(undefined, msgSerizlized),
    };
  }
}
