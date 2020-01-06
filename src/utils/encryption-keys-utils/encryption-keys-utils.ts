import { encodeArrayBufferToDOMString } from 'utils/string-encoding-utils';
import { calculateHashNative } from './../hash-calculation-utils/hash-calculation-utils';
import { HASH_CALCULATION_UTILS_HASH_ALHORITHM } from 'utils/hash-calculation-utils/hash-calculation-utils.const';
import {
  MIN_JWK_PROPS_COUNT,
  MIN_JWK_STRING_LENGTH,
  ENCRYPTIONS_KEYS_UTILS_JWK_FORMAT_OBJECT_KEYS,
  ENCRYPTIONS_KEYS_UTILS_EXPORT_FORMATS,
} from './encryption-keys-utils.const';

export const isCryptoKey = (v: any): v is CryptoKey => v instanceof CryptoKey;

export const isCryptoKeyPair = (keyPair: any): keyPair is CryptoKeyPair => {
  return (
    typeof keyPair === 'object' &&
    keyPair.publicKey instanceof CryptoKey &&
    keyPair.privateKey instanceof CryptoKey
  );
};

export const isCryptoKeyPairExportedAsString = (keyPair: any): boolean => {
  return typeof keyPair === 'string' && keyPair.length >= MIN_JWK_STRING_LENGTH;
};

export const isJWK = (
  keyObject: object,
  isReturnError: boolean = false
): Error | boolean => {
  if (keyObject && typeof keyObject === 'object') {
    const options = Object.keys(keyObject);
    const optionsCount = options.length;

    if (optionsCount > MIN_JWK_PROPS_COUNT) {
      let idx = 0;
      let optionName: string;

      for (; idx < optionsCount; idx += 1) {
        optionName = options[idx];
        if (
          !ENCRYPTIONS_KEYS_UTILS_JWK_FORMAT_OBJECT_KEYS.includes(optionName)
        ) {
          return isReturnError
            ? new Error(`There is an unknown property ${optionName}`)
            : false;
        }
      }
      return true;
    }
  }
  return isReturnError ? new Error('There is a wrong format of JWK') : false;
};

export const getJWK = (
  key: any,
  isReturnError: boolean = false
): JsonWebKey | boolean | Error => {
  let keyObject = key;

  if (typeof key === 'string' && key.length > MIN_JWK_STRING_LENGTH) {
    try {
      keyObject = JSON.parse(key);
    } catch (e) {
      return e;
    }
  }

  const isJWKValid = isJWK(keyObject, isReturnError);

  if (isJWKValid === true) {
    return keyObject as JsonWebKey;
  }
  return isJWKValid instanceof Error
    ? isJWKValid
    : new Error('There is a wrong format of JWK');
};

export const getJWKOrError = (key: any): JsonWebKey | Error =>
  getJWK(key, true) as JsonWebKey | Error;

export const getJWKOrBool = (key: any): JsonWebKey | boolean =>
  getJWK(key, false) as JsonWebKey | boolean;

export const exportCryptokeyInFormat = async (
  key: CryptoKey,
  format: ENCRYPTIONS_KEYS_UTILS_EXPORT_FORMATS
): Promise<ArrayBuffer | JsonWebKey | Error> => {
  try {
    return crypto.subtle.exportKey(format, key);
  } catch (err) {
    return err;
  }
};

/**
 * calculates hash string of the crypto key
 * @param {CryptoKey} key
 */
export const calcCryptoKeyHash = async (
  key: CryptoKey,
  alg: HASH_CALCULATION_UTILS_HASH_ALHORITHM = HASH_CALCULATION_UTILS_HASH_ALHORITHM.SHA256
): Promise<Error | string> => {
  if (!(key instanceof CryptoKey)) {
    return new Error('Key os not an instane of CryptoKey');
  }

  const exportedCryptoKey = await exportCryptokeyInFormat(
    key,
    ENCRYPTIONS_KEYS_UTILS_EXPORT_FORMATS.RAW
  );

  if (exportedCryptoKey instanceof Error) {
    console.error(exportedCryptoKey);
    return new Error('Failed to export the crypto key in the RAW format');
  }

  const hashCalcResult = await calculateHashNative(
    exportedCryptoKey as ArrayBuffer,
    alg
  );

  if (hashCalcResult instanceof Error) {
    console.error(hashCalcResult);
    return new Error('Failed to calculate a hash for the exported crypto key');
  }
  return encodeArrayBufferToDOMString(hashCalcResult);
};
