import { TTypedArrays, TMainDataTypes } from 'types/main.types';
import { decode, encode } from 'base64-arraybuffer';

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

type TStringifyData = TMainDataTypes;

export const stryngify = (data: TStringifyData): string | Error => {
  const dataType = typeof data;

  if (dataType === 'string') {
    return data as string;
  }
  if (dataType === 'number') {
    return String(data);
  }
  if (dataType === 'object') {
    try {
      return JSON.stringify(data);
    } catch (err) {
      return err;
    }
  }
  return new Error('Unknown data type');
};

export const stringToTypedArray = (
  data: TMainDataTypes
): ArrayBuffer | Error => {
  const strData = stryngify(data);

  if (strData instanceof Error) {
    return strData;
  }
  return decode(btoa(strData));
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

  return atob(encode(dataAsArrayBuffer));
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
