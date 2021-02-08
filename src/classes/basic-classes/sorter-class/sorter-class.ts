import { TSortableEntry, ISortingOptions, ISorter } from './sorter-class.types';
import { ESortingOrder } from './sorter-class.const';
import { IPropsByAliasesGetter } from '../props-by-aliases-getter/props-by-aliases-getter.types';

export class Sorter<E extends TSortableEntry, K extends keyof E | string> implements ISorter<E, K> {
  constructor(protected _propsValuesGetter: IPropsByAliasesGetter<E>) {}

  public sort<A extends E[]>(arrayOfEntries: A, sortingOptions: Partial<ISortingOptions<E, K>>): A {
    return Object.keys(sortingOptions).reduce((sortedArray, propertyPath) => {
      const isAscDirection = sortingOptions[propertyPath as K] === ESortingOrder.ASC;
      return sortedArray.sort((entryFirst, entrySecond): number => {
        const firstEntryPropertyValue = this.__getPropertyValueOrUndefinedByPath(propertyPath, entryFirst);
        const secondEntryPropertyValue = this.__getPropertyValueOrUndefinedByPath(propertyPath, entrySecond);
        const diff = this._isFirstGreaterThanSecond(firstEntryPropertyValue, secondEntryPropertyValue) ? 1 : -1;
        return isAscDirection ? diff : -diff;
      });
    }, arrayOfEntries);
  }

  protected _isFirstGreaterThanSecond(
    firstValue: string | number | undefined,
    secondValue: string | number | undefined
  ): boolean {
    if (firstValue === secondValue) {
      return false;
    }
    if (firstValue === undefined) {
      return false;
    }
    if (secondValue === undefined) {
      return true;
    }
    if (!firstValue && !secondValue) {
      // case for '', 0
      return false;
    }
    if (firstValue && !secondValue) {
      // in case second value is '' or 0
      return true;
    }
    if (!firstValue && secondValue) {
      // in case first value is '' or 0
      return false;
    }
    if (typeof firstValue === 'number' || typeof secondValue === 'number') {
      return Number(firstValue) > Number(secondValue);
    }
    return firstValue > secondValue;
  }

  protected _getSimpleTypeValueOrNaN(value: unknown): string | number {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      return value;
    }
    return NaN;
  }

  protected __getPropertyValueOrUndefinedByPath(propertyPath: string, entry: E): string | number | undefined {
    try {
      return this._getSimpleTypeValueOrNaN(this._propsValuesGetter.getPropertyValueByPath(propertyPath, entry));
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }
}
