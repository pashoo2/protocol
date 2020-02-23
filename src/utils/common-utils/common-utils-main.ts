export const isDefined = <T>(v: T): v is NonNullable<T> => v != null;
