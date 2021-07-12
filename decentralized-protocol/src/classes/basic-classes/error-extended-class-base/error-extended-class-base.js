export class ErrorExtendedBaseClass extends Error {
    constructor(arg, code) {
        if (arg instanceof ErrorExtendedBaseClass) {
            return arg;
        }
        if (arg instanceof Error) {
            super(arg.message);
            Object.assign(this, arg);
        }
        else {
            super(arg);
        }
        this.code = code;
    }
    toString() {
        const { code, message } = this;
        if (code) {
            return `Error code: ${code}. ${message}`;
        }
        return message;
    }
}
export default ErrorExtendedBaseClass;
//# sourceMappingURL=error-extended-class-base.js.map