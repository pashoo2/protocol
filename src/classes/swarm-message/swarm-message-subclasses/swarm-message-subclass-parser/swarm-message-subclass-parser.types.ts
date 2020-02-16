import { ISwarmMessageSubclassValidator } from '../swarm-message-subclass-validators/swarm-message-subclass-validator.types';
import { ISwarmMessageUtilsMessageParser } from '../../swarm-message-utils/swarm-message-utils-message-parser/swarm-message-utils-message-parser.types';
import { ISwarmMessageUtilsBodyParser } from '../../swarm-message-utils/swarm-message-utils-body-parser';
import {
  TSwarmMessageSeriazlized,
  ISwarmMessageInstance,
} from '../../swarm-message-constructor.types';

export interface ISwarmMessageSubclassParserUtils {
  messageParser: ISwarmMessageUtilsMessageParser;
  messageBodyRawParser: ISwarmMessageUtilsBodyParser;
}

export interface ISwarmMessageSubclassParserOptions {
  validator: ISwarmMessageSubclassValidator;
  utils: ISwarmMessageSubclassParserUtils;
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
   * @param {TSwarmMessageSeriazlized} message - swarm message serialized
   * @returns {Promise<ISwarmMessage>}
   * @memberof ISwarmMessageSubclassParser
   * @throws
   */
  parse(message: TSwarmMessageSeriazlized): Promise<ISwarmMessageInstance>;
}
