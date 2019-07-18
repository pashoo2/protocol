import {
  HTTP_REQUEST_ERROR_CODES_RANGE,
  HTTP_REQUEST_CONTENT_TYPE,
  HTTP_REQUEST_HEADERS_NAMES,
  HTTP_REQUEST_CONTENT_TYPES_KNOWN,
} from './http-request-class-base.const';
import { ownValueOf } from 'types/helper.types';
import {
  TQueryStringParamsObject,
  TQueryStringAllowedParamValue,
  TQueryStringParams,
} from './http-request-class-base.types';
import { concatStrings } from 'utils/string-utilities';

const { NO_ERROR, CLIENT_ERROR } = HTTP_REQUEST_ERROR_CODES_RANGE;
const [MIN_CODE_SUCCESS, MAX_CODE_SUCCESS] = NO_ERROR;
const [MIN_CODE_ERROR_CLIENT, MAX_CODE_ERROR_CLIENT] = CLIENT_ERROR;

export const isSucceedResponse = (response: Response): boolean => {
  const { status } = response;

  if (!status) {
    return false;
  }
  if (status >= MIN_CODE_SUCCESS && status <= MAX_CODE_SUCCESS) {
    return true;
  }
  return false;
};

export const isClientSideError = (response: Response): boolean => {
  const { status } = response;

  if (!status) {
    return false;
  }
  if (status >= MIN_CODE_ERROR_CLIENT && status <= MAX_CODE_ERROR_CLIENT) {
    return true;
  }
  return false;
};

export const getContentType = (
  response: Response
): void | ownValueOf<typeof HTTP_REQUEST_CONTENT_TYPE> => {
  const { headers } = response;

  if (headers) {
    const contentType = headers.get(HTTP_REQUEST_HEADERS_NAMES.CONTENT_TYPE);

    if (contentType && HTTP_REQUEST_CONTENT_TYPES_KNOWN.includes(contentType)) {
      return contentType;
    }
  }
  return undefined;
};

export const getContentTypeRAW = (response: Response): void | string => {
  const { headers } = response;

  if (headers) {
    const contentType = headers.get(HTTP_REQUEST_HEADERS_NAMES.CONTENT_TYPE);

    if (typeof contentType === 'string') {
      return contentType;
    }
  }
  return undefined;
};

export const getNetworkError = (response: Response): Error | void => {
  if (typeof (response as any).error === 'function') {
    const networkError = (response as any).error();

    return networkError;
  }
  return undefined;
};

/**
 * resolve a param as a string can be used as
 * a query string param
 * @param {object | string | number | Array<object | string | number> } paramValue
 * @returns string
 */
export const resolveQueryStringParam = (
  paramValue: TQueryStringAllowedParamValue
): string => {
  if (paramValue instanceof Array) {
    return `[${paramValue.map(resolveQueryStringParam)}]`;
  }

  const paramValueType = typeof paramValue;
  let resolvedValue;

  try {
    switch (paramValueType) {
      case 'string':
        resolvedValue = paramValue as string;
        break;
      case 'number':
        resolvedValue = String(paramValue);
        break;
      default:
        resolvedValue = JSON.stringify(paramValue);
        break;
    }
    if (resolvedValue) {
      return encodeURIComponent(resolvedValue);
    }
  } catch (err) {
    console.error(err);
  }
  return '';
};

/**
 *
 * @param {object} obj
 * @returns {string} - string in the format of
 * param1=value1....&paramN=valueN
 */
export const queryStringFromObject = (
  obj: TQueryStringParamsObject
): string => {
  if (obj && typeof obj === 'object') {
    const paramNames = Object.keys(obj);
    const paramsCount = paramNames.length;
    const paramsLastIdx = paramsCount - 1;
    let idx = 0;
    let result = '';
    let paramName;
    let paramValue;
    let paramValueString;

    for (; idx < paramsCount; idx += 1) {
      paramName = paramNames[idx];
      paramValue = obj[paramName];
      paramValueString = resolveQueryStringParam(paramValue);
      result = `${encodeURIComponent(paramName)}=${paramValueString}${
        idx !== paramsLastIdx ? '&' : ''
      }`;
    }
    return result;
  }
  return '';
};

export const resolveQueryStringParams = (
  ...params: TQueryStringParams[]
): string => {
  const paramsCount = params.length;
  let idx = 0;
  let result = '';
  let paramValue;
  let paramStringValue;

  for (; idx < paramsCount; idx += 1) {
    paramValue = params[idx];
    if (paramValue && typeof paramValue === 'object') {
      paramStringValue = queryStringFromObject(
        paramValue as TQueryStringParamsObject
      );
    } else {
      paramStringValue = resolveQueryStringParam(paramValue);
    }
    result = concatStrings('&', result, paramStringValue);
  }
  return result;
};
