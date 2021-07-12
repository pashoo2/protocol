import { TSwarmMessageIssuerDeserialized } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-issuer-deserizlied/swarm-message-subclass-validator-fields-validator-validator-issuer-deserizlied.types';
import { TSwarmMessageType } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-type/swarm-message-subclass-validator-fields-validator-validator-type.types';
import { ISwarmMessagePayloadValidationOptions } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-payload/swarm-message-subclass-validator-fields-validator-validator-payload.types';
import { ISwarmMessageTimestampValidationOptions } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-timestamp/swarm-message-subclass-validator-fields-validator-validator-timestamp.types';
import { TSwarmMessageUserIdentifierVersion } from '../swarm-message-subclass-validator.types';
import { TSwarmMessage, TSwarmMessageBodyEncrypted } from '../../../swarm-message-constructor.types';
import { ISwarmMessageBodyDeserialized, ISwarmMessageRaw } from '../../../swarm-message-constructor.types';
export interface IMessageFieldsValidatorOptions {
    issuersList?: TSwarmMessageIssuerDeserialized[];
    typesList?: TSwarmMessageType[];
    payloadValidationOptions?: ISwarmMessagePayloadValidationOptions;
    timestampValidationOptions?: ISwarmMessageTimestampValidationOptions;
    supportedUserIdentifierVer?: TSwarmMessageUserIdentifierVersion[];
}
export interface ISwarmMessageSubclassFieldsValidator {
    validateMessageBodyEncrypted(messsageBodyEncrypted: TSwarmMessageBodyEncrypted): void;
    validateMessageBody(messageBody: ISwarmMessageBodyDeserialized): void;
    validateMessage(message: TSwarmMessage): void;
    validateMessageRaw(messageRaw: ISwarmMessageRaw): void;
}
//# sourceMappingURL=swarm-message-subclass-validator-fields-validator.types.d.ts.map