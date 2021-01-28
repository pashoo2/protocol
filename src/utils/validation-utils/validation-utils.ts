import { ValidationError } from './validation-utils-validation-error';
import Ajv, { ValidateFunction } from 'ajv';
import ajvJSONSchemaDraft6 from 'ajv/lib/refs/json-schema-draft-06.json';
import memoize from 'lodash.memoize';
import { isDEV } from 'const/common-values/common-values-env';
import { JSONSchema7 } from 'json-schema';

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
ajvVerbose.addKeyword('instanceof', {
  compile: (schema) => (data) => {
    if (typeof window[schema] === 'function') {
      return data instanceof (window[schema] as any);
    }
    return false;
  },
});

export const getValidatorForJSONSchema = memoize((schema: object): ValidateFunction => ajv.compile(schema));

export const validateBySchema = (schema: object, value: any): boolean => {
  return !!getValidatorForJSONSchema(schema)(value);
};

export const getVerboseValidatorForJSONSchema = memoize((schema: object): ValidateFunction => ajvVerbose.compile(schema));

export const validateVerboseBySchema = (schema: object, value: any): Error | undefined => {
  const validator = getVerboseValidatorForJSONSchema(schema);
  const validationResult = validator(value);

  if (!validationResult) {
    return new ValidationError(validator.errors);
  }
};

/**
 * Validate object by the schema and throw an error
 *
 * @export
 * @param {JSONSchema7} schema - schema to validate by
 * @param {*} value - a value to validate
 * @returns {Promise<void>} - promise will be resolved after validation
 * @throws
 */
export function validateVerboseBySchemaWithVoidResult(schema: JSONSchema7, value: any): void {
  const validationError = validateVerboseBySchema(schema, value);
  if (validationError) {
    throw validationError;
  }
}

/**
 * Validate object by the schema and throw an error
 *
 * @export
 * @param {JSONSchema7} schema - schema to validate by
 * @param {*} value - a value to validate
 * @returns {Promise<void>} - promise will be resolved after validation
 * @throws
 */
export async function asyncValidateVerboseBySchemaWithVoidResult(schema: JSONSchema7, value: any): Promise<void> {
  const validationError = validateVerboseBySchema(schema, value);
  if (validationError) {
    throw validationError;
  }
}
