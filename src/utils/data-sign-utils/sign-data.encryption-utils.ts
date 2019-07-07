import { cryptoModule } from './main.data-sign-utils.const';
import {
  DATA_SIGN_CRYPTO_UTIL_DATA_SIGN_AND_VERIFY_PARAMS,
  DATA_SIGN_CRYPTO_UTIL_SIGN_KEY_TYPE,
} from './data-sign-utils.const';
import {
  TDATA_SIGN_UTIL_SIGN_DATA_TYPES,
  TDATA_SIGN_UTIL_SIGN_DATA_TYPES_NATIVE,
  TDATA_SIGN_UTIL_SIGN_KEY_TYPES,
} from './data-sign-utils.types';
import { getKeyOfType, exportKey } from './keys.data-sign-utils';
import {
  convertToTypedArray,
  typedArrayToString,
} from 'utils/typed-array-utils';

export const signNative = async (
  key: CryptoKey,
  data: TDATA_SIGN_UTIL_SIGN_DATA_TYPES_NATIVE
): Promise<ArrayBuffer | Error> => {
  if (key.type !== DATA_SIGN_CRYPTO_UTIL_SIGN_KEY_TYPE) {
    return new Error(
      `The type of the key ${key.type} may not be used for data signing`
    );
  }
  try {
    const res = await cryptoModule.sign(
      { ...DATA_SIGN_CRYPTO_UTIL_DATA_SIGN_AND_VERIFY_PARAMS },
      key,
      data
    );

    return res;
  } catch (err) {
    return err;
  }
};

export const signToTypedArray = async (
  // crypto key using for data encryption
  // a public key of the user in the current implementation
  key: TDATA_SIGN_UTIL_SIGN_KEY_TYPES,
  data: TDATA_SIGN_UTIL_SIGN_DATA_TYPES
): Promise<ArrayBuffer | Error> => {
  const k = await getKeyOfType(key, DATA_SIGN_CRYPTO_UTIL_SIGN_KEY_TYPE);

  if (k instanceof Error) {
    return k;
  }

  const d = await convertToTypedArray(data);

  if (d instanceof Error) {
    return d;
  }

  return signNative(
    k as CryptoKey,
    d as TDATA_SIGN_UTIL_SIGN_DATA_TYPES_NATIVE
  );
};

export const signToString = async (
  // crypto key using for data encryption
  // a public key of the user in the current implementation
  key: TDATA_SIGN_UTIL_SIGN_KEY_TYPES,
  data: TDATA_SIGN_UTIL_SIGN_DATA_TYPES
): Promise<string | Error> => {
  const encryptedData = await signToTypedArray(key, data);

  if (encryptedData instanceof Error) {
    return encryptedData;
  }

  return typedArrayToString(encryptedData);
};
