/**
 * return how many bytes in the
 * number
 *
 * @export
 * @param {number} num
 * @returns {number | Error}
 */
export function bytesInInteger(num: number): number | Error {
  if (typeof num !== 'number') {
    return Error('The argument must be a number');
  }
  if (!Number.isInteger(num)) {
    return Error('The number must be an integer');
  }
  if (num <= 255) {
    return 1;
  } else if (num <= 4294967295) {
    return 4;
  }
  return 8;
}
