import { isSimpleObject } from "./..";
export const createImmutableObjectClone = (object) => {
    const objectClone = {};
    const objectPropsDescriptors = {};
    if (!isSimpleObject(object)) {
        throw new Error('The object is not a key-value dictionary');
    }
    Object.entries(object).forEach(([key, value]) => {
        objectPropsDescriptors[key] = {
            value: isSimpleObject(value) ? createImmutableObjectClone(value) : value,
            writable: false,
            configurable: false,
            enumerable: true,
        };
    });
    Object.defineProperties(objectClone, objectPropsDescriptors);
    return objectClone;
};
//# sourceMappingURL=data-immutability-key-value-structure-utils.js.map