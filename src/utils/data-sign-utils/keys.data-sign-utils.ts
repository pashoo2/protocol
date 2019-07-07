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
  TCRYPTO_UTIL_IMPORT_KEY_TYPES,
} from './data-sign-utils.types';
import { isCryptoKeyPair } from 'utils/encryption-keys-utils';

export const isCryptoKeyPairImported = (
  key: any
): key is TDATA_SIGN_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE => {
  return (
    typeof key === 'object' &&
    !!key[DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME] &&
    !!key[DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]
  );
};

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

export const importKey = async (
  key: TCRYPTO_UTIL_IMPORT_KEY_TYPES,
  isPublic: boolean = true
): Promise<CryptoKey | Error> => {
  try {
    if (typeof key !== 'object') {
      return new Error('Unsupported argument type');
    }
    const res = await cryptoModule.importKey(
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

    if (!(res instanceof CryptoKey)) {
      return new Error("Can't import the key");
    }
    return res;
  } catch (err) {
    return err;
  }
};

export const importPublicKey = (
  key: TCRYPTO_UTIL_IMPORT_KEY_TYPES
): PromiseLike<CryptoKey | Error> => importKey(key, true);

export const importPrivateKey = (
  key: TCRYPTO_UTIL_IMPORT_KEY_TYPES
): PromiseLike<CryptoKey | Error> => importKey(key, false);

export const importKeyPair = async (
  keyPair: TDATA_SIGN_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE
): Promise<TDATA_SIGN_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE | Error> => {
  try {
    if (isCryptoKeyPairImported(keyPair)) {
      const [publicKey, privateKey] = await Promise.all([
        importPublicKey(keyPair[DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME]),
        importPrivateKey(
          keyPair[DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]
        ),
      ]).catch(err => [err, err]);

      if (publicKey instanceof Error) {
        return publicKey;
      }
      if (privateKey instanceof Error) {
        return privateKey;
      }
      return {
        [DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME]: publicKey,
        [DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]: privateKey,
      };
    }
    return new Error('The argument must be an instance of CryptoKeyPair');
  } catch (err) {
    return err;
  }
};

export const importKeyPairFromString = (
  keyPairString: string
): Promise<TDATA_SIGN_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE | Error> | Error => {
  try {
    if (typeof keyPairString === 'string') {
      const keyPairObject = JSON.parse(keyPairString);

      if (isCryptoKeyPairImported(keyPairObject)) {
        return importKeyPair(keyPairObject);
      }
      return new Error('There is a wrong format for the imported key pair');
    }
    return new Error('The key must be a string');
  } catch (err) {
    return err;
  }
};

export const importKeyFromString = (
  keyString: string,
  isPublic: boolean = true
): PromiseLike<CryptoKey | Error> | Error => {
  try {
    if (typeof keyString !== 'string') {
      return new Error('The key must be a string');
    }

    const parsedKey = JSON.parse(keyString);

    return importKey(parsedKey, isPublic);
  } catch (err) {
    return err;
  }
};

export const importPublicKeyFromString = (
  key: string
): PromiseLike<CryptoKey | Error> | Error => importKeyFromString(key, true);

export const importPrivateKeyFromString = (
  key: string
): PromiseLike<CryptoKey | Error> | Error => importKeyFromString(key, false);

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
