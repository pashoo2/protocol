import { ValidationError } from './validation-utils-validation-error';
import Ajv, { ValidateFunction } from 'ajv';
import ajvJSONSchemaDraft6 from 'ajv/lib/refs/json-schema-draft-06.json';
import memoize from 'lodash.memoize';
import { isDEV } from 'const/common-values/common-values-env';

const ajv = new Ajv({
  allErrors: isDEV,
  verbose: isDEV,
});

ajv.addMetaSchema(ajvJSONSchemaDraft6);

const ajvVerbose = new Ajv({
  allErrors: true,
  verbose: true,
});

ajvVerbose.addMetaSchema(ajvJSONSchemaDraft6);

export const getValidatorForJSONSchema = memoize(
  (schema: object): ValidateFunction => ajv.compile(schema)
);

export const validateBySchema = (schema: object, value: any): boolean => {
  return !!getValidatorForJSONSchema(schema)(value);
};

export const getVerboseValidatorForJSONSchema = memoize(
  (schema: object): ValidateFunction => ajvVerbose.compile(schema)
);

export const validateVerboseBySchema = (
  schema: object,
  value: any
): Error | void => {
  const validator = getVerboseValidatorForJSONSchema(schema);
  const validationResult = validator(value);

  if (!validationResult) {
    return new ValidationError(validator.errors);
  }
};
