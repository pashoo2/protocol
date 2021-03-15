import {
  IDataCachingDecoratorDecoratedFunction,
  IDataCachingDecoratorCachedValue,
} from './data-cache-utils-caching-decorator.types';
import { DATA_CACHING_DECORATOR_DEFAULT_CACHE_CAPACITY } from './data-cache-utils-caching-decorator.const';
import { debounce } from '../../throttling-utils/throttling-utils-main';

/**
 * decorator for a method, will be wrapped for
 * caching values of a mostly used keys.
 * Must be used only for immutable
 * key-value stores
 * @property {number} cachedValuesCount - number
 * of a cached values
 */
export const dataCachingUtilsCachingDecorator = <T, V, I extends object>(
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
    const methodOrigin: IDataCachingDecoratorDecoratedFunction<T, V> = descriptor.value;
    // key - rating
    const keysRaiting = new Map<TMapKey, number>();
    const cache = new Map<TMapKey, IDataCachingDecoratorCachedValue<V>>();
    let minimalRaitingOfValueInCache = -Infinity;

    if (typeof methodOrigin !== 'function') {
      throw new Error('dataCachingUtilsCachingDecorator failed to decorate a non function property');
    }

    function increaseKeyRaitingAndReturnIt(key: TMapKey): number {
      const keyRaiting = Number(keysRaiting.get(key) || 0) + 1;

      keysRaiting.set(key, keyRaiting);
      return keyRaiting;
    }

    const removeValuesWithWorstRaitingFromCache = debounce((): void => {
      let itemsToRemove = cache.size - cacheItemsMaxCapacity;
      let key;
      let cachedItem;
      for ([key, cachedItem] of cache) {
        if (itemsToRemove && cachedItem.rating < minimalRaitingOfValueInCache) {
          cache.delete(key);
          itemsToRemove = Math.min(itemsToRemove--, 0);
        }
      }
    }, 500);

    async function cachingWrapper(this: I, parameter: T): Promise<V> {
      const key = getKeyByMethodArgument ? (getKeyByMethodArgument(parameter) as TMapKey) : parameter;

      if (key === undefined) {
        // if there is no key for the method parameter, then call the method origin itself
        return await methodOrigin.call(this, parameter);
      }

      const cachedValueForKey = cache.get(key);
      const valueFromCache = cachedValueForKey?.value;

      // check if the value of the
      // key was cached
      if (valueFromCache != null) {
        increaseKeyRaitingAndReturnIt(key);
        return valueFromCache;
      }

      const resultedValue = await methodOrigin.call(this, parameter);
      const keyRaiting = increaseKeyRaitingAndReturnIt(key);

      if (minimalRaitingOfValueInCache < keyRaiting) {
        cache.set(key, {
          rating: keyRaiting,
          value: resultedValue,
        });
        minimalRaitingOfValueInCache = keyRaiting;
        if (cache.size > cacheItemsMaxCapacity) {
          removeValuesWithWorstRaitingFromCache();
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
