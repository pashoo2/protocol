export enum HTTP_REQUEST_METHOD {
  POST = 'post',
  GET = 'get',
  PUT = 'put',
  DELETE = 'delete',
}

export enum HTTP_REQUEST_CONTENT_TYPE {
  JSON = 'application/json; charset=utf-8',
  URL_ENCODED = 'application/x-www-form-urlencoded',
  MULTIPART = 'multipart/form-data',
  PLAIN = 'text/plain; charset=utf-8',
}

export enum HTTP_REQUEST_MODE {
  CORS = 'cors',
  // CORS_FORCE_PREFLIGHT = 'cors-with-forced-preflight',
  SAME_ORIGIN = 'same-origin',
  NO_CORS = 'no-cors',
}

export const HTTP_REQUEST_MODES_SUPPORTED = Object.values(HTTP_REQUEST_MODE);

export enum HTTP_REQUEST_CACHE_CONTROL {
  DEFAULT = 'default',
  NO_CACHE = 'no-cache',
  RELOAD = 'reload',
  FORCE = 'force-cache',
  CACHED_ONLY = 'only-if-cached',
}

export const HTTP_REQUEST_ERROR_CODES_RANGE = {
  CLIENT_ERROR: [400, 499],
  SERVER_ERROR: [500, 599],
  NO_ERROR: [200, 299],
};

export const HTTP_RESPONSE_TYPES = {
  OPAQUE: 'opaque',
  OPAQUE_REDIRECT: 'opaque_redirect',
  ERROR: 'error',
};

export enum HTTP_REQUEST_HEADERS_NAMES {
  AUTHORIZATION = 'Authorization',
  CONTENT_TYPE = 'Content-Type',
}

export const HTTP_REQUEST_AUTH_TOKEN_TYPE = 'Bearer';

export const HTTP_REQUEST_CONTENT_TYPES_KNOWN = Object.values(
  HTTP_REQUEST_CONTENT_TYPE
);

export const HTTP_REQUEST_URL_PROTOCOL_DELIIMETR_REGEXP = /^\/+/g;
