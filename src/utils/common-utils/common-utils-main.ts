import { isTypedArray } from '../typed-array-utils';
import { TTypedArrays } from '../../types/main.types';

export const isDefined = <T>(v: T): v is NonNullable<T> => v != null;

/**
 * Count of items
 *
 * @template T
 * @param {T} arg - argument which is able to count it's items number
 * @returns {number} - chars in string, bytes in typed arrays, keys in object, members in map, items in set, items in array
 */
export const getItemsCount = <T extends Map<any, any> | Set<any> | Array<any> | {} | string | TTypedArrays>(arg: T): number => {
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

/**
 * Return a Promise which will be resolved
 * when the callback returns any value
 * which is defined(not null, ubdefined, NaN).
 *
 * @template R - resolved type return by the callback function
 * @param {() => R | undefined} cb - callback function called each interval till not trow or return somethind
 * @param {number} [checkIntervalMs=100] - interval when the callback will be called
 * @param {number} [timeoutMs = 360000] - timeout when the promise will be rejected if not resolved before
 * @returns {Promise<R>}
 * @throw - rejects on timeout or if the callback thrown an error
 */
export const waitFor = <R>(cb: () => NonNullable<R> | undefined, checkIntervalMs: number = 100, timeoutMs: number = 360000): Promise<R> => {
  return new Promise((res, rej) => {
    let timeout: NodeJS.Timer | undefined;
    let checkInterval: NodeJS.Timeout | undefined;
    const clearTimers = () => {
      checkInterval && clearInterval(checkInterval);
      timeout && clearTimeout(timeout);
      checkInterval = undefined;
      timeout = undefined;
    };

    if (timeoutMs) {
      timeout = setTimeout(() => {
        clearTimers();
        rej(new Error('Timeout'));
      }, timeoutMs);
    }
    checkInterval = setInterval(() => {
      let result;
      try {
        result = cb();
      } catch (err) {
        clearTimers();
        rej(err);
        return;
      }
      if (isDefined(result)) {
        clearTimers();
        res(result);
      }
    }, checkIntervalMs);
  });
};
