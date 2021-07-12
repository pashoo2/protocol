import { ErrorObject } from 'ajv';
export declare class ValidationError extends Error {
    static mergeErrorObjects(errors: ErrorObject[]): string;
    constructor(error: ErrorObject[] | undefined | null);
}
//# sourceMappingURL=validation-utils-validation-error.d.ts.map