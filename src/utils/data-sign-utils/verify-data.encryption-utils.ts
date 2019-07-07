import {
  isTypedArray,
  stringToTypedArray,
  typedArrayToString,
} from 'utils/typed-array-utils';
import { cryptoModule } from './main.data-sign-utils.const';
import {
  DATA_SIGN_CRYPTO_UTIL_VERIFY_KEY_TYPE,
  DATA_SIGN_CRYPTO_UTIL_KEY_DESC,
} from './data-sign-utils.const';
import {
  TDATA_SIGN_UTIL_VERIFY_DATA_TYPES,
  TDATA_SIGN_UTIL_VERIFY_DATA_TYPES_NATIVE,
  TDATA_SIGN_UTIL_VERIFY_KEY_TYPES,
} from './data-sign-utils.types';
import { getKeyOfType } from './keys.data-sign-utils';

export const decryptNative = async (
  key: CryptoKey,
  data: TDATA_SIGN_UTIL_VERIFY_DATA_TYPES_NATIVE
): Promise<ArrayBuffer | Error> => {
  if (key.type !== DATA_SIGN_CRYPTO_UTIL_VERIFY_KEY_TYPE) {
    return new Error(
      `The type of the key ${key.type} may not be used for data decryption`
    );
  }
  if (!isTypedArray(data)) {
    return new Error('The data type is not supported');
  }
  try {
    const res = await cryptoModule.decrypt(
      DATA_SIGN_CRYPTO_UTIL_KEY_DESC,
      key,
      data
    );

    return res;
  } catch (err) {
    return err;
  }
};

export const decryptDataFromString = async (
  key: TDATA_SIGN_UTIL_VERIFY_KEY_TYPES,
  data: TDATA_SIGN_UTIL_VERIFY_DATA_TYPES
): Promise<ArrayBuffer | Error> => {
  const k = await getKeyOfType(key, DATA_SIGN_CRYPTO_UTIL_VERIFY_KEY_TYPE);

  if (k instanceof Error) {
    return k;
  }

  const d = typeof data
    ? stringToTypedArray(data)
    : (data as TDATA_SIGN_UTIL_VERIFY_DATA_TYPES_NATIVE);

  if (d instanceof Error) {
    return d;
  }

  return decryptNative(k, d);
};

export const decryptFromString = async (
  key: TDATA_SIGN_UTIL_VERIFY_KEY_TYPES,
  data: TDATA_SIGN_UTIL_VERIFY_DATA_TYPES
): Promise<string | Error> => {
  const decryptedData = await decryptDataFromString(key, data);

  if (decryptedData instanceof Error) {
    return decryptedData;
  }
  return typedArrayToString(decryptedData);
};
