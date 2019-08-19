import {
  CONST_VALIDATION_SCHEMES_URI,
  CONST_VALIDATION_SCHEMES_URL,
  CONST_VALIDATION_SCHEMES_UUID_V4,
} from 'const/const-validation-schemes/const-validation-schemes-common';
import { validateBySchema } from 'utils/validation-utils/validation-utils';

export const dataValidatorUtilURI = (v: any): boolean => {
  return validateBySchema(CONST_VALIDATION_SCHEMES_URI, v);
};

export const dataValidatorUtilURL = (v: any): boolean => {
  const result = validateBySchema(CONST_VALIDATION_SCHEMES_URL, v);

  return result;
};

export const dataValidatorUtilUUIDV4 = (v: any): boolean => {
  return validateBySchema(CONST_VALIDATION_SCHEMES_UUID_V4, v);
};
