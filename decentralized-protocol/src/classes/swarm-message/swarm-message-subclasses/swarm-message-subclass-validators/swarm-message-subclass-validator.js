import { __awaiter } from "tslib";
import SwarmMessageSubclassFieldsValidator from './swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator';
import { SwarmMessgeSubclassSignatureValidator } from './swarm-message-subclass-validator-signature-validator/swarm-message-subclass-validator-signature-validator';
import assert from 'assert';
export class SwarmMessageSubclassValidator {
    constructor(options) {
        this.options = options;
        this.valiadateSwarmMessageRaw = (msgRaw) => __awaiter(this, void 0, void 0, function* () {
            const { messageFormatValidator, signatureValidator } = this;
            if (!messageFormatValidator || !signatureValidator) {
                assert(!!messageFormatValidator, 'Validator of a message fields format is not defined');
                assert(!!signatureValidator, 'Validator of a message signature is not defined');
                return;
            }
            messageFormatValidator.validateMessageRaw(msgRaw);
            return signatureValidator.validateSignature(msgRaw);
        });
        this.valiadateSwarmMessage = (msg) => {
            const { messageFormatValidator } = this;
            if (!messageFormatValidator) {
                assert(!!messageFormatValidator, 'Validator of a message fields format is not defined');
                return;
            }
            return messageFormatValidator.validateMessage(msg);
        };
        this.validateMessageBodyEncrypted = (bdy) => {
            const { messageFormatValidator } = this;
            if (!messageFormatValidator) {
                assert(!!messageFormatValidator, 'Validator of a message fields format is not defined');
                return;
            }
            return messageFormatValidator.validateMessageBodyEncrypted(bdy);
        };
        this.validateMessageBody = (msgBody) => {
            const { messageFormatValidator } = this;
            if (!messageFormatValidator) {
                assert(!!messageFormatValidator, 'Validator of a message fields format is not defined');
                return;
            }
            return messageFormatValidator.validateMessageBody(msgBody);
        };
        this.startValidators();
    }
    startValidators() {
        const { formatValidatorOpts, signatureValidationOpts } = this.options;
        this.messageFormatValidator = new SwarmMessageSubclassFieldsValidator(formatValidatorOpts);
        this.signatureValidator = new SwarmMessgeSubclassSignatureValidator(signatureValidationOpts);
    }
}
//# sourceMappingURL=swarm-message-subclass-validator.js.map