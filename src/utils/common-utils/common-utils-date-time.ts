import addSeconds from 'date-fns/addSeconds';

/**
 * returns a signed difference with the
 * date time sync server in seconds.
 *
 * @export
 * @returns {number}
 */
export function getTimeDiffWithSyncServerSeconds(): number {
    // TODO
    return 1000;
}

/**
 * returns date given including the
 * offset from the sync server.
 *
 * @export
 * @param {Date} d
 * @returns {Date}
 */
export function getDateWithTimeSyncOffset(d: Date): Date {
    return addSeconds(
        d,
        getTimeDiffWithSyncServerSeconds(),
    );
}

/**
 * returns the current date and time
 * which is syncronized with the server
 *
 * @export
 * @returs {Date}
 */
export function getCurrentDate(): Date {
    return getDateWithTimeSyncOffset(
        new Date(),
    );
}

export function getSecondsByMilliseconds(milliseconds: number): number {
    return Math.floor(milliseconds / 1000);
}
