export class ErrorExtendedBaseClass extends Error {
  public code?: number;

  constructor(arg?: Error | ErrorExtendedBaseClass | string, code?: number) {
    if (arg instanceof ErrorExtendedBaseClass) {
      return arg;
    }
    if (arg instanceof Error) {
      super(arg.message);
      Object.assign(this, arg);
    } else {
      super(arg);
    }
    this.code = code;
  }

  toString(): string {
    const { code, message } = this;

    if (code) {
      return `Error code: ${code}. ${message}`;
    }
    return message;
  }
}

export default ErrorExtendedBaseClass;
