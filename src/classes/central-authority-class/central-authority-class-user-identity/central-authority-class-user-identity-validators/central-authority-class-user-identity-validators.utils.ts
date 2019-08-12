import { CA_USER_IDENTOTY_VALIDATORS_BY_VERSION } from './central-authority-class-user-identity-validators.const';
import { IUserIdentityDescriptionValidator } from './central-authority-class-user-identity-validators.types';

export const getValidatorByIdentityVersion = (
  identityVersion: string
): IUserIdentityDescriptionValidator | Error => {
  const validator = CA_USER_IDENTOTY_VALIDATORS_BY_VERSION[identityVersion];

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
