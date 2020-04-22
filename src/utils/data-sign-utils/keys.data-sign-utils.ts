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
  KEY_NOT_FOUND_ERROR_MESSAGE,
} from './data-sign-utils.const';
import { cryptoModuleDataSign } from './main.data-sign-utils.const';
import {
  TDATA_SIGN_UTIL_KEY_EXPORT_FORMAT_TYPE,
  TDATA_SIGN_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE,
  TDATA_SIGN_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE,
  TDATA_SIGN_UTIL_SIGN_KEY_TYPES,
  TDATA_SIGN_UTIL_IMPORT_KEY_TYPES,
} from './data-sign-utils.types';
import {
  isCryptoKeyPair,
  getJWKOrBool,
} from 'utils/encryption-keys-utils/encryption-keys-utils';
import { TEncryptionKeyStoreFormatType } from 'types/encryption-keys.types';
import { isTypedArray } from 'utils/typed-array-utils';
import { stringify } from 'utils/main-utils';
import { decryptDataByPassword } from '../password-utils/decrypt.password-utils';
import { DATA_SIGN_CRYPTO_UTIL_KEYPAIR_SALT_KEY_NAME } from './data-sign-utils.const';
import { generateSalt } from '../encryption-utils/salt-utils';
import { encryptDataWithPassword } from '../password-utils/encrypt.password-utils';
import { TDATA_SIGN_UTIL_KEYPAIR_IMPORT_TYPE } from './data-sign-utils.types';
import { typedArrayToString } from '../typed-array-utils';

export const dataSignIsCryptoKeyPairImported = (
  key: any,
  checkPrivateKey: boolean = true
): key is TDATA_SIGN_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE => {
  return (
    typeof key === 'object' &&
    !!key[DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME] &&
    (!checkPrivateKey || !!key[DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME])
  );
};

export const dataSignGenerateKeyPair = (): PromiseLike<CryptoKeyPair> =>
  cryptoModuleDataSign.generateKey(
    DATA_SIGN_CRYPTO_UTIL_GENERATE_KEYPAIR_OPTIONS,
    DATA_SIGN_CRYPTO_UTIL_KEYS_EXTRACTABLE,
    DATA_SIGN_CRYPTO_UTIL_KEYPAIR_USAGES
  );

export const dataSignExportKey = async (
  key: CryptoKey
): Promise<TDATA_SIGN_UTIL_KEY_EXPORT_FORMAT_TYPE | Error> => {
  try {
    return cryptoModuleDataSign.exportKey(
      DATA_SIGN_CRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT,
      key
    );
  } catch (err) {
    return err;
  }
};

export const dataSignExportKeyAsString = async (
  key: CryptoKey
): Promise<string | Error> => {
  const keyExported = await dataSignExportKey(key);

  if (keyExported instanceof Error) {
    return keyExported;
  }
  try {
    return stringify(keyExported);
  } catch (err) {
    return err;
  }
};

export const dataSignExportPublicKey = async (
  keyPair: CryptoKeyPair
): Promise<TDATA_SIGN_UTIL_KEY_EXPORT_FORMAT_TYPE | Error> => {
  if (isCryptoKeyPair(keyPair)) {
    return dataSignExportKey(keyPair.publicKey);
  }
  return new Error('Argument must be a CryptoKeyPair');
};

export const dataSignExportPublicKeyAsString = async (
  keyPair: CryptoKeyPair
): Promise<Error | string> => {
  try {
    const keyPublicExported = await dataSignExportPublicKey(keyPair);

    if (keyPublicExported instanceof Error) {
      return keyPublicExported;
    }
    return stringify(keyPublicExported);
  } catch (err) {
    return err;
  }
};

