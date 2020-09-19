import { FirstPrameter } from 'types/helper.types';
import { isTypedArray } from '../typed-array-utils';
import { TTypedArrays } from '../../types/main.types';

export const isDefined = <T>(v: T): v is NonNullable<T> => v != null;

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
 * Count of items
 *
 * @template T
 * @param {T} arg - argument which is able to count it's items number
 * @returns {number} - chars in string, bytes in typed arrays, keys in object, members in map, items in set, items in array
 */
export const getItemsCount = <
  T extends Map<any, any> | Set<any> | Array<any> | {} | string | TTypedArrays
>(
  arg: T
): number => {
  if (arg instanceof Map || arg instanceof Set) {
    return arg.size;
  } else if (Array.isArray(arg)) {
    return arg.length;
  } else if (arg && typeof arg === 'object') {
    return Object.keys(arg).length;
  } else if (typeof arg === 'string') {
    return arg.length;
  } else if (isTypedArray(arg)) {
    return arg.byteLength;
  }
  throw new Error('Unsupported type');
};
