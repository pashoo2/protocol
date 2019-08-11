import {
  CA_USER_IDENTITY_TYPE,
  CA_USER_IDENTITY_MIN_LENGTH,
  CA_USER_PASSWORD_MIN_LENGTH,
  CA_USER_PASSWORD_TYPE,
  CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME,
  CA_AUTH_CREDENTIALS_USER_PASSWORD_PROP_NAME,
  CA_USER_IDENTITY_MAX_LENGTH,
} from 'classes/central-authority-class/central-authority-class-const/central-authority-class-const';
import {
  TCentralAuthorityUserIdentity,
  TCentralAuthorityAuthCredentials,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';

export const validateUserIdentity = (
  v: any
): v is TCentralAuthorityUserIdentity => {
  return (
    typeof v === CA_USER_IDENTITY_TYPE &&
    v.length >= CA_USER_IDENTITY_MIN_LENGTH &&
    v.length <= CA_USER_IDENTITY_MAX_LENGTH
  );
};

export const validatePassword = (
  v: any
): v is TCentralAuthorityUserIdentity => {
  return (
    typeof v === CA_USER_PASSWORD_TYPE &&
    v.length >= CA_USER_PASSWORD_MIN_LENGTH
  );
};

export const validateAuthCredentials = (
  v: any
): v is TCentralAuthorityAuthCredentials => {
  if (v && typeof v === 'object') {
    const {
      [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userIdentity,
      [CA_AUTH_CREDENTIALS_USER_PASSWORD_PROP_NAME]: password,
    } = v;

    return validatePassword(password) && validateUserIdentity(userIdentity);
  }
  return false;
};
