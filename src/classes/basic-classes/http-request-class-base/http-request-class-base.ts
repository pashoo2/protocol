import { HttpRequestBodyProcessor } from './http-request-class-base-subclasses/http-request-class-base-body-processor';
import {
  IHttpRequestOptions,
  IHttpRequestHeaders,
  THttpResponseResult,
  TQueryStringParams,
} from './http-request-class-base.types';
import { HTTP_REQUEST_HEADERS_NAMES } from './http-request-class-base.const';
import { HttpRequestResponseProcessor } from './http-request-class-base-subclasses/http-request-class-response-processor';
import { HttpResponseError } from './http-request-class-base-subclasses/http-request-class-base-response-error';
import { resolveQueryStringParams } from './http-request-class-base-utils';

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

  setQueryStringParams(params: TQueryStringParams): void {
    const { queryStringParams } = this;
    const resolvedParams = resolveQueryStringParams(
      queryStringParams || '',
      params
    );

    this.queryStringParams = resolvedParams;
  }

  /**
   * resolve the url where to send the request
   * depending on the options url
   * base url and a query string
   */
  resolveTargetUrl(): string {
    const { options, baseUrl, queryStringParams } = this;
    const { url } = options;
    const urlInstance = new URL(url, baseUrl || undefined);

    if (queryStringParams) {
      urlInstance.search = queryStringParams;
    }
    return String(urlInstance);
  }

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
    const { method } = options;
    const url = this.resolveTargetUrl();
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
