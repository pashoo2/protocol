import { ESortingOrder } from './sorter-class.const';
export class Sorter {
    constructor(_propsValuesGetter) {
        this._propsValuesGetter = _propsValuesGetter;
    }
    sort(arrayOfEntries, sortingOptions) {
        return Object.keys(sortingOptions).reduce((sortedArray, propertyPath) => {
            const isAscDirection = sortingOptions[propertyPath] === ESortingOrder.ASC;
            return sortedArray.sort((entryFirst, entrySecond) => {
                const firstEntryPropertyValue = this.__getPropertyValueOrUndefinedByPath(propertyPath, entryFirst);
                const secondEntryPropertyValue = this.__getPropertyValueOrUndefinedByPath(propertyPath, entrySecond);
                const diff = this._isFirstGreaterThanSecond(firstEntryPropertyValue, secondEntryPropertyValue) ? 1 : -1;
                return isAscDirection ? diff : -diff;
            });
        }, arrayOfEntries);
    }
    _isFirstGreaterThanSecond(firstValue, secondValue) {
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
            return false;
        }
        if (firstValue && !secondValue) {
            return true;
        }
        if (!firstValue && secondValue) {
            return false;
        }
        if (typeof firstValue === 'number' || typeof secondValue === 'number') {
            return Number(firstValue) > Number(secondValue);
        }
        return firstValue > secondValue;
    }
    _getSimpleTypeValueOrNaN(value) {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'string') {
            return value;
        }
        return NaN;
    }
    __getPropertyValueOrUndefinedByPath(propertyPath, entry) {
        try {
            return this._getSimpleTypeValueOrNaN(this._propsValuesGetter.getPropertyValueByPath(propertyPath, entry));
        }
        catch (e) {
            console.error(e);
            return undefined;
        }
    }
}
//# sourceMappingURL=sorter-class.js.map