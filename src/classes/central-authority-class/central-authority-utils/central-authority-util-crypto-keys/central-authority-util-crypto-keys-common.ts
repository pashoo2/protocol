import { isCryptoKeyPair } from 'utils/encryption-keys-utils/encryption-keys-utils';
import {
  TCACryptoKeyPairs,
  TCACryptoPubilicKeys,
} from '../../central-authority-class-types/central-authority-class-types';
import {
  CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME,
  CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME,
  CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME,
  CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME,
} from './central-authority-util-crypto-keys.const';

export const checkIsCryptoKeyPairs = (
  keyPairs: any
): keyPairs is TCACryptoKeyPairs => {
  return (
    keyPairs &&
    typeof keyPairs === 'object' &&
    isCryptoKeyPair(keyPairs[CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]) &&
    isCryptoKeyPair(keyPairs[CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME])
  );
};

/**
 * returns only a public keys
 * from a key pairs object
 * @param keyPairs
 * @returns {Error | object}
 */
export const getPublicKeysFromCryptoKeyPairs = (
  keyPairs: TCACryptoKeyPairs
): TCACryptoPubilicKeys | Error => {
  if (checkIsCryptoKeyPairs(keyPairs)) {
    return new Error('There is a wrong format of the key pairs');
  }

  const {
    [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: encryptionKeyPair,
    [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: dataSignKeyPair,
  }: TCACryptoKeyPairs = keyPairs;

  return {
    [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME]:
      encryptionKeyPair.publicKey,
    [CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME]: dataSignKeyPair.publicKey,
  } as TCACryptoPubilicKeys;
};
