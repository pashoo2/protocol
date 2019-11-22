import { NTPConfig } from 'ntpclient';
import { CONST_VALIDATION_VALUES_MESSAGING_MAX_ERROR_SECONDS } from 'const/const-validation-values/const-validation-values-messaging-date';

// the default port for ntp is 123
export const COMMON_DATE_TIME_NTP_SERVER_PORT_DEFAULT = 123; 

export const COMMON_DATE_TIME_NTP_SERVER_RESPONSE_TIMEOUT_MS = CONST_VALIDATION_VALUES_MESSAGING_MAX_ERROR_SECONDS * 1000;

export const COMMON_DATE_TIME_NTP_SERVER_MAX_FAILS_CHECK_PERIOD_MS = 30000;

export const COMMON_DATE_TIME_NTP_SERVER_MAX_FAILS_PERCENTAGE_DURING_CHECK_PERIOD = 10;

/**
 * settings for NTP servers pool
 * used to connect on one of them
 * to syncronize the client side time
 */
export const COMMON_DATE_TIME_NTP_SERVERS_POOL: NTPConfig[] = [
    {
        server: 'pool.ntp.org',
        port: COMMON_DATE_TIME_NTP_SERVER_PORT_DEFAULT,
        replyTimeout: COMMON_DATE_TIME_NTP_SERVER_RESPONSE_TIMEOUT_MS,
    },
    {
        server: '',
        port: COMMON_DATE_TIME_NTP_SERVER_PORT_DEFAULT,
        replyTimeout: COMMON_DATE_TIME_NTP_SERVER_RESPONSE_TIMEOUT_MS,
    },
    {
        server: '',
        port: COMMON_DATE_TIME_NTP_SERVER_PORT_DEFAULT,
        replyTimeout: COMMON_DATE_TIME_NTP_SERVER_RESPONSE_TIMEOUT_MS,
    },
    {
        server: '',
        port: COMMON_DATE_TIME_NTP_SERVER_PORT_DEFAULT,
        replyTimeout: COMMON_DATE_TIME_NTP_SERVER_RESPONSE_TIMEOUT_MS,
    },
    {
        server: '',
        port: COMMON_DATE_TIME_NTP_SERVER_PORT_DEFAULT,
        replyTimeout: COMMON_DATE_TIME_NTP_SERVER_RESPONSE_TIMEOUT_MS,
    },
];
