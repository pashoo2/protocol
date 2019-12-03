import {
  TCACryptoKeyPairsExported,
  TCACryptoKeyPairs,
} from './central-authority-class-types-crypto-keys';
import {
  CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_USER_ID_KEY_NAME,
  CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_CRYPTO_KEYS_KEY_NAME,
} from '../central-authority-storage-local/central-authority-storage-current-user-auth/central-authority-storage-credentials/central-authority-storage-credentials.const';
import {
  TCentralAuthorityUserIdentity,
  TCentralAuthorityAuthCredentials,
} from './central-authority-class-types-common';

export type TCentralAuthorityUserCryptoCredentials = {
  [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_USER_ID_KEY_NAME]: TCentralAuthorityUserIdentity;
  [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: TCACryptoKeyPairs;
};

export type TCentralAuthorityUserCryptoCredentialsExported = {
  [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_USER_ID_KEY_NAME]: TCentralAuthorityUserIdentity;
  [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: string;
};

export type TCentralAuthorityCredentialsStorageAuthCredentials = TCentralAuthorityAuthCredentials;
