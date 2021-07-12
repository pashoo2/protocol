export class ValidationError extends Error {
    static mergeErrorObjects(errors) {
        return errors.reduce((errMessage, err, idx) => {
            return `${errMessage}\n\r "${err.dataPath}" - ${err.message}`;
        }, '');
    }
    constructor(error) {
        let message;
        if (error instanceof Array) {
            message = ValidationError.mergeErrorObjects(error);
        }
        else {
            message = 'An unknown error';
        }
        super(message);
    }
}
//# sourceMappingURL=validation-utils-validation-error.js.map