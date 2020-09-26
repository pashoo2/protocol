import { memoize } from '../data-cache-utils/data-cache-utils-memoization';
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

/**
 * Return ten to the power memoized
 * to reduce number of calculations.
 *
 * @param {number} power - power of 10
 * @returns {number} - Math.pow(10, power)
 */
export const getPowTen = memoize((power: number): number => {
  return Math.pow(10, power);
});

/**
 * Round a number to a requered precision.
 *
 * @param {number} num - a number to round
 * @param {number} precision - count of digits after floating point
 * @returns {number} - the number rounding to precision required
 */
export const round = (num: number, precision: number): number => {
  const mult = getPowTen(precision);

  return Math.round((num + Number.EPSILON) * mult) / mult;
};
