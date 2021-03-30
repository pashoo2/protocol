import { importSalt } from '../encryption-utils/salt-utils';
import { TSaltUtilsSaltType } from '../encryption-utils/salt-utils.types';
import {
  TPASSWORD_ENCRYPTION_SUPPORTED_PASSWORD_NATIVE_TYPES,
  TPASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_EXPORT_FORMAT,
  TPASSWORD_ENCRYPTION_KEY_IMPORT_NATIVE_SUPPORTED_TYPES,
} from './password-utils.types';
import { isTypedArray } from 'utils/typed-array-utils';
import {
  PASSWORD_ENCRYPTION_UTILS_KEY_GENERATION_KEY_IMPORTED_FORMAT,
  PASSWORD_ENCRYPTION_UTILS_KEY_GENERATION_IS_KEY_EXTRACTABLE,
  PASSWORD_ENCRYPTON_UTILS_KEY_USAGES,
  PASSWORD_ENCRYPTION_UTILS_KEY_GENERATION_ALHORITHM,
  PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_BASE_KEY_CONFIG,
  PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_CONFIG,
  PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_USAGES,
  PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_IS_EXPORTED,
  PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_EXPORT_FORMAT,
  PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_IMPORT_FORMAT,
} from './password-utils.const';
import { decodeDOMStringToArrayBuffer } from 'utils/string-encoding-utils';
import { crypto, cryptoModuleDataSign } from '../data-sign-utils/main.data-sign-utils.const';

export const generatePasswordKey = async (
  password: TPASSWORD_ENCRYPTION_SUPPORTED_PASSWORD_NATIVE_TYPES
): Promise<CryptoKey | Error> => {
  if (!isTypedArray(password)) {
    return new Error('The password must have a TypedArray type');
  }
  try {
    return await cryptoModuleDataSign.importKey(
      PASSWORD_ENCRYPTION_UTILS_KEY_GENERATION_KEY_IMPORTED_FORMAT,
      password,
      PASSWORD_ENCRYPTION_UTILS_KEY_GENERATION_ALHORITHM,
      PASSWORD_ENCRYPTION_UTILS_KEY_GENERATION_IS_KEY_EXTRACTABLE,
      PASSWORD_ENCRYPTON_UTILS_KEY_USAGES as KeyUsage[]
    );
  } catch (err) {
    return err;
  }
};

export const getDeriviationNative = async (passwordKey: CryptoKey, saltValue: Uint8Array): Promise<Error | CryptoKey> => {
  if (!saltValue) {
    return new Error('The generated random value of salt is empty');
  }
  if (!isTypedArray(saltValue)) {
    return new Error('The password must have a TypedArray type');
  }
  if (!(passwordKey instanceof CryptoKey)) {
    return new Error('A password key must be an instance of a CryptoKey');
  }
  try {
    return await crypto.subtle.deriveKey(
      {
        ...PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_BASE_KEY_CONFIG,
        salt: saltValue,
      },
      passwordKey,
      {
        ...PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_CONFIG,
      },
      PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_IS_EXPORTED,
      PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_USAGES as KeyUsage[]
    );
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const generatePasswordKeyByPasswordString = async (
  passwordString: string,
  saltValue: TSaltUtilsSaltType
): Promise<CryptoKey | Error> => {
  const passwordArrayBuffer = decodeDOMStringToArrayBuffer(passwordString);

  if (passwordArrayBuffer instanceof Error) {
    return passwordArrayBuffer;
  }

  const passwordBaseKey = await generatePasswordKey(passwordArrayBuffer);

  if (passwordBaseKey instanceof Error) {
    return passwordBaseKey;
  }

  const saltImported = importSalt(saltValue);

  if (saltImported instanceof Error) {
    return saltImported;
  }
  return getDeriviationNative(passwordBaseKey, saltImported);
};

export const exportPasswordKey = (
  passwordKey: CryptoKey
): PromiseLike<TPASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_EXPORT_FORMAT> | Error => {
  try {
    return cryptoModuleDataSign.exportKey(PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_EXPORT_FORMAT, passwordKey);
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const exportPasswordKeyAsString = async (passwordKey: CryptoKey): Promise<string | Error> => {
  try {
    const cryptoKey = await cryptoModuleDataSign.exportKey(
      PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_EXPORT_FORMAT,
      passwordKey
    );

    if (cryptoKey instanceof Error) {
      return cryptoKey;
    }
    return JSON.stringify(cryptoKey);
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const generatePasswordKeyInExportFormat = async (
  passwordString: string,
  salt: TSaltUtilsSaltType
): Promise<TPASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_EXPORT_FORMAT | Error> => {
  const passwordKey = await generatePasswordKeyByPasswordString(passwordString, salt);

  if (passwordKey instanceof Error) {
    return passwordKey;
  }

  return exportPasswordKey(passwordKey);
};

export const generatePasswordKeyAsString = async (passwordString: string, salt: TSaltUtilsSaltType): Promise<string | Error> => {
  const passwordKeyExported = await generatePasswordKeyInExportFormat(passwordString, salt);

  if (passwordKeyExported instanceof Error) {
    return passwordKeyExported;
  }

  return JSON.stringify(passwordKeyExported);
};

export const importPasswordKey = async (
  passwordKey: TPASSWORD_ENCRYPTION_KEY_IMPORT_NATIVE_SUPPORTED_TYPES
): Promise<CryptoKey | Error> => {
  try {
    return await cryptoModuleDataSign.importKey(
      PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_IMPORT_FORMAT,
      passwordKey,
      {
        ...PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_CONFIG,
      },
      PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_IS_EXPORTED,
      PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_USAGES as KeyUsage[]
    );
  } catch (err) {
    return err;
  }
};

export const importPasswordKeyFromString = async (passwordKey: string): Promise<CryptoKey | Error> => {
  try {
    const keyExportedFormat: TPASSWORD_ENCRYPTION_KEY_IMPORT_NATIVE_SUPPORTED_TYPES = JSON.parse(passwordKey);

    return await importPasswordKey(keyExportedFormat);
  } catch (err) {
    console.error(err);

    return err;
  }
};
