import {
  IDataCachingDecoratorDecoratedFunction,
  IDataCachingDecoratorCachedValue,
} from './data-cache-utils-caching-decorator.types';
import { commonUtilsArrayOrderByDec } from 'utils/common-utils/common-utils';
import { DATA_CACHING_DECORATOR_DEFAULT_CACHE_CAPACITY } from './data-cache-utils-caching-decorator.const';

/**
 * decorator for a method, will be wrapped for
 * caching values of a mostly used keys.
 * Must be used only for immutable
 * key-value stores
 * @property {number} cachedValuesCount - number
 * of a cached values
 */
export const dataCachingUtilsCachingDecorator = <T, V, I extends object>(
  cacheItemsCapacity: number = DATA_CACHING_DECORATOR_DEFAULT_CACHE_CAPACITY
) => {
  /**
   *
   *
   * @param {object} target
   * @param {string} propertyKey
   * @param {PropertyDescriptor} descriptor
   * @returns
   */
  return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
    let newDescriptor;
    // the original method, will be wrapped
    const methodOrigin: IDataCachingDecoratorDecoratedFunction<T, V> = descriptor.value;
    // key - rating
    const keysRaiting = new Map<T, number>();
    let keysHighestRatings: number[] = [];
    const cache = new Map<T, IDataCachingDecoratorCachedValue<V>>();
    const cachedValuesCountLastIndex = cacheItemsCapacity - 1;

    if (typeof methodOrigin !== 'function') {
      throw new Error('dataCachingUtilsCachingDecorator failed to decorate a non function property');
    }

    async function cachingWrapper(this: I, key: T): Promise<V> {
      const cachedValueForKey = cache.get(key);

      // check if the value of the
      // key was cached
      if (cachedValueForKey != null) {
        return cachedValueForKey.value;
      }

      const resultedValue = await methodOrigin.call(this, key);

      if (!(resultedValue instanceof Error) && resultedValue != null) {
        const theMinimalRaitingValue = keysHighestRatings[cachedValuesCountLastIndex];
        // increase the key raiting on each read of the key
        const keyRaiting = Number(keysRaiting.get(key) || 0) + 1;

        keysRaiting.set(key, keyRaiting);
        if (!theMinimalRaitingValue || theMinimalRaitingValue < keyRaiting) {
          // put the key rating on the last index
          keysHighestRatings[Math.min(cachedValuesCountLastIndex, keysHighestRatings.length)] = keyRaiting;
          // sort the resulted array an replace the highest rating
          // array with the ordered copy of it
          keysHighestRatings = commonUtilsArrayOrderByDec<number>(keysHighestRatings);

          // if the minimal rating value is exists.
          // Means that the cache is overflow
          // and it's necessary to delete
          // a value for the key with the minimal rating
          // from the cache.
          if (theMinimalRaitingValue) {
            // find the key with the minimal value of the rating
            // which value was stored in the cache
            for (const entry of cache) {
              if (entry[1].rating === theMinimalRaitingValue) {
                // if found the key with the minimal
                // rating delete it from the cache
                cache.delete(entry[0]);
                break;
              }
            }
          }

          // cache the key value
          cache.set(key, {
            rating: keyRaiting,
            value: resultedValue,
          });
        }
      }
      return resultedValue;
    }

    if (descriptor.writable) {
      descriptor.value = cachingWrapper;
      newDescriptor = descriptor;
    } else {
      newDescriptor = {
        writable: false,
        enumerable: true,
        configurable: false,
        value: cachingWrapper,
      };
    }
    return newDescriptor;
  };
};
