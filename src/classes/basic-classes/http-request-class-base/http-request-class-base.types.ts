import {
  HTTP_REQUEST_CONTENT_TYPE,
  HTTP_REQUEST_METHOD,
  HTTP_REQUEST_MODE,
  HTTP_REQUEST_CACHE_CONTROL,
  HTTP_REQUEST_HEADERS_NAMES,
} from './http-request-class-base.const';
import { ownValueOf } from 'types/helper.types';

/**
 * allowed types for a query string params
 * it will be convertod to a string
 */
export type TQueryStringAllowedParamValue = string | number | string[];

/**
 * will be resolved as a string like
 * &paramName=paramValue....&paramNameN=paramValueN
 * paramValueN may be an array = [paramNItem1....paramNItemN]
 */
export type TQueryStringParamsObject = {
  [paramName: string]: TQueryStringAllowedParamValue;
};

export type TQueryStringParams = string | TQueryStringParamsObject;

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

export type THttpResponseResult = object | string | File | Blob | FormData;

export interface IHttpRequestHeaders {
  [HTTP_REQUEST_HEADERS_NAMES.AUTHORIZATION]?: string;
  [HTTP_REQUEST_HEADERS_NAMES.CONTENT_TYPE]?: string;
}
