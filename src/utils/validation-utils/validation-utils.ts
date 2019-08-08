import Ajv, { ValidateFunction } from 'ajv';
import memoize from 'lodash.memoize';

const ajv = new Ajv();

export const getValidatorForJSONSchema = memoize(
  (schema: object): ValidateFunction => ajv.compile(schema)
);

export const validateBySchema = (schema: object, value: any): boolean => {
  const validator = getValidatorForJSONSchema(schema);

  return validator(value) as boolean;
};
