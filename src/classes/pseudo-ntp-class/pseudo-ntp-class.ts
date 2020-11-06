import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base';
import {
  IPseudoNTPClassEvents,
  IPseudoNTPClassOptions,
  TPseudoNTPClassServersPoolOption,
  IPseudoNTPClassServerConnection,
  IPseudoNTPClassCommonOptionsMilliseconds,
  TPseudoNTPClassServerResponse,
  TPseudoNTPClassResponseWithTimesamps,
  IPseudoNTPClassServerConnectionField,
  IPseudoNTPClassServerConnectionCb,
} from './pseudo-ntp-class.types';
import {
  PSEUDO_NTP_CLASS_DEFAULT_OPTIONS,
  PSEUDO_NTP_CLASS_LOGS_PREFIX,
  PSEUDO_NTP_CLASS_EVENTS,
  PSEUDO_NTP_CLASS_REQUEST_OPTIONS,
} from './pseudo-ntp-class.const';
import { getTimestampSeconds, addSecondsToDate, datesDifferenceSeconds } from './pseudo-ntp-class.utils';
import HttpRequest from 'classes/basic-classes/http-request-class-base/http-request-class-base';
import { IHttpRequestOptions } from 'classes/basic-classes/http-request-class-base/http-request-class-base.types';

/**
 * This is class for time sync with the
 * server which provides API to get
 * the current date and time in UTC.
 * This allows to sync time for all users.
 *
 * @export
 * @class PseudoNTPClass
 * @extends {EventEmitter<IPseudoNTPClassEvents>}
 */
export class PseudoNTPClass extends EventEmitter<IPseudoNTPClassEvents> {
  public static Event = PSEUDO_NTP_CLASS_EVENTS;

  /**
   * true if the sync is running on
   *
   * @type {boolean}
   * @memberof PseudoNTPClass
   */
  public isRunning: boolean = false;

  /**
   * if sync process is running at now
   * then this flag will be set on true
   *
   * @protected
   * @type {boolean}
   * @memberof PseudoNTPClass
   */
  protected isSyncInProgress: boolean = false;

  protected serversPool?: TPseudoNTPClassServersPoolOption;

  // index of the server connected to
  protected currentServerIndex?: number;

  // options of the server connected to
  protected currentServerOptions?: IPseudoNTPClassServerConnection;

  protected currentServerRequestOptions?: IHttpRequestOptions;

  // a number of fails for the current server
  protected currentServerFails: number = 0;

  /**
   * the options used for requesting
   *
   * @protected
   * @type {IPseudoNTPClassCommonOptionsMilliseconds}
   * @memberof PseudoNTPClass
   */
  protected commonOptions: IPseudoNTPClassCommonOptionsMilliseconds = PSEUDO_NTP_CLASS_DEFAULT_OPTIONS;

  /**
   * the active interval for requesting
   * the server
   *
   * @protected
   * @type {NodeJS.Timer}
   * @memberof PseudoNTPClass
   */
  protected intervalRunning?: NodeJS.Timeout;

  constructor(options: IPseudoNTPClassOptions) {
    super();
    this.setOptions(options);
  }

  /**
   * start the requesting of the servers in the pool
   *
   * @memberof PseudoNTPClass
   */
  public start() {
    this.setCurrentServerFromPool();
    this.startInterval();
  }

  /**
   * stop the requesting of the servers in the pool
   *
   * @memberof PseudoNTPClass
   */
  public stop() {
    this.stopInterval();
  }

  /**
   * write something in console.log
   *
   * @protected
   * @param {(Error | string)} message
   * @memberof PseudoNTPClass
   */
  protected log = (message: Error | string) => {
    const { currentServerOptions } = this;
    const consoleMethod = message instanceof Error ? 'error' : 'log';

    console[consoleMethod](PSEUDO_NTP_CLASS_LOGS_PREFIX, `server is ${currentServerOptions ? currentServerOptions.server : 'not defined'}`, message);
  };

  /**
   * check is a server's options are valid
   *
   * @protected
   * @param {*} options
   * @returns {options is IPseudoNTPClassServerConnection}
   * @memberof PseudoNTPClass
   */
  protected checkServerOptions(options: any): options is IPseudoNTPClassServerConnection {
    return !!options && typeof options === 'object' && typeof options.server === 'string' && !!options.server.length;
  }

  /**
   * set options for the instance and
   * convert seconds in milliseconds
   * for all the options
   *
   * @protected
   * @param {IPseudoNTPClassOptions} options
   * @memberof PseudoNTPClass
   * @throws
   */
  protected setOptions(options: IPseudoNTPClassOptions) {
    const { serversPool, maxFailedResponses, maxOffsetErrorS, responseTimeoutS, retryRequestDelayS, syncIntervalS } = options;

    if (!(serversPool instanceof Array) || !serversPool.length) {
      throw new Error('The "servers pool" option must be defined');
    }
    this.serversPool = serversPool;

    const optionsInMs = {
      maxFailedResponses: typeof maxFailedResponses === 'number' ? maxFailedResponses : PSEUDO_NTP_CLASS_DEFAULT_OPTIONS.maxFailedResponses,
      maxOffsetErrorS: typeof maxOffsetErrorS === 'number' ? maxOffsetErrorS : PSEUDO_NTP_CLASS_DEFAULT_OPTIONS.maxOffsetErrorS,
      responseTimeoutMs: typeof responseTimeoutS === 'number' ? responseTimeoutS * 1000 : PSEUDO_NTP_CLASS_DEFAULT_OPTIONS.responseTimeoutMs,
      retryRequestDelayMs: typeof retryRequestDelayS === 'number' ? retryRequestDelayS * 1000 : PSEUDO_NTP_CLASS_DEFAULT_OPTIONS.retryRequestDelayMs,
      syncIntervalMs: typeof syncIntervalS === 'number' ? syncIntervalS * 1000 : PSEUDO_NTP_CLASS_DEFAULT_OPTIONS.syncIntervalMs,
    };

    this.commonOptions = optionsInMs;
  }

  protected setCurrentServerFromPoolIndex(): void {
    const { serversPool, currentServerIndex } = this;
    const serversPoolLength = serversPool!.length;
    let currentServerIndexResolved: number;

    if (typeof currentServerIndex === 'number') {
      if (currentServerIndex === serversPoolLength) {
        currentServerIndexResolved = 0;
      }
      currentServerIndexResolved = currentServerIndex + 1;
    } else {
      currentServerIndexResolved = 0;
    }
    this.currentServerIndex = currentServerIndexResolved;
  }

  /**
   * create an object to send the request
   * to the server to request the current
   * date and time
   *
   * @protected
   * @returns {(void | Error)}
   * @memberof PseudoNTPClass
   */
  protected setCurrentServerRequestOptions(): void | Error {
    const { currentServerOptions } = this;
    const { server: serverUrl } = currentServerOptions!;

    if (!currentServerOptions) {
      return new Error('The current server options is not defined');
    }
    this.currentServerRequestOptions = {
      ...PSEUDO_NTP_CLASS_REQUEST_OPTIONS,
      url: serverUrl,
    };
  }

  protected setCurrentServerFromPoolOptions(): void {
    const { serversPool, currentServerIndex } = this;
    const currentServerOptions = serversPool![currentServerIndex || 0];

    if (!this.checkServerOptions(currentServerOptions)) {
      // if the options is not defined for the server or there is no url for it
      // choose another server from the pool
      this.log(`Options is not defined for the server under the index ${currentServerIndex} in the pool`);
      this.setCurrentServerFromPoolIndex();
      return this.setCurrentServerFromPoolOptions();
    }
    this.currentServerOptions = currentServerOptions;

    const serCurrentServerRequestOptionsResult = this.setCurrentServerRequestOptions();

    if (serCurrentServerRequestOptionsResult instanceof Error) {
      return this.setCurrentServerFromPoolOptions();
    }
  }

  protected resetCurrentServerDescription() {
    this.currentServerFails = 0;
    this.currentServerOptions = undefined;
  }

  /**
   * choose the next server from the pool
   * and set it's options to use as the
   * current server
   *
   * @protected
   * @memberof PseudoNTPClass
   */
  protected setCurrentServerFromPool() {
    this.resetCurrentServerDescription();
    this.setCurrentServerFromPoolIndex();
    this.setCurrentServerFromPoolOptions();
  }

  /**
   * send a request to the server
   * and handle a response from it
   *
   * @protected
   * @memberof PseudoNTPClass
   */
  protected sync = async (): Promise<void> => {
    const { isSyncInProgress } = this;

    if (isSyncInProgress) {
      // if the sync process is
      // already is running on
      return;
    }
    this.isSyncInProgress = true;

    const response = await this.sendRequestToCurrentServer();

    if (response instanceof Error) {
      return this.handleSyncFail(response);
    }

    const resultOfHandlig = await this.handleServerResponse(response);

    if (resultOfHandlig instanceof Error) {
      return this.handleSyncFail(resultOfHandlig);
    }
    this.isSyncInProgress = false;
  };

  /**
   * starts the interval for requesting
   * the current server from the servers
   * pool for it's current time
   *
   * @protected
   * @memberof PseudoNTPClass
   */
  protected startInterval(): void {
    const { commonOptions } = this;
    const { syncIntervalMs } = commonOptions;

    if (this.isRunning) {
      this.log('Want to start the instance already running');
    } else {
      this.intervalRunning = setInterval(this.sync, syncIntervalMs);
      this.isRunning = true;
      this.sync();
    }
  }

  protected stopInterval() {
    if (this.intervalRunning) {
      clearInterval(this.intervalRunning);
      this.intervalRunning = undefined;
    }
    this.isRunning = false;
  }

  /**
   * handle failed sync attempt
   *
   * @param err
   */
  protected handleSyncFail(err?: Error) {
    if (err instanceof Error) {
      this.log(`Request failed ${err.message}`);
    }

    const { currentServerFails, commonOptions } = this;
    const { maxFailedResponses } = commonOptions;

    if (currentServerFails > maxFailedResponses) {
      this.log(`There is ${currentServerFails} fail`);
      this.setCurrentServerFromPool();
    }
  }

  /**
   * returns the date from the server response
   * or an error
   *
   * @private
   * @memberof PseudoNTPClass
   */
  protected parseServerResponse = (response: TPseudoNTPClassServerResponse): Error | Date => {
    const { currentServerOptions } = this;

    if (typeof (currentServerOptions as IPseudoNTPClassServerConnectionField).fieldName === 'string') {
      const { fieldName } = currentServerOptions as IPseudoNTPClassServerConnectionField;

      if (typeof response !== 'object') {
        return new Error(`Response must be an object to get the date from the field ${fieldName}`);
      }

      const fieldValue = (response as any)[fieldName];

      if (typeof fieldValue !== 'string') {
        return new Error(`Response field ${fieldName} must be a string`);
      }
      try {
        const resultParse = new Date(fieldValue);

        if (resultParse instanceof Date) {
          return resultParse;
        }
        return new Error(`Failed to parse string from the server response from field ${fieldName}`);
      } catch (err) {
        return err;
      }
    }
    if (typeof (currentServerOptions as IPseudoNTPClassServerConnectionCb).parseCallback === 'function') {
      const { parseCallback } = currentServerOptions as IPseudoNTPClassServerConnectionCb;

      if (!parseCallback.length) {
        this.log('The callback seems to have no arguments accepted');
      }
      try {
        const parseResponseResult = parseCallback(response);

        if (parseResponseResult instanceof Error) {
          return parseResponseResult;
        }
        if (parseResponseResult instanceof Date) {
          return parseResponseResult;
        }
      } catch (err) {}
      return new Error('The server response do not parse correctly');
    }
    if (typeof response === 'string') {
      try {
        const resultParse = new Date(response);

        if (resultParse instanceof Date) {
          return resultParse;
        }
      } catch (err) {}
      return new Error('Failed to parse string from the server response');
    }
    return new Error('There is unknown response format');
  };

