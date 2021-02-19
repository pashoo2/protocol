import { AnyConstructor } from 'types/common.types';
import { asyncQueueConcurentMixinDefault } from './async-queue-concurent-mixin-default';
import { IAsyncQueueConcurentMixinDefault } from '../../async-queue-concurent.types';

export function decoratorAsyncQueueConcurentMixinDefault<M extends AnyConstructor<any>>(
  jobTimeoutDefault: number,
  ...methodsToWrapInAsync: Array<keyof InstanceType<M>>
) {
  function assignQueuedMethods(inst: InstanceType<M & AnyConstructor<IAsyncQueueConcurentMixinDefault>>) {
    methodsToWrapInAsync.forEach((methodName) => {
      const origin = inst[methodName];
      if (typeof origin === 'function') {
        inst[methodName] = (
          ...args: Parameters<InstanceType<M & AnyConstructor<IAsyncQueueConcurentMixinDefault>>[typeof methodName]>
        ) => {
          return (inst as IAsyncQueueConcurentMixinDefault)._runAsJob(() => origin(...args), String(methodName));
        };
      }
    });
  }
  return function decorate(BaseClass: M): M & AnyConstructor<IAsyncQueueConcurentMixinDefault> {
    return class extends asyncQueueConcurentMixinDefault<M>(BaseClass, jobTimeoutDefault) {
      constructor(...args: unknown[]) {
        super(...args);
        assignQueuedMethods(this as InstanceType<M & AnyConstructor<IAsyncQueueConcurentMixinDefault>>);
      }
    };
  };
}
