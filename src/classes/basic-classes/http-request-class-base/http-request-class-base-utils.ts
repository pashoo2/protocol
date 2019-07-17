import { HTTP_REQUEST_ERROR_CODES_RANGE } from './http-request-class-base.const';

const { NO_ERROR, CLIENT_ERROR } = HTTP_REQUEST_ERROR_CODES_RANGE;
const [MIN_CODE_SUCCESS, MAX_CODE_SUCCESS] = NO_ERROR;
const [MIN_CODE_ERROR_CLIENT, MAX_CODE_ERROR_CLIENT] = CLIENT_ERROR;

export const isSucceedResponse = (response: Response) => {
  const { status } = response;

  if (!status) {
    return false;
  }
  if (status >= MIN_CODE_SUCCESS && status <= MAX_CODE_SUCCESS) {
    return true;
  }
  return false;
};

export const isClientSideError = (response: Response) => {
  const { status } = response;

  if (!status) {
    return false;
  }
  if (status >= MIN_CODE_ERROR_CLIENT && status <= MAX_CODE_ERROR_CLIENT) {
    return true;
  }
  return false;
};
