import { PseudoNTPClass as PseudoNTP } from 'classes/pseudo-ntp-class';
import { COMMON_DATE_TIME_NTP_SERVERS_POOL } from 'const/common-date-time/common-date-time-ntp-servers.const';
import { DATE_TIME_COMMON_CURRENT_DATE_UPDATE_INTERVAL_SECONDS } from 'const/common-date-time/common-date-time-main';
import { CONST_VALUES_RESTRICTIONS_COMMON_CURRENT_DATE_MAX_ERROR_SECONDS } from 'const/const-values-restrictions-common';

/**
 * returns a signed difference with the
 * date time sync server in seconds.
 *
 * @export
 * @returns {number}
 */
export const getTimeDiffWithSyncServerSeconds = (() => {
  let offsetSeconds: number = 0;
  const pseudoNTP = new PseudoNTP({
    serversPool: COMMON_DATE_TIME_NTP_SERVERS_POOL,
    maxOffsetErrorS: CONST_VALUES_RESTRICTIONS_COMMON_CURRENT_DATE_MAX_ERROR_SECONDS,
  });

  pseudoNTP.on(PseudoNTP.Event.TIME_SYNC, (differenceInSeconds: number) => {
    offsetSeconds = differenceInSeconds;
  });
  return () => offsetSeconds;
})();

/**
 * returns date given including the
 * offset from the sync server.
 *
 * @export
 * @param {Date} d
 * @returns {Date}
 */
export const getDateWithTimeSyncOffset = (d: Date): Date => {
  return new Date(d.getTime() + getTimeDiffWithSyncServerSeconds() * 1000);
};

/**
 * returns the current date and time
 * which is syncronized with the server.
 * To increase the performance and
 * avoid unnecessary calculations the
 * current date updated peridiocally
 * and the cached value returned by this
 * function.
 *
 * @export
 * @returs {Date}
 */
export const getCurrentDateSynced = (() => {
  let currentDate = getDateWithTimeSyncOffset(new Date());

  setInterval(() => {
    currentDate = getDateWithTimeSyncOffset(new Date());
  }, DATE_TIME_COMMON_CURRENT_DATE_UPDATE_INTERVAL_SECONDS * 1000);
  return () => currentDate;
})();

/**
 * returns milliseconds since 1970
 * cached and changes only on the current
 * date synced will change
 */
export const getDateNowInSeconds = (() => {
  const getSecondsByMilliseconds = (ms: number): number => Math.round(ms / 1000);
  let prevReturnValue = getSecondsByMilliseconds(Date.now());
  let prevDateSynced = getCurrentDateSynced();

  return () => {
    const currentDateSynced = getCurrentDateSynced();

    if (currentDateSynced !== prevDateSynced) {
      prevDateSynced = currentDateSynced;
      prevReturnValue = getSecondsByMilliseconds(Date.now());
    }
    return prevReturnValue;
  };
})();
