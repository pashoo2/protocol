import { TDictionary, TObjectKeys } from 'types/common.types';
import { isDefined, isSimpleTypeValue } from './common-utils-main';

export const isNotEmptyObject = (o: any): o is object => {
  return !!o && typeof o === 'object' && !!Object.keys(o).length;
};

export const isEmptyObject = (o: any): boolean => {
  return !isNotEmptyObject(o);
};

export const getObjectKeys = (o: object): Array<TObjectKeys> =>
  (Object.keys(o) as Array<TObjectKeys>).concat(Object.getOwnPropertySymbols(o));

export const isSimpleObject = (o: unknown): o is Record<string, unknown> =>
  o !== null && typeof o === 'object' && Object.getPrototypeOf(o) === Object.prototype && o !== Object.prototype;

export const isSimpleTypesObject = (o: unknown): o is Record<string, unknown> =>
  isSimpleObject(o) && Object.keys(o).every((objectKey) => isSimpleTypeValue(o[objectKey]));

/**
 * extends object with another object if the object
 * have no properties
 *
 * @export
 * @template T
 * @template E
 * @param {T} o
 * @param {E} ext
 * @returns {T}
 */
export function extend<T extends TDictionary<any>, E extends TDictionary<any>>(
  o: T | undefined,
  ext: E,
  replaceExisting?: boolean
): T & E {
  if (!o) {
    return ext;
  }
  if (!isSimpleObject(o) || !isSimpleObject(ext)) {
    if (replaceExisting && ext) {
      return ext;
    }
    return (!o || isEmptyObject(o)) && ext ? ext : o;
  }

  const keys = getObjectKeys(ext);
  let idx = 0;
  let k: keyof E;
  const len = keys.length;

  while (idx < len) {
    k = keys[idx];
    idx++;
    if (!isDefined(ext[k])) {
      continue;
    }
    if (replaceExisting || !isDefined(o[k])) {
      o[k] = ext[k];
    } else if (typeof o[k] === 'object' && typeof ext[k] === 'object') {
      o[k] = extend(o[k], ext[k]);
    }
  }
  return o;
}

export const isObjectsSwallowEquals = <T>(simpleValuesObject1: any, simpleValuesObject2: T) => {
  if (
    simpleValuesObject1 &&
    simpleValuesObject2 &&
    typeof simpleValuesObject1 === 'object' &&
    typeof simpleValuesObject2 === 'object'
  ) {
    const simpleValuesObject1Keys = Object.keys(simpleValuesObject1);
    const simpleValuesObject2Keys = Object.keys(simpleValuesObject2);
    if (simpleValuesObject1Keys.length !== simpleValuesObject2Keys.length) {
      return false;
    }
    return simpleValuesObject1Keys.every(
      (simpleObject1Key) => (simpleValuesObject2 as any)[simpleObject1Key] === simpleValuesObject1[simpleObject1Key]
    );
  }
  return false;
};
