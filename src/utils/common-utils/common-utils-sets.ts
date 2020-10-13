import { isDefined } from './common-utils-main';

export const concatSets = <T>(...sets: Array<Set<T> | undefined>): Set<T> => {
  return new Set(...sets.filter(isDefined));
};
