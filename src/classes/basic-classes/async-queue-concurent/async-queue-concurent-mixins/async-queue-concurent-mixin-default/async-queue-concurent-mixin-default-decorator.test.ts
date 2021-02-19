import { decoratorAsyncQueueConcurentMixinDefault } from './async-queue-concurent-mixin-default-decorator';

describe('decoratorAsyncQueueConcurentMixinDefault', () => {
  it('Should decorate class with async method', async () => {
    const expectedValue = 'expectedValue';
    @decoratorAsyncQueueConcurentMixinDefault(100, 'testMehod')
    class TestClass {
      async testMehod() {
        return await Promise.resolve(expectedValue);
      }
    }
    const instance = new TestClass();
    await expect(instance.testMehod()).resolves.toBe(expectedValue);
  });
});
