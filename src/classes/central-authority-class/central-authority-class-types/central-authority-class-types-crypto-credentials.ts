import {
  CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME,
  CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME,
} from 'classes/central-authority-class/central-authority-class-const/central-authority-class-const';
import { TCACryptoKeyPairs } from './central-authority-class-types-crypto-keys';
import {
  TCentralAuthorityUserIdentity,
  TCentralAuthorityAuthCredentials,
} from './central-authority-class-types-common';

export type TCentralAuthorityUserCryptoCredentials = {
  [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: TCentralAuthorityUserIdentity;
  [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: TCACryptoKeyPairs;
};

export type TCentralAuthorityUserCryptoCredentialsExported = {
  [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: TCentralAuthorityUserIdentity;
  [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: string;
};

export type TCentralAuthorityCredentialsStorageAuthCredentials = TCentralAuthorityAuthCredentials;
