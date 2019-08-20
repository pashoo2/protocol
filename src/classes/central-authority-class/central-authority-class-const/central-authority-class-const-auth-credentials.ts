import { UTILS_DATA_COMPRESSION_COMPRESSION_RATIO_MAX } from 'utils/data-compression-utils/data-compression-utils.const';
import { MIN_JWK_STRING_LENGTH } from 'utils/encryption-keys-utils/encryption-keys-utils.const';

export const CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME = 'userIdentity';

export const CA_AUTH_CREDENTIALS_USER_PASSWORD_PROP_NAME = 'password';

export const CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME = 'cryptoKeys';

export const CA_USER_IDENTITY_TYPE = 'string';

export const CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MIN_LENGTH = 36;

export const CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MAX_LENGTH = 36;

export const CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MIN_LENGTH = 10;

export const CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MAX_LENGTH = 255;

export const CA_CREDENTIALS_KEY_CRYPTO_CREDENTIALS_EXPORTED_AS_STRING_MIN_LENGTH =
  (2 * MIN_JWK_STRING_LENGTH) / UTILS_DATA_COMPRESSION_COMPRESSION_RATIO_MAX;

export const CA_USER_IDENTITY_MIN_LENGTH =
  CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MIN_LENGTH +
  CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MIN_LENGTH;

export const CA_USER_IDENTITY_MAX_LENGTH =
  CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MAX_LENGTH +
  CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MAX_LENGTH;

export const CA_USER_PASSWORD_TYPE = 'string';

export const CA_USER_PASSWORD_MIN_LENGTH = 6;
