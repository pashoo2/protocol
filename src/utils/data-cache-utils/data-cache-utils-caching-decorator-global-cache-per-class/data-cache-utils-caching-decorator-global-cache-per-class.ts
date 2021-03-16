import { IDataCachingDecoratorDecoratedFunction } from './data-cache-utils-caching-decorator-global-cache-per-class.types';
import { DATA_CACHING_DECORATOR_DEFAULT_CACHE_CAPACITY } from './data-cache-utils-caching-decorator-global-cache-per-class.const';
import { debounce } from '../../throttling-utils/throttling-utils-main';

/**
 * !WARNING - it used the same cache for all
 * instances of a class.
 *
 * decorator for a method, will be wrapped for
 * caching values of a mostly used keys.
 * Must be used only for immutable
 * key-value stores
 * @property {number} cachedValuesCount - number
 * of a cached values
 */
export const dataCachingUtilsCachingDecoratorGlobalCachePerClass = <T, V, I extends object>(
  cacheItemsMaxCapacity: number = DATA_CACHING_DECORATOR_DEFAULT_CACHE_CAPACITY,
  getKeyByMethodArgument?: (value: T) => unknown
) => {
  type TGetKeyByMethodArgument = typeof getKeyByMethodArgument;
  type TMapKey = TGetKeyByMethodArgument extends (value: T) => any ? ReturnType<Exclude<TGetKeyByMethodArgument, undefined>> : T;
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
    const methodOrigin: IDataCachingDecoratorDecoratedFunction<T, V> = descriptor.value as IDataCachingDecoratorDecoratedFunction<
      T,
      V
    >;
    // key - rating
    const keysRating = new Map<TMapKey, number>();
    const cache = new Map<TMapKey, V>();
    let minimalRatingOfValueInCache = -Infinity;

    if (typeof methodOrigin !== 'function') {
      throw new Error('dataCachingUtilsCachingDecorator failed to decorate a non function property');
    }

    function increaseKeyRatingAndReturnIt(key: TMapKey): number {
      const keyRating = Number(keysRating.get(key) || 0) + 1;

      keysRating.set(key, keyRating);
      return keyRating;
    }

    const removeValuesWithWorstRatingFromCacheAndUpdateMinimalRating = debounce((): void => {
      let countItemsToRemove = cache.size - cacheItemsMaxCapacity;
      const keysSortedByRating: Array<{
        key: T;
        rating: number;
      }> = [];
      let keyInCache;
      let keyRating;

      for (keyInCache of cache.keys()) {
        keyRating = keysRating.get(keyInCache) ?? 0;
        keysSortedByRating.push({
          key: keyInCache,
          rating: keyRating,
        });
      }

      keysSortedByRating.sort(
        (keyWithRaitingFirst, keyWithRaitingSecond) => keyWithRaitingSecond.rating - keyWithRaitingFirst.rating
      );
      minimalRatingOfValueInCache = keysSortedByRating[keysSortedByRating.length - countItemsToRemove - 1].rating;

      let keyToRemove;

      while (countItemsToRemove) {
        keyToRemove = keysSortedByRating[keysSortedByRating.length - countItemsToRemove].key;
        cache.delete(keyToRemove);
        countItemsToRemove -= 1;
      }
    }, 500);

    async function cachingWrapper(this: I, parameter: T): Promise<V> {
      const key = getKeyByMethodArgument ? (getKeyByMethodArgument(parameter) as TMapKey) : parameter;

      if (key === undefined) {
        // if there is no key for the method parameter, then call the method origin itself
        return await methodOrigin.call(this, parameter);
      }

      const valueFromCache = cache.get(key);

      // check if the value of the
      // key was cached
      if (valueFromCache != null) {
        increaseKeyRatingAndReturnIt(key);
        return valueFromCache;
      }

      const resultedValue = await methodOrigin.call(this, parameter);
      const keyRatingUpdated = increaseKeyRatingAndReturnIt(key);
      const whetherCacheOverload = cache.size >= cacheItemsMaxCapacity;
      const whetherKeyRatingIsGreaterThanMinimal = keyRatingUpdated > minimalRatingOfValueInCache;

      if (!whetherCacheOverload || whetherKeyRatingIsGreaterThanMinimal) {
        cache.set(key, resultedValue);
        if (minimalRatingOfValueInCache === -Infinity) {
          minimalRatingOfValueInCache = keyRatingUpdated;
        }
        if (whetherCacheOverload) {
          removeValuesWithWorstRatingFromCacheAndUpdateMinimalRating();
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
