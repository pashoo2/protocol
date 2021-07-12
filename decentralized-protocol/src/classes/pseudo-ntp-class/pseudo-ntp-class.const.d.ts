import { HTTP_REQUEST_CACHE_CONTROL, HTTP_REQUEST_METHOD, HTTP_REQUEST_MODE } from 'classes/basic-classes/http-request-class-base';
export declare enum PSEUDO_NTP_CLASS_EVENTS {
    TIME_SYNC = "TIME_SYNC"
}
export declare const PSEUDO_NTP_CLASS_LOGS_PREFIX = "PseudoNTPClass";
export declare const PSEUDO_NTP_CLASS_DEFAULT_OPTIONS: {
    syncIntervalMs: number;
    maxFailedResponses: number;
    retryRequestDelayMs: number;
    responseTimeoutMs: number;
    maxOffsetErrorS: number;
};
export declare const PSEUDO_NTP_CLASS_REQUEST_OPTIONS: {
    cache: HTTP_REQUEST_CACHE_CONTROL;
    method: HTTP_REQUEST_METHOD;
    mode: HTTP_REQUEST_MODE;
};
//# sourceMappingURL=pseudo-ntp-class.const.d.ts.map