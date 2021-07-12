import { TSortableEntry, ISortingOptions, ISorter } from './sorter-class.types';
import { IPropsByAliasesGetter } from '../props-by-aliases-getter/props-by-aliases-getter.types';
export declare class Sorter<E extends TSortableEntry, K extends keyof E | string> implements ISorter<E, K> {
    protected _propsValuesGetter: IPropsByAliasesGetter<E>;
    constructor(_propsValuesGetter: IPropsByAliasesGetter<E>);
    sort<A extends E[]>(arrayOfEntries: A, sortingOptions: Partial<ISortingOptions<E, K>>): A;
    protected _isFirstGreaterThanSecond(firstValue: string | number | undefined, secondValue: string | number | undefined): boolean;
    protected _getSimpleTypeValueOrNaN(value: unknown): string | number;
    protected __getPropertyValueOrUndefinedByPath(propertyPath: string, entry: E): string | number | undefined;
}
//# sourceMappingURL=sorter-class.d.ts.map