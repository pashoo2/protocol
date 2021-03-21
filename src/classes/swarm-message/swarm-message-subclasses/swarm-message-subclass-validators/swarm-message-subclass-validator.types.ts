import { IMessageFieldsValidatorOptions } from './swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator.types';
import { IMessageSignatureValidatorOptions } from './swarm-message-subclass-validator-signature-validator/swarm-message-subclass-validator-signature-validator.types';
import { TSwarmMessageBodyEncrypted } from '../../swarm-message-constructor.types';
import { TSwarmMessage, ISwarmMessageRaw, ISwarmMessageBodyDeserialized } from '../../swarm-message-constructor.types';
import { TCAuthProviderUserIdentifierVersion } from '../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.types';

export type TPayload = string | number[] | Uint8Array | ArrayBuffer | SharedArrayBuffer;

export type TSwarmMessageUserIdentifierVersion = TCAuthProviderUserIdentifierVersion;

export interface IMessageValidatorOptions {
  formatValidatorOpts: IMessageFieldsValidatorOptions;
  signatureValidationOpts: IMessageSignatureValidatorOptions;
}

/**
 * validates swarm messages deserialized and serialized
 * and validates signature for it's body.
 *
 * @export
 * @interface ISwarmMessageSubclassValidator
 */
export interface ISwarmMessageSubclassValidator {
  /**
   * validates a message body encrypted.
   *
   * @param {TSwarmMessageBodyEncrypted} bdy
   * @returns {Promise<void>}
   * @memberof ISwarmMessageSubclassValidator
   */
  validateMessageBodyEncrypted(bdy: TSwarmMessageBodyEncrypted): void;
  /**
   * validates swarm messge with body serialized
   * and also validates a signature of the message.
   *
   * @param {ISwarmMessageRaw} msgRaw
   * @returns {Promise<void>}
   * @memberof ISwarmMessageSubclassValidator
   * @throws and rejects
   */
  valiadateSwarmMessageRaw(msgRaw: ISwarmMessageRaw): Promise<void>;

  /**
   * validates swarm messge desirialized format
   * only. Does not verifies the signature
   *
   * @param {TSwarmMessage} msg
   * @memberof ISwarmMessageSubclassValidator
   * @throws
   */
  valiadateSwarmMessage(msg: TSwarmMessage): void;

  /**
   * validate message's deserialized body object
   *
   * @param {ISwarmMessageBodyDeserialized} messageBody
   * @memberof SwarmMessageSubclassFieldsValidator
   * @throws
   */
  validateMessageBody(messageBody: ISwarmMessageBodyDeserialized): void;
}
