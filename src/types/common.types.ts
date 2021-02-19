export type TObjectKeys = string | number | symbol;

export type TSimpleTypes = number | string | boolean | null | undefined;

export type TDictionary<T> = Record<TObjectKeys, T>;

export interface IConstructorSimple<T> {
  new (): T;
}

export type AnyConstructor<A = object> = new (...input: any[]) => A;

export type MaybeError = Error | void;

export interface IResolvable<T> {
  resolve: (value: T) => unknown;
}

export interface IRejectable<E extends MaybeError> {
  reject: (err: E) => unknown;
}

export interface IKeyValueDataStructure {
  [k: string]: IKeyValueDataStructure | TSimpleTypes;
  [k: number]: IKeyValueDataStructure | TSimpleTypes;
}
