export const getSecondsByMilliseconds = (ms: number): number =>
  Math.round(ms / 1000);

export const getTimestampSeconds = () =>
  getSecondsByMilliseconds(performance.now());

export const addSecondsToDate = (date: Date, seconds: number): Date => {
  date.setSeconds(date.getSeconds() + seconds);
  return date;
};

export const datesDifferenceSeconds = (
  dateMinuend: Date,
  dateSubtrahend: Date
): number => {
  return getSecondsByMilliseconds(
    dateMinuend.getTime() - dateSubtrahend.getTime()
  );
};
