import { IHttpRequestOptions } from '../http-request-class-base.types';
import { HTTP_REQUEST_METHOD, HTTP_REQUEST_CONTENT_TYPE } from '../http-request-class-base.const';
import {
  objectToUrlEncodedString,
  IParamsObject,
  objectToFormData,
  IParamsObjectFormData,
} from '../http-request-class-base.utils';

export class HttpRequestBodyProcessor {
  protected static logError(methodName: string, err: string | Error): void {
    console.error(`HttpRequestBodyProcessor::${methodName}`, err);
  }

  constructor(protected options: IHttpRequestOptions) {}

  private get bodyRAW() {
    const { options } = this;
    const { body } = options;

    return body;
  }

  private get bodyType() {
    const { bodyRAW: body } = this;

    return typeof body;
  }

  protected processBodyAsMultipart() {
    const { bodyRAW: body, bodyType } = this;

    if (body instanceof FormData) {
      return body;
    }
    if (bodyType === 'object') {
      return objectToFormData(body as IParamsObjectFormData);
    }
    HttpRequestBodyProcessor.logError('checkBodyIsMultipart', 'a wrong type of the body');
    return undefined;
  }

  protected processBodyAsUrlEncoded() {
    const { bodyRAW: body, bodyType } = this;

    switch (bodyType) {
      case 'string':
        return encodeURI(String(body));
      case 'object':
        return objectToUrlEncodedString(body as IParamsObject);
      default: {
        HttpRequestBodyProcessor.logError('processBodyAsUrlEncoded', 'a wrong type of the body');
        return undefined;
      }
    }
  }

  protected processBodyAsJSON(): string | FormData | undefined {
    const { bodyRAW: body, bodyType } = this;

    switch (bodyType) {
      case 'string':
        return body as string;
      case 'number':
      case 'object':
        return JSON.stringify(body);
      default:
        return undefined;
    }
  }

  protected preProcessBody(): string | FormData | undefined {
    const { options } = this;
    const { contentType } = options;

    if (typeof contentType === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      switch (contentType!) {
        case HTTP_REQUEST_CONTENT_TYPE.JSON:
          return this.processBodyAsJSON();
        case HTTP_REQUEST_CONTENT_TYPE.URL_ENCODED:
          return this.processBodyAsUrlEncoded();
        case HTTP_REQUEST_CONTENT_TYPE.MULTIPART:
          return this.processBodyAsMultipart();
      }
    }
    return undefined;
  }

  protected getBody(): string | FormData | undefined {
    const { options } = this;
    const { method } = options;

    if (method === HTTP_REQUEST_METHOD.GET || method === HTTP_REQUEST_METHOD.DELETE) {
      return undefined;
    }
    return this.preProcessBody();
  }
}
