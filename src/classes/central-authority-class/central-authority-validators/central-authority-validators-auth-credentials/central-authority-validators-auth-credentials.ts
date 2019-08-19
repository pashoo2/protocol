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
import { UTILS_DATA_COMPRESSION_COMPRESSION_RATIO_MAX } from 'utils/data-compression-utils/data-compression-utils.const';

export const validateUserIdentity = (
  v: any
): v is TCentralAuthorityUserIdentity => {
  if (typeof v !== CA_USER_IDENTITY_TYPE) {
    console.error('There is a wrong type of the user identity');
    return false;
  }
  if (
    v.length <
    CA_USER_IDENTITY_MIN_LENGTH / UTILS_DATA_COMPRESSION_COMPRESSION_RATIO_MAX
  ) {
    console.error('There is a too small length of the user identity');
    return false;
  }
  if (v.length > CA_USER_IDENTITY_MAX_LENGTH) {
    console.error('There is a too big length of the user identity');
    return false;
  }
  return true;
};

export const validatePassword = (
  v: any
): v is TCentralAuthorityUserIdentity => {
  return (
    typeof v === CA_USER_PASSWORD_TYPE &&
    v.length >=
      CA_USER_PASSWORD_MIN_LENGTH / UTILS_DATA_COMPRESSION_COMPRESSION_RATIO_MAX
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
