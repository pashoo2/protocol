import { __awaiter } from "tslib";
import { ValidationError } from './validation-utils-validation-error';
import Ajv from 'ajv';
import ajvJSONSchemaDraft6 from 'ajv/lib/refs/json-schema-draft-06.json';
import memoize from 'lodash.memoize';
import { isDEV } from "../../const/common-values/common-values-env";
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
            return data instanceof window[schema];
        }
        return false;
    },
});
export const getValidatorForJSONSchema = memoize((schema) => ajv.compile(schema));
export const validateBySchema = (schema, value) => {
    return !!getValidatorForJSONSchema(schema)(value);
};
export const getVerboseValidatorForJSONSchema = memoize((schema) => ajvVerbose.compile(schema));
export const validateVerboseBySchema = (schema, value) => {
    const validator = getVerboseValidatorForJSONSchema(schema);
    const validationResult = validator(value);
    if (!validationResult) {
        return new ValidationError(validator.errors);
    }
};
export function validateVerboseBySchemaWithVoidResult(schema, value) {
    const validationError = validateVerboseBySchema(schema, value);
    if (validationError) {
        throw validationError;
    }
}
export function asyncValidateVerboseBySchemaWithVoidResult(schema, value) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationError = validateVerboseBySchema(schema, value);
        if (validationError) {
            throw validationError;
        }
    });
}
//# sourceMappingURL=validation-utils.js.map