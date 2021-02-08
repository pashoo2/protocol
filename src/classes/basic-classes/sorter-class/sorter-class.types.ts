import { ESortingOrder } from './sorter-class.const';

import { IPropsByAliasesGetter } from '../props-by-aliases-getter/props-by-aliases-getter.types';

export type TSortableEntry = {};

export type ISortingOptions<E extends TSortableEntry, K extends keyof E | string> = {
  [key in K]: ESortingOrder;
};

export interface ISorter<E extends TSortableEntry, K extends keyof E | string> {
  sort<A extends E[]>(arrayOfEntries: A, options: Partial<ISortingOptions<E, K>>): A;
}

export interface ISorterConstructor<E extends TSortableEntry, K extends keyof E | string> {
  new (propsValuesGetter: IPropsByAliasesGetter<E>): ISorter<E, K>;
}
