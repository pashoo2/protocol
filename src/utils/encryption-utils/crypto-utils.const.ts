export const CRYPTO_UTIL_KEY_ALGORYTHM = 'RSA-OAEP';

export const CRYPTO_UTIL_KEY_DESC = {
  name: CRYPTO_UTIL_KEY_ALGORYTHM,
  hash: { name: 'SHA-256' },
};

export const CRYPTO_UTIL_GENERATE_KEYPAIR_OPTIONS = {
  ...CRYPTO_UTIL_KEY_DESC,
  modulusLength: 4096,
  publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
};

export const CRYPTO_UTIL_KEYPAIR_USAGES = [
  'encrypt',
  'decrypt',
  'sign',
  'verify',
];

export const CRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT = 'jwk';

export type TCRYPTO_UTIL_KEY_EXPORT_FORMAT_TYPE = object;

export type TCRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE = {
  public: object;
  private: object;
};
