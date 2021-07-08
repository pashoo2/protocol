/**
 * Encryption used for the channel
 *
 * @export
 * @enum {number}
 */
export enum SWARM_MESSAGES_CHANNEL_ENCRYPTION {
  /**
   * no additional messages encryption
   */
  PUBLIC = 'PUBLIC',
  /**
   * encrypt messages with a key of the receiver
   */
  PRIVATE = 'PRIVATE',
  /**
   * encrypt messages with a password
   */
  PASSWORD = 'PASSWORD',
}
