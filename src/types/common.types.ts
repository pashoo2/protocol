export type TObjectKeys = string | number | symbol;

export type TSimpleTypes =
  | number
  | string
  | boolean
  | symbol
  | null
  | undefined;

export type TDictionary<T> = Record<TObjectKeys, T>;

export interface IConstructorSimple<T> {
  new (): T;
}
