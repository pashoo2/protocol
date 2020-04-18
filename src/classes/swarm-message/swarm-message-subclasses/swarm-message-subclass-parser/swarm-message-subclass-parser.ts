import assert from 'assert';
import {
  ISwarmMessageInstance,
  TSwarmMessageBodyRaw,
  TSwarmMessageBodyRawEncrypted,
} from '../../swarm-message-constructor.types';
import { isCryptoKeyDataDecryption } from '../../../../utils/encryption-keys-utils/encryption-keys-utils';
import { QueuedEncryptionClassBase } from '../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base';
import { ISwarmMessgaeEncryptedCache } from '../../../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import {
  IQueuedEncrypyionClassBaseOptions,
  IQueuedEncrypyionClassBase,
} from '../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
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

  protected msgDecryptQueue?: IQueuedEncrypyionClassBase;

  protected encryptedCache?: ISwarmMessgaeEncryptedCache;

  protected get options(): ISwarmMessageSubclassParserOptions {
    if (!this.constructorOptions) {
      throw new Error('The options is not defined for the instance');
    }
    return this.constructorOptions;
  }

  /**
   * returns an options for messages signing
   * queue
   *
   * @readonly
   * @protected
   * @type {IQueuedEncrypyionClassBaseOptions}
   * @memberof SwarmMessageSerializer
   */
  protected get messageDecryptQueueOptions(): IQueuedEncrypyionClassBaseOptions {
    return {
      ...this.options.queueOptions,
      keys: {
        signKey: this.options.decryptionKey,
      },
    };
  }

  constructor(options: ISwarmMessageSubclassParserOptions) {
    this.setOptions(options);
    this.startMessageDecryptQueue();
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
    const messageParsed = await this.parseMessageRaw(messageRaw);

    return this.getSwarmMessageInstance(messageParsed, message);
  };

  protected validateOptions(options: ISwarmMessageSubclassParserOptions): void {
    assert(options, 'Options must be provided');
    assert(
      typeof options === 'object',
      'The options provided must be an object'
    );

    const { utils, validator, decryptionKey } = options;

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
    if (!decryptionKey) {
      console.warn(
        'There is no key for private messages decryption provided in options'
      );
    } else {
      assert(
        isCryptoKeyDataDecryption(decryptionKey),
        "The key provided can't be used for data decryption"
      );
    }
  }

  protected setOptions(options: ISwarmMessageSubclassParserOptions): void {
    this.validateOptions(options);
    this.constructorOptions = options;
    this.encryptedCache = options.encryptedCache;
  }

  protected startMessageDecryptQueue() {
    this.msgDecryptQueue = new QueuedEncryptionClassBase(
      this.messageDecryptQueueOptions
    );
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
  protected async parseMessageRaw(
    messageRaw: ISwarmMessageRaw
  ): Promise<ISwarmMessage> {
    const { utils, validator } = this.options;
    const { messageBodyRawParser } = utils;
    const { bdy: bodyRaw, isPrivate } = messageRaw;
    let bodyRawDecrypted;

    if (isPrivate) {
      const msgBody = await this.readMessgeBodyFromCache(messageRaw.sig);
      debugger;
      if (typeof msgBody === 'string') {
        // if the message's body decrypted found
        bodyRawDecrypted = msgBody;
      }
    }

    const bodyRawParsed = messageBodyRawParser(
      bodyRawDecrypted ||
        (!isPrivate ? await this.decryptMessageBodyRaw(bodyRaw) : bodyRaw)
    );
    const swarmMessage: ISwarmMessage = {
      ...messageRaw,
      bdy: bodyRawParsed,
    };

    validator.valiadateSwarmMessage(swarmMessage);
    return swarmMessage;
  }

  protected async decryptMessageBodyRaw(
    bodyRaw: TSwarmMessageBodyRawEncrypted
  ): Promise<TSwarmMessageBodyRaw> {
    if (!this.msgDecryptQueue) {
      throw new Error(
        'Message decrypt queue must be started to read private messgaes'
      );
    }
    const decryptedBody = await this.msgDecryptQueue.decryptData(bodyRaw);
    debugger;
    if (decryptedBody instanceof Error) {
      console.error('Failed to decrypt the private message');
      throw decryptedBody;
    }
    if (!decryptedBody) {
      throw new Error('No data got after message was decrypted');
    }
    return decryptedBody;
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

  /**
   * read a message's body decrypted.
   *
   * @protected
   * @param {string} sig
   * @returns
   * @memberof SwarmMessageSubclassParser
   */
  protected async readMessgeBodyFromCache(sig: string) {
    if (this.encryptedCache) {
      return this.encryptedCache.get(sig);
    }
  }
}
