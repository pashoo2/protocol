import {
  TCACryptoKeyPairsExported,
  TCACryptoKeyPairs,
} from './central-authority-class-types-crypto-keys';
import {
  CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_USER_ID_KEY_NAME,
  CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_CRYPTO_KEYS_KEY_NAME,
} from '../central-authority-storage/central-authority-storage-credentials/central-authority-storage-credentials.const';

export type TCentralAuthorityUserCryptoCredentials = {
  [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_USER_ID_KEY_NAME]: string;
  [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: TCACryptoKeyPairs;
};

export type TCentralAuthorityUserCryptoCredentialsExported = {
  [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_USER_ID_KEY_NAME]: string;
  [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: TCACryptoKeyPairsExported;
};

export type TCentralAuthorityCredentialsStorageAuthCredentials = {
  password: string;
};
