import { TStringifyData, stryngify } from 'utils/main-utils';
import {
  decodeStringUTF8ToArrayBuffer,
  encodeArrayBufferToUTF8,
} from 'utils/string-encoding-utils';
import { TTypedArrays } from 'types/main.types';
import { HASH_CALCULATION_UTILS_DEFAULT_HASH_ALHORITHM } from './hash-calculation-utils.const';

export const hashCalculator = window.crypto.subtle.digest.bind(
  window.crypto.subtle
);

export const calculateHashNative = async (
  data: TTypedArrays
): Promise<ArrayBuffer | Error> => {
  try {
    const hashString = await hashCalculator(
      HASH_CALCULATION_UTILS_DEFAULT_HASH_ALHORITHM,
      data
    );

    return hashString;
  } catch (err) {
    return err;
  }
};

export const calculateHash = async (
  data: TStringifyData
): Promise<string | Error> => {
  const dataAsString = stryngify(data);

  if (dataAsString instanceof Error) {
    return dataAsString;
  }

  const dataAsArrayBuffer = decodeStringUTF8ToArrayBuffer(dataAsString);

  if (dataAsArrayBuffer instanceof Error) {
    return dataAsArrayBuffer;
  }

  const hashArrayBuffer = await calculateHashNative(dataAsArrayBuffer);

  if (hashArrayBuffer instanceof Error) {
    return hashArrayBuffer;
  }

  return encodeArrayBufferToUTF8(hashArrayBuffer);
};
