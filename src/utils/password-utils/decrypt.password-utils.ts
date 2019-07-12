import { importPasswordKeyFromString } from './derive-key.password-utils';
import {
  getInitializationVectorFromData,
  decryptDataFromString,
} from 'utils/encryption-utils/encryption-utils';
import { PASSWORD_ENCRYPTION_UTILS_DECRYPTION_PARAMS } from './password-utils.const';

export const decryptDataWithKeyNative = async (
  key: string,
  dataWithIv: ArrayBuffer
): Promise<ArrayBuffer | Error> => {
  const cryptoKey = await importPasswordKeyFromString(key);

  if (cryptoKey instanceof Error) {
    return cryptoKey;
  }

  const dataWithIvStructure = getInitializationVectorFromData(dataWithIv);

  if (dataWithIvStructure instanceof Error) {
    return dataWithIvStructure;
  }

  const { iv, data } = dataWithIvStructure;

  return decryptDataFromString(cryptoKey, data, {
    ...PASSWORD_ENCRYPTION_UTILS_DECRYPTION_PARAMS,
    iv,
  });
};
