import { HttpRequestBodyProcessor } from './http-request-class-base-subclasses/http-request-class-base-body-processor';
import {
  IHttpRequestOptions,
  IHttpRequestHeaders,
  THttpResponseResult,
} from './http-request-class-base.types';
import { HTTP_REQUEST_HEADERS_NAMES } from './http-request-class-base.const';
import { HttpRequestResponseProcessor } from './http-request-class-base-subclasses/http-request-class-response-processor';
import { HttpResponseError } from './http-request-class-base-subclasses/http-request-class-base-response-error';

export class HttpRequest extends HttpRequestBodyProcessor {
  protected baseUrl?: string;
  protected queryStringParams?: string;

  constructor(protected options: IHttpRequestOptions) {
    super(options);
  }

  setBaseUrl(baseUrl: string): void {
    if (typeof baseUrl === 'string') {
      this.baseUrl = baseUrl;
    }
  }

  setQueryStringParams(params): void {}

  getRequestHeaders(): HeadersInit {
    const { options } = this;
    const { contentType, token } = options;
    const headers: IHttpRequestHeaders = {};

    if (contentType) {
      headers[HTTP_REQUEST_HEADERS_NAMES.CONTENT_TYPE] = contentType;
    }
    if (token) {
      headers[HTTP_REQUEST_HEADERS_NAMES.AUTHORIZATION] = contentType;
    }
    return headers as HeadersInit;
  }

  getCacheMode(): RequestCache {
    const { options } = this;
    const { cache } = options;

    return cache as RequestCache;
  }

  preProcessResponse(
    response: Response
  ): Promise<Error | HttpResponseError | THttpResponseResult> {
    const responseProcessor = new HttpRequestResponseProcessor(response);

    return responseProcessor.getResult();
  }

  send = async () => {
    const { options } = this;
    const { url, method } = options;
    const body = await this.getBody();
    const headers = this.getRequestHeaders();
    const cache = this.getCacheMode();

    try {
      const response = await fetch(url, {
        body,
        headers,
        cache,
        method,
      });

      return this.preProcessResponse(response);
    } catch (err) {
      return err;
    }
  };
}

export default HttpRequest;
