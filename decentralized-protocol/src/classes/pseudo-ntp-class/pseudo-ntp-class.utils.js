export const getSecondsByMilliseconds = (ms) => Math.round(ms / 1000);
export const getTimestampSeconds = () => getSecondsByMilliseconds(performance.now());
export const addSecondsToDate = (date, seconds) => {
    date.setSeconds(date.getSeconds() + seconds);
    return date;
};
export const datesDifferenceSeconds = (dateMinuend, dateSubtrahend) => {
    return getSecondsByMilliseconds(dateMinuend.getTime() - dateSubtrahend.getTime());
};
//# sourceMappingURL=pseudo-ntp-class.utils.js.map