export enum PSEUDO_NTP_CLASS_EVENTS {
    TIME_SYNC = 'TIME_SYNC',
}

export const PSEUDO_NTP_CLASS_LOGS_PREFIX = 'PseudoNTPClass';

export const PSEUDO_NTP_CLASS_DEFAULT_OPTIONS = {
    syncIntervalMs: 60000,
    maxFailedResponses: 3,
    retryRequestDelayMs: 5000,
    responseTimeoutMs: 1000,
    maxOffsetErrorS: 10,
}
