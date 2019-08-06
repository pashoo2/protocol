import Ajv, { ValidateFunction } from 'ajv';

const ajv = new Ajv();

export const getValidatorForJSONSchema = (schema: object): ValidateFunction =>
  ajv.compile(schema);
