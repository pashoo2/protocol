import {
  IMessageValidatorOptions,
  ISwarmMessageSubclassValidator,
} from './swarm-message-subclass-validator.types';
import { ISwarmMessgeSubclassSignatureValidator } from './swarm-message-subclass-validator-signature-validator/swarm-message-subclass-validator-signature-validator.types';
import { ISwarmMessageSubclassFieldsValidator } from './swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator.types';
import SwarmMessageSubclassFieldsValidator from './swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator';
import { SwarmMessgeSubclassSignatureValidator } from './swarm-message-subclass-validator-signature-validator/swarm-message-subclass-validator-signature-validator';
import {
  ISwarmMessageRaw,
  ISwarmMessage,
  ISwarmMessageBodyDeserialized,
} from '../../swarm-message-constructor.types';
import assert from 'assert';

export class SwarmMessageSubclassValidator
  implements ISwarmMessageSubclassValidator {
  protected messageFormatValidator?: ISwarmMessageSubclassFieldsValidator;

  protected signatureValidator?: ISwarmMessgeSubclassSignatureValidator;

  constructor(protected options: IMessageValidatorOptions) {
    this.startValidators();
  }

  public valiadateSwarmMessageRaw = async (
    msgRaw: ISwarmMessageRaw
  ): Promise<void> => {
    const { messageFormatValidator, signatureValidator } = this;

    if (!messageFormatValidator || !signatureValidator) {
      assert(
        !!messageFormatValidator,
        'Validator of a message fields format is not defined'
      );
      assert(
        !!signatureValidator,
        'Validator of a message signature is not defined'
      );
      return;
    }
    messageFormatValidator.validateMessageRaw(msgRaw);
    return signatureValidator.validateSignature(msgRaw);
  };

  public valiadateSwarmMessage = (msg: ISwarmMessage): void => {
    const { messageFormatValidator } = this;

    if (!messageFormatValidator) {
      assert(
        !!messageFormatValidator,
        'Validator of a message fields format is not defined'
      );
      return;
    }
    return messageFormatValidator.validateMessage(msg);
  };

  public validateMessageBody = (
    msgBody: ISwarmMessageBodyDeserialized
  ): void => {
    const { messageFormatValidator } = this;

    if (!messageFormatValidator) {
      assert(
        !!messageFormatValidator,
        'Validator of a message fields format is not defined'
      );
      return;
    }
    return messageFormatValidator.validateMessageBody(msgBody);
  };

  /**
   * starts message's format validator
   * and validator of a signature for
   * raw messages.
   *
   * @protected
   * @memberof SwarmMessageSubclassValidator
   */
  protected startValidators() {
    const { formatValidatorOpts, signatureValidationOpts } = this.options;

    this.messageFormatValidator = new SwarmMessageSubclassFieldsValidator(
      formatValidatorOpts
    );
    this.signatureValidator = new SwarmMessgeSubclassSignatureValidator(
      signatureValidationOpts
    );
  }
}
