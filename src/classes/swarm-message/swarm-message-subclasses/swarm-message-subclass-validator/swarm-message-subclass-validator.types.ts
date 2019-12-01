import { TSwarmMessageIssuerDeserialized } from './swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-issuer-deserizlied/swarm-message-subclass-validator-fields-validator-validator-issuer-deserizlied.types';
import { TSwarmMessageType } from './swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-type/swarm-message-subclass-validator-fields-validator-validator-type.types';
import { TSwarmMessaggeIssuerSerialized } from './swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-issuer-serialized/swarm-message-subclass-validator-fields-validator-validator-issuer-serialized.types';
import { TSwarmMessageUserIdentifierSerialized } from './swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import {
  TSwarmMessagePayloadSerialized,
  ISwarmMessagePayloadValidationOptions,
} from './swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-payload/swarm-message-subclass-validator-fields-validator-validator-payload.types';
import { ISwarmMessageTimestampValidationOptions } from './swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-timestamp/swarm-message-subclass-validator-fields-validator-validator-timestamp.types';

export type TPayload =
  | string
  | number[]
  | Uint8Array
  | ArrayBuffer
  | SharedArrayBuffer;

/**
 * interface for the options for the validator
 * of a swarm messages
 *
 * @export
 * @interface IMessageValidatorOptions
 * @property {number} [SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MAX_LENGTH_BYTES] payloadMaxLength - the maximum
 * length for the payload
 * @property {number} [SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MAX_LENGTH_BYTES] payloadMinLength - the minimum
 * length for the payload
 * @property {string[]} [[]] issuersList - the list of the valid issuers
 * @property {Array<string | number>} [[]] typesList - the list of the valid types
 * @property {number} [undefined] ttlSeconds - time to life of a message, the message will be invalidated if the
 * message timestamp is not in the interval within the timestamp. If not defined or se to 0 means infinite
 * time to live. Time to live in the seconds
 */
export interface IMessageValidatorOptions {
  issuersList?: TSwarmMessageIssuerDeserialized[];
  typesList?: TSwarmMessageType[];
  payloadValidationOptions?: ISwarmMessagePayloadValidationOptions;
  timestampValidationOptions?: ISwarmMessageTimestampValidationOptions;
}

/**
 * message for sending an information in
 * the peer to peer decentralized system
 *
 * @export
 * @interface ISwarmMessage
 * @property {string} typ - a type of the message
 * @property {string | Buffer} pld - payload of the message is a buffer or a string
 * @property {string} uid - an identity of the user which post the message
 * @property {string} ts - UNIX timestamp in UTC when the message was posted
 * @property {string} iss - the service in which the message was generated
 * @property {string} alg - the algorythm used for the signature
 * @property {string} sig - a signature created with the user private key.
 *
 * The signature must sign all the fields, including
 * the algorithm it used.
 */
export interface ISwarmMessage {
  typ: TSwarmMessageType;
  pld: TSwarmMessagePayloadSerialized;
  uid: TSwarmMessageUserIdentifierSerialized;
  ts: number;
  iss: TSwarmMessaggeIssuerSerialized;
  alg: string;
  sig: string | Buffer;
}
