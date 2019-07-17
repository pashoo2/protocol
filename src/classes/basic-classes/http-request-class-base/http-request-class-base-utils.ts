import {
  HTTP_REQUEST_ERROR_CODES_RANGE,
  HTTP_REQUEST_CONTENT_TYPE,
  HTTP_REQUEST_HEADERS_NAMES,
  HTTP_REQUEST_CONTENT_TYPES_KNOWN,
} from './http-request-class-base.const';
import { ownValueOf } from 'types/helper.types';

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

export const getNetworkError = (response: Response): Error | void => {
  if (typeof (response as any).error === 'function') {
    const networkError = (response as any).error();

    return networkError;
  }
  return undefined;
};
