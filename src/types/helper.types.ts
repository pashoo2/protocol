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

export type OmitTypeProp<T extends {}, E> = {
  [k in keyof T]: T[k] extends E ? never : T[k];
};

export type OmitType<T, O> = T extends O ? never : T;

export type ConstructorType<T> = new (...args: any[]) => T;

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
