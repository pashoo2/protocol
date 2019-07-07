import { TTypedArrays, TMainDataTypes } from 'types/main.types';
import { stryngify, TStringifyData } from './main-utils';
import {
  encodeArrayBufferToBase64,
  decodeStringBase64ToArrayBuffer,
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
  const strData = stryngify(data);

  if (strData instanceof Error) {
    return strData;
  }
  return decodeStringBase64ToArrayBuffer(strData);
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

  return encodeArrayBufferToBase64(dataAsArrayBuffer);
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
