export class ErrorExtendedBaseClass extends Error {
  public code?: number | string;

  constructor(arg?: Error | ErrorExtendedBaseClass | string, code?: number | string) {
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

  public toString(): string {
    const { code, message } = this;

    if (code) {
      return `Error code: ${code}. ${message}`;
    }
    return message;
  }
}

export default ErrorExtendedBaseClass;
