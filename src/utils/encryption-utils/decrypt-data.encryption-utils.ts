import {
  isTypedArray,
  stringToTypedArray,
  typedArrayToString,
} from 'utils/typed-array-utils';
import { cryptoModule } from './main.crypto-utils.const';
import {
  CRYPTO_UTIL_DECRIPTION_KEY_TYPE,
  CRYPTO_UTIL_KEY_DESC,
} from './crypto-utils.const';
import {
  TCRYPTO_UTIL_DECRYPT_DATA_TYPES,
  TCRYPTO_UTIL_DECRYPT_DATA_TYPES_NATIVE,
  TCRYPTO_UTIL_DECRYPT_KEY_TYPES,
} from './crypto-utils.types';
import { getKeyOfType } from './keys.encryption-utils';
import { stringify } from 'utils/main-utils';

export const decryptNative = async (
  key: CryptoKey,
  data: TCRYPTO_UTIL_DECRYPT_DATA_TYPES_NATIVE
): Promise<ArrayBuffer | Error> => {
  if (key.type !== CRYPTO_UTIL_DECRIPTION_KEY_TYPE) {
    return new Error(
      `The type of the key ${key.type} may not be used for data decryption`
    );
  }
  if (!isTypedArray(data)) {
    return new Error('The data type is not supported');
  }
  try {
    const res = await cryptoModule.decrypt(CRYPTO_UTIL_KEY_DESC, key, data);

    return res;
  } catch (err) {
    return err;
  }
};

export const decryptDataFromString = async (
  key: TCRYPTO_UTIL_DECRYPT_KEY_TYPES,
  data: TCRYPTO_UTIL_DECRYPT_DATA_TYPES | object
): Promise<ArrayBuffer | Error> => {
  const k = await getKeyOfType(key, CRYPTO_UTIL_DECRIPTION_KEY_TYPE);

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
  return decryptNative(k, d);
};

export const decryptFromString = async (
  key: TCRYPTO_UTIL_DECRYPT_KEY_TYPES,
  data: TCRYPTO_UTIL_DECRYPT_DATA_TYPES
): Promise<string | Error> => {
  const decryptedData = await decryptDataFromString(key, data);

  if (decryptedData instanceof Error) {
    return decryptedData;
  }
  return typedArrayToString(decryptedData);
};
