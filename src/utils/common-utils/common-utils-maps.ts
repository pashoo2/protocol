export function filterMapKeys<M extends Map<any, any>, F extends Array<any>>(
  map: M,
  filterKeys: F
): M {
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
export function concatMaps<M extends Map<any, any>>(
  mapTarget: M,
  ...maps: M[]
): M {
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
