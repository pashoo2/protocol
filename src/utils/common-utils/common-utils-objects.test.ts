import { deepCloneObject } from './common-utils-objects';

describe('Common utils objects', () => {
  describe('deepCloneObject', () => {
    it('Should return a deep copy of an object', () => {
      const objectWithSimpleProps = {
        simplePropNull: null,
        simplePropUndefined: undefined,
        simplePropString: 'string',
        simplePropNumner: 999,
      };
      const objectWithComplexProps = {
        ...objectWithSimpleProps,
        nestedObject: {
          ...objectWithSimpleProps,
          array: [null, undefined, 'string', 1212, [objectWithSimpleProps]],
          nestedObject: {
            ...objectWithSimpleProps,
            nestedObject: {
              ...objectWithSimpleProps,
            },
          },
        },
      };
      expect(deepCloneObject(objectWithComplexProps)).not.toBe(objectWithComplexProps);
      expect(deepCloneObject(objectWithComplexProps)).toEqual(objectWithComplexProps);
      expect(deepCloneObject(objectWithComplexProps.nestedObject)).not.toBe(objectWithComplexProps.nestedObject);
      expect(deepCloneObject(objectWithComplexProps).nestedObject).toEqual(objectWithComplexProps.nestedObject);
      expect(deepCloneObject(objectWithComplexProps.nestedObject.nestedObject)).not.toBe(
        objectWithComplexProps.nestedObject.nestedObject
      );
      expect(deepCloneObject(objectWithComplexProps).nestedObject.nestedObject).toEqual(
        objectWithComplexProps.nestedObject.nestedObject
      );
      expect(deepCloneObject(objectWithComplexProps).nestedObject.array).not.toBe(objectWithComplexProps.nestedObject.array);
      expect(deepCloneObject(objectWithComplexProps).nestedObject.array).toEqual(
        expect.arrayContaining(objectWithComplexProps.nestedObject.array)
      );
    });
  });
});
