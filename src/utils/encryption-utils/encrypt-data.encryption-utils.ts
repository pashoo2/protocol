import { cryptoModule } from './main.crypto-utils.const';
import {
  CRYPTO_UTIL_KEY_DESC,
  CRYPTO_UTIL_ENCRYPTION_KEY_TYPE,
  INITIALIZATION_VECTOR_DEFAULT_LENGTH,
} from './crypto-utils.const';
import {
  TCRYPTO_UTIL_ENCRYPT_DATA_TYPES,
  TCRYPTO_UTIL_ENCRYPT_DATA_TYPES_NATIVE,
  TCRYPTO_UTIL_ENCRYPT_KEY_TYPES,
  TCRYPTO_UTILS_ENCRYPT_DATA_KEY_CONFIG,
  TCRYPTO_UTILS_DATA_WITH_INITIALIZATION_VECTOR,
} from './crypto-utils.types';
import { getKeyOfType, exportKey } from './keys.encryption-utils';
import {
  convertToTypedArray,
  typedArrayToString,
  arrayBufferFromTypedArray,
  concatArrayBuffers,
  getBytesFromArrayBuffer,
} from 'utils/typed-array-utils';
import { decodeDOMStringToArrayBuffer } from 'utils/string-encoding-utils';

/**
 * return a random vector, used e.g. for aes-gcm
 * encryption
 * @param vectorLength - lenght of the vector generated
 */
export const generateInitializationVectorNative = (
  vectorLength: number = INITIALIZATION_VECTOR_DEFAULT_LENGTH
): Uint8Array | Error => {
  try {
    return window.crypto.getRandomValues(new Uint8Array(vectorLength));
  } catch (err) {
    return err;
  }
};

export const generateInitializationVectorNativeArrayBuffer = (
  vectorLength?: number
): ArrayBuffer | Error => {
  const iv = generateInitializationVectorNative(vectorLength);

  if (iv instanceof Error) {
    return iv;
  }
  return arrayBufferFromTypedArray(iv);
};

export const concatDataWithInitializationVector = (
  options: TCRYPTO_UTILS_DATA_WITH_INITIALIZATION_VECTOR
): ArrayBuffer | Error => {
  try {
    return concatArrayBuffers(options.iv, options.data);
  } catch (err) {
    return err;
  }
};

export const getInitializationVectorFromData = (
  arrayBuffer: ArrayBuffer,
  ivLengthBytes: number = INITIALIZATION_VECTOR_DEFAULT_LENGTH
): TCRYPTO_UTILS_DATA_WITH_INITIALIZATION_VECTOR | Error => {
  try {
    const iv = getBytesFromArrayBuffer(arrayBuffer, 0, ivLengthBytes);

    if (iv instanceof Error) {
      return iv;
    }

    const data = getBytesFromArrayBuffer(arrayBuffer, ivLengthBytes);

    if (data instanceof Error) {
      return data;
    }
    return {
      iv,
      data,
    };
  } catch (err) {
    return err;
  }
};

export const getInitializationVectorFromDataString = (
  data: string,
  ivLengthBytes?: number
): TCRYPTO_UTILS_DATA_WITH_INITIALIZATION_VECTOR | Error => {
  const dataArrayBuffer = decodeDOMStringToArrayBuffer(data);

  if (dataArrayBuffer instanceof Error) {
    return dataArrayBuffer;
  }
  return getInitializationVectorFromData(dataArrayBuffer, ivLengthBytes);
};

export const encryptNative = async (
  // crypto key using for data encryption
  // a public key of the user in the current implementation
  key: CryptoKey,
  data: TCRYPTO_UTIL_ENCRYPT_DATA_TYPES_NATIVE,
  //an optional params for the encryption method
  cryptoKeyConfig: TCRYPTO_UTILS_ENCRYPT_DATA_KEY_CONFIG = CRYPTO_UTIL_KEY_DESC
): Promise<ArrayBuffer | Error> => {
  try {
    const res = await cryptoModule.encrypt(cryptoKeyConfig, key, data);

    return res;
  } catch (err) {
    return err;
  }
};

export const encryptToTypedArray = async (
  // crypto key using for data encryption
  // a public key of the user in the current implementation
  key: TCRYPTO_UTIL_ENCRYPT_KEY_TYPES,
  data: TCRYPTO_UTIL_ENCRYPT_DATA_TYPES,
  //an optional params for the encryption method
  cryptoKeyConfig?: TCRYPTO_UTILS_ENCRYPT_DATA_KEY_CONFIG
): Promise<ArrayBuffer | Error> => {
  let k;

  if (key instanceof CryptoKey) {
    k = key;
  } else {
    k = await getKeyOfType(key, CRYPTO_UTIL_ENCRYPTION_KEY_TYPE);
  }
  if (k instanceof Error) {
    return k;
  }

  const d = convertToTypedArray(data);

  if (d instanceof Error) {
    return d;
  }

  return encryptNative(k, d, cryptoKeyConfig);
};

export const encryptToString = async (
  // crypto key using for data encryption
  // a public key of the user in the current implementation
  key: TCRYPTO_UTIL_ENCRYPT_KEY_TYPES,
  data: TCRYPTO_UTIL_ENCRYPT_DATA_TYPES,
  //an optional params for the encryption method
  cryptoKeyConfig?: TCRYPTO_UTILS_ENCRYPT_DATA_KEY_CONFIG
): Promise<string | Error> => {
  const encryptedData = await encryptToTypedArray(key, data);

  if (encryptedData instanceof Error) {
    return encryptedData;
  }

  return typedArrayToString(encryptedData);
};
