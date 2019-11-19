export const commonUtilsArrayOrderByDecComparationFunction = <T>(
  a: T,
  b: T
): number => Number(b) - Number(a);

/**
 * sort array by decreasing
 * value on increased index
 * @param {any[]} arr
 */
export const commonUtilsArrayOrderByDec = <T>(arr: T[]): T[] =>
  arr.sort(commonUtilsArrayOrderByDecComparationFunction);

/**
 * delete an item from the array
 * @param {Array} arr 
 * @param {any} item 
 */  
export const commonUtilsArrayDeleteFromArray = <T>(arr: T[], item: T) => {
  if (
    arr instanceof Array
    && arr.length  
  ) {
    const idxOfItem = arr.findIndex((el: T) => el === item);

    if (idxOfItem !== -1) {
      arr.splice(idxOfItem, 1);
    }
  }
}

/**
 * call a callback function for an each item in the
 * array till the result is not an intstance of the
 * Error. If any callback resulted with an Error
 * then the execution will break.
 */
export const commonUtilsArrayDoCallbackTillNoError = <T>(arr: T[], cb: (v: T) => Error | any): Error | void => {
  if (!(arr instanceof Array)) {
    return new Error('The array value must be an instance of Array');
  }

  const len = arr.length;
  let idx = 0;
  let r: Error | any;

  for(; idx < len; idx += 1) {
    r = cb(arr[idx]);

    if (r instanceof Error) {
      return r;
    }
  }
}

/**
 * calculate the overall lenght
 * of the numeric array in bytes
 * @param {number[]} arr 
 * @param {number} [maxNumber] - maximum value of the valid number
 * @param {number} [minNumber] - minimum value of the valid number
 * @returns {number | Error} - return a length of the array or an Error 
 * if a non-finite or an unsafe number will be met
 */
export const commonUtilsArrayCalculateLengthOfIntegerArray = (
  arr: number[], 
  maxNumber?: number,
  minNumber?: number,
): number | Error => {
  if (!(arr instanceof Array)) {
    return new Error('The array value must be an instance of Array');
  }

  const maxNumberRes = typeof maxNumber === 'number'
    ? maxNumber
    : Number.MAX_SAFE_INTEGER;
  const minNumberRes = typeof minNumber === 'number'
    ? minNumber
    : 0;
  const len = arr.length;
  let idx = 0;
  let item;
  let result = 0;

  for(; idx < len; idx += 1) {
    item = arr[idx];

    if (typeof item !== 'number') {
      return new Error('The value is not a number');
    }
    if (item < 0) {
      return new Error('The number must be greater than 0');
    }
    if (!Number.isFinite(item)) {
      return new Error('The value is not a finite number');
    }
    if (item > maxNumberRes) {
      return new Error('The number is too big');
    }
    if (item < minNumberRes) {
      return new Error('The number is too small');
    }
    if (item < 255) {
      result += 1;
    } else if (item < 65537) {
      result += 4;
    } else if (item > 65537) {
      result += 8;
    }
  }
  return result;
}