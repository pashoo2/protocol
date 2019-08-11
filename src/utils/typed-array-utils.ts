import { TTypedArrays, TMainDataTypes } from 'types/main.types';
import { stringify, TStringifyData } from './main-utils';
import {
  encodeArrayBufferToDOMString,
  decodeDOMStringToArrayBuffer,
} from 'utils/string-encoding-utils';

export const arrayBufferFromTypedArray = (
  typedArray: TTypedArrays | ArrayBuffer
): ArrayBuffer | Error => {
  if (typedArray instanceof ArrayBuffer) {
    return typedArray;
  }
  if (ArrayBuffer.isView(typedArray)) {
    return typedArray.buffer;
  }
  return new Error('The data given is not a typed array');
};

type isTypedArrayData = any;

export const isTypedArray = (data: isTypedArrayData): data is TTypedArrays =>
  data instanceof ArrayBuffer || ArrayBuffer.isView(data);

export const stringToTypedArray = (
  data: TMainDataTypes
): ArrayBuffer | Error => {
  const strData = stringify(data);

  if (strData instanceof Error) {
    return strData;
  }
  return decodeDOMStringToArrayBuffer(strData);
};

export const typedArrayToString = (
  data: TTypedArrays | string
): string | Error => {
  if (typeof data === 'string') {
    return data;
  }
  if (!isTypedArray(data)) {
    return new Error('The data is not a typed array');
  }

  const dataAsArrayBuffer = arrayBufferFromTypedArray(data);

  if (dataAsArrayBuffer instanceof Error) {
    return dataAsArrayBuffer;
  }

  return encodeArrayBufferToDOMString(dataAsArrayBuffer);
};

type TConvertedToTypedArrayData = TStringifyData | TTypedArrays;

export const convertToTypedArray = (
  data: TConvertedToTypedArrayData
): TTypedArrays | Error => {
  if (isTypedArray(data)) {
    return data;
  }
  return stringToTypedArray(data);
};

export const getOverallLength = (
  ...typedArrays: ArrayBuffer[]
): number | Error => {
  try {
    return typedArrays.reduce(
      (allLength, typedArray) => (allLength += typedArray.byteLength),
      0
    );
  } catch (err) {
    return err;
  }
};

export const concatArrayBuffers = (
  ...typedArrays: ArrayBuffer[]
): ArrayBuffer | Error => {
  const len = getOverallLength(...typedArrays);

  if (len instanceof Error) {
    return len;
  }

  const arrayResulted = new Uint8Array(len);
  const count = typedArrays.length;
  let idx = 0;
  let arrayBuffer = null;
  let currentLength = 0;
  let newTypedArray;

  try {
    for (; idx < count; idx += 1) {
      arrayBuffer = typedArrays[idx];
      newTypedArray = new Uint8Array(arrayBuffer);
      arrayResulted.set(newTypedArray, currentLength);
      currentLength += newTypedArray.byteLength;
    }
  } catch (err) {
    return err;
  }
  return arrayBufferFromTypedArray(arrayResulted);
};

export const getBytesFromArrayBuffer = (
  typedArray: ArrayBuffer,
  from: number,
  to?: number
): ArrayBuffer | Error => {
  try {
    const arrayResulted = new Uint8Array(typedArray);

    return arrayBufferFromTypedArray(arrayResulted.slice(from, to));
  } catch (err) {
    return err;
  }
};
