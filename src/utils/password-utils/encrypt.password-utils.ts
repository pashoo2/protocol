import {
  PASSWORD_ENCRYPTION_UTILS_ENCRYPTION_INITIALIZATION_VECTOR_LENGTH,
  PASSWORD_ENCRYPTION_UTILS_ENCRYPTION_PARAMS,
} from './password-utils.const';
import {
  generateInitializationVectorNativeArrayBuffer,
  encryptToTypedArray,
  concatDataWithInitializationVector,
} from 'utils/encryption-utils/encryption-utils';
import {
  TCRYPTO_UTIL_ENCRYPT_KEY_TYPES,
  TCRYPTO_UTIL_ENCRYPT_DATA_TYPES,
} from 'utils/encryption-utils/crypto-utils.types';
import { encodeArrayBufferToUTF8 } from 'utils/string-encoding-utils';
import { importPasswordKeyFromString } from './derive-key.password-utils';

export const encryptDataToArrayBuffer = async (
  key: string,
  data: TCRYPTO_UTIL_ENCRYPT_DATA_TYPES
): Promise<Error | ArrayBuffer> => {
  const cryptoKey = await importPasswordKeyFromString(key);

  if (cryptoKey instanceof Error) {
    return cryptoKey;
  }

  const iv = generateInitializationVectorNativeArrayBuffer();
  debugger;
  if (iv instanceof Error) {
    return iv;
  }

  const dataEncrypted = await encryptToTypedArray(cryptoKey, data, {
    ...PASSWORD_ENCRYPTION_UTILS_ENCRYPTION_PARAMS,
    iv,
  });

  debugger;
  if (dataEncrypted instanceof Error) {
    return dataEncrypted;
  }
  debugger;
  return concatDataWithInitializationVector({
    data: dataEncrypted,
    iv,
  });
};

export const encryptDataToString = async (
  key: string,
  data: TCRYPTO_UTIL_ENCRYPT_DATA_TYPES
): Promise<Error | string> => {
  const encrypted = await encryptDataToArrayBuffer(key, data);

  if (encrypted instanceof Error) {
    return encrypted;
  }
  return encodeArrayBufferToUTF8(encrypted);
};
