import { CA_USER_IDENTITY_VALIDATORS_BY_VERSION } from './central-authority-class-user-identity-validators.const';
import { IUserIdentityDescriptionValidator } from './central-authority-class-user-identity-validators.types';
import {
  CA_USER_IDENTITY_VERSION_PROP_NAME,
  CA_USER_IDENTITY_VERSION_CHARACTERS_COUNT,
} from '../central-authority-class-user-identity.const';

export const validateIdentityDescriptionVersion = (
  version: any
): version is string => {
  return (
    typeof version === 'string' &&
    version.length === CA_USER_IDENTITY_VERSION_CHARACTERS_COUNT
  );
};

export const getValidatorByIdentityVersion = (
  identityVersion: string
): IUserIdentityDescriptionValidator | Error => {
  const validator = CA_USER_IDENTITY_VALIDATORS_BY_VERSION[identityVersion];

  if (typeof validator === 'function') {
    return validator;
  }
  return new Error(
    `There is no validator for the identity version ${identityVersion}`
  );
};

export const validateUserIdentityDescriptionVersion = (
  identityVersion: string,
  userIdentityDescription: any
): boolean | Error => {
  const validatorForVersion = getValidatorByIdentityVersion(identityVersion);

  if (validatorForVersion instanceof Error) {
    console.error(validatorForVersion);
    return new Error(
      `Can't define a validator for the user's identity version ${validatorForVersion}`
    );
  }

  const validationResult = validatorForVersion(userIdentityDescription);

  if (validationResult !== true) {
    return new Error("There is a wrong format of user's identity");
  }
  return true;
};

export const validateUserIdentityDescription = (
  userIdetnityDescription: any
): boolean | Error => {
  if (userIdetnityDescription && typeof userIdetnityDescription === 'object') {
    const {
      [CA_USER_IDENTITY_VERSION_PROP_NAME]: version,
    } = userIdetnityDescription;

    if (!version) {
      return new Error(
        'There is no version defined in the user identity description object'
      );
    }
    if (validateIdentityDescriptionVersion(version)) {
      return validateUserIdentityDescriptionVersion(
        version,
        userIdetnityDescription
      );
    }
    return new Error(
      'There is a wrong version in the user identity description object'
    );
  }
  return new Error('There is a wrong format of the user identity description');
};
