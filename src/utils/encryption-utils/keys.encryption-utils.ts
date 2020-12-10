import { isCryptoKeyPair } from 'utils/encryption-keys-utils/encryption-keys-utils';
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
import { stringify } from 'utils/serialization-utils';
import { decryptDataByPassword } from 'utils';
import { generateSalt } from './salt-utils';
import { CRYPTO_UTIL_KEYPAIR_SALT_KEY_NAME } from './crypto-utils.const';
import { encryptDataWithPassword } from '../password-utils/encrypt.password-utils';
import { encodeArrayBufferToDOMString } from '../string-encoding-utils';
import { TCRYPTO_UTIL_KEYPAIR_PREIMPORT_FORMAT_TYPE } from './crypto-utils.types';
import { typedArrayToString } from '../typed-array-utils';

export const isCryptoKeyPairImported = (
  key: any,
  checkPrivateKey: boolean = true
): key is TCRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE => {
  return (
    typeof key === 'object' &&
    !!key[CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME] &&
    (!checkPrivateKey || !!key[CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME])
  );
};

export const generateKeyPair = (): PromiseLike<CryptoKeyPair> =>
  cryptoModule.generateKey(CRYPTO_UTIL_GENERATE_KEYPAIR_OPTIONS, CRYPTO_UTIL_KEYS_EXTRACTABLE, CRYPTO_UTIL_KEYPAIR_USAGES);

