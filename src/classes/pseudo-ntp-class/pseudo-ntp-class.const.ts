import { CONST_VALIDATION_VALUES_MESSAGING_MAX_ERROR_SECONDS } from 'const/const-validation-values/const-validation-values-messaging-date';
import {
  HTTP_REQUEST_CACHE_CONTROL,
  HTTP_REQUEST_METHOD,
  HTTP_REQUEST_MODE,
} from 'classes/basic-classes/http-request-class-base/http-request-class-base.const';

export enum PSEUDO_NTP_CLASS_EVENTS {
  TIME_SYNC = 'TIME_SYNC',
}

export const PSEUDO_NTP_CLASS_LOGS_PREFIX = 'PseudoNTPClass';

export const PSEUDO_NTP_CLASS_DEFAULT_OPTIONS = {
  syncIntervalMs: 60000,
  maxFailedResponses: 3,
  retryRequestDelayMs: 5000,
  responseTimeoutMs: 1000,
  maxOffsetErrorS: CONST_VALIDATION_VALUES_MESSAGING_MAX_ERROR_SECONDS,
};

export const PSEUDO_NTP_CLASS_REQUEST_OPTIONS = {
  cache: HTTP_REQUEST_CACHE_CONTROL.NO_CACHE,
  method: HTTP_REQUEST_METHOD.GET,
  mode: HTTP_REQUEST_MODE.CORS,
};