  protected emitClientServerTimeDifference(timeDifferenceSeconds: number) {
    this.emit(PSEUDO_NTP_CLASS_EVENTS.TIME_SYNC, timeDifferenceSeconds);
  }

  /**
   * handle Date received in a server response
   * and make an adjustment based on the on the
   * time the request was sent and
   * the response was received.
   * If the difference is more than the max error
   * then emit the event.
   *
   * @protected
   * @param {Date} serverDate
   * @param {number} timestampReq - request sent in seconds
   * @param {number} timestampRes - response received in seconds
   * @param {Date} dateRes - Date when the responce received
   * @memberof PseudoNTPClass
   */
  protected handleServerDate(serverDate: Date, timestampReq: number, timestampRes: number, dateRes: Date): void {
    // we think that the request was received on the
    // server at half of the request-response time
    const adjustmentS = (timestampRes - timestampReq) / 2;
    const clientDate = addSecondsToDate(dateRes, adjustmentS);
    const offsetClientTimeFromServer = datesDifferenceSeconds(clientDate, serverDate);

    if (offsetClientTimeFromServer) {
      const { commonOptions } = this;
      const { maxOffsetErrorS } = commonOptions;

      if (Math.abs(offsetClientTimeFromServer) > maxOffsetErrorS) {
        this.log(`The client-server time difference is equals to ${offsetClientTimeFromServer}`);
        this.emitClientServerTimeDifference(offsetClientTimeFromServer);
      }
    }
  }

  protected convertServerResponseRaw(responseRaw: { [key: string]: string }): TPseudoNTPClassServerResponse | Error {
    return responseRaw;
  }

  /**
   * handle the responce from the server
   *
   * @private
   * @memberof PseudoNTPClass
   */
  private handleServerResponse = async (responseWithTimestamps: TPseudoNTPClassResponseWithTimesamps): Promise<void | Error> => {
    const { responseRaw, timestampReq, timestempRes, dateRes } = responseWithTimestamps;
    const response = this.convertServerResponseRaw(responseRaw);

    if (response instanceof Error) {
      return response;
    }

    const responseResult = this.parseServerResponse(response);

    if (responseResult instanceof Error) {
      return responseResult;
    }
    if (responseResult instanceof Date) {
      return this.handleServerDate(responseResult, timestampReq, timestempRes, dateRes);
    }
    return new Error('An unknown result of parsing the response');
  };

  /**
   * send the HTTP request to the current
   * server from the pool
   *
   * @private
   * @memberof PseudoNTPClass
   */
  private async sendRequestToCurrentServer(): Promise<Error | TPseudoNTPClassResponseWithTimesamps> {
    const { currentServerRequestOptions } = this;
    // timestamp when the request sent
    const timestampReq = getTimestampSeconds();
    const request = new HttpRequest({
      ...currentServerRequestOptions!,
    });
    let responseRaw;

    try {
      responseRaw = await request.send();

      if (responseRaw instanceof Error) {
        console.error(responseRaw);
        return new Error('The request failed');
      }
    } catch (err) {
      return err;
    }
    // timestamp when the response received
    const timestempRes = getTimestampSeconds();
    const dateRes = new Date();
    return {
      responseRaw,
      timestampReq,
      timestempRes,
      dateRes,
    };
  }
}

export default PseudoNTPClass;
