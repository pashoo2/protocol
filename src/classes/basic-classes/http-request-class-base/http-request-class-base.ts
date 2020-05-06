import validator from 'validator';
import { HttpRequestBodyProcessor } from './http-request-class-base-subclasses/http-request-class-base-body-processor';
import {
  IHttpRequestOptions,
  IHttpRequestHeaders,
  THttpResponseResult,
  THttpRequestToken,
  TQueryStringParams,
} from './http-request-class-base.types';
import {
  HTTP_REQUEST_HEADERS_NAMES,
  HTTP_REQUEST_METHOD,
  HTTP_REQUEST_MODE,
  HTTP_REQUEST_CONTENT_TYPE,
  HTTP_REQUEST_MODES_SUPPORTED,
} from './http-request-class-base.const';
import { HttpRequestResponseProcessor } from './http-request-class-base-subclasses/http-request-class-response-processor';
import { HttpResponseError } from './http-request-class-base-subclasses/http-request-class-base-response-error';
import { ownValueOf } from 'types/helper.types';
import { resolveQueryStringParams } from './http-request-class-base-utils';
import { prefixUrlWithHTTPProtocol } from './http-request-class-base.utils';

export class HttpRequest extends HttpRequestBodyProcessor {
  public static ContentType = HTTP_REQUEST_CONTENT_TYPE;

  public static HeaderName = HTTP_REQUEST_HEADERS_NAMES;

  public static RequestMode = HTTP_REQUEST_MODE;

  public static RequestMethod = HTTP_REQUEST_METHOD;

  protected static baseUrl?: string;

  private static token?: THttpRequestToken;

  public static setBaseUrl(baseUrl: string): void | Error {
    if (!validator.isURL(baseUrl)) {
      return new Error('This is not a valid url');
    }
    HttpRequest.baseUrl = baseUrl;
  }

  public static setToken(token: THttpRequestToken): void | Error {
    HttpRequest.token = token;
  }

  protected baseUrl?: string = HttpRequest.baseUrl;

  protected url?: string;

  protected method?: string;

  protected mode?: RequestMode;

  protected token?: THttpRequestToken = HttpRequest.token;

  protected contentType?: string;

  protected queryStringParams?: string;

  protected credentials?: RequestCredentials;

  /**
   * Creates an instance of HttpRequest.
   * @param {IHttpRequestOptions} options
   * @memberof HttpRequest
   * @throws
   */
  constructor(options: IHttpRequestOptions) {
    super(options);

    const resultSetOptions = this.setOptions(options);

    if (resultSetOptions instanceof Error) {
      console.error(
        'HttpRequest::setOptions::failed',
        resultSetOptions,
        options
      );
      throw resultSetOptions;
    }
  }

  /**
   * send the request to the server
   * on the url defined in the
   * options
   *
   * @memberof HttpRequest
   */
  public send = async () => {
    const { url, method, credentials, mode } = this;
    const body = this.getBody();
    const headers = this.getRequestHeaders();
    const cache = this.getCacheMode();

    try {
      const response = await fetch(url!, {
        mode,
        body,
        headers,
        cache,
        method,
        credentials,
      });

      return this.preProcessResponse(response);
    } catch (err) {
      console.error(`HttpRequest::${url}::send::failed`, err);
      return err;
    }
  };

  protected getRequestMethod(
    method: string | undefined,
    options: IHttpRequestOptions
  ): Error | HTTP_REQUEST_METHOD {
    if (!method) {
      const { body } = options;

      if (body) {
        return HTTP_REQUEST_METHOD.POST;
      }
      return HTTP_REQUEST_METHOD.GET;
    }

    const methodRes = method.trim().toUpperCase();

    if (HTTP_REQUEST_METHOD.hasOwnProperty(methodRes)) {
      return (HTTP_REQUEST_METHOD as any)[methodRes] as ownValueOf<
        typeof HTTP_REQUEST_METHOD
      >;
    }
    return new Error(`An unknown request method "${method}"`);
  }

  protected getCredentials(
    options: IHttpRequestOptions
  ): RequestCredentials | undefined {
    const { withCookie, credentials } = options;

    if (credentials) {
      return credentials;
    }
    if (withCookie) {
      return 'same-origin';
    }
  }

