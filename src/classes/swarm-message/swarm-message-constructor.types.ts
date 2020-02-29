import { TSwarmMessageUserIdentifierSerialized } from './swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { ownKeyOf } from '../../types/helper.types';
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
import { CentralAuthority } from '../central-authority-class/central-authority-class';
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

export const SwarmMessageSignatureSupprotedAlgorithms = Object.keys(
  ESwarmMessageSignatureAlgorithmsDescription
);

export type TSwarmMessageSignatureAlgorithm = ownKeyOf<
  typeof ESwarmMessageSignatureAlgorithmsDescription
>;

/**
 * message serizlized and ready to send
 * into the swarm.
 */
export type TSwarmMessageSerialized = string;

/**
 * message payload deserialized
 */
export type TSwarmMessagePayloadDeserialized = string;

/**
 * message for sending an information in
 * the peer to peer decentralized system.
 * This interface describes deserialized
 * message body.
 *
 * @export
 * @interface ISwarmMessage
 * @property {string} typ - a type of the message
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
  pld: TSwarmMessagePayloadDeserialized | ArrayBuffer;
  ts: number;
  iss: string;
}

/**
 * This is type of the message's body
 * serialized.
 */
export type TSwarmMessageBodyRaw = string;

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
}

export type TSwarmMessageSeriazlized = string;

/**
 * body of a swarm message
 *
 * @export
 * @interface ISwarmMessageBody
 * @extends {Omit<ISwarmMessageBodyDeserialized, 'pld'>}
 */
export interface ISwarmMessageBody
  extends Omit<ISwarmMessageBodyDeserialized, 'pld'> {
  pld: TSwarmMessagePayloadDeserialized;
}

/**
 * this is representation of a message deserialized.
 *
 * @export
 * @interface ISwarmMessage
 * @extends {ISwarmMessageBodyDeserialized}
 */
export interface ISwarmMessage extends Omit<ISwarmMessageRaw, 'bdy'> {
  bdy: ISwarmMessageBody;
}

export interface ISwarmMessageInstance extends ISwarmMessage {
  toString(): TSwarmMessageSeriazlized;
}

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
}

export interface ISwarmMessageConstructorOptionsRequired {
  utils: ISwarmMessageConstructorUtils;
  caConnection: ICentralAuthority;
  validation: IMessageValidatorOptions & {
    signatureValidationOpts: Omit<
      IMessageValidatorOptions['signatureValidationOpts'],
      'caConnection'
    >;
  };
  instances?: Partial<ISwarmMessageConstructorOptionsInstances>;
}

/**
 * options used for swarm messages construction.
 *
 * @export
 * @interface ISwarmMessageConstructorOptions
 */
export type TSwarmMessageConstructorOptions = Omit<
  Omit<ISwarmMessageConstructorOptionsRequired, 'utils'>,
  'validation'
> & {
  utils?: Partial<ISwarmMessageConstructorOptionsRequired['utils']>;
  validation?: Partial<ISwarmMessageConstructorOptionsRequired['validation']>;
};

// construct message from a serialized
export interface ISwarmMessageConstructor {
  readonly caConnection?: ICentralAuthority;
  construct(message: TSwarmMessageSeriazlized): Promise<ISwarmMessageInstance>;
}

export type TSwarmMessageConstructorArgumentBody = Omit<
  ISwarmMessageBodyDeserialized,
  'ts'
> &
  Partial<ISwarmMessageBodyDeserialized>;

// construct message from an object which represents message's body
export interface ISwarmMessageConstructor {
  construct(
    messageBody: TSwarmMessageConstructorArgumentBody
  ): Promise<ISwarmMessageInstance>;
}
