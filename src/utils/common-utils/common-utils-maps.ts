export function filterMap<M extends Map<any, any>, F extends Array<any>>(
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
