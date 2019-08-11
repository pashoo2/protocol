import { TStringifyData, stringify } from 'utils/main-utils';
import {
  decodeDOMStringToArrayBuffer,
  encodeArrayBufferToDOMString,
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
  const dataAsString = stringify(data);

  if (dataAsString instanceof Error) {
    return dataAsString;
  }

  const dataAsArrayBuffer = decodeDOMStringToArrayBuffer(dataAsString);

  if (dataAsArrayBuffer instanceof Error) {
    return dataAsArrayBuffer;
  }

  const hashArrayBuffer = await calculateHashNative(dataAsArrayBuffer);

  if (hashArrayBuffer instanceof Error) {
    return hashArrayBuffer;
  }

  return encodeArrayBufferToDOMString(hashArrayBuffer);
};
