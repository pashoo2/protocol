// eslint-disable-next-line @typescript-eslint/ban-types
export type TPrototypeKeys = keyof Object;

export type ownKeyOf<T extends object> = keyof T extends TPrototypeKeys
  ? never
  : keyof T;

// onlye own properties values
export type ownValueOf<T extends object> = keyof T extends ownKeyOf<T>
  ? T[keyof T]
  : never;

export type ArgumentTypes<F extends Function> = F extends (
  ...args: infer A
) => any
  ? A
  : never;

export type FirstPrameter<F extends (arg: any) => any> = Parameters<
  F
> extends Array<infer FirstArg>
  ? FirstArg
  : never;
type FirstPrameter<F extends (arg: any) => any> = Parameters<F> extends Array<
  infer FirstArg
>
  ? FirstArg
  : never;

export type OmitTypeProp<T extends {}, E> = {
  [k in keyof T]: T[k] extends E ? never : T[k];
};

export type OmitType<T, O> = T extends O ? never : T;

export type ConstructorType<R, A extends Array<any> = any[]> = new (
  ...args: A
) => R;

export type ArrayFirst<T extends any[]> = T extends Array<infer F> ? F : never;

export type Defined<T extends {}> = {
  [k in keyof T]: T[k] extends undefined ? NonNullable<T[k]> : T[k];
};

export type OmitFirstArg<F extends Function> = F extends (
  x: any,
  ...args: infer P
) => infer R
  ? (...args: P) => R
  : never;

export type ArrayElement<
  ArrayType extends readonly unknown[]
> = ArrayType[number];

export type PromiseResolveType<T> = T extends PromiseLike<infer U> ? U : T;
