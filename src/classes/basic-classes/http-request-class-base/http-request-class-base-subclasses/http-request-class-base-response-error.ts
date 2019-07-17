import { isClientSideError } from '../http-request-class-base-utils';

export class HttpResponseError extends Error {
  public code?: number;
  public error?: Error;
  // is error code is between the 400..500
  public isClientError: boolean = false;

  protected response: Response;

  constructor(response: Response) {
    super();
    this.response = response;
    this.processResponse();
  }

  setResponseCode() {
    const { response } = this;
    const { status } = response;

    this.code = status ? Number(status) : undefined;
  }

  setIsClientSideError() {
    const { response } = this;

    this.isClientError = isClientSideError(response);
  }

  async errorMessage() {
    const { message, response } = this;

    if (message && typeof message === 'string') {
      return message;
    }
    try {
      const message = await response.text();

      // cached error message
      this.message = String(message);
      return message;
    } catch (err) {
      console.error(`HttpResponseError::setErrorMessage::fail`, err);
      return err;
    }
  }

  processResponse() {
    this.setResponseCode();
    this.setIsClientSideError();
    this.errorMessage();
  }
}
