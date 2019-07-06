export const CRYPTO_UTIL_KEYS_EXTRACTABLE = true;

export const CRYPTO_UTIL_KEY_ALGORYTHM = 'RSA-OAEP';

export const CRYPTO_UTIL_KEY_DESC = {
  name: CRYPTO_UTIL_KEY_ALGORYTHM,
  hash: { name: 'SHA-256' },
};

export const CRYPTO_UTIL_PUBLIC_KEY_USAGE = 'encrypt';

export const CRYPTO_UTIL_PRIVATE_KEY_USAGE = 'decrypt';

export const CRYPTO_UTIL_ENCRYPTION_KEY_TYPE = 'public';

export const CRYPTO_UTIL_KEYPAIR_USAGES = [
  CRYPTO_UTIL_PUBLIC_KEY_USAGE,
  CRYPTO_UTIL_PRIVATE_KEY_USAGE,
];

export const CRYPTO_UTIL_GENERATE_KEYPAIR_OPTIONS = {
  ...CRYPTO_UTIL_KEY_DESC,
  modulusLength: 4096,
  publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
};

export const CRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT = 'jwk';

export type TCRYPTO_UTIL_KEY_EXPORT_FORMAT_TYPE = object;

export type TCRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE = {
  public: object;
  private: object;
};
