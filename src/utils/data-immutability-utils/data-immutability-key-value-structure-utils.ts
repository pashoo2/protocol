import { DeepReadonly } from 'ts-essentials';
import { isSimpleObject } from '../common-utils/common-utils-objects';

export const createImmutableObjectClone = <T extends Record<string | number, any>>(object: T): DeepReadonly<T> => {
  const objectClone = {};
  const objectPropsDescriptors: PropertyDescriptorMap = {};

  if (!isSimpleObject(object)) {
    throw new Error('The object is not a key-value dictionary');
  }
  Object.entries(object).forEach(([key, value]): void => {
    objectPropsDescriptors[key] = {
      value: isSimpleObject(value) ? createImmutableObjectClone(value) : value,
      writable: false,
      configurable: false,
    };
  });
  Object.defineProperties(objectClone, objectPropsDescriptors);
  return objectClone as DeepReadonly<T>;
};
