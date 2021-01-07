export const createImmutableObjectClone = <T extends Record<string, unknown>>(object: T): Readonly<T> => {
  const objectClone = {};
  const objectPropsDescriptors: PropertyDescriptorMap = {};
  Object.entries(object).forEach(([key, value]): void => {
    objectPropsDescriptors[key] = {
      value:
        typeof value === 'object' && value && value !== Object.prototype
          ? createImmutableObjectClone(value as Record<string, unknown>)
          : value,
      writable: false,
      configurable: false,
    };
  });
  Object.defineProperties(objectClone, objectPropsDescriptors);
  return objectClone as Readonly<T>;
};
