import { PSEUDO_NTP_CLASS_EVENTS } from './pseudo-ntp-class.const';

export type TPseudoNTPClassResponseRaw = any;

/**
 * @param {number} timestampReq - timestamp when the request was sent
 * @param {number} timestempRes - timestamp when the response was received
 * @param {Date} dateRes - date when the response was received
 * @param {TPseudoNTPClassResponseRaw} responseRaw - reqponse from the server
 */
export type TPseudoNTPClassResponseWithTimesamps = {
  timestampReq: number;
  timestempRes: number;
  dateRes: Date;
  responseRaw: TPseudoNTPClassResponseRaw;
};

/**
 *  events emitted by the pseudo ntp
 *
 * @export
 * @interface IPseudoNTPClassEvents
 */
export interface IPseudoNTPClassEvents {
  /**
   * after syncronization with the
   * server emit the event and
   * returns the time offset in
   * seconds
   */
  [PSEUDO_NTP_CLASS_EVENTS.TIME_SYNC]: number;
}

export type TPseudoNTPClassServerResponse = string | { [key: string]: any };

/**
 *
 * @export
 * @interface IPseudoNTPClassServerConnection
 * @param {string} server - the url of the server connect to
 * @param {string} fieldName - name of the field where is
 * the server's current date as a string in ISO format
 * @param {function} parseCallback - callback which called
 * to parse the response from the server and must return
 * the Date on the server
 */
export interface IPseudoNTPClassServerConnection {
  server: string;
  fieldName?: string;
  parseCallback: (response: TPseudoNTPClassServerResponse) => Date | Error;
}

export type TPseudoNTPClassServersPoolOption = IPseudoNTPClassServerConnection[];

/**
 * @param {number} [1] responseTimeoutS - timeout for reponse from the
 * server in seconds
 * @param {number} [60] syncIntervalS - interval in seconds to request the server
 * to get the time on it
 * @param {number} [10] maxOffsetErrorS - the maximum offset between the client
 * and the server time which will not be suggested as error
 * @param {number} [3] maxFailedResponses - the maximum fails of the responses
 * to switch on the another server
 * @param {number} [5] retryRequestDelayS - the delay to repeat the request
 * after fail
 */
export interface IPseudoNTPClassCommonOptions {
  syncIntervalS?: number;
  maxFailedResponses?: number;
  retryRequestDelayS?: number;
  responseTimeoutS?: number;
  maxOffsetErrorS?: number;
}

export interface IPseudoNTPClassCommonOptionsMilliseconds {
  syncIntervalMs: number;
  maxFailedResponses: number;
  retryRequestDelayMs: number;
  responseTimeoutMs: number;
  maxOffsetErrorS: number;
}

/**
 * options for pseudo ntp class
 *
 * @export
 * @interface IPseudoNTPClassOptions
 * @param {IPseudoNTPClassServerConnection[]} serversPool - this is options for
 * the pool of the servers to receive the current date and time
 */
export interface IPseudoNTPClassOptions extends IPseudoNTPClassCommonOptions {
  serversPool: TPseudoNTPClassServersPoolOption;
}
