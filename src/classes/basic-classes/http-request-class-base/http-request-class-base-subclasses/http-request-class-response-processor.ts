import { HttpResponseError } from './http-request-class-base-response-error';
import { THttpResponseResult } from '../http-request-class-base.types';
import {
  isSucceedResponse,
  getContentType,
} from '../http-request-class-base-utils';
import { HTTP_REQUEST_CONTENT_TYPE } from '../http-request-class-base.const';

export class HttpRequestResponseProcessor {
  constructor(protected response: Response) {}

  protected logError(error: Error): Error {
    console.error(error);
    return error;
  }

  protected async processAsText(): Promise<string | Error> {
    const { response } = this;

    try {
      const result = await response.text();

      return result;
    } catch (err) {
      return this.logError(err);
    }
  }

  protected async processAsFormData(): Promise<Error | FormData> {
    const { response } = this;
    let result;

    try {
      if (typeof response.formData === 'function') {
        result = await response.formData();
      } else {
      }

      return new Error("Can't parse the content");
    } catch (err) {
      return this.logError(err);
    }
  }

  protected async processAsJSON(): Promise<Error | object> {
    const { response } = this;

    try {
      const result = await response.json();

      return result;
    } catch (err) {
      return this.logError(err);
    }
  }

  protected async processResponse(): Promise<Error | THttpResponseResult> {
    const { response } = this;
    const contentType = getContentType(response);
    let result;

    switch (contentType) {
      case HTTP_REQUEST_CONTENT_TYPE.JSON:
        return this.processAsJSON();
      case HTTP_REQUEST_CONTENT_TYPE.MULTIPART:
        return this.processAsFormData();
      default:
        return this.processAsText();
    }
  }

  public async getResult(): Promise<
    Error | HttpResponseError | THttpResponseResult
  > {
    const { response } = this;

    if (!isSucceedResponse(response)) {
      return new HttpResponseError(response);
    }
    return this.processResponse();
  }
}
