import { ErrorObject } from 'ajv';

export class ValidationError extends Error {
  static mergeErrorObjects(errors: ErrorObject[]): string {
    return errors.reduce(
      (errMessage: string, err: ErrorObject, idx: number) => {
        return `${errMessage}. ${idx}::${err.message}`;
      },
      ''
    );
  }

  constructor(error: ErrorObject[] | undefined | null) {
    let message;

    if (error instanceof Array) {
      message = ValidationError.mergeErrorObjects(error);
    } else {
      message = 'An unknown error';
    }
    super(message);
  }
}
