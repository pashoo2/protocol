import {
  TPASSWORD_ENCRYPTION_SUPPORTED_PASSWORD_NATIVE_TYPES,
  TPASSWORD_ENCRYPTION_SUPPORTES_SALT_NATIVE_TYPES,
} from './password-utils.types';
import { isTypedArray } from 'utils/typed-array-utils';
import {
  PASSWORD_ENCRYPTION_UTILS_KEY_GENERATION_KEY_IMPORTED_FORMAT,
  PASSWORD_ENCRYPTION_UTILS_KEY_GENERATION_IS_KEY_EXTRACTABLE,
  PASSWORD_ENCRYPTON_UTILS_KEY_USAGES,
  PASSWORD_ENCRYPTION_UTILS_KEY_GENERATION_ALHORITHM,
  PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_BITS_KEY_LENGTH_BYTES,
  PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_BASE_KEY_CONFIG,
  SALT_DEFAULT_ARRAY_BUFFER,
  PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_CONFIG,
  PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_USAGES,
} from './password-utils.const';

const cryptoModule = window.crypto.subtle;

export const generatePasswordKey = (
  password: TPASSWORD_ENCRYPTION_SUPPORTED_PASSWORD_NATIVE_TYPES
): Error | PromiseLike<CryptoKey> => {
  if (!isTypedArray(password)) {
    return new Error('The password must have a TypedArray type');
  }
  return cryptoModule.importKey(
    PASSWORD_ENCRYPTION_UTILS_KEY_GENERATION_KEY_IMPORTED_FORMAT,
    password,
    PASSWORD_ENCRYPTION_UTILS_KEY_GENERATION_ALHORITHM,
    PASSWORD_ENCRYPTION_UTILS_KEY_GENERATION_IS_KEY_EXTRACTABLE,
    PASSWORD_ENCRYPTON_UTILS_KEY_USAGES
  );
};

export const getDeriviationNative = (
  passwordKey: CryptoKey,
  salt: TPASSWORD_ENCRYPTION_SUPPORTES_SALT_NATIVE_TYPES = SALT_DEFAULT_ARRAY_BUFFER
): Error | PromiseLike<CryptoKey> => {
  if (!isTypedArray(salt)) {
    return new Error('The password must have a TypedArray type');
  }
  if (!(passwordKey instanceof CryptoKey)) {
    return new Error('A password key must be an instance of a CryptoKey');
  }
  return crypto.subtle.deriveKey(
    {
      ...PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_BASE_KEY_CONFIG,
      salt,
    },
    passwordKey,
    {
      ...PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_CONFIG,
    },
    false,
    PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_USAGES
  );
};
