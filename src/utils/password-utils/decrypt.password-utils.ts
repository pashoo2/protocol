import {
  importPasswordKeyFromString,
  generatePasswordKeyByPasswordString,
} from './derive-key.password-utils';
import {
  getInitializationVectorFromData,
  decryptDataFromString,
} from 'utils/encryption-utils/encryption-utils';
import { PASSWORD_ENCRYPTION_UTILS_DECRYPTION_PARAMS } from './password-utils.const';
import {
  decodeStringUTF8ToArrayBuffer,
  encodeArrayBufferToUTF8,
} from 'utils/string-encoding-utils';

export const decryptDataWithKeyNative = async (
  key: string | CryptoKey,
  dataWithIv: ArrayBuffer
): Promise<ArrayBuffer | Error> => {
  let cryptoKey;

  if (key instanceof CryptoKey) {
    cryptoKey = key;
  } else {
    cryptoKey = await importPasswordKeyFromString(key);
  }
  if (cryptoKey instanceof Error) {
    return cryptoKey;
  }

  const dataWithIvStructure = getInitializationVectorFromData(dataWithIv);
  debugger;
  if (dataWithIvStructure instanceof Error) {
    return dataWithIvStructure;
  }

  const { iv, data } = dataWithIvStructure;

  return decryptDataFromString(cryptoKey, data, {
    ...PASSWORD_ENCRYPTION_UTILS_DECRYPTION_PARAMS,
    iv,
  });
};

export const decryptDataWithKey = async (
  key: string | CryptoKey,
  dataWithIv: string
): Promise<string | Error> => {
  const dataWithIvArrayBuffer = decodeStringUTF8ToArrayBuffer(dataWithIv);

  if (dataWithIvArrayBuffer instanceof Error) {
    return dataWithIvArrayBuffer;
  }

  const decryptedArrayBuffer = await decryptDataWithKeyNative(
    key,
    dataWithIvArrayBuffer
  );

  if (decryptedArrayBuffer instanceof Error) {
    return decryptedArrayBuffer;
  }

  return encodeArrayBufferToUTF8(decryptedArrayBuffer);
};

export const decryptDataByPassword = async (
  password: string,
  dataWithIv: string
): Promise<string | Error> => {
  const key = await generatePasswordKeyByPasswordString(password);

  if (key instanceof Error) {
    console.error(key);
    return key;
  }

  return decryptDataWithKey(key, dataWithIv);
};
