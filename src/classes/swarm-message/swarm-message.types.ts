import { TSwarmMessageUserIdentifierSerialized } from './swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
/**
 * message for sending an information in
 * the peer to peer decentralized system.
 * This interface describes deserialized
 * message body.
 *
 * @export
 * @interface ISwarmMessage
 * @property {string} typ - a type of the message
 * @property {string | Buffer} pld - payload of the message is a buffer or a string
 * @property {string} uid - an identity of the user which post the message
 * @property {string} tss - UNIX timestamp in UTC when the message was posted. In seconds
 * @property {string} iss - the service in which the message was generated
 * @property {string} alg - the algorythm used for the signature
 * @property {string} sig - a signature created with the user private key.
 *
 * The signature must sign all the fields, including
 * the algorithm it used.
 */
export interface ISwarmMessageBodyDeserialized {
  typ: string | number;
  pld: string | Buffer;
  ts: number;
  iss: string;
  alg: string;
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
}

/**
 * this is representation of a message deserialized.
 *
 * @export
 * @interface ISwarmMessage
 * @extends {ISwarmMessageBodyDeserialized}
 */
export interface ISwarmMessage extends Omit<ISwarmMessageRaw, 'bdy'> {
  bdy: ISwarmMessageBodyDeserialized;
}
