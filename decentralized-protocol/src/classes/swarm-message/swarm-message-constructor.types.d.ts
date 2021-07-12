import { TSwarmMessageUserIdentifierSerialized } from '../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { ownKeyOf } from 'types/helper.types';
import { ISwarmMessageSubclassParserUtils, ISwarmMessageSubclassParser } from './swarm-message-subclasses/swarm-message-subclass-parser/swarm-message-subclass-parser.types';
import { ISwarmMessageSerializerUtils, ISwarmMessageSerializer } from './swarm-message-subclasses/swarm-message-subclass-serializer/swarm-message-subclass-serializer.types';
import { IMessageSignatureValidatorOptionsUtils } from './swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-signature-validator/swarm-message-subclass-validator-signature-validator.types';
import { ICentralAuthority } from '../central-authority-class/central-authority-class.types';
import { ISwarmMessageEncryptedCache } from '../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { IMessageValidatorOptions, ISwarmMessageSubclassValidator } from './swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator.types';
export declare enum ESwarmMessageSignatureAlgorithms {
    'ep256' = "ep256"
}
export declare enum ESwarmMessageSignatureAlgorithmsDescription {
    'ep256' = "ECDSA_P-256"
}
export declare const SwarmMessageSignatureSupprotedAlgorithms: string[];
export interface ISwarmMessageReceiver {
    receiverId: TSwarmMessageUserIdentifierSerialized;
}
export declare type TSwarmMessageSignatureAlgorithm = ownKeyOf<typeof ESwarmMessageSignatureAlgorithmsDescription>;
export declare type TSwarmMessageSerialized = string;
export declare type TDeserializedSwarmMessageSerializedPayload = string;
export interface ISwarmMessageBodyDeserialized {
    typ: string | number;
    pld: TDeserializedSwarmMessageSerializedPayload | ArrayBuffer;
    ts: number;
    iss: string;
}
export declare type TSwarmMessageBodyRaw = string;
export declare type TSwarmMessageBodyRawEncrypted = string;
export declare type TSwarmMessageBodyEncrypted = string;
export interface ISwarmMessageRaw {
    bdy: TSwarmMessageBodyRaw;
    uid: TSwarmMessageUserIdentifierSerialized;
    sig: string;
    alg: ownKeyOf<typeof ESwarmMessageSignatureAlgorithmsDescription>;
    isPrivate?: boolean;
}
export declare type TSwarmMessageConstructorArgumentBodyPrivate = TSwarmMessageConstructorArgumentBody & ISwarmMessageReceiver;
export interface ISwarmMessageBody extends Omit<ISwarmMessageBodyDeserialized, 'pld'>, Partial<ISwarmMessageReceiver> {
    pld: TDeserializedSwarmMessageSerializedPayload;
}
export interface ISwarmMessageDecrypted extends Omit<ISwarmMessageRaw, 'bdy'> {
    bdy: ISwarmMessageBody;
}
export interface ISwarmMessageEncrypted extends Omit<ISwarmMessageRaw, 'bdy'> {
    bdy: ISwarmMessageBody;
}
export declare type TSwarmMessage = ISwarmMessageEncrypted | ISwarmMessageDecrypted;
export interface ISwarmMessageInstanceBase extends Omit<ISwarmMessageRaw, 'bdy'> {
    toString(): TSwarmMessageSerialized;
}
export interface ISwarmMessageInstanceDecrypted extends Omit<ISwarmMessageInstanceBase, 'bdy'> {
    bdy: ISwarmMessageBody;
}
export interface ISwarmMessageInstanceEncrypted extends Omit<ISwarmMessageInstanceBase, 'bdy'> {
    bdy: TSwarmMessageBodyEncrypted;
}
export declare type TSwarmMessageInstance = ISwarmMessageInstanceDecrypted | ISwarmMessageInstanceEncrypted;
export interface ISwarmMessageConstructorUtils extends ISwarmMessageSubclassParserUtils, ISwarmMessageSerializerUtils, IMessageSignatureValidatorOptionsUtils {
}
export interface ISwarmMessageConstructorOptionsInstances {
    parser: ISwarmMessageSubclassParser;
    serizlizer: ISwarmMessageSerializer;
    validator: ISwarmMessageSubclassValidator;
    encryptedCache: ISwarmMessageEncryptedCache;
}
export interface ISwarmMessageConstructorOptionsRequired {
    utils: ISwarmMessageConstructorUtils;
    caConnection: ICentralAuthority;
    validation: IMessageValidatorOptions & {
        signatureValidationOpts: Omit<IMessageValidatorOptions['signatureValidationOpts'], 'caConnection'>;
    };
    instances: Partial<ISwarmMessageConstructorOptionsInstances>;
}
export declare type TSwarmMessageConstructorOptions = Omit<ISwarmMessageConstructorOptionsRequired, 'utils' | 'validation'> & {
    utils?: Partial<ISwarmMessageConstructorOptionsRequired['utils']>;
    validation?: Partial<ISwarmMessageConstructorOptionsRequired['validation']>;
};
export interface ISwarmMessageConstructor {
    readonly caConnection?: ICentralAuthority;
    readonly encryptedCache?: ISwarmMessageEncryptedCache;
    construct(message: TSwarmMessageSerialized): Promise<TSwarmMessageInstance>;
}
export declare type TSwarmMessageConstructorArgumentBody = Omit<ISwarmMessageBodyDeserialized, 'ts'> & Partial<ISwarmMessageBodyDeserialized>;
export interface ISwarmMessageConstructor {
    construct(messageBody: TSwarmMessageConstructorArgumentBodyPrivate): Promise<TSwarmMessageInstance>;
}
export declare type TSwarmMessageConstructorBodyMessage = TSwarmMessageConstructorArgumentBodyPrivate | TSwarmMessageConstructorArgumentBody;
export interface ISwarmMessageConstructor {
    construct(messageBody: TSwarmMessageConstructorArgumentBody): Promise<TSwarmMessageInstance>;
}
//# sourceMappingURL=swarm-message-constructor.types.d.ts.map