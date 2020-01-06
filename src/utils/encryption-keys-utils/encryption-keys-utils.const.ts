export const ENCRYPTIONS_KEYS_UTILS_JWK_FORMAT_OBJECT_KEYS = [
  'alg',
  'crv',
  'd',
  'dp',
  'dq',
  'e',
  'ext',
  'k',
  'kty',
  'n',
  'oth',
  'p',
  'q',
  'qi',
  'use',
  'x',
  'y',
];

export const MIN_JWK_STRING_LENGTH = 40;

export const MIN_JWK_PROPS_COUNT = 3;

export enum ENCRYPTIONS_KEYS_UTILS_EXPORT_FORMATS {
  RAW = 'raw',
  PKCS8 = 'pkcs8',
  SPKI = 'spki',
  JWK = 'jwk',
}
