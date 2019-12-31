import { TSaltUtilsSaltType } from './salt-utils.types';
import { isTypedArray } from './../typed-array-utils';
import {
  typedArrayToString,
  stringToTypedArray,
} from 'utils/typed-array-utils';
import {
  SALT_GENERATION_UTILS_SALT_LENGTH_BYTES,
  SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES,
  SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES,
} from './salt-utils.const';

export const generateSalt = (
  saltLength = SALT_GENERATION_UTILS_SALT_LENGTH_BYTES
): Uint8Array | Error => {
  let saltValue;
  try {
    saltValue = crypto.getRandomValues(new Uint8Array(saltLength));
  } catch (err) {
    saltValue = err;
  }
  return saltValue;
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
  let saltValue;

  if (isTypedArray(salt)) {
    saltValue = typedArrayToString(salt);
  } else if (typeof salt === 'string') {
    saltValue = salt;
  }
  if (typeof saltValue === 'string') {
    return (
      encodeURI(saltValue) === saltValue &&
      saltValue.length >= SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES &&
      saltValue.length <= SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES
    );
  }
  return false;
};

export const importSalt = (salt: TSaltUtilsSaltType): Uint8Array | Error => {
  if (isValidSalt(salt)) {
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
