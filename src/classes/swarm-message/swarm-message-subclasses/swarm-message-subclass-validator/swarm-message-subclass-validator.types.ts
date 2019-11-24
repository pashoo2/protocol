export type TType = string | number;

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
  payloadMaxLength?: number;
  payloadMinLength?: number;
  issuersList?: string[];
  typesList?: TType[];
  ttlSeconds?: number;
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
  typ: string | number;
  pld: string | Buffer;
  uid: string;
  ts: number;
  iss: string;
  alg: string;
  sig: string | Buffer;
}
