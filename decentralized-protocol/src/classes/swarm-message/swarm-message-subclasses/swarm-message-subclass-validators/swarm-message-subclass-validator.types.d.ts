import { IMessageFieldsValidatorOptions } from './swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator.types';
import { IMessageSignatureValidatorOptions } from './swarm-message-subclass-validator-signature-validator/swarm-message-subclass-validator-signature-validator.types';
import { TSwarmMessageBodyEncrypted } from '../../swarm-message-constructor.types';
import { TSwarmMessage, ISwarmMessageRaw, ISwarmMessageBodyDeserialized } from '../../swarm-message-constructor.types';
import { TCAuthProviderUserIdentifierVersion } from '../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.types';
export declare type TPayload = string | number[] | Uint8Array | ArrayBuffer | SharedArrayBuffer;
export declare type TSwarmMessageUserIdentifierVersion = TCAuthProviderUserIdentifierVersion;
export interface IMessageValidatorOptions {
    formatValidatorOpts: IMessageFieldsValidatorOptions;
    signatureValidationOpts: IMessageSignatureValidatorOptions;
}
export interface ISwarmMessageSubclassValidator {
    validateMessageBodyEncrypted(bdy: TSwarmMessageBodyEncrypted): void;
    valiadateSwarmMessageRaw(msgRaw: ISwarmMessageRaw): Promise<void>;
    valiadateSwarmMessage(msg: TSwarmMessage): void;
    validateMessageBody(messageBody: ISwarmMessageBodyDeserialized): void;
}
//# sourceMappingURL=swarm-message-subclass-validator.types.d.ts.map