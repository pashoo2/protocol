import { ISwarmMessageSubclassValidator } from '../swarm-message-subclass-validators/swarm-message-subclass-validator.types';
import { ISwarmMessageUtilsMessageParser } from '../../swarm-message-utils/swarm-message-utils-message-parser/swarm-message-utils-message-parser.types';
import { ISwarmMessageUtilsBodyParser } from '../../swarm-message-utils/swarm-message-utils-body-parser';
import { IQueuedEncrypyionClassBaseOptions } from '../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { ISwarmMessageEncryptedCache } from '../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { TSwarmMessageSerialized, TSwarmMessageInstance } from '../../swarm-message-constructor.types';

export interface ISwarmMessageSubclassParserUtils {
  messageParser: ISwarmMessageUtilsMessageParser;
  messageBodyRawParser: ISwarmMessageUtilsBodyParser;
}

export interface ISwarmMessageSubclassParserOptions {
  validator: ISwarmMessageSubclassValidator;
  utils: ISwarmMessageSubclassParserUtils;
  queueOptions?: IQueuedEncrypyionClassBaseOptions['queueOptions'];
  /**
   * this is a key used to decrypt private messages
   */
  decryptionKey?: CryptoKey;
  /**
   * if provided, then:
   * 1) For private messages, before decrypt it's body, parser will try to
   * read it's body from the cache provided before;
   * 2) For all messages, parser will try to read sign mark before
   * validation of a message signature. If there is no mark stored,
   * then it will be validated.
   *
   * @type {ISwarmMessageEncryptedCache}
   * @memberof ISwarmMessageSubclassParserOptions
   */
  encryptedCache?: ISwarmMessageEncryptedCache;
}

/**
 * parses and validates swarm message serizlized
 *
 * @export
 * @interface ISwarmMessageSubclassParser
 */
export interface ISwarmMessageSubclassParser {
  /**
   * deserialize and validate the swarm message
   *
   * @param {TSwarmMessageSerialized} message - swarm message serialized
   * @returns {Promise<ISwarmMessage>}
   * @memberof ISwarmMessageSubclassParser
   * @throws
   */
  parse(message: TSwarmMessageSerialized): Promise<TSwarmMessageInstance>;
}
