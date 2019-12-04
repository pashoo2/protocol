import Ajv, { ValidateFunction } from 'ajv';
import ajvJSONSchemaDraft6 from 'ajv/lib/refs/json-schema-draft-06.json';
import memoize from 'lodash.memoize';
import { isDEV } from 'const/common-values/common-values-env';

const ajv = new Ajv({
  allErrors: isDEV,
  verbose: isDEV,
});
ajv.addMetaSchema(ajvJSONSchemaDraft6);

export const getValidatorForJSONSchema = memoize(
  (schema: object): ValidateFunction => ajv.compile(schema)
);

export const validateBySchema = (schema: object, value: any): boolean => {
  const validator = getValidatorForJSONSchema(schema);

  return !!validator(value);
};
