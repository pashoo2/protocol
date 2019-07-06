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
import { getKeyOfType } from './keys.encryption-utils';
import { convertToTypedArray, typedArrayToString } from 'utils/main-utils';

export const encryptNative = (
  // crypto key using for data encryption
  // a public key of the user in the current implementation
  key: CryptoKey,
  data: TCRYPTO_UTIL_ENCRYPT_DATA_TYPES_NATIVE
): PromiseLike<ArrayBuffer> | Error => {
  if (key.type !== CRYPTO_UTIL_ENCRYPTION_KEY_TYPE) {
    return new Error(
      `The type of the key ${key.type} is not used for data encryption`
    );
  }

  return cryptoModule.encrypt(CRYPTO_UTIL_KEY_DESC, key, data);
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
  debugger;
  if (encryptedData instanceof Error) {
    return encryptedData;
  }
  return typedArrayToString(encryptedData);
};
