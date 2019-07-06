import { TTypedArrays, TMainDataTypes } from 'types/main.types';

type isTypedArrayData = any;

export const isTypedArray = (data: isTypedArrayData): data is TTypedArrays => {
  return typeof data === 'object' && data instanceof Float32Array;
};

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

const textEncoder = new TextEncoder();

export const strToTypedArray = (data: TMainDataTypes): Uint8Array | Error => {
  const strData = stryngify(data);

  if (strData instanceof Error) {
    return strData;
  }

  return textEncoder.encode(strData);
};

type TConvertedToTypedArrayData = TStringifyData | TTypedArrays;

export const convertToTypedArray = (
  data: TConvertedToTypedArrayData
): TTypedArrays | Error => {
  if (isTypedArray(data)) {
    return data;
  }
  return strToTypedArray(data);
};
