import { ValidateFunction } from 'ajv';
import { JSONSchema7 } from 'json-schema';
export declare const getValidatorForJSONSchema: ((schema: object) => ValidateFunction) & import("lodash").MemoizedFunction;
export declare const validateBySchema: (schema: object, value: any) => boolean;
export declare const getVerboseValidatorForJSONSchema: ((schema: object) => ValidateFunction) & import("lodash").MemoizedFunction;
export declare const validateVerboseBySchema: (schema: object, value: any) => Error | undefined;
export declare function validateVerboseBySchemaWithVoidResult(schema: JSONSchema7, value: any): void;
export declare function asyncValidateVerboseBySchemaWithVoidResult(schema: JSONSchema7, value: any): Promise<void>;
//# sourceMappingURL=validation-utils.d.ts.map