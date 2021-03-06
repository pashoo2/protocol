import { CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME } from './../central-authority-class-user-identity.const';
import { CA_USER_IDENTITY_VALIDATORS_BY_VERSION } from './central-authority-class-user-identity-validators.const';
import { IUserIdentityDescriptionValidator } from './central-authority-class-user-identity-validators.types';
import {
  CA_USER_IDENTITY_VERSION_PROP_NAME,
  CA_USER_IDENTITY_VERSION_CHARACTERS_COUNT,
  CA_USER_IDENTITY_PARSER_VERSIONS_SUPPORTED,
} from '../central-authority-class-user-identity.const';
import { ICAUserUniqueIdentifierMetadata } from '../central-authority-class-user-identity.types';
import { dataValidatorUtilURL } from 'utils/data-validators-utils';

export const validateIdentityDescriptionVersion = (version: any): version is string => {
  if (typeof version !== 'string') {
    console.error('An identity description version must be a string');
    return false;
  }
  if (version.length !== CA_USER_IDENTITY_VERSION_CHARACTERS_COUNT) {
    console.error(`An identity description version length must be a ${CA_USER_IDENTITY_VERSION_CHARACTERS_COUNT} characters`);
    return false;
  }
  if (!CA_USER_IDENTITY_PARSER_VERSIONS_SUPPORTED.includes(version)) {
    console.error(`The version ${version} is not supported`);
    return false;
  }
  return true;
};

export const getValidatorByIdentityVersion = (identityVersion: string): IUserIdentityDescriptionValidator | Error => {
  const validator = CA_USER_IDENTITY_VALIDATORS_BY_VERSION[identityVersion];

  if (typeof validator === 'function') {
    return validator;
  }
  return new Error(`There is no validator for the identity version ${identityVersion}`);
};

export const validateUserIdentityDescriptionVersion = (
  identityVersion: string,
  userIdentityDescription: any
): boolean | Error => {
  const validatorForVersion = getValidatorByIdentityVersion(identityVersion);

  if (validatorForVersion instanceof Error) {
    console.error(validatorForVersion);
    return new Error(`Can't define a validator for the user's identity version ${validatorForVersion}`);
  }

  const validationResult = validatorForVersion(userIdentityDescription);

  if (validationResult !== true) {
    return new Error("There is a wrong format of user's identity");
  }
  return true;
};

export const validateUserIdentityDescription = (userIdetnityDescription: any): boolean | Error => {
  if (userIdetnityDescription && typeof userIdetnityDescription === 'object') {
    const { [CA_USER_IDENTITY_VERSION_PROP_NAME]: version } = userIdetnityDescription;

    if (!version) {
      return new Error('There is no version defined in the user identity description object');
    }
    if (validateIdentityDescriptionVersion(version)) {
      return validateUserIdentityDescriptionVersion(version, userIdetnityDescription);
    }
    return new Error('There is a wrong version in the user identity description object');
  }
  return new Error('There is a wrong format of the user identity description');
};

export const checkIsValidUserIdentityMetadata = (identityMetadata: ICAUserUniqueIdentifierMetadata): boolean | Error => {
  if (typeof identityMetadata !== 'object') {
    return new Error('Identity metadata must be an object');
  }
  if (identityMetadata instanceof Error) {
    return identityMetadata;
  }
  if (!identityMetadata) {
    return new Error('Identity metadata must not be empty');
  }

  const {
    [CA_USER_IDENTITY_VERSION_PROP_NAME]: version,
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: authorityProviderURI,
  } = identityMetadata;

  if (version && !validateIdentityDescriptionVersion(version)) {
    return new Error('Version in Identity metadata have a wrong format');
  }
  if (!dataValidatorUtilURL(authorityProviderURI)) {
    return new Error('The URL of an authority provider is not valid');
  }
  return true;
};
