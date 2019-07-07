export const DATA_SIGN_CRYPTO_UTIL_KEYS_EXTRACTABLE = true;

export const DATA_SIGN_CRYPTO_UTIL_KEY_ALGORITHM = 'ECDSA';

export const DATA_SIGN_CRYPTO_UTIL_HASH_ALGORITHM = 'SHA-256';

export const DATA_SIGN_CRYPTO_UTIL_KEY_DESC = {
  name: DATA_SIGN_CRYPTO_UTIL_KEY_ALGORITHM,
  namedCurve: 'P-256',
};

export const DATA_SIGN_CRYPTO_UTIL_PUBLIC_KEY_USAGE = 'sign';

export const DATA_SIGN_CRYPTO_UTIL_PRIVATE_KEY_USAGE = 'verify';

export const DATA_SIGN_CRYPTO_UTIL_VERIFY_KEY_TYPE = 'public';

export const DATA_SIGN_CRYPTO_UTIL_SIGN_KEY_TYPE = 'private';

export const DATA_SIGN_CRYPTO_UTIL_KEYPAIR_USAGES = [
  DATA_SIGN_CRYPTO_UTIL_PUBLIC_KEY_USAGE,
  DATA_SIGN_CRYPTO_UTIL_PRIVATE_KEY_USAGE,
];

export const DATA_SIGN_CRYPTO_UTIL_GENERATE_KEYPAIR_OPTIONS = {
  ...DATA_SIGN_CRYPTO_UTIL_KEY_DESC,
};

export const DATA_SIGN_CRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT = 'jwk';

export const DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME = 'publicKey';

export const DATA_SIGN_CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME = 'privateKey';

export const DATA_SIGN_CRYPTO_UTIL_DATA_SIGN_AND_VERIFY_PARAMS = {
  name: DATA_SIGN_CRYPTO_UTIL_KEY_ALGORITHM,
  hash: { name: DATA_SIGN_CRYPTO_UTIL_HASH_ALGORITHM },
};
