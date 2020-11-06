import { AsyncQueueClassBase } from './async-queue-class-base';
import { delay } from '../../../utils/common-utils/common-utils-timer';

describe('AsyncQueueClassBase', () => {
  it('constructor with no arguments should not fail', () => {
    expect(() => new AsyncQueueClassBase()).not.toThrow();
  });
  it('constructor with arguments should not fail', () => {
    expect(
      () =>
        new AsyncQueueClassBase({
          batchSize: 5,
          delayMs: 200,
          promiseTimeout: 1000,
        })
    ).not.toThrow();
  });
  it('should return same result as in the Promise.resolve', async () => {
    const asyncQueue = new AsyncQueueClassBase();
    const expectedResolve = { test: 'object' };
    const promiseProvider = jest.fn(() => {
      return Promise.resolve(expectedResolve);
    });

    await expect(asyncQueue.do(promiseProvider)).resolves.toBe(expectedResolve);
    expect(promiseProvider).toBeCalledTimes(1);
  });
  it('should return same result as in the Promise.resolve with multiple', async () => {
    const asyncQueue = new AsyncQueueClassBase();
    const expectedResolve1 = { test: 'object' };
    const promiseProvider1 = jest.fn(() => {
      return Promise.resolve(expectedResolve1);
    });
    const expectedResolve2 = { test: 'object2' };
    const promiseProvider2 = jest.fn(() => {
      return Promise.resolve(expectedResolve2);
    });

    await expect(asyncQueue.do([promiseProvider1, promiseProvider2])).resolves.toEqual([expectedResolve1, expectedResolve2]);
    expect(promiseProvider1).toBeCalledTimes(1);
    expect(promiseProvider2).toBeCalledTimes(1);
  });
  it('should return same result as in the Promise.resolve with multiple times called withing one cycle', async () => {
    const asyncQueue = new AsyncQueueClassBase();
    const expectedResolve1 = { test: 'object' };
    const promiseProvider1 = jest.fn(() => {
      return Promise.resolve(expectedResolve1);
    });
    const expectedResolve2 = { test: 'object2' };
    const promiseProvider2 = jest.fn(() => {
      return Promise.resolve(expectedResolve2);
    });

    await expect(Promise.all([asyncQueue.do(promiseProvider1), asyncQueue.do(promiseProvider2)])).resolves.toEqual([
      expectedResolve1,
      expectedResolve2,
    ]);
    expect(promiseProvider1).toBeCalledTimes(1);
    expect(promiseProvider2).toBeCalledTimes(1);
  });
  it('should return same result as in the Promise.resolve with multiple times called async withing one cycle', async () => {
    const asyncQueue = new AsyncQueueClassBase();
    const expectedResolve1 = { test: 'object' };
    const promiseProvider1 = jest.fn(async () => {
      await delay(500);
      return Promise.resolve(expectedResolve1);
    });
    const expectedResolve2 = { test: 'object2' };
    const promiseProvider2 = jest.fn(async () => {
      await delay(500);
      return Promise.resolve(expectedResolve2);
    });

    await expect(Promise.all([asyncQueue.do(promiseProvider1), asyncQueue.do(promiseProvider2)])).resolves.toEqual([
      expectedResolve1,
      expectedResolve2,
    ]);
    expect(promiseProvider1).toBeCalledTimes(1);
    expect(promiseProvider2).toBeCalledTimes(1);
  });
  it('should works with delay between batches', async () => {
    let isTimer1Triggers = false;
    let isTimer2Triggers = false;
    const delayMs = 1000;
    const asyncQueue = new AsyncQueueClassBase({
      delayMs,
    });
    const expectedResolve1 = { test: 'object' };
    const promiseProvider1 = jest.fn(() => {
      return Promise.resolve(expectedResolve1);
    });
    const expectedResolve2 = { test: 'object2' };
    const promiseProvider2 = jest.fn(() => {
      return Promise.resolve(expectedResolve2);
    });
    setTimeout(() => {
      isTimer1Triggers = true;
    }, delayMs);
    setTimeout(() => {
      isTimer2Triggers = true;
    }, 2 * delayMs);

    await expect(asyncQueue.do(promiseProvider1)).resolves.toEqual(expectedResolve1);
    expect(promiseProvider1).toBeCalledTimes(1);
    await expect(asyncQueue.do(promiseProvider2)).resolves.toEqual(expectedResolve2);
    expect(promiseProvider2).toBeCalledTimes(1);
    expect(isTimer1Triggers).toBe(true);
    expect(isTimer2Triggers).toBe(false);
  });
});
