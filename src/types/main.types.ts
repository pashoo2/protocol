export type TTypedArraysNative =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

export type TTypedArrays = TTypedArraysNative | DataView | ArrayBuffer;

export type TArrayBufferView = TTypedArrays;

export type TMainDataTypes = object | number | string;
