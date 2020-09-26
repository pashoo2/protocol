import { FirstPrameter } from '../../types';
import { commonUtilsIsAllArraysEquals } from '../common-utils';

export const memoize = <
  F extends (arg: any) => any,
  A extends FirstPrameter<F>,
  R extends ReturnType<F>
>(
  functionToMemoize: F
): ((arg: A) => R) => {
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
export const memoizeLastReturnedValue = <F extends (...arg: any[]) => any>(
  func: F
) => {
  let lastArgs: Parameters<F>;
  let lastReturnValue: ReturnType<F>;
  return (...args: Parameters<F>): ReturnType<F> => {
    if (!lastArgs || !commonUtilsIsAllArraysEquals(lastArgs, args)) {
      lastArgs = args;
      lastReturnValue = func(...args);
    }
    return lastReturnValue;
  };
};
