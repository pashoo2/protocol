import {
  DATA_SIGN_CRYPTO_UTIL_GENERATE_KEYPAIR_OPTIONS,
  DATA_SIGN_CRYPTO_UTIL_KEYPAIR_USAGES,
  DATA_SIGN_CRYPTO_UTIL_PUBLIC_KEY_USAGE,
  DATA_SIGN_CRYPTO_UTIL_PRIVATE_KEY_USAGE,
  DATA_SIGN_CRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT,
  DATA_SIGN_CRYPTO_UTIL_KEY_DESC,
  DATA_SIGN_CRYPTO_UTIL_KEYS_EXTRACTABLE,
  DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME,
  DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME,
} from './data-sign-utils.const';
import { cryptoModule } from './main.data-sign-utils.const';
import {
  TDATA_SIGN_UTIL_KEY_EXPORT_FORMAT_TYPE,
  TDATA_SIGN_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE,
  TDATA_SIGN_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE,
  TDATA_SIGN_UTIL_SIGN_KEY_TYPES,
} from './data-sign-utils.types';
import { isCryptoKeyPair } from 'utils/encryption-keys-utils';

export const generateKeyPair = (): PromiseLike<CryptoKeyPair> =>
  cryptoModule.generateKey(
    DATA_SIGN_CRYPTO_UTIL_GENERATE_KEYPAIR_OPTIONS,
    DATA_SIGN_CRYPTO_UTIL_KEYS_EXTRACTABLE,
    DATA_SIGN_CRYPTO_UTIL_KEYPAIR_USAGES
  );

export const exportKey = async (
  key: CryptoKey
): Promise<TDATA_SIGN_UTIL_KEY_EXPORT_FORMAT_TYPE | Error> => {
  try {
    return cryptoModule.exportKey(
      DATA_SIGN_CRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT,
      key
    );
  } catch (err) {
    return err;
  }
};

export const exportPublicKey = async (
  keyPair: CryptoKeyPair
): Promise<TDATA_SIGN_UTIL_KEY_EXPORT_FORMAT_TYPE | Error> => {
  if (isCryptoKeyPair(keyPair)) {
    return exportKey(keyPair.publicKey);
  }
  return new Error('Argument must be a CryptoKeyPair');
};

export const exportPublicKeyAsString = async (
  keyPair: CryptoKeyPair
): Promise<Error | string> => {
  try {
    const keyPublicExported = await exportPublicKey(keyPair);

    if (keyPublicExported instanceof Error) {
      return keyPublicExported;
    }
    return JSON.stringify(keyPublicExported);
  } catch (err) {
    return err;
  }
};

export const exportKeyPair = async (
  keyPair: CryptoKeyPair
): Promise<TDATA_SIGN_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE | Error> => {
  try {
    if (isCryptoKeyPair(keyPair)) {
      // do it in parallel
      const [privateKey, publicKey] = await Promise.all([
        exportKey(keyPair.privateKey),
        exportKey(keyPair.publicKey),
      ]).catch(err => [err, err]);

      if (privateKey instanceof Error) {
        return privateKey;
      }
      if (publicKey instanceof Error) {
        return publicKey;
      }
      return {
        [DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME]: publicKey,
        [DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]: privateKey,
      };
    }
    return new Error('Argument given must be a CryptoKeyPair');
  } catch (err) {
    return err;
  }
};

export const exportKeyPairAsString = async (
  keyPair: CryptoKeyPair
): Promise<string | Error> => {
  try {
    const res = await exportKeyPair(keyPair);

    if (res instanceof Error) {
      return res;
    }
    return JSON.stringify(res);
  } catch (err) {
    return err;
  }
};

export const importKey = (
  key: object,
  isPublic: boolean = true
): PromiseLike<CryptoKey> => {
  return cryptoModule.importKey(
    DATA_SIGN_CRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT,
    key,
    DATA_SIGN_CRYPTO_UTIL_KEY_DESC,
    DATA_SIGN_CRYPTO_UTIL_KEYS_EXTRACTABLE,
    [
      isPublic
        ? DATA_SIGN_CRYPTO_UTIL_PUBLIC_KEY_USAGE
        : DATA_SIGN_CRYPTO_UTIL_PRIVATE_KEY_USAGE,
    ]
  );
};

export const importPublicKey = (key: object): PromiseLike<CryptoKey> =>
  importKey(key, true);

export const importPrivateKey = (key: object): PromiseLike<CryptoKey> =>
  importKey(key, false);

export const importKeyPair = async (
  keyPair: TDATA_SIGN_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE
): Promise<TDATA_SIGN_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE> => {
  return {
    [DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME]: await importPublicKey(
      keyPair[DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME]
    ),
    [DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]: await importPrivateKey(
      keyPair[DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]
    ),
  };
};

export const importKeyPairFromString = (
  keyPairString: string
): Promise<TDATA_SIGN_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE> | Error => {
  try {
    const keyPairObject = JSON.parse(keyPairString);

    return importKeyPair(keyPairObject);
  } catch (err) {
    return err;
  }
};

export const importKeyFromString = (
  keyString: string,
  isPublic: boolean = true
): PromiseLike<CryptoKey> | Error => {
  try {
    return importKey(JSON.parse(keyString), isPublic);
  } catch (err) {
    return err;
  }
};

export const importPublicKeyFromString = (
  key: string
): PromiseLike<CryptoKey> | Error => importKeyFromString(key, true);

export const importPrivateKeyFromString = (
  key: string
): PromiseLike<CryptoKey> | Error => importKeyFromString(key, false);

export const checkIfStringIsKeyPair = (keyString: string): boolean => {
  return (
    keyString.includes(DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME) &&
    keyString.includes(DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME)
  );
};

const KEY_NOT_FOUND_ERROR_MESSAGE = 'A key of the required type was not found';

export const getKeyOfType = async (
  key: TDATA_SIGN_UTIL_SIGN_KEY_TYPES,
  type: KeyType
): Promise<CryptoKey | Error> => {
  if (typeof key === 'string') {
    if (checkIfStringIsKeyPair(key)) {
      const keyPair = await importKeyPairFromString(key);

      if (keyPair instanceof Error) {
        return keyPair;
      }
      return getKeyOfType(keyPair, type);
    } else {
      const keyFromString = await importKeyFromString(key, type === 'public');

      if (keyFromString instanceof Error) {
        return keyFromString;
      }
      return getKeyOfType(keyFromString, type);
    }
  }
  if (key instanceof CryptoKey) {
    return key.type === type ? key : new Error(KEY_NOT_FOUND_ERROR_MESSAGE);
  }
  if (typeof key === 'object') {
    const keys = Object.values(key);
    const keyResulted = keys.find(
      (k: CryptoKey) => k && k.type && k.type === type
    );

    return keyResulted || new Error(KEY_NOT_FOUND_ERROR_MESSAGE);
  }
  return new Error('There is an unsupported type of the key given');
};
