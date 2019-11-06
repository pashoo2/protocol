export const commonUtilsArrayOrderByDecComparationFunction = <T>(
  a: T,
  b: T
): number => Number(b) - Number(a);

/**
 * sort array by decreasing
 * value on increased index
 * @param {any[]} arr
 */
export const commonUtilsArrayOrderByDec = <T>(arr: T[]): T[] =>
  arr.sort(commonUtilsArrayOrderByDecComparationFunction);

  export const commonUtilsArrayDeleteFromArray = <T>(arr: T[], item: T) => {
    const idxOfItem = arr.findIndex((el: T) => el === item);

    if (idxOfItem !== -1) {
      arr.splice(idxOfItem, 1);
    }
  }