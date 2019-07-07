import { TStringifyData, stryngify } from 'utils/main-utils';
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
