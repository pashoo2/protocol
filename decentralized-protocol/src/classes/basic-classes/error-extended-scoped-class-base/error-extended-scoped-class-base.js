import ErrorExtendedBaseClass from '../error-extended-class-base/error-extended-class-base';
export const getErrorScopedClass = (errorScopeName) => {
    class ErrorExtendedBaseScopedClass extends ErrorExtendedBaseClass {
        constructor(arg, code) {
            super(`${errorScopeName}::${arg}`, code);
        }
    }
    return ErrorExtendedBaseScopedClass;
};
export default getErrorScopedClass;
//# sourceMappingURL=error-extended-scoped-class-base.js.map