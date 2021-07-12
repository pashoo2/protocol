import { IMessageValidatorOptions, ISwarmMessageSubclassValidator } from './swarm-message-subclass-validator.types';
import { ISwarmMessgeSubclassSignatureValidator } from './swarm-message-subclass-validator-signature-validator/swarm-message-subclass-validator-signature-validator.types';
import { ISwarmMessageSubclassFieldsValidator } from './swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator.types';
import { ISwarmMessageRaw, TSwarmMessage, ISwarmMessageBodyDeserialized } from '../../swarm-message-constructor.types';
import { TSwarmMessageBodyEncrypted } from '../../swarm-message-constructor.types';
export declare class SwarmMessageSubclassValidator implements ISwarmMessageSubclassValidator {
    protected options: IMessageValidatorOptions;
    protected messageFormatValidator?: ISwarmMessageSubclassFieldsValidator;
    protected signatureValidator?: ISwarmMessgeSubclassSignatureValidator;
    constructor(options: IMessageValidatorOptions);
    valiadateSwarmMessageRaw: (msgRaw: ISwarmMessageRaw) => Promise<void>;
    valiadateSwarmMessage: (msg: TSwarmMessage) => void;
    validateMessageBodyEncrypted: (bdy: TSwarmMessageBodyEncrypted) => void;
    validateMessageBody: (msgBody: ISwarmMessageBodyDeserialized) => void;
    protected startValidators(): void;
}
//# sourceMappingURL=swarm-message-subclass-validator.d.ts.map