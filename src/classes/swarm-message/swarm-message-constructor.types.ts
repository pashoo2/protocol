import { TSwarmMessageUserIdentifierSerialized } from '../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { ownKeyOf } from 'types/helper.types';
import {
  ISwarmMessageSubclassParserUtils,
  ISwarmMessageSubclassParser,
} from './swarm-message-subclasses/swarm-message-subclass-parser/swarm-message-subclass-parser.types';
import {
  ISwarmMessageSerializerUtils,
  ISwarmMessageSerializer,
} from './swarm-message-subclasses/swarm-message-subclass-serializer/swarm-message-subclass-serializer.types';
import { IMessageSignatureValidatorOptionsUtils } from './swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-signature-validator/swarm-message-subclass-validator-signature-validator.types';
import { ICentralAuthority } from '../central-authority-class/central-authority-class.types';
import { ISwarmMessageEncryptedCache } from '../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import {
  IMessageValidatorOptions,
  ISwarmMessageSubclassValidator,
} from './swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator.types';

export enum ESwarmMessageSignatureAlgorithms {
  'ep256' = 'ep256',
}

export enum ESwarmMessageSignatureAlgorithmsDescription {
  'ep256' = 'ECDSA_P-256',
}

export const SwarmMessageSignatureSupprotedAlgorithms = Object.keys(ESwarmMessageSignatureAlgorithmsDescription);

export interface ISwarmMessageReceiver {
  receiverId: TSwarmMessageUserIdentifierSerialized;
}

export type TSwarmMessageSignatureAlgorithm = ownKeyOf<typeof ESwarmMessageSignatureAlgorithmsDescription>;

/**
 * message serizlized and ready to send
 * into the swarm.
 */
export type TSwarmMessageSerialized = string;

/**
 * message payload deserialized
 */
export type TDeserializedSwarmMessageSerializedPayload = string;

/**
 * message for sending an information in
 * the peer to peer decentralized system.
 * This interface describes deserialized
 * message body.
 *
 * @export
 * @interface ISwarmMessage
 * @property {string} typ - a type of the message.
 * @property {string | ArrayBuffer} pld - payload of the message is a buffer or a string
 * @property {string} uid - an identity of the user which post the message
 * @property {string} tss - UNIX timestamp in UTC when the message was posted. In seconds
 * @property {string} iss - the service in which the message was generated
 *
 * The signature must sign all the fields, including
 * the algorithm it used.
 */
export interface ISwarmMessageBodyDeserialized {
  typ: string | number;
  pld: TDeserializedSwarmMessageSerializedPayload | ArrayBuffer;
  ts: number;
  iss: string;
}

/**
 * This is type of the message's body
 * serialized.
 */
export type TSwarmMessageBodyRaw = string;

/**
 * body encrypted with a private of the user,
 * who will be receiver of the message
 */
export type TSwarmMessageBodyRawEncrypted = string;

/**
 * this is message body of a private body
 * which is encrypted for the receiver user.
 */
export type TSwarmMessageBodyEncrypted = string;

/**
 * This interface represents a message
 * incoming.
 *
 * @export
 * @interface ISwarmMessageRaw
 */
export interface ISwarmMessageRaw {
  /**
   * body of the message serialized
   *
   * @type {TSwarmMessageBodyRaw}
   * @memberof ISwarmMessageRaw
   */
  bdy: TSwarmMessageBodyRaw;
  /**
   * sender identifier serialized
   *
   * @type {string}
   * @memberof ISwarmMessageRaw
   */
  uid: TSwarmMessageUserIdentifierSerialized;
  /**
   * signature of the message body
   * and sender of the message
   *
   * @type {string}
   * @memberof ISwarmMessageRaw
   */
  sig: string;
  /**
   * the algorythm used for the signature
   *
   * @type {string}
   * @memberof ISwarmMessageRaw
   */
  alg: ownKeyOf<typeof ESwarmMessageSignatureAlgorithmsDescription>;
  /**
   * is this is private message, may be for this user
   *
   * @type {boolean}
   * @memberof ISwarmMessageRaw
   */
  isPrivate?: boolean;
}

// this is for a private messages construction. Message body will be encrypted
// with the public key of the user with id = receiverId
export type TSwarmMessageConstructorArgumentBodyPrivate = TSwarmMessageConstructorArgumentBody & ISwarmMessageReceiver;

/**
 * body of a swarm message
 *
 * @export
 * @interface ISwarmMessageBody
 * @extends {Omit<ISwarmMessageBodyDeserialized, 'pld'>}
 */
