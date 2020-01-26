import { TCentralAuthorityUserCryptoCredentials } from './central-authority-class-types/central-authority-class-types-crypto-credentials';
import { TCACryptoKeyPairs } from './central-authority-class-types/central-authority-class-types-crypto-keys';
import {
  CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME,
  CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME,
} from './central-authority-class-const/central-authority-class-const-auth-credentials';
import { TCentralAuthorityUserIdentity } from './central-authority-class-types/central-authority-class-types-common';
import {
  CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME,
  CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME,
} from './central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys.const';

export const getCryptoKeysByCryptoCredentials = (
  cryptoCredentials: TCentralAuthorityUserCryptoCredentials | null
): TCACryptoKeyPairs | null => {
  if (!cryptoCredentials) {
    return null;
  }
  return cryptoCredentials[CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME];
};

export const getUserIdentityByCryptoCredentials = (
  cryptoCredentials: TCentralAuthorityUserCryptoCredentials | null
): TCentralAuthorityUserIdentity | null => {
  if (!cryptoCredentials) {
    return null;
  }
  return cryptoCredentials[CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME];
};

export const getKeyPairByCryptoCredentials = (
  cryptoCredentials: TCentralAuthorityUserCryptoCredentials | null,
  keyType:
    | typeof CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME
    | typeof CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME
): CryptoKeyPair | null => {
  const cryptoKeyPair = getCryptoKeysByCryptoCredentials(cryptoCredentials);

  if (!cryptoKeyPair) {
    return null;
  }
  return cryptoKeyPair[keyType];
};

export const getPubKeyByCryptoCredentials = (
  cryptoCredentials: TCentralAuthorityUserCryptoCredentials | null,
  keyType:
    | typeof CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME
    | typeof CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME
): CryptoKey | null => {
  const cryptoKeyPair = getKeyPairByCryptoCredentials(
    cryptoCredentials,
    keyType
  );

  if (!cryptoKeyPair) {
    return null;
  }
  return cryptoKeyPair.publicKey;
};

export const getDataSignPubKeyByCryptoCredentials = (
  cryptoCredentials: TCentralAuthorityUserCryptoCredentials | null
): CryptoKey | null => {
  return getPubKeyByCryptoCredentials(
    cryptoCredentials,
    CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME
  );
};

export const getDataSignKeyPairByCryptoCredentials = (
  cryptoCredentials: TCentralAuthorityUserCryptoCredentials | null
): CryptoKeyPair | null => {
  return getKeyPairByCryptoCredentials(
    cryptoCredentials,
    CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME
  );
};

export const getDataEncryptionPubKeyByCryptoCredentials = (
  cryptoCredentials: TCentralAuthorityUserCryptoCredentials | null
): CryptoKey | null => {
  return getPubKeyByCryptoCredentials(
    cryptoCredentials,
    CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME
  );
};

export const getDataEncryptionKeyPairByCryptoCredentials = (
  cryptoCredentials: TCentralAuthorityUserCryptoCredentials | null
): CryptoKeyPair | null => {
  return getKeyPairByCryptoCredentials(
    cryptoCredentials,
    CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME
  );
};
