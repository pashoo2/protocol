import {
  MIN_JWK_PROPS_COUNT,
  MIN_JWK_STRING_LENGTH,
  ENCRYPTIONS_KEYS_UTILS_JWK_FORMAT_OBJECT_KEYS,
} from './encryption-keys-utils.const';

export const isCryptoKey = (v: any): v is CryptoKey => v instanceof CryptoKey;

export const isCryptoKeyPair = (key: any): key is CryptoKeyPair => {
  return (
    typeof key === 'object' &&
    key.publicKey instanceof CryptoKey &&
    key.privateKey instanceof CryptoKey
  );
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
