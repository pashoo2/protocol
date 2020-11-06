import { TObjectKeys, TDictionary } from 'types/common.types';
import { isDefined } from './common-utils-main';

export const isNotEmptyObject = (o: any): o is object => {
  return !!o && typeof o === 'object' && !!Object.keys(o).length;
};

export const isEmptyObject = (o: any): boolean => {
  return !isNotEmptyObject(o);
};

export const getObjectKeys = (o: object): Array<TObjectKeys> => (Object.keys(o) as Array<TObjectKeys>).concat(Object.getOwnPropertySymbols(o));

export const isSimpleObject = (o: any): o is object => typeof o === 'object' && Object.getPrototypeOf(o) === Object.prototype;

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
export function extend<T extends TDictionary<any>, E extends TDictionary<any>>(o: T | undefined, ext: E, replaceExisting?: boolean): T & E {
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
