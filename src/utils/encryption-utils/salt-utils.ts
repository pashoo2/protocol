import { isTypedArrayNative, isEqualArrayBufferNative } from './../typed-array-utils';
import { TSaltUtilsSaltType } from './salt-utils.types';
import { isTypedArray, typedArrayToString, stringToTypedArray } from 'utils/typed-array-utils';
import {
  SALT_GENERATION_UTILS_SALT_LENGTH_BYTES,
  SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES,
  SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES,
} from './salt-utils.const';

export const generateSaltNative = (saltLength: number): Uint8Array | Error => {
  try {
    return crypto.getRandomValues(new Uint8Array(saltLength));
  } catch (err) {
    return err;
  }
};

export const generateSalt = (saltLength: number = SALT_GENERATION_UTILS_SALT_LENGTH_BYTES): Uint8Array | Error => {
  if (saltLength < SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES) {
    return new Error(`The length ${saltLength} must not be less than the ${SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES}`);
  }
  if (saltLength > SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES) {
    return new Error(`The length ${saltLength} should not be greater than ${SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES}`);
  }
  return generateSaltNative(saltLength);
};

export const generateSaltString = (saltLength?: number): string | Error => {
  const salt = generateSalt(saltLength);

  if (salt instanceof Error) {
    return salt;
  }
  return typedArrayToString(salt);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isValidSalt = (salt: any): salt is TSaltUtilsSaltType => {
  if (isTypedArrayNative(salt) || salt instanceof ArrayBuffer) {
    const strFromTyped = typedArrayToString(salt);

    if (strFromTyped instanceof Error) {
      return false;
    }

    const typedFromStr = stringToTypedArray(strFromTyped);

    if (typedFromStr instanceof Error) {
      return false;
    }
    if (!isEqualArrayBufferNative(typedFromStr, salt)) {
      return false;
    }
    return (
      salt.byteLength >= SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES &&
      salt.byteLength <= SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES
    );
  }
  if (typeof salt === 'string') {
    const typedFromStr = stringToTypedArray(salt);

    if (typedFromStr instanceof Error) {
      return false;
    }

    const strFromTyped = typedArrayToString(typedFromStr);

    if (strFromTyped instanceof Error) {
      return false;
    }
    if (salt !== strFromTyped) {
      return false;
    }
    return (
      typedFromStr.byteLength >= SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES &&
      typedFromStr.byteLength <= SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES
    );
  }
  return false;
};

export const importSalt = (salt: TSaltUtilsSaltType): Uint8Array | Error => {
  if (!isValidSalt(salt)) {
    return new Error('The salt is not valid');
  }

  if (isTypedArray(salt)) {
    // if a typed array then convert the salt directly
    return new Uint8Array(salt);
  }
  // if a string then convert string to typed array
  const saltImported = stringToTypedArray(salt);

  if (saltImported instanceof Error) {
    return saltImported;
  }
  return new Uint8Array(saltImported);
};
