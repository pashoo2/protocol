import {
  CONST_VALUES_RESTRICTIONS_COMMON_URI_MAX_LENGTH,
  CONST_VALUES_RESTRICTIONS_COMMON_UUID_V4_MAX_LENGTH,
  CONST_VALUES_RESTRICTIONS_COMMON_UUID_V4_MIN_LENGTH,
  CONST_VALUES_RESTRICTIONS_COMMON_LOGIN_MAX_LENGTH,
  CONST_VALUES_RESTRICTIONS_COMMON_LOGIN_MIN_LENGTH,
} from 'const/const-values-restrictions-common';
import {
  CONST_VALIDATION_REGEX_LOGIN_STRING,
  CONST_VALIDATION_REGEX_INTERNATIONAL_PHONE_NUMBER_STRING,
} from 'const/const-validation-regex/const-validation-regex-common';

export const CONST_VALIDATION_SCHEMES_URI = {
  type: 'string',
  format: 'uri',
  maxLength: CONST_VALUES_RESTRICTIONS_COMMON_URI_MAX_LENGTH,
};

export const CONST_VALIDATION_SCHEMES_URL = {
  type: 'string',
  format: 'url',
};

export const CONST_VALIDATION_SCHEMES_EMAIL = {
  type: 'string',
  format: 'email',
};

/**
 * validate user login - it may be a string compilant to the rules described in
 * https://www.ibm.com/support/knowledgecenter/SSFTN5_8.5.5/com.ibm.wbpm.imuc.doc/topics/rsec_characters.html
 * or an email address
 */
export const CONST_VALIDATION_SCHEMES_LOGIN = {
  type: 'string',
  minLength: CONST_VALUES_RESTRICTIONS_COMMON_LOGIN_MIN_LENGTH,
  maxLength: CONST_VALUES_RESTRICTIONS_COMMON_LOGIN_MAX_LENGTH,
  pattern: CONST_VALIDATION_REGEX_LOGIN_STRING,
};

export const CONST_VALIDATION_SCHEMES_INTERNATIONAL_PHONE_NUMBER = {
  type: 'string',
  // https://stackoverflow.com/a/2113915
  pattern: CONST_VALIDATION_REGEX_INTERNATIONAL_PHONE_NUMBER_STRING,
};

export const CONST_VALIDATION_SCHEMES_UUID_V4 = {
  type: 'string',
  format: 'uuid',
  maxLength: CONST_VALUES_RESTRICTIONS_COMMON_UUID_V4_MAX_LENGTH,
  minLength: CONST_VALUES_RESTRICTIONS_COMMON_UUID_V4_MIN_LENGTH,
};
