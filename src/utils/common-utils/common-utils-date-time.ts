/**
 * returns a number of seeconds
 * rounded to neares integer
 * less than
 *
 * @export
 * @param {number} milliseconds
 * @returns {number}
 */
export function getSecondsByMilliseconds(milliseconds: number): number {
  return Math.floor(milliseconds / 1000);
}
