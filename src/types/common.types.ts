export type TObjectKeys = string | number | symbol;

export type TDictionary<T> = Record<TObjectKeys, T>;

export interface IConstructorSimple<T> {
  new (): T;
}
