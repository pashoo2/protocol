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

export type OmitType<T extends {}, E> = {
  [k in keyof T]: T[k] extends E ? never : T[k];
};
