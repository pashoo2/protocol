import { __awaiter } from "tslib";
import { getEventEmitterClass } from "../basic-classes/event-emitter-class-base/event-emitter-class-base";
import { PSEUDO_NTP_CLASS_DEFAULT_OPTIONS, PSEUDO_NTP_CLASS_LOGS_PREFIX, PSEUDO_NTP_CLASS_EVENTS, PSEUDO_NTP_CLASS_REQUEST_OPTIONS, } from './pseudo-ntp-class.const';
import { getTimestampSeconds, addSecondsToDate, datesDifferenceSeconds } from './pseudo-ntp-class.utils';
import { HttpRequest, IHttpRequestOptions } from "../basic-classes/http-request-class-base";
export class PseudoNTPClass extends getEventEmitterClass() {
    constructor(options) {
        super();
        this.isRunning = false;
        this.isSyncInProgress = false;
        this.currentServerFails = 0;
        this.commonOptions = PSEUDO_NTP_CLASS_DEFAULT_OPTIONS;
        this.log = (message) => {
            const { currentServerOptions } = this;
            const consoleMethod = message instanceof Error ? 'error' : 'log';
            console[consoleMethod](PSEUDO_NTP_CLASS_LOGS_PREFIX, `server is ${currentServerOptions ? currentServerOptions.server : 'not defined'}`, message);
        };
        this.sync = () => __awaiter(this, void 0, void 0, function* () {
            const { isSyncInProgress } = this;
            if (isSyncInProgress) {
                return;
            }
            this.isSyncInProgress = true;
            const response = yield this.sendRequestToCurrentServer();
            if (response instanceof Error) {
                return this.handleSyncFail(response);
            }
            const resultOfHandlig = yield this.handleServerResponse(response);
            if (resultOfHandlig instanceof Error) {
                return this.handleSyncFail(resultOfHandlig);
            }
            this.isSyncInProgress = false;
        });
        this.parseServerResponse = (response) => {
            const { currentServerOptions } = this;
            if (typeof currentServerOptions.fieldName === 'string') {
                const { fieldName } = currentServerOptions;
                if (typeof response !== 'object') {
                    return new Error(`Response must be an object to get the date from the field ${fieldName}`);
                }
                const fieldValue = response[fieldName];
                if (typeof fieldValue !== 'string') {
                    return new Error(`Response field ${fieldName} must be a string`);
                }
                try {
                    const resultParse = new Date(fieldValue);
                    if (resultParse instanceof Date) {
                        return resultParse;
                    }
                    return new Error(`Failed to parse string from the server response from field ${fieldName}`);
                }
                catch (err) {
                    return err;
                }
            }
            if (typeof currentServerOptions.parseCallback === 'function') {
                const { parseCallback } = currentServerOptions;
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
                }
                catch (err) { }
                return new Error('The server response do not parse correctly');
            }
            if (typeof response === 'string') {
                try {
                    const resultParse = new Date(response);
                    if (resultParse instanceof Date) {
                        return resultParse;
                    }
                }
                catch (err) { }
                return new Error('Failed to parse string from the server response');
            }
            return new Error('There is unknown response format');
        };
        this.handleServerResponse = (responseWithTimestamps) => __awaiter(this, void 0, void 0, function* () {
            const { responseRaw, timestampReq, timestampRes: timestempRes, dateRes } = responseWithTimestamps;
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
        });
        this.setOptions(options);
    }
    start() {
        this.setCurrentServerFromPool();
        this.startInterval();
    }
    stop() {
        this.stopInterval();
    }
    checkServerOptions(options) {
        return !!options && typeof options === 'object' && typeof options.server === 'string' && !!options.server.length;
    }
    setOptions(options) {
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
    setCurrentServerFromPoolIndex() {
        const { serversPool, currentServerIndex } = this;
        const serversPoolLength = serversPool.length;
        let currentServerIndexResolved;
        if (typeof currentServerIndex === 'number') {
            if (currentServerIndex === serversPoolLength) {
                currentServerIndexResolved = 0;
            }
            currentServerIndexResolved = currentServerIndex + 1;
        }
        else {
            currentServerIndexResolved = 0;
        }
        this.currentServerIndex = currentServerIndexResolved;
    }
    setCurrentServerRequestOptions() {
        const { currentServerOptions } = this;
        const { server: serverUrl } = currentServerOptions;
        if (!currentServerOptions) {
            return new Error('The current server options is not defined');
        }
        this.currentServerRequestOptions = Object.assign(Object.assign({}, PSEUDO_NTP_CLASS_REQUEST_OPTIONS), { url: serverUrl });
    }
    setCurrentServerFromPoolOptions() {
        const { serversPool, currentServerIndex } = this;
        const currentServerOptions = serversPool[currentServerIndex || 0];
        if (!this.checkServerOptions(currentServerOptions)) {
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
    resetCurrentServerDescription() {
        this.currentServerFails = 0;
        this.currentServerOptions = undefined;
    }
    setCurrentServerFromPool() {
        this.resetCurrentServerDescription();
        this.setCurrentServerFromPoolIndex();
        this.setCurrentServerFromPoolOptions();
    }
    startInterval() {
        const { commonOptions } = this;
        const { syncIntervalMs } = commonOptions;
        if (this.isRunning) {
            this.log('Want to start the instance already running');
        }
        else {
            this.intervalRunning = setInterval(this.sync, syncIntervalMs);
            this.isRunning = true;
            void this.sync();
        }
    }
    stopInterval() {
        if (this.intervalRunning) {
            clearInterval(this.intervalRunning);
            this.intervalRunning = undefined;
        }
        this.isRunning = false;
    }
    handleSyncFail(err) {
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
    emitClientServerTimeDifference(timeDifferenceSeconds) {
        this.emit(PSEUDO_NTP_CLASS_EVENTS.TIME_SYNC, timeDifferenceSeconds);
    }
    handleServerDate(serverDate, timestampReq, timestampRes, dateRes) {
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
    convertServerResponseRaw(responseRaw) {
        return responseRaw;
    }
    sendRequestToCurrentServer() {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentServerRequestOptions } = this;
            const timestampReq = getTimestampSeconds();
            const request = new HttpRequest(Object.assign({}, currentServerRequestOptions));
            let responseRaw;
            try {
                responseRaw = yield request.send();
                if (responseRaw instanceof Error) {
                    console.error(responseRaw);
                    return new Error('The request failed');
                }
            }
            catch (err) {
                return err;
            }
            const timestempRes = getTimestampSeconds();
            const dateRes = new Date();
            return {
                responseRaw,
                timestampReq,
                timestampRes: timestempRes,
                dateRes,
            };
        });
    }
}
PseudoNTPClass.Event = PSEUDO_NTP_CLASS_EVENTS;
export default PseudoNTPClass;
//# sourceMappingURL=pseudo-ntp-class.js.map