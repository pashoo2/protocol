import { NTPClient, NTPConfig } from 'ntpclient';
import { 
    COMMON_DATE_TIME_NTP_SERVERS_POOL,
    COMMON_DATE_TIME_NTP_SERVER_MAX_FAILS_CHECK_PERIOD_MS,
    COMMON_DATE_TIME_NTP_SERVER_MAX_FAILS_PERCENTAGE_DURING_CHECK_PERIOD,
} from 'const/common-date-time/common-date-time-sync.const';

const ntpServersPoolLength = COMMON_DATE_TIME_NTP_SERVERS_POOL.length;
let currentServerInPool = 0;

/**
 * returns settings to establish connection with the 
 * NTP server. It must be swithched if too many 
 * errors returned from the current server
 */
function getNtpServerConnectionSettings(): NTPConfig {
    if (currentServerInPool >= ntpServersPoolLength) {
        currentServerInPool = 0;
    }
    return COMMON_DATE_TIME_NTP_SERVERS_POOL[currentServerInPool];
}

export function createNtpClient(): NTPClient {
    return new NTPClient(getNtpServerConnectionSettings());
}

/**
 * the dafault ntp client used for the
 * time sync in the application
 */
let ntpClientDefault = createNtpClient();

/**
 * percentage as number
 * to avoid each time calculation
 */
const maxFailsPercentageAsNumber = COMMON_DATE_TIME_NTP_SERVER_MAX_FAILS_PERCENTAGE_DURING_CHECK_PERIOD / 100;
/**
 * the count of fails of a timeout
 * requsts during the last 60 seconds
 */
let ntpCurrentClientFails = 0;
/**
 * the count of requests sent to get
 * a time from the NTP server
 */
let ntpCurrentClientRequests = 0;

function switchNTPServer() {
    if (currentServerInPool === ntpServersPoolLength) {
        currentServerInPool = 0;
    }
    currentServerInPool =  Math.min(
        currentServerInPool += 1,
        ntpServersPoolLength,
    );
    ntpClientDefault = createNtpClient();
}

/**
 * the function calculates the current
 * percentage of fails. If it will be
 * more than MAX then the NTP server
 * currently used for time sync will
 * be switched to another one.
 */
function checkCurrentServersFails() {
    const currentFailsPercentage = ntpCurrentClientFails / ntpCurrentClientRequests;

    if (currentFailsPercentage > maxFailsPercentageAsNumber) {
        switchNTPServer();
    }
    // reset the current count of a
    // requests sent for time sync
    ntpCurrentClientFails = 0;
    ntpCurrentClientRequests = 0;
}
setInterval(
    checkCurrentServersFails,
    COMMON_DATE_TIME_NTP_SERVER_MAX_FAILS_CHECK_PERIOD_MS,
);

/**
 * log error, increase the
 * number of a requests failed
 * and check whether the max
 * limit of fails has reached
 * 
 * @param {Error} err 
 * @param {string} [err.message] msg 
 * @returns Error
 */
function onFailedToRequestNTPServer(
    err: Error,
    msg?: string,
): Error {
    console.error(
        msg || err && err.message,
        getNtpServerConnectionSettings(),
        err,
    );
    ntpCurrentClientFails += 1;
    checkCurrentServersFails();
    return err;
}

function convertNTPServerResponseToDate(response: Date | string): Date | Error {
    if (response instanceof Date) {
        return response;
    }
    if (typeof response === 'string') {
        try {
            return new Date(response);
        } catch(err) {
            return onFailedToRequestNTPServer(
                err,
                'Failed to parse the response from the NTP server',
            );
        }
    }
    return onFailedToRequestNTPServer(new Error('Unknown response format from the NTP server'));
}

/**
 * returns the currend date-time
 * which is used on the NTP server
 */
export function getNetworkTime(): Promise<Date | Error> {
    ntpCurrentClientRequests += 1;
    return ntpClientDefault.getNetworkTime()
        .then(convertNTPServerResponseToDate)
        .catch(onFailedToRequestNTPServer);
}
