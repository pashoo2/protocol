import ErrorExtendedBaseClass from '../error-extended-class-base/error-extended-class-base';

/**
 * create error extended by the code and added
 * a prefix defined by the error scope name.
 */
export const getErrorScopedClass = (errorScopeName: string) => {
  class ErrorExtendedBaseScopedClass extends ErrorExtendedBaseClass {
    constructor(
      arg: Error | ErrorExtendedBaseClass | string,
      code?: string | number
    ) {
      super(`${errorScopeName}::${arg}`, code);
    }
  }

  return ErrorExtendedBaseScopedClass;
};

export default getErrorScopedClass;
