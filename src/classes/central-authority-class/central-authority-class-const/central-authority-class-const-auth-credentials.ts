import { UTILS_DATA_COMPRESSION_COMPRESSION_RATIO_MAX } from 'utils/data-compression-utils/data-compression-utils.const';
import { MIN_JWK_STRING_LENGTH } from '@pashoo2/crypto-utilities';
import {
  CONST_VALUES_RESTRICTIONS_COMMON_LOGIN_MIN_LENGTH,
  CONST_VALUES_RESTRICTIONS_COMMON_LOGIN_MAX_LENGTH,
} from 'const/const-values-restrictions-common';

// this is the user public identifier, which may be used
// to encrypt the ueser's local data. Therefore it's
// better to use the secret login instead of the public
// login to authorize to aceess for a local data.
export const CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME = 'userIdentity';

export const CA_AUTH_CREDENTIALS_USER_PASSWORD_PROP_NAME = 'password';

// this is a secret login used for access to a local encrypted data. If it is
// empty the user identity will be used instead.
export const CA_AUTH_CREDENTIALS_USER_SECRET_LOGIN_PROP_NAME = 'secretLogin';

export const CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME = 'cryptoKeys';

export const CA_USER_IDENTITY_TYPE = 'string';

export const CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MIN_LENGTH = CONST_VALUES_RESTRICTIONS_COMMON_LOGIN_MIN_LENGTH;

export const CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MAX_LENGTH = CONST_VALUES_RESTRICTIONS_COMMON_LOGIN_MAX_LENGTH;

export const CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MIN_LENGTH = 10;

export const CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MAX_LENGTH = 255;

export const CA_CREDENTIALS_KEY_CRYPTO_CREDENTIALS_EXPORTED_AS_STRING_MIN_LENGTH =
  (2 * MIN_JWK_STRING_LENGTH) / UTILS_DATA_COMPRESSION_COMPRESSION_RATIO_MAX;

export const CA_USER_IDENTITY_MIN_LENGTH =
  CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MIN_LENGTH + CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MIN_LENGTH;

export const CA_USER_IDENTITY_MAX_LENGTH =
  CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MAX_LENGTH + CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MAX_LENGTH;

export const CA_USER_PASSWORD_TYPE = 'string';

export const CA_USER_PASSWORD_MIN_LENGTH = 6;

export const CA_USER_LOGIN_MIN_LENGTH = 3;
