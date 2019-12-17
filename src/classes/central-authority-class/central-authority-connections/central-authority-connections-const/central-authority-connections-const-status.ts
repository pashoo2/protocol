/**
 * the current status of the connection:
 * CONNECTED - connected to the firebase in the anonymous mode
 * AUTHORIZED - connected and authorized
 * DISCONNECTED - not authorized or connected in the anonymous mode
 *
 * @export
 * @enum {number}
 */
export enum CA_CONNECTION_STATUS {
  DISCONNECTED,
  CONNECTED,
  AUTHORIZED,
}