export const exportKey = (key: CryptoKey): PromiseLike<TCRYPTO_UTIL_KEY_EXPORT_FORMAT_TYPE | Error> => {
  try {
    return cryptoModule.exportKey(CRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT, key);
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const exportKeyAsString = async (key: CryptoKey): Promise<Error | string> => {
  return stringify(await exportKey(key));
};

export const exportPublicKey = async (keyPair: CryptoKeyPair) => {
  return exportKey(keyPair.publicKey);
};

export const exportPublicKeyAsString = async (keyPair: CryptoKeyPair) => {
  const publicKey = await exportPublicKey(keyPair);

  if (publicKey instanceof Error) {
    return publicKey;
  }
  return stringify(publicKey);
};

export const exportKeyPair = async (
  keyPair: CryptoKeyPair,
  password?: string
): Promise<TCRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE | Error> => {
  try {
    if (isCryptoKeyPair(keyPair, !!password)) {
      // do it in parallel
      const [privateKey, publicKey] = await Promise.all([
        password || keyPair.privateKey ? exportKey(keyPair.privateKey) : Promise.resolve(undefined),
        exportKey(keyPair.publicKey),
      ]).catch((err) => [err, err]);

      if (privateKey instanceof Error) {
        return privateKey;
      }
      if (publicKey instanceof Error) {
        return publicKey;
      }

      const result: TCRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE = {
        [CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME]: publicKey,
        [CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]: privateKey,
      };

      if (password) {
        const salt = generateSalt();

        if (salt instanceof Error) {
          return new Error('Failed to generate a unique salt value');
        }

        const encryptedPrivateKey = await encryptDataWithPassword(password, salt, privateKey);

        if (encryptedPrivateKey instanceof Error) {
          return new Error('Failed to encrypt private key with password provided');
        }

        const saltStringified = typedArrayToString(salt);

        if (saltStringified instanceof Error) {
          return new Error('Failed to stringify the salt for the encryption private key');
        }

        const decryptedPrivateKey = await decryptDataByPassword(password, saltStringified, encryptedPrivateKey);

        if (decryptedPrivateKey instanceof Error) {
          return new Error('Failed to decrypt private key for data encryption');
        }
        result[CRYPTO_UTIL_KEYPAIR_SALT_KEY_NAME] = saltStringified;
        result[CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME] = encryptedPrivateKey;
      }
      return result;
    }
    return new Error('Argument given must be a CryptoKeyPair');
  } catch (err) {
    return err;
  }
};

export const exportKeyPairAsString = async (keyPair: CryptoKeyPair, password?: string): Promise<string | Error> => {
  const exportedKeyPair = await exportKeyPair(keyPair, password);

  if (exportedKeyPair instanceof Error) {
    return exportedKeyPair;
  }
  try {
    return stringify(exportedKeyPair);
  } catch (err) {
    return err;
  }
};

export const importKey = (key: object, isPublic: boolean = true): PromiseLike<CryptoKey> => {
  return cryptoModule.importKey(CRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT, key, CRYPTO_UTIL_KEY_DESC, CRYPTO_UTIL_KEYS_EXTRACTABLE, [
    isPublic ? CRYPTO_UTIL_PUBLIC_KEY_USAGE : CRYPTO_UTIL_PRIVATE_KEY_USAGE,
  ]);
};

export const importPublicKey = (key: object): PromiseLike<CryptoKey> => importKey(key, true);

export const importPrivateKey = (key: object): PromiseLike<CryptoKey> => importKey(key, false);

export const importKeyPair = async (
  keyPair: TCRYPTO_UTIL_KEYPAIR_PREIMPORT_FORMAT_TYPE,
  checkPrivateKey: boolean = true
): Promise<TCRYPTO_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE | Error> => {
  try {
    if (isCryptoKeyPairImported(keyPair, checkPrivateKey)) {
      const importResult = await Promise.all([
        (async () => {
          try {
            return await importPublicKey(keyPair[CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME]);
          } catch (err) {
            return err;
          }
        })(),
        (async () => {
          try {
            if (checkPrivateKey || keyPair[CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]) {
              return await importPrivateKey(keyPair[CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]);
            }
          } catch (err) {
            return err;
          }
        })(),
      ]);
      const publicKey = importResult[0];
      let privateKey = importResult[1];

      if (publicKey instanceof Error) {
        return publicKey;
      }
      if (privateKey instanceof Error) {
        if (checkPrivateKey) {
          return privateKey;
        }
        privateKey = undefined;
      }
      return {
        [CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME]: publicKey,
        [CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]: privateKey,
      };
    }
    return new Error('The argument must be an instance of CryptoKeyPair');
  } catch (err) {
    return err;
  }
};

export const importKeyPairFromString = async (
  keyPairString: string,
  password?: string
): Promise<TCRYPTO_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE | Error> => {
  try {
    if (typeof keyPairString === 'string') {
      const keyPairObject = JSON.parse(keyPairString);

      if (password && keyPairObject[CRYPTO_UTIL_KEYPAIR_SALT_KEY_NAME]) {
        if (typeof keyPairObject[CRYPTO_UTIL_KEYPAIR_SALT_KEY_NAME] !== 'string') {
          return new Error('A salt value must be a string');
        }

        const decryptedPrivateKey = await decryptDataByPassword(
          password,
          keyPairObject[CRYPTO_UTIL_KEYPAIR_SALT_KEY_NAME],
          keyPairObject[CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]
        );

        if (decryptedPrivateKey instanceof Error) {
          console.error('Failed to decrypt the data encryption private key');
          return decryptedPrivateKey;
        }
        try {
          keyPairObject[CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME] = JSON.parse(decryptedPrivateKey);
        } catch (err) {
          console.error(err);
          return new Error('Failed to parse dataencryption Private key from the string decrypted');
        }
      }
      return await importKeyPair(keyPairObject, !!password);
    }
    return new Error('A key pair must be a string');
  } catch (err) {
    return err;
  }
};

export const importKeyFromString = (keyString: string, isPublic: boolean = true): PromiseLike<CryptoKey> | Error => {
  try {
    return importKey(JSON.parse(keyString), isPublic);
  } catch (err) {
    return err;
  }
};

export const importPublicKeyFromString = (key: string): PromiseLike<CryptoKey> | Error => importKeyFromString(key, true);

export const importPrivateKeyFromString = (key: string): PromiseLike<CryptoKey> | Error => importKeyFromString(key, false);

export const checkIfStringIsKeyPair = (keyString: string): boolean => {
  return keyString.includes(CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME) && keyString.includes(CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME);
};

const KEY_NOT_FOUND_ERROR_MESSAGE = 'A key of the required type was not found';

export const getKeyOfType = async (key: TCRYPTO_UTIL_ENCRYPT_KEY_TYPES, type: KeyType): Promise<CryptoKey | Error> => {
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
    const keyResulted = keys.find((k: CryptoKey) => k && k.type && k.type === type);

    return keyResulted || new Error(KEY_NOT_FOUND_ERROR_MESSAGE);
  }
  return new Error('There is an unsupported type of the key given');
};
