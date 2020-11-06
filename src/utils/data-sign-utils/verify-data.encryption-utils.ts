import { isTypedArray, stringToTypedArray, typedArrayToString } from 'utils/typed-array-utils';
import { stringify } from 'utils/main-utils';
import { cryptoModuleDataSign } from './main.data-sign-utils.const';
import { DATA_SIGN_CRYPTO_UTIL_VERIFY_KEY_TYPE, DATA_SIGN_CRYPTO_UTIL_DATA_SIGN_AND_VERIFY_PARAMS } from './data-sign-utils.const';
import {
  TDATA_SIGN_UTIL_VERIFY_DATA_TYPES,
  TDATA_SIGN_UTIL_VERIFY_DATA_TYPES_EXTENDED,
  TDATA_SIGN_UTIL_VERIFY_DATA_TYPES_NATIVE,
  TDATA_SIGN_UTIL_VERIFY_KEY_TYPES,
} from './data-sign-utils.types';
import { dataSignGetKeyOfType } from './keys.data-sign-utils';

export const verifyNative = async (
  key: CryptoKey,
  data: TDATA_SIGN_UTIL_VERIFY_DATA_TYPES_NATIVE,
  signature: TDATA_SIGN_UTIL_VERIFY_DATA_TYPES_NATIVE
): Promise<true | Error> => {
  if (key.type !== DATA_SIGN_CRYPTO_UTIL_VERIFY_KEY_TYPE) {
    return new Error(`The type of the key ${key.type} may not be used for data decryption`);
  }
  if (!isTypedArray(data)) {
    return new Error('The data type is not supported');
  }
  try {
    const res = await cryptoModuleDataSign.verify({ ...DATA_SIGN_CRYPTO_UTIL_DATA_SIGN_AND_VERIFY_PARAMS }, key, signature, data);

    return res !== true ? new Error('The signature for the data is not valid') : true;
  } catch (err) {
    return err;
  }
};

export const verifyData = async (
  key: TDATA_SIGN_UTIL_VERIFY_KEY_TYPES,
  data: TDATA_SIGN_UTIL_VERIFY_DATA_TYPES_EXTENDED,
  signature: TDATA_SIGN_UTIL_VERIFY_DATA_TYPES
): Promise<true | Error> => {
  const k = await dataSignGetKeyOfType(key, DATA_SIGN_CRYPTO_UTIL_VERIFY_KEY_TYPE);

  if (k instanceof Error) {
    return k;
  }

  let d;

  if (isTypedArray(data)) {
    d = data;
  } else if (typeof data === 'object' && !(data instanceof Error)) {
    d = stringify(data);

    if (d instanceof Error) {
      return d;
    }
    d = stringToTypedArray(d);
  } else if (typeof data === 'string') {
    d = stringToTypedArray(data);
  } else {
    return new Error('Unsupported data type');
  }
  if (d instanceof Error) {
    return d;
  }

  const s = typeof signature === 'string' ? stringToTypedArray(signature) : signature;

  if (s instanceof Error) {
    return s;
  }
  return verifyNative(k, d, s);
};
