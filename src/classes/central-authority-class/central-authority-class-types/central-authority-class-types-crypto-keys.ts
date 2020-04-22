import {
  CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME,
  CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME,
  CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME,
  CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME,
} from '../central-authority-utils-common/central-authority-util-crypto-keys';

export type TCACryptoKeyPairs = {
  [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: CryptoKeyPair & {
    privateKey: CryptoKeyPair['privateKey'] | undefined;
  };
  [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: CryptoKeyPair & {
    privateKey: CryptoKeyPair['privateKey'] | undefined;
  };
};

export type TCACryptoKeyPairsExported = {
  [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: string;
  [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: string;
};

export type TCACryptoPubilicKeys = {
  [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME]: CryptoKey;
  [CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME]: CryptoKey;
};
