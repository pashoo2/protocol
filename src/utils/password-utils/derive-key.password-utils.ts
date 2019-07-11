import {
  TPASSWORD_ENCRYPTION_SUPPORTED_PASSWORD_NATIVE_TYPES,
  TPASSWORD_ENCRYPTION_SUPPORTES_SALT_NATIVE_TYPES,
  TPASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_EXPORT_FORMAT,
} from './password-utils.types';
import { isTypedArray } from 'utils/typed-array-utils';
import {
  PASSWORD_ENCRYPTION_UTILS_KEY_GENERATION_KEY_IMPORTED_FORMAT,
  PASSWORD_ENCRYPTION_UTILS_KEY_GENERATION_IS_KEY_EXTRACTABLE,
  PASSWORD_ENCRYPTON_UTILS_KEY_USAGES,
  PASSWORD_ENCRYPTION_UTILS_KEY_GENERATION_ALHORITHM,
  PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_BASE_KEY_CONFIG,
  SALT_DEFAULT_ARRAY_BUFFER,
  PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_CONFIG,
  PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_USAGES,
  PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_IS_EXPORTED,
  PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_EXPORT_FORMAT,
} from './password-utils.const';
import { decodeStringUTF8ToArrayBuffer } from 'utils/string-encoding-utils';

const cryptoModule = window.crypto.subtle;

export const generatePasswordKey = (
  password: TPASSWORD_ENCRYPTION_SUPPORTED_PASSWORD_NATIVE_TYPES
): Error | PromiseLike<CryptoKey> => {
  if (!isTypedArray(password)) {
    return new Error('The password must have a TypedArray type');
  }
  try {
    return cryptoModule.importKey(
      PASSWORD_ENCRYPTION_UTILS_KEY_GENERATION_KEY_IMPORTED_FORMAT,
      password,
      PASSWORD_ENCRYPTION_UTILS_KEY_GENERATION_ALHORITHM,
      PASSWORD_ENCRYPTION_UTILS_KEY_GENERATION_IS_KEY_EXTRACTABLE,
      PASSWORD_ENCRYPTON_UTILS_KEY_USAGES
    );
  } catch (err) {
    return err;
  }
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
  try {
    return crypto.subtle.deriveKey(
      {
        ...PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_BASE_KEY_CONFIG,
        salt,
      },
      passwordKey,
      {
        ...PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_CONFIG,
      },
      PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_IS_EXPORTED,
      PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_USAGES
    );
  } catch (err) {
    return err;
  }
};

export const generatePasswordKeyByPasswordString = async (
  passwordString: string
): Promise<CryptoKey | Error> => {
  const passwordArrayBuffer = decodeStringUTF8ToArrayBuffer(passwordString);

  if (passwordArrayBuffer instanceof Error) {
    return passwordArrayBuffer;
  }

  const passwordBaseKey = await generatePasswordKey(passwordArrayBuffer);

  if (passwordBaseKey instanceof Error) {
    return passwordBaseKey;
  }

  return getDeriviationNative(passwordBaseKey);
};

export const exportPasswordKey = (
  passwordKey: CryptoKey
):
  | PromiseLike<TPASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_EXPORT_FORMAT>
  | Error => {
  try {
    return cryptoModule.exportKey(
      PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_EXPORT_FORMAT,
      passwordKey
    );
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const generatePasswordKeyInExportFormat = async (
  passwordString: string
): Promise<
  TPASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_EXPORT_FORMAT | Error
> => {
  const passwordKey = await generatePasswordKeyByPasswordString(passwordString);

  if (passwordKey instanceof Error) {
    return passwordKey;
  }

  return exportPasswordKey(passwordKey);
};

export const generatePasswordKeyAsString = async (
  passwordString: string
): Promise<string | Error> => {
  const passwordKeyExported = await generatePasswordKeyInExportFormat(
    passwordString
  );

  if (passwordKeyExported instanceof Error) {
    return passwordKeyExported;
  }

  return JSON.stringify(passwordKeyExported);
};
