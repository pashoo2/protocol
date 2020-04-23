import { TSwarmMessageIssuerDeserialized } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-issuer-deserizlied/swarm-message-subclass-validator-fields-validator-validator-issuer-deserizlied.types';
import { TSwarmMessageType } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-type/swarm-message-subclass-validator-fields-validator-validator-type.types';
import { ISwarmMessagePayloadValidationOptions } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-payload/swarm-message-subclass-validator-fields-validator-validator-payload.types';
import { ISwarmMessageTimestampValidationOptions } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-timestamp/swarm-message-subclass-validator-fields-validator-validator-timestamp.types';
import { TSwarmMessageUserIdentifierVersion } from '../swarm-message-subclass-validator.types';
import {
  ISwarmMessage,
  TSwarmMessageBodyEncrypted,
} from '../../../swarm-message-constructor.types';
import {
  ISwarmMessageBodyDeserialized,
  ISwarmMessageRaw,
} from '../../../swarm-message-constructor.types';
/**
 * interface for the options for the validator
 * of a swarm messages
 *
 * @export
 * @interface IMessageFieldsValidatorOptions
 * @property {Array<TSwarmMessageUserIdentifierVersion>} supportedUserIdentifierVer - a user identifier versions
 * supported
 * @property {number} [SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MAX_LENGTH_BYTES] payloadMaxLength - the maximum
 * length for the payload
 * @property {number} [SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MAX_LENGTH_BYTES] payloadMinLength - the minimum
 * length for the payload
 * @property {string[]} [[]] issuersList - the list of the valid issuers
 * @property {Array<string | number>} [[]] typesList - the list of the valid types
 * @property {number} [undefined] ttlSeconds - time to life of a message, the message will be invalidated if the
 * message timestamp is not in the interval within the timestamp. If not defined or se to 0 means infinite
 * time to live. Time to live in the seconds
 */
export interface IMessageFieldsValidatorOptions {
  issuersList?: TSwarmMessageIssuerDeserialized[];
  typesList?: TSwarmMessageType[];
  payloadValidationOptions?: ISwarmMessagePayloadValidationOptions;
  timestampValidationOptions?: ISwarmMessageTimestampValidationOptions;
  supportedUserIdentifierVer?: TSwarmMessageUserIdentifierVersion[];
}

/**
 * validate a Swarm message's fields format.
 *
 * @export
 * @interface ISwarmMessageSubclassFieldsValidator
 */
export interface ISwarmMessageSubclassFieldsValidator {
  /**
   * validate body encrypted
   *
   * @param {TSwarmMessageBodyEncrypted} messsageBodyEncrypted
   * @memberof ISwarmMessageSubclassFieldsValidator
   */
  validateMessageBodyEncrypted(
    messsageBodyEncrypted: TSwarmMessageBodyEncrypted
  ): void;
  /**
   * validate message's deserialized body object
   *
   * @param {ISwarmMessageBodyDeserialized} messageBody
   * @memberof SwarmMessageSubclassFieldsValidator
   * @throws
   */
  validateMessageBody(messageBody: ISwarmMessageBodyDeserialized): void;
  /**
   * validate swarm message object
   * throw an error if the message
   * is not valid
   *
   * @param {ISwarmMessage} message
   * @memberof SwarmMessageSubclassFieldsValidator
   * @throws
   */
  validateMessage(message: ISwarmMessage): void;
  /**
   * validate a serialized message's field format.
   *
   * @param {ISwarmMessageRaw} messageRaw
   * @memberof ISwarmMessageSubclassFieldsValidator
   */
  validateMessageRaw(messageRaw: ISwarmMessageRaw): void;
}
