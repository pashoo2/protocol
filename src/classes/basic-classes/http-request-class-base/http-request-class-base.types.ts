import {
  HTTP_REQUEST_CONTENT_TYPE,
  HTTP_REQUEST_METHOD,
  HTTP_REQUEST_MODE,
  HTTP_REQUEST_CACHE_CONTROL,
  HTTP_REQUEST_HEADERS_NAMES,
} from './http-request-class-base.const';
import { ownValueOf } from 'types/helper.types';

export type THttpRequestUrl = string;

export type THttpRequestMethod = ownValueOf<typeof HTTP_REQUEST_METHOD>;

export type THttpRequestContentType = ownValueOf<
  typeof HTTP_REQUEST_CONTENT_TYPE
>;

export type THttpRequestCacheControl = ownValueOf<
  typeof HTTP_REQUEST_CACHE_CONTROL
>;

export type THttpRequestMode = ownValueOf<typeof HTTP_REQUEST_MODE>;

export type THttpRequestToken = object | string;

export interface IHttpRequestOptions {
  method: THttpRequestMethod;
  contentType: THttpRequestContentType;
  url: THttpRequestUrl;
  body?: string | object | number;
  mode?: THttpRequestMode;
  cache?: THttpRequestCacheControl;
  token?: THttpRequestToken;
}

export type THttpResponseResult = object | string | File | Blob;

export interface IHttpRequestHeaders {
  [HTTP_REQUEST_HEADERS_NAMES.AUTHORIZATION]?: string;
  [HTTP_REQUEST_HEADERS_NAMES.CONTENT_TYPE]?: string;
}