export interface ISwarmMessageBody extends Omit<ISwarmMessageBodyDeserialized, 'pld'>, Partial<ISwarmMessageReceiver> {
  pld: TDeserializedSwarmMessageSerializedPayload;
}

/**
 * this is representation of a message deserialized
 * and fully decrypted.
 *
 * @export
 * @interface ISwarmMessage
 * @extends {ISwarmMessageBodyDeserialized}
 */
export interface ISwarmMessageDecrypted extends Omit<ISwarmMessageRaw, 'bdy'> {
  bdy: ISwarmMessageBody;
}

/**
 * this is representation of a message deserialized
 * and private with encrypted body.
 *
 * @export
 * @interface ISwarmMessage
 * @extends {ISwarmMessageBodyDeserialized}
 */
export interface ISwarmMessageEncrypted extends Omit<ISwarmMessageRaw, 'bdy'> {
  bdy: ISwarmMessageBody;
}

export type TSwarmMessage = ISwarmMessageEncrypted | ISwarmMessageDecrypted;

export interface ISwarmMessageInstanceBase extends Omit<ISwarmMessageRaw, 'bdy'> {
  toString(): TSwarmMessageSerialized;
}

export interface ISwarmMessageInstanceDecrypted extends Omit<ISwarmMessageInstanceBase, 'bdy'> {
  bdy: ISwarmMessageBody;
}

export interface ISwarmMessageInstanceEncrypted extends Omit<ISwarmMessageInstanceBase, 'bdy'> {
  bdy: TSwarmMessageBodyEncrypted;
}

export type TSwarmMessageInstance = ISwarmMessageInstanceDecrypted | ISwarmMessageInstanceEncrypted;

/**
 * utilities used for messages parsing,
 * serizlization and validation
 *
 * @export
 * @interface ISwarmMessageConstructorUtils
 * @extends {ISwarmMessageSubclassParserUtils}
 * @extends {ISwarmMessageSerializerUtils}
 * @extends {IMessageSignatureValidatorOptionsUtils}
 */
export interface ISwarmMessageConstructorUtils
  extends ISwarmMessageSubclassParserUtils,
    ISwarmMessageSerializerUtils,
    IMessageSignatureValidatorOptionsUtils {}

export interface ISwarmMessageConstructorOptionsInstances {
  parser: ISwarmMessageSubclassParser;
  serizlizer: ISwarmMessageSerializer;
  validator: ISwarmMessageSubclassValidator;
  /**
   * used to store private messages
   * in decrypted form, cause there is
   * no way to decrypt private message
   * which was sent to another user.
   *
   * @type {ISwarmMessageEncryptedCache}
   * @memberof ISwarmMessageConstructorOptionsInstances
   */
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

/**
 * options used for swarm messages construction.
 *
 * @export
 * @interface ISwarmMessageConstructorOptions
 */
export type TSwarmMessageConstructorOptions = Omit<ISwarmMessageConstructorOptionsRequired, 'utils' | 'validation'> & {
  utils?: Partial<ISwarmMessageConstructorOptionsRequired['utils']>;
  validation?: Partial<ISwarmMessageConstructorOptionsRequired['validation']>;
};

// construct message from a serialized
export interface ISwarmMessageConstructor {
  readonly caConnection?: ICentralAuthority;
  readonly encryptedCache?: ISwarmMessageEncryptedCache;
  construct(message: TSwarmMessageSerialized): Promise<TSwarmMessageInstance>;
}

export type TSwarmMessageConstructorArgumentBody = Omit<ISwarmMessageBodyDeserialized, 'ts'> &
  Partial<ISwarmMessageBodyDeserialized>;

/**
 * This signature constructs a private message for the user with
 * id === receiverId. The message's body will be encrypted
 * with a public key of the receiver.
 *
 * @export
 * @interface ISwarmMessageConstructor
 */
export interface ISwarmMessageConstructor {
  construct(messageBody: TSwarmMessageConstructorArgumentBodyPrivate): Promise<TSwarmMessageInstance>;
}

export type TSwarmMessageConstructorBodyMessage =
  | TSwarmMessageConstructorArgumentBodyPrivate
  | TSwarmMessageConstructorArgumentBody;

// construct message from an object which represents message's body
export interface ISwarmMessageConstructor {
  construct(messageBody: TSwarmMessageConstructorArgumentBody): Promise<TSwarmMessageInstance>;
}
