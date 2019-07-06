import { cryptoModule } from './main.crypto-utils.const';
import {
  CRYPTO_UTIL_KEY_DESC,
  CRYPTO_UTIL_ENCRYPTION_KEY_TYPE,
} from './crypto-utils.const';
import {
  TCRYPTO_UTIL_ENCRYPT_DATA_TYPES,
  TCRYPTO_UTIL_ENCRYPT_DATA_TYPES_NATIVE,
  TCRYPTO_UTIL_ENCRYPT_KEY_TYPES,
} from './crypto-utils.types';
import { getKeyOfType, exportKey } from './keys.encryption-utils';
import { convertToTypedArray, typedArrayToString } from 'utils/main-utils';

export const encryptNative = async (
  // crypto key using for data encryption
  // a public key of the user in the current implementation
  key: CryptoKey,
  data: TCRYPTO_UTIL_ENCRYPT_DATA_TYPES_NATIVE
): Promise<ArrayBuffer | Error> => {
  if (key.type !== CRYPTO_UTIL_ENCRYPTION_KEY_TYPE) {
    return new Error(
      `The type of the key ${key.type} may not be used for data encryption`
    );
  }
  try {
    console.log('encryptNative:key', await exportKey(key));
    const res = await cryptoModule.encrypt(
      { ...CRYPTO_UTIL_KEY_DESC },
      key,
      data
    );
    console.log('encryptNative:result', res);
    return res;
  } catch (err) {
    return err;
  }
};

export const encryptToTypedArray = async (
  // crypto key using for data encryption
  // a public key of the user in the current implementation
  key: TCRYPTO_UTIL_ENCRYPT_KEY_TYPES,
  data: TCRYPTO_UTIL_ENCRYPT_DATA_TYPES
): Promise<ArrayBuffer | Error> => {
  const k = await getKeyOfType(key, CRYPTO_UTIL_ENCRYPTION_KEY_TYPE);

  if (k instanceof Error) {
    return k;
  }

  const d = await convertToTypedArray(data);

  if (d instanceof Error) {
    return d;
  }

  return encryptNative(
    k as CryptoKey,
    d as TCRYPTO_UTIL_ENCRYPT_DATA_TYPES_NATIVE
  );
};

export const encryptToString = async (
  // crypto key using for data encryption
  // a public key of the user in the current implementation
  key: TCRYPTO_UTIL_ENCRYPT_KEY_TYPES,
  data: TCRYPTO_UTIL_ENCRYPT_DATA_TYPES
): Promise<string | Error> => {
  const encryptedData = await encryptToTypedArray(key, data);

  if (encryptedData instanceof Error) {
    return encryptedData;
  }

  return typedArrayToString(encryptedData);
};
