import { TStringifyData, stringify } from 'utils/main-utils';
import {
  decodeDOMStringToArrayBuffer,
  encodeArrayBufferToDOMString,
} from 'utils/string-encoding-utils';
import { TTypedArrays } from 'types/main.types';
import { HASH_CALCULATION_UTILS_HASH_ALHORITHM } from './hash-calculation-utils.const';
import {
  cryptoModule,
  crypto,
} from '../data-sign-utils/main.data-sign-utils.const';

export const hashCalculator = cryptoModule.digest.bind(crypto.subtle);

export const calculateHashNative = async (
  data: TTypedArrays,
  alg: HASH_CALCULATION_UTILS_HASH_ALHORITHM
): Promise<ArrayBuffer | Error> => {
  try {
    const hashString = await hashCalculator(alg, data);

    return hashString;
  } catch (err) {
    return err;
  }
};

export const calculateHash = async (
  data: TStringifyData,
  alg: HASH_CALCULATION_UTILS_HASH_ALHORITHM = HASH_CALCULATION_UTILS_HASH_ALHORITHM.SHA256
): Promise<string | Error> => {
  const dataAsString = stringify(data);

  if (dataAsString instanceof Error) {
    return dataAsString;
  }

  const dataAsArrayBuffer = decodeDOMStringToArrayBuffer(dataAsString);

  if (dataAsArrayBuffer instanceof Error) {
    return dataAsArrayBuffer;
  }

  const hashArrayBuffer = await calculateHashNative(dataAsArrayBuffer, alg);

  if (hashArrayBuffer instanceof Error) {
    return hashArrayBuffer;
  }
  return encodeArrayBufferToDOMString(hashArrayBuffer);
};
