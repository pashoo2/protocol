// eslint-disable-next-line @typescript-eslint/ban-types
export type TPrototypeKeys = keyof Object;

export type ownKeyOf<T extends object> = keyof T extends TPrototypeKeys
  ? never
  : keyof T;

// onlye own properties values
export type ownValueOf<T extends object> = keyof T extends ownKeyOf<T>
  ? T[keyof T]
  : never;
