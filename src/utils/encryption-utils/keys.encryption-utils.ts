import { isCryptoKeyPair } from 'utils/encryption-keys-utils';
import {
  CRYPTO_UTIL_GENERATE_KEYPAIR_OPTIONS,
  CRYPTO_UTIL_KEYPAIR_USAGES,
  CRYPTO_UTIL_PUBLIC_KEY_USAGE,
  CRYPTO_UTIL_PRIVATE_KEY_USAGE,
  CRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT,
  CRYPTO_UTIL_KEY_DESC,
  CRYPTO_UTIL_KEYS_EXTRACTABLE,
  CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME,
  CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME,
} from './crypto-utils.const';
import { cryptoModule } from './main.crypto-utils.const';
import {
  TCRYPTO_UTIL_KEY_EXPORT_FORMAT_TYPE,
  TCRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE,
  TCRYPTO_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE,
  TCRYPTO_UTIL_ENCRYPT_KEY_TYPES,
} from './crypto-utils.types';

export const generateKeyPair = (): PromiseLike<CryptoKeyPair> =>
  cryptoModule.generateKey(
    CRYPTO_UTIL_GENERATE_KEYPAIR_OPTIONS,
    CRYPTO_UTIL_KEYS_EXTRACTABLE,
    CRYPTO_UTIL_KEYPAIR_USAGES
  );

export const exportKey = (
  key: CryptoKey
): PromiseLike<TCRYPTO_UTIL_KEY_EXPORT_FORMAT_TYPE> => {
  return cryptoModule.exportKey(CRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT, key);
};

export const exportPublicKey = async (keyPair: CryptoKeyPair) => {
  return exportKey(keyPair.publicKey);
};

export const exportPublicKeyAsString = async (keyPair: CryptoKeyPair) => {
  return JSON.stringify(exportPublicKey(keyPair));
};

export const exportKeyPair = async (
  keyPair: CryptoKeyPair
): Promise<TCRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE | Error> => {
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
        [CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME]: publicKey,
        [CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]: privateKey,
      };
    }
    return new Error('Argument given must be a CryptoKeyPair');
  } catch (err) {
    return err;
  }
};

export const exportKeyPairAsString = async (
  keyPair: CryptoKeyPair
): Promise<string> => {
  return JSON.stringify(await exportKeyPair(keyPair));
};

export const importKey = (
  key: object,
  isPublic: boolean = true
): PromiseLike<CryptoKey> => {
  return cryptoModule.importKey(
    CRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT,
    key,
    CRYPTO_UTIL_KEY_DESC,
    CRYPTO_UTIL_KEYS_EXTRACTABLE,
    [isPublic ? CRYPTO_UTIL_PUBLIC_KEY_USAGE : CRYPTO_UTIL_PRIVATE_KEY_USAGE]
  );
};

export const importPublicKey = (key: object): PromiseLike<CryptoKey> =>
  importKey(key, true);

export const importPrivateKey = (key: object): PromiseLike<CryptoKey> =>
  importKey(key, false);

export const importKeyPair = async (
  keyPair: TCRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE
): Promise<TCRYPTO_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE> => {
  return {
    [CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME]: await importPublicKey(
      keyPair[CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME]
    ),
    [CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]: await importPrivateKey(
      keyPair[CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]
    ),
  };
};

export const importKeyPairFromString = (
  keyPairString: string
): Promise<TCRYPTO_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE> | Error => {
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
    keyString.includes(CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME) &&
    keyString.includes(CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME)
  );
};

const KEY_NOT_FOUND_ERROR_MESSAGE = 'A key of the required type was not found';

export const getKeyOfType = async (
  key: TCRYPTO_UTIL_ENCRYPT_KEY_TYPES,
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
