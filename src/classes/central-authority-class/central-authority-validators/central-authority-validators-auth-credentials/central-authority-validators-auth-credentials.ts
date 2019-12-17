import {
  CA_USER_IDENTITY_TYPE,
  CA_USER_IDENTITY_MIN_LENGTH,
  CA_USER_PASSWORD_MIN_LENGTH,
  CA_USER_PASSWORD_TYPE,
  CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME,
  CA_AUTH_CREDENTIALS_USER_PASSWORD_PROP_NAME,
  CA_USER_IDENTITY_MAX_LENGTH,
  CA_USER_LOGIN_MIN_LENGTH,
} from 'classes/central-authority-class/central-authority-class-const/central-authority-class-const';
import { UTILS_DATA_COMPRESSION_COMPRESSION_RATIO_MAX } from 'utils/data-compression-utils/data-compression-utils.const';
import {
  TCentralAuthorityUserIdentity,
  TCentralAuthorityAuthCredentials,
  ICentralAuthorityUserAuthCredentials,
  TCentralAuthorityUserPassword,
  TCentralAuthorityUserLogin,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { CA_USER_IDENTITY_VERSIONS_LIST } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import { TUserIdentityVersion } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.types';

export const validateUserIdentityType = (v: any): boolean =>
  typeof v === CA_USER_IDENTITY_TYPE;

export const validateUserIdentityVersion = (
  v: any
): v is TUserIdentityVersion =>
  typeof v === 'string' && CA_USER_IDENTITY_VERSIONS_LIST.includes(v);

export const validateUserIdentity = (
  v: any,
  isSilentMode: boolean = false
): v is TCentralAuthorityUserIdentity => {
  if (!validateUserIdentityType(v)) {
    if (!isSilentMode) {
      console.error('There is a wrong type of the user identity');
    }
    return false;
  }
  if (
    v.length <
    CA_USER_IDENTITY_MIN_LENGTH / UTILS_DATA_COMPRESSION_COMPRESSION_RATIO_MAX
  ) {
    if (!isSilentMode) {
      console.error('There is a too small length of the user identity');
    }
    return false;
  }
  if (v.length > CA_USER_IDENTITY_MAX_LENGTH) {
    if (!isSilentMode) {
      console.error('There is a too big length of the user identity');
    }
    return false;
  }
  return true;
};

export const validateUserIdentitySilent = (
  v: any
): v is TCentralAuthorityUserIdentity => validateUserIdentity(v, true);

export const validatePassword = (
  v: any
): v is TCentralAuthorityUserPassword => {
  return (
    typeof v === CA_USER_PASSWORD_TYPE &&
    v.length >= CA_USER_PASSWORD_MIN_LENGTH
  );
};

export const validateLogin = (v: any): v is TCentralAuthorityUserLogin => {
  return typeof v === 'string' && v.length >= CA_USER_LOGIN_MIN_LENGTH;
};

export const validateAuthCredentials = (authCredentials: any): void | Error => {
  if (!authCredentials) {
    return new Error('The auth credentials is not defined');
  }
  if (typeof authCredentials !== 'object') {
    return new Error('The auth credentials must be an object');
  }

  const { login, password } = authCredentials;

  if (!login) {
    return new Error('The login must be defined');
  }
  if (!password) {
    return new Error('The password must be defined');
  }
  if (!validatePassword(password)) {
    return new Error('The password is incorrect');
  }
  if (!validateLogin(login)) {
    return new Error('The login is incorrect');
  }
};