export const dataSignExportKeyPair = async (
  keyPair: CryptoKeyPair,
  password?: string
): Promise<TDATA_SIGN_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE | Error> => {
  try {
    if (isCryptoKeyPair(keyPair, !!password)) {
      // do it in parallel
      const [privateKey, publicKey] = await Promise.all([
        password || keyPair.privateKey
          ? dataSignExportKey(keyPair.privateKey)
          : Promise.resolve(undefined),
        dataSignExportKey(keyPair.publicKey),
      ]).catch((err) => [err, err]);

      if (privateKey instanceof Error) {
        return privateKey;
      }
      if (publicKey instanceof Error) {
        return publicKey;
      }

      const result: TDATA_SIGN_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE = {
        [DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME]: publicKey,
        [DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]: privateKey,
      };

      if (password) {
        const salt = generateSalt();

        if (salt instanceof Error) {
          return new Error('Failed to generate a unique salt value');
        }

        const encryptedPrivateKey = await encryptDataWithPassword(
          password,
          salt,
          privateKey
        );

        if (encryptedPrivateKey instanceof Error) {
          return new Error(
            'Failed to encrypt private key with password provided'
          );
        }

        const saltStringified = typedArrayToString(salt);

        if (saltStringified instanceof Error) {
          return new Error(
            'Failed to stringify the salt value for the private data sign key'
          );
        }

        const decryptedPrivateKey = await decryptDataByPassword(
          password,
          saltStringified,
          encryptedPrivateKey
        );

        if (decryptedPrivateKey instanceof Error) {
          return new Error('Failed to decrypt private key for data encryption');
        }
        result[DATA_SIGN_CRYPTO_UTIL_KEYPAIR_SALT_KEY_NAME] = saltStringified;
        result[
          DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME
        ] = encryptedPrivateKey;
      }
      return result;
    }
    return new Error('Argument given must be a CryptoKeyPair');
  } catch (err) {
    return err;
  }
};

export const dataSignExportKeyPairAsString = async (
  keyPair: CryptoKeyPair,
  password?: string
): Promise<string | Error> => {
  try {
    const res = await dataSignExportKeyPair(keyPair, password);

    if (res instanceof Error) {
      return res;
    }
    return stringify(res);
  } catch (err) {
    return err;
  }
};

