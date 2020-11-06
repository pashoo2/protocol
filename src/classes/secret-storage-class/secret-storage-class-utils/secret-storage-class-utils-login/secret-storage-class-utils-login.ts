import { encryptDataToString } from './../../../../utils/password-utils/encrypt.password-utils';
import { decryptDataWithKey } from './../../../../utils/password-utils/decrypt.password-utils';
import { generatePasswordKeyByPasswordString } from 'utils/password-utils/derive-key.password-utils';
import { calculateHash } from 'utils/hash-calculation-utils';
import {
  SECRET_STORAGE_CLASS_UTILS_LOGIN_HASH_ALG,
  SECRET_STORAGE_CLASS_UTILS_LOGIN_SALT,
} from './secret-storage-class-utils-login.const';

export const getLoginHash = (login: string) => {
  return calculateHash(login, SECRET_STORAGE_CLASS_UTILS_LOGIN_HASH_ALG);
};

export const getCryptoKeyByLogin = (login: string): Promise<CryptoKey | Error> => {
  return generatePasswordKeyByPasswordString(login, SECRET_STORAGE_CLASS_UTILS_LOGIN_SALT);
};

export const encryptValueByLogin = async (login: string, value: string): Promise<string | Error> => {
  const loginCryptoKey = await getCryptoKeyByLogin(login);

  if (loginCryptoKey instanceof Error) {
    console.error(loginCryptoKey);
    return new Error('Failed to generate a crypto key by the login');
  }
  return encryptDataToString(loginCryptoKey, value);
};

export const decryptValueByLogin = async (login: string, value: string): Promise<Error | string> => {
  const loginCryptoKey = await getCryptoKeyByLogin(login);

  if (loginCryptoKey instanceof Error) {
    return loginCryptoKey;
  }
  return decryptDataWithKey(loginCryptoKey, value);
};
