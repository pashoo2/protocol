import { PseudoNTPClass as PseudoNTP } from "../../classes/pseudo-ntp-class";
import { COMMON_DATE_TIME_NTP_SERVERS_POOL } from "../../const/common-date-time/common-date-time-ntp-servers.const";
import { DATE_TIME_COMMON_CURRENT_DATE_UPDATE_INTERVAL_SECONDS } from "../../const/common-date-time/common-date-time-main";
import { CONST_VALUES_RESTRICTIONS_COMMON_CURRENT_DATE_MAX_ERROR_SECONDS } from "../../const/const-values-restrictions-common";
export const getTimeDiffWithSyncServerSeconds = (() => {
    let offsetSeconds = 0;
    const pseudoNTP = new PseudoNTP({
        serversPool: COMMON_DATE_TIME_NTP_SERVERS_POOL,
        maxOffsetErrorS: CONST_VALUES_RESTRICTIONS_COMMON_CURRENT_DATE_MAX_ERROR_SECONDS,
    });
    pseudoNTP.on(PseudoNTP.Event.TIME_SYNC, (differenceInSeconds) => {
        offsetSeconds = differenceInSeconds;
    });
    return () => offsetSeconds;
})();
export const getDateWithTimeSyncOffset = (d) => {
    return new Date(d.getTime() + getTimeDiffWithSyncServerSeconds() * 1000);
};
export const getCurrentDateSynced = (() => {
    let currentDate = getDateWithTimeSyncOffset(new Date());
    setInterval(() => {
        currentDate = getDateWithTimeSyncOffset(new Date());
    }, DATE_TIME_COMMON_CURRENT_DATE_UPDATE_INTERVAL_SECONDS * 1000);
    return () => currentDate;
})();
export const getDateNowInSeconds = (() => {
    const getSecondsByMilliseconds = (ms) => Math.round(ms / 1000);
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
//# sourceMappingURL=common-utils.date-time.js.map