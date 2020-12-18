export type TObjectKeys = string | number | symbol;

export type TSimpleTypes = number | string | boolean | null | undefined;

export type TDictionary<T> = Record<TObjectKeys, T>;

export interface IConstructorSimple<T> {
  new (): T;
}

export type MaybeError = Error | void;

export interface IResolvable<T> {
  resolve: (value: T) => unknown;
}

export interface IRejectable<E extends MaybeError> {
  reject: (err: E) => unknown;
}
