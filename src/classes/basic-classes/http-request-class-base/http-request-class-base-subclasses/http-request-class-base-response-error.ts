import { isClientSideError, getNetworkError } from '../http-request-class-base-utils';

export class HttpResponseError extends Error {
  public code?: number;
  public error?: Error;
  // is error code is between the 400..500
  public isClientError: boolean = false;

  protected response: Response;

  constructor(response: Response) {
    super();
    this.response = response;
    void this.processResponse();
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
      const { statusText } = response;
      const message = await response.text();

      this.message = statusText;
      if (message) {
        // cached error message
        this.message = String(message);
        return message;
      }
      return statusText;
    } catch (err) {
      console.error(`HttpResponseError::setErrorMessage::fail`, err);
      return err;
    }
  }

  mergeWithNetworkError(): boolean {
    const { response } = this;
    const networkError = getNetworkError(response);

    if (networkError instanceof Error) {
      Object.assign(this, networkError);
      return true;
    }
    return false;
  }

  async processResponse() {
    this.setResponseCode();
    this.setIsClientSideError();
    if (!this.mergeWithNetworkError()) {
      await this.errorMessage();
    }
  }
}