  protected getRequestMode(
    method: HTTP_REQUEST_METHOD,
    options: IHttpRequestOptions
  ): RequestMode | Error | undefined {
    const { mode, contentType, body, token } = options;

    if (!mode) {
      if (token) {
        return 'cors';
      }
      if (
        method === HTTP_REQUEST_METHOD.DELETE ||
        method === HTTP_REQUEST_METHOD.PUT
      ) {
        return 'cors';
      }
      if (
        contentType !== HTTP_REQUEST_CONTENT_TYPE.URL_ENCODED &&
        contentType !== HTTP_REQUEST_CONTENT_TYPE.MULTIPART &&
        contentType !== HTTP_REQUEST_CONTENT_TYPE.PLAIN
      ) {
        return 'cors';
      }
      if (body instanceof ReadableStream) {
        return 'cors';
      }
      return undefined;
    }

    if (typeof mode === 'string') {
      const methodRes = mode.trim().toLowerCase();

      if ((HTTP_REQUEST_MODES_SUPPORTED as string[]).includes(methodRes)) {
        return methodRes as RequestMode;
      }
      return new Error(`An unknown request mode "${mode}"`);
    }
  }

  /**
   * resolve the url where to send the request
   * depending on the options url
   * base url and a query string
   */
  protected resolveTargetUrl(url: string): string {
    const { baseUrl, queryStringParams } = this;
    const urlInstance = new URL(
      baseUrl ? url : prefixUrlWithHTTPProtocol(url),
      baseUrl ? prefixUrlWithHTTPProtocol(baseUrl) : undefined
    );

    if (queryStringParams) {
      urlInstance.search = queryStringParams;
    }
    return String(urlInstance);
  }

  protected getQueryStringParams(params: TQueryStringParams): string {
    const { queryStringParams } = this;
    const resolvedParams = resolveQueryStringParams(
      queryStringParams || '',
      params
    );

    return resolvedParams;
  }

  /**
   * @protected
   * @param {IHttpRequestOptions} options
   * @memberof HttpRequest
   * @throws
   */
  protected setOptions(options: IHttpRequestOptions) {
    if (!options) {
      throw new Error('The options must be defined for the request');
    }
    if (typeof options !== 'object') {
      return new Error('The options must be an object');
    }
    if (typeof options.url !== 'string') {
      return new Error('The url must be defined in options');
    }

    const { url, baseUrl, method, token, queryStringParams } = options;

    if (typeof url !== 'string') {
      return new Error('The url must be defined in options');
    }
    if (typeof baseUrl === 'string') {
      if (!validator.isURL(baseUrl)) {
        return new Error('The baseUrl is not valid');
      }
      this.baseUrl = baseUrl;
    } else if (!validator.isURL(url)) {
      this.baseUrl = '';
      try {
        new URL(url); // maybe it's data url
      } catch (err) {
        return new Error('The url is not valid');
      }
    }
    if (token) {
      this.token = token;
    }

    const methodRes = this.getRequestMethod(method, options);

    if (methodRes instanceof Error) {
      return methodRes;
    }
    this.method = methodRes;

    const modeRes = this.getRequestMode(methodRes, options);

    if (modeRes instanceof Error) {
      return modeRes;
    }
    this.mode = modeRes;
    this.credentials = this.getCredentials(options);
    if (queryStringParams) {
      this.queryStringParams = this.getQueryStringParams(queryStringParams);
    }
    this.url = this.resolveTargetUrl(url);
  }

  protected getRequestHeaders(): HeadersInit {
    const { options, token } = this;
    const { contentType } = options;
    const headers: IHttpRequestHeaders = {};

    if (contentType) {
      headers[HTTP_REQUEST_HEADERS_NAMES.CONTENT_TYPE] = contentType;
    }
    if (token) {
      headers[HTTP_REQUEST_HEADERS_NAMES.AUTHORIZATION] = `Bearer ${token}`;
    }
    return headers as HeadersInit;
  }

  protected getCacheMode(): RequestCache {
    const { options } = this;
    const { cache } = options;

    return cache as RequestCache;
  }

  protected preProcessResponse(
    response: Response
  ): Promise<Error | HttpResponseError | THttpResponseResult> {
    const responseProcessor = new HttpRequestResponseProcessor(response);

    return responseProcessor.getResult();
  }
}

export default HttpRequest;
