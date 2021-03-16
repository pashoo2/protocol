import { dataCachingUtilsCachingDecoratorGlobalCachePerClass } from './data-cache-utils-caching-decorator-global-cache-per-class';

describe('Caching decorator', () => {
  let map: Map<string, string>;
  let valueGetter: jest.MockedFunction<(key: string) => Promise<string | undefined>>;

  class TestClass {
    @dataCachingUtilsCachingDecoratorGlobalCachePerClass(2)
    getValue(key: string): Promise<string | undefined> {
      return valueGetter(key);
    }
  }

  beforeEach(() => {
    map = new Map<string, string>();
    valueGetter = jest.fn(
      async (key: string): Promise<string | undefined> => {
        return map.get(key);
      }
    );
  });

  it('Should return undefined for a key which is not exists', async () => {
    const testClassImplementation = new TestClass();
    await expect(testClassImplementation.getValue('unknown_key')).resolves.toBe(undefined);
  });

  it('Should call the getter function every time till it returns undefined', async () => {
    const testClassImplementation = new TestClass();
    const testKey = 'test_key';

    map.set(testKey, undefined as any);
    expect(valueGetter).not.toBeCalled();
    void (await testClassImplementation.getValue(testKey));
    expect(valueGetter).toBeCalledTimes(1);
    void (await testClassImplementation.getValue(testKey));
    expect(valueGetter).toBeCalledTimes(2);
  });

  it('Should use the same cache for all instances of class', async () => {
    const testClassImplementation = new TestClass();
    const testKey = 'test_key';
    const testValue = 'testValue';

    map.set(testKey, testValue);
    expect(valueGetter).not.toBeCalled();
    await expect(testClassImplementation.getValue(testKey)).resolves.toBe(testValue);
    // should read value from the cache put there by test above
    expect(valueGetter).toBeCalledTimes(1);

    const testClassImplementationSecond = new TestClass();
    await expect(testClassImplementationSecond.getValue(testKey)).resolves.toBe(testValue);
    expect(valueGetter).toBeCalledTimes(1);

    const testClassImplementationThird = new TestClass();
    await expect(testClassImplementationThird.getValue(testKey)).resolves.toBe(testValue);
    expect(valueGetter).toBeCalledTimes(1);
  });

  it('Should read and return value which was read for the first time', async () => {
    const testClassImplementation = new TestClass();
    const testKey = 'test_key';
    const testValue = 'testValue';

    map.set(testKey, testValue);
    await expect(testClassImplementation.getValue(testKey)).resolves.toBe(testValue);
    map.set(testKey, `another_${testValue}`);
    await expect(testClassImplementation.getValue(testKey)).resolves.toBe(testValue);
  });

  describe('Run each test with its own cache', () => {
    it('Should read a value for the same key only once', async () => {
      class TestClassIndependent {
        @dataCachingUtilsCachingDecoratorGlobalCachePerClass(2)
        getValue(key: string): Promise<string | undefined> {
          return valueGetter(key);
        }
      }
      const testClassImplementation = new TestClassIndependent();
      const testKey = 'test_key';
      const testValue = 'testValue';

      map.set(testKey, testValue);
      expect(valueGetter).not.toBeCalled();
      void (await testClassImplementation.getValue(testKey));
      expect(valueGetter).toBeCalledTimes(1);
      void (await testClassImplementation.getValue(testKey));
      expect(valueGetter).toBeCalledTimes(1);
    });

    it('Should not call getter function twice also for the second value', async () => {
      class TestClassIndependent {
        @dataCachingUtilsCachingDecoratorGlobalCachePerClass(2)
        getValue(key: string): Promise<string | undefined> {
          return valueGetter(key);
        }
      }
      const testClassImplementation = new TestClassIndependent();
      const testKey = 'test_key';
      const testValue = 'testValue';
      const testKeySecond = 'test_key2';
      const testValueSecond = 'testValue2';

      map.set(testKey, testValue);
      map.set(testKeySecond, testValueSecond);
      expect(valueGetter).not.toBeCalled();
      await expect(testClassImplementation.getValue(testKey)).resolves.toBe(testValue);
      expect(valueGetter).toBeCalledTimes(1);
      await expect(testClassImplementation.getValue(testKey)).resolves.toBe(testValue);
      expect(valueGetter).toBeCalledTimes(1);
      await expect(testClassImplementation.getValue(testKeySecond)).resolves.toBe(testValueSecond);
      expect(valueGetter).toBeCalledTimes(2);
      await expect(testClassImplementation.getValue(testKeySecond)).resolves.toBe(testValueSecond);
      expect(valueGetter).toBeCalledTimes(2);
    });

    it('Should call getter function for a value whose rating less than the existing values in cache', async () => {
      jest.useFakeTimers();
      class TestClassIndependent {
        @dataCachingUtilsCachingDecoratorGlobalCachePerClass(2)
        getValue(key: string): Promise<string | undefined> {
          return valueGetter(key);
        }
      }
      const testClassImplementation = new TestClassIndependent();
      const testKey = 'test_key';
      const testValue = 'testValue';
      const testKeySecond = 'test_key2';
      const testValueSecond = 'testValue2';
      const testKeyThird = 'test_key3';
      const testValueThird = 'testValue3';

      map.set(testKey, testValue);
      map.set(testKeySecond, testValueSecond);
      map.set(testKeyThird, testValueThird);
      expect(valueGetter).not.toBeCalled();
      await expect(testClassImplementation.getValue(testKey)).resolves.toBe(testValue);
      expect(valueGetter).toBeCalledTimes(1);
      await expect(testClassImplementation.getValue(testKeySecond)).resolves.toBe(testValueSecond);
      expect(valueGetter).toBeCalledTimes(2);
      // currently testKey should has rating = 1 and testKeySecond also should has rating = 1
      await expect(testClassImplementation.getValue(testKeyThird)).resolves.toBe(testValueThird);
      expect(valueGetter).toBeCalledTimes(3);
      // now testKeyThird has rating = 1, as cache is already full, a value for the key was not cached
      await expect(testClassImplementation.getValue(testKeyThird)).resolves.toBe(testValueThird);
      expect(valueGetter).toBeCalledTimes(4);
      // now testKeyThird has rating = 2, and it's value must be cached, so the next reading for this key
      // will be done from the cache without calling the getter function
      await expect(testClassImplementation.getValue(testKeyThird)).resolves.toBe(testValueThird);
      expect(valueGetter).toBeCalledTimes(4);
      jest.runAllTimers();
      // now one of the values which was exists in cache before and have a rating smaller than 2 must be removed,
      // so if we read a value for the testKey or the testKeySecond, one of those attemps will lead to calling of
      // the getter functin, but another one will be read from the cache (because only one of these keys must have been removed)
      await expect(testClassImplementation.getValue(testKey)).resolves.toBe(testValue);
      await expect(testClassImplementation.getValue(testKeySecond)).resolves.toBe(testValueSecond);
      expect(valueGetter).toBeCalledTimes(5);
      jest.runAllTimers();
      // now the ratings should looks like
      // testKey = 2
      // testKeySecond = 2
      // testKeyThird = 3
      await expect(testClassImplementation.getValue(testKey)).resolves.toBe(testValue);
      await expect(testClassImplementation.getValue(testKeySecond)).resolves.toBe(testValueSecond);
      expect(valueGetter).toBeCalledTimes(6);
      jest.runAllTimers();
      // now the ratings should looks like
      // testKey = 3
      // testKeySecond = 3
      // testKeyThird = 3
      await expect(testClassImplementation.getValue(testKey)).resolves.toBe(testValue);
      await expect(testClassImplementation.getValue(testKeySecond)).resolves.toBe(testValueSecond);
      expect(valueGetter).toBeCalledTimes(7);
      // now the ratings should looks like
      // testKey = 4
      // testKeySecond = 4
      // testKeyThird = 3
      jest.runAllTimers();
      // cache must be updated and the testKeyThird must be removed from the cache and
      // the keys testKey, testKeySecond should be in the cache
      await expect(testClassImplementation.getValue(testKey)).resolves.toBe(testValue);
      await expect(testClassImplementation.getValue(testKeySecond)).resolves.toBe(testValueSecond);
      expect(valueGetter).toBeCalledTimes(7);
      // testKeyThird should be read not from the cache
      await expect(testClassImplementation.getValue(testKeyThird)).resolves.toBe(testValueThird);
      expect(valueGetter).toBeCalledTimes(8);
    });
  });
});
