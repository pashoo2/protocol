import { FirstPrameter } from '../../types';
import { commonUtilsAreAllArraysEqual } from '../common-utils';
import { mapValuesForFurtherComparision } from './data-cache-utils-main';

export const memoize = <F extends (arg: any) => any, A extends FirstPrameter<F>, R extends ReturnType<F>>(functionToMemoize: F): ((arg: A) => R) => {
  const cachedResults = new Map<A, R>();
  const memoized = (a: A): R => {
    const cachedResult = cachedResults.get(a);

    if (cachedResult) {
      return cachedResult;
    }

    const result = functionToMemoize(a);

    cachedResults.set(a, result);
    return result;
  };

  memoized.clean = () => cachedResults.clear();
  return memoized;
};

/**
 * Returns a function which will return the same result
 * as the last one if the arguments are equals to the
 * arguments for the last result memoized.
 *
 * @template R
 * @template A
 * @template F
 * @param {F} func
 * @returns {(...arg: A) => R} - returns a function which only the last result will be memoized
 */
export const memoizeLastReturnedValue = <F extends (...arg: any[]) => any>(func: F) => {
  let lastArgs: any[];
  let lastReturnValue: ReturnType<F>;

  return (...args: Parameters<F>): ReturnType<F> => {
    const argsMappedForComparision = mapValuesForFurtherComparision(args);

    if (!lastArgs || !commonUtilsAreAllArraysEqual(lastArgs, argsMappedForComparision)) {
      lastArgs = argsMappedForComparision;
      lastReturnValue = func(...args);
    }
    return lastReturnValue;
  };
};
