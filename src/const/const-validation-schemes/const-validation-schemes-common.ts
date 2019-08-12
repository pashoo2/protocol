import {
  CONST_VALUES_RESTRICTIONS_COMMON_URI_MAX_LENGTH,
  CONST_VALUES_RESTRICTIONS_COMMON_UUID_V4_MAX_LENGTH,
  CONST_VALUES_RESTRICTIONS_COMMON_UUID_V4_MIN_LENGTH,
} from 'const/const-values-restrictions-common';

export const CONST_VALIDATION_SCHEMES_URI = {
  type: 'string',
  format: 'uri-reference',
  maxLength: CONST_VALUES_RESTRICTIONS_COMMON_URI_MAX_LENGTH,
};

export const CONST_VALIDATION_SCHEMES_UUID_V4 = {
  type: 'string',
  format: 'uuid',
  maxLength: CONST_VALUES_RESTRICTIONS_COMMON_UUID_V4_MAX_LENGTH,
  minLength: CONST_VALUES_RESTRICTIONS_COMMON_UUID_V4_MIN_LENGTH,
};