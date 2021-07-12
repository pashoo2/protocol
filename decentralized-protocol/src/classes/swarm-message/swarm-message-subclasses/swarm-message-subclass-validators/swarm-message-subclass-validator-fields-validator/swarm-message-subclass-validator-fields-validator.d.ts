import { TSwarmMessageUserIdentifierVersion } from '../swarm-message-subclass-validator.types';
import { TSwarmMessageIssuerDeserialized } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-issuer-deserizlied/swarm-message-subclass-validator-fields-validator-validator-issuer-deserizlied.types';
import { TSwarmMessageType } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-type/swarm-message-subclass-validator-fields-validator-validator-type.types';
import { ISwarmMessagePayloadValidationOptions, TSwarmMessagePayloadSerialized } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-payload/swarm-message-subclass-validator-fields-validator-validator-payload.types';
import { ISwarmMessageTimestampValidationOptions } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-timestamp/swarm-message-subclass-validator-fields-validator-validator-timestamp.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { TSwarmMessage, TSwarmMessageBodyEncrypted } from '../../../swarm-message-constructor.types';
import { IMessageFieldsValidatorOptions, ISwarmMessageSubclassFieldsValidator } from './swarm-message-subclass-validator-fields-validator.types';
import { ISwarmMessageBodyDeserialized, ISwarmMessageRaw } from '../../../swarm-message-constructor.types';
export declare class SwarmMessageSubclassFieldsValidator implements ISwarmMessageSubclassFieldsValidator {
    protected issuersList: TSwarmMessageIssuerDeserialized[];
    protected supportedUserIdentifierVer: TSwarmMessageUserIdentifierVersion[];
    protected typesList: TSwarmMessageType[];
    protected payloadValidationOptions?: ISwarmMessagePayloadValidationOptions;
    protected timestampValidationOptions?: ISwarmMessageTimestampValidationOptions;
    protected validatePayload: (pld: TSwarmMessagePayloadSerialized) => void;
    protected validateTimestamp: (timestamp: number) => void;
    constructor(options?: IMessageFieldsValidatorOptions);
    validateMessageBody(messageBody: ISwarmMessageBodyDeserialized): void;
    validateMessageBodyEncrypted(messsageBodyEncrypted: TSwarmMessageBodyEncrypted): void;
    validateMessage(message: TSwarmMessage): void;
    validateMessageRaw(messageRaw: ISwarmMessageRaw): void;
    addIssuerToValidList: (issuer: string) => void;
    removeIssuerFromValidList(issuer: string): boolean | Error;
    protected checkIssuerIsInList(issuer: string): void;
    protected validateIsPrivateField(isPrivateField?: any): void;
    protected validateIssuer(issuer: string): void;
    protected addType: (type: TSwarmMessageType) => void;
    protected removeType(type: TSwarmMessageType): void;
    protected checkTypeInList(type: TSwarmMessageType): void;
    protected validateType(type: TSwarmMessageType): void;
    protected validateUserIdentifier: (userId: TSwarmMessageUserIdentifierSerialized) => void;
    protected setOptions(options?: IMessageFieldsValidatorOptions): void;
}
export default SwarmMessageSubclassFieldsValidator;
//# sourceMappingURL=swarm-message-subclass-validator-fields-validator.d.ts.map