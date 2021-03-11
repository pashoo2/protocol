export function filterMapKeys<M extends Map<any, any>, F extends Array<any>>(map: M, filterKeys: F): M {
  if (!filterKeys.length) {
    return map;
  }

  const filteredMap = new Map() as M;

  for (const [key, value] of map) {
    if (!filterKeys.includes(key)) {
      filteredMap.set(key, value);
    }
  }
  return filteredMap;
}

/**
 * Merge all maps into the target
 *
 * @export
 * @template M
 * @param {M} mapTarget
 * @param {...M[]} maps
 * @returns {M}
 */
export function mergeMaps<M extends Map<any, any>>(mapTarget: M, ...maps: M[]): M {
  const mergedMap = mapTarget;

  for (let idx = 0, len = maps.length; idx < len; idx += 1) {
    const map = maps[idx];
    let entry;
    for (entry of map) {
      mergedMap.set(entry[0], entry[1]);
    }
  }
  return mergedMap;
}

/**
 * Clones readonly Map or normal map
 * into normal map.
 *
 * @export
 * @template T
 * @param {(Readonly<T> | T)} map
 * @returns {T}
 */
export function cloneMap<T extends Map<unknown, unknown>>(map: Readonly<T> | T): T {
  return new Map((map as unknown) as T) as T;
}

export function whetherTwoMapsSame<T>(
  firstMap: Map<unknown, T>,
  secondMap: Map<unknown, T>,
  comparator?: (firstValue: T | undefined, secondValue: T | undefined) => boolean
): boolean {
  if (firstMap === secondMap) {
    return true;
  }

  const firstMapKeys = firstMap.keys();
  let firstMapKey;

  for (firstMapKey of firstMapKeys) {
    const secondMapValueForKey = secondMap.get(firstMapKey);
    const firstMapValueForKey = secondMap.get(firstMapKey);

    if (firstMapValueForKey === secondMapValueForKey) {
      continue;
    }
    if (firstMapValueForKey == null && secondMapValueForKey == null) {
      continue;
    }
    if (!comparator) {
      return false;
    }
    if (Boolean(firstMapValueForKey) !== Boolean(secondMapValueForKey)) {
      // e.g. firstMapValueForKey = undefined !== secondMapValueForKey = 1
      return false;
    }
    if (typeof firstMapValueForKey !== typeof secondMapValueForKey) {
      // e.g. firstMapValueForKey = {} !== secondMapValueForKey = 'string'
      return false;
    }
    if (comparator(firstMapValueForKey, secondMapValueForKey)) {
      return false;
    }
  }
  return true;
}
