/**
 * message for sending an information in
 * the peer to peer decentralized system
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
export interface ISwarmMessage {
  typ: string | number;
  pld: string | Buffer;
  uid: string;
  ts: number;
  iss: string;
  alg: string;
  sig: string | Buffer;
}