export const dataSignImportKey = async (
  key: TDATA_SIGN_UTIL_IMPORT_KEY_TYPES,
  isPublic: boolean = true
): Promise<CryptoKey | Error> => {
  try {
    if (typeof key !== 'object') {
      return new Error('Unsupported argument type');
    }
    const res = await cryptoModuleDataSign.importKey(
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

export const dataSignImportPublicKey = (
  key: TDATA_SIGN_UTIL_IMPORT_KEY_TYPES
): PromiseLike<CryptoKey | Error> => dataSignImportKey(key, true);

export const dataSignImportPrivateKey = (
  key: TDATA_SIGN_UTIL_IMPORT_KEY_TYPES
): PromiseLike<CryptoKey | Error> => dataSignImportKey(key, false);

export const dataSignImportKeyPair = async (
  keyPair: TDATA_SIGN_UTIL_KEYPAIR_IMPORT_TYPE,
  checkPrivateKey: boolean = true
): Promise<TDATA_SIGN_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE | Error> => {
  try {
    if (dataSignIsCryptoKeyPairImported(keyPair, checkPrivateKey)) {
      const privateKeyToImport =
        keyPair[DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME];
      if (checkPrivateKey && !privateKeyToImport) {
        return new Error('The private key is empty');
      }
      const importResult = await Promise.all([
        dataSignImportPublicKey(
          keyPair[DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME]
        ),
        checkPrivateKey || privateKeyToImport
          ? dataSignImportPrivateKey(privateKeyToImport!)
          : (Promise.resolve(undefined) as any),
      ]).catch((err) => [err, err]);
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
        [DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME]: publicKey,
        [DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]: privateKey,
      };
    }
    return new Error('The argument must be an instance of CryptoKeyPair');
  } catch (err) {
    return err;
  }
};

export const dataSignImportKeyPairFromString = async (
  keyPairString: string,
  password?: string
): Promise<TDATA_SIGN_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE | Error> => {
  try {
    if (typeof keyPairString === 'string') {
      const keyPairObject = JSON.parse(keyPairString);

      if (
        password &&
        keyPairObject[DATA_SIGN_CRYPTO_UTIL_KEYPAIR_SALT_KEY_NAME]
      ) {
        if (
          typeof keyPairObject[DATA_SIGN_CRYPTO_UTIL_KEYPAIR_SALT_KEY_NAME] !==
          'string'
        ) {
          return new Error('A salt value must be a string');
        }

        const decryptedPrivateKey = await decryptDataByPassword(
          password,
          keyPairObject[DATA_SIGN_CRYPTO_UTIL_KEYPAIR_SALT_KEY_NAME],
          keyPairObject[DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]
        );

        if (decryptedPrivateKey instanceof Error) {
          console.error('Failed to decrypt the data sign private key');
          return decryptedPrivateKey;
        }
        try {
          keyPairObject[
            DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME
          ] = JSON.parse(decryptedPrivateKey);
        } catch (err) {
          console.error(err);
          return new Error(
            'Failed to parse datasign Private key from the string decrypted'
          );
        }
      }
      if (dataSignIsCryptoKeyPairImported(keyPairObject, !!password)) {
        return dataSignImportKeyPair(
          keyPairObject as TDATA_SIGN_UTIL_KEYPAIR_IMPORT_TYPE,
          !!password
        );
      }
      return new Error('There is a wrong format for the imported key pair');
    }
    return new Error('The key must be a string');
  } catch (err) {
    return err;
  }
};

export const dataSignImportKeyFromString = (
  keyString: string,
  isPublic: boolean = true
): PromiseLike<CryptoKey | Error> | Error => {
  try {
    if (typeof keyString !== 'string') {
      return new Error('The key must be a string');
    }

    const parsedKey = JSON.parse(keyString);

    return dataSignImportKey(parsedKey, isPublic);
  } catch (err) {
    return err;
  }
};

export const dataSignImportPublicKeyFromString = (
  key: string
): PromiseLike<CryptoKey | Error> | Error =>
  dataSignImportKeyFromString(key, true);

export const dataSignImportPrivateKeyFromString = (
  key: string
): PromiseLike<CryptoKey | Error> | Error =>
  dataSignImportKeyFromString(key, false);

export const dataSignCheckIfStringIsKeyPair = (keyString: string): boolean => {
  return (
    keyString.includes(DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME) &&
    keyString.includes(DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME)
  );
};

export const dataSignGetKeyOfType = async (
  key: TDATA_SIGN_UTIL_SIGN_KEY_TYPES,
  type: KeyType
): Promise<CryptoKey | Error> => {
  if (typeof key === 'string') {
    if (dataSignCheckIfStringIsKeyPair(key)) {
      const keyPair = await dataSignImportKeyPairFromString(key);

      if (keyPair instanceof Error) {
        return keyPair;
      }
      return dataSignGetKeyOfType(keyPair, type);
    } else {
      const keyFromString = await dataSignImportKeyFromString(
        key,
        type === 'public'
      );

      if (keyFromString instanceof Error) {
        return keyFromString;
      }
      return dataSignGetKeyOfType(keyFromString, type);
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

/**
 * import an encryption key from a
 * supported format of an exported key
 * and returns a crypto key in native
 * format
 * @param {} key
 */
export const dataSignImportEncryptionKey = async (
  key: TEncryptionKeyStoreFormatType
): Promise<CryptoKey | Error> => {
  if (isTypedArray(key)) {
    return dataSignImportKey(key);
  } else {
    const jwk = getJWKOrBool(key);

    if (typeof jwk === 'object') {
      return dataSignImportKey(jwk);
    } else if (typeof key === 'string') {
      return dataSignImportKeyFromString(key);
    }
  }
  return new Error('There is an unknown key format');
};

/**
 * import an encryption key from a
 * supported format of an exported key
 * and returns a crypto key as a string
 * @param {} key
 */
export const dataSignConvertAndExportKeyAsString = async (
  key: TEncryptionKeyStoreFormatType
): Promise<string | Error> => {
  const cryptoKeyImported = await dataSignImportEncryptionKey(key);

  if (cryptoKeyImported instanceof Error) {
    return cryptoKeyImported;
  }
  return dataSignExportKeyAsString(cryptoKeyImported);
};
