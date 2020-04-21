import {
  isCryptoKeyPair,
  isCryptoKey,
  isCryptoKeyPairExportedAsString,
} from 'utils/encryption-keys-utils/encryption-keys-utils';
import {
  TCACryptoKeyPairs,
  TCACryptoPubilicKeys,
  TCACryptoKeyPairsExported,
} from '../../central-authority-class-types/central-authority-class-types';
import {
  CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME,
  CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME,
  CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME,
  CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME,
  CA_CRYPTO_KEY_PAIRS_STRINGIFIED_MIN_LENGTH,
} from './central-authority-util-crypto-keys.const';

export const checkIsCryptoKeyPairsExportedAsString = (v: any): boolean => {
  return (
    typeof v === 'string' &&
    v.length >= CA_CRYPTO_KEY_PAIRS_STRINGIFIED_MIN_LENGTH
  );
};

/**
 * check is a given value
 * have a key pairs in a
 * raw format
 * @param keyPairs
 * @returns {boolean}
 */
export const checkIsCryptoKeyPairs = (
  keyPairs: any,
  checkPrivateKeys: boolean = true
): keyPairs is TCACryptoKeyPairs => {
  if (keyPairs && typeof keyPairs === 'object') {
    const {
      [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: encryptionKeyPair,
      [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: signKeyPair,
    } = keyPairs;

    if (!isCryptoKeyPair(encryptionKeyPair, checkPrivateKeys)) {
      console.error('Encryption key pair is not valid');
      return false;
    }
    if (!isCryptoKeyPair(signKeyPair, checkPrivateKeys)) {
      console.error('Data sign key pair is not valid');
      return false;
    }
    return true;
  }
  console.error('A wrong format of the keyPairs');
  return false;
};

/**
 * check is a given value
 * have a key pairs in an
 * exported format
 * @param keyPairs
 * @returns {boolean}
 */
export const checkIsCryptoKeyPairsExported = (
  keyPairs: any
): keyPairs is TCACryptoKeyPairsExported => {
  if (keyPairs && typeof keyPairs === 'object') {
    const {
      [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: encryptionKeyPairExported,
      [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: signKeyPairExported,
    } = keyPairs;

    if (!isCryptoKeyPairExportedAsString(encryptionKeyPairExported)) {
      console.error('Encryption key pair exported is not valid');
      return false;
    }
    if (!isCryptoKeyPairExportedAsString(signKeyPairExported)) {
      console.error('Data sign key pair exported is not valid');
      return false;
    }
    return true;
  }
  console.error('A wrong format of the keyPairs exported');
  return false;
};

export const checkIsPublicKeys = (
  keysPublic: any
): keysPublic is TCACryptoPubilicKeys => {
  if (keysPublic && typeof keysPublic === 'object') {
    if (
      !isCryptoKey(keysPublic[CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME])
    ) {
      console.error('Encryption public key is not valid');
      return false;
    }
    if (!isCryptoKey(keysPublic[CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME])) {
      console.error('Sign data public key is not valid');
      return false;
    }
    return true;
  }
  console.error('A wrong format for the keysPublic');
  return false;
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
  if (!checkIsCryptoKeyPairs(keyPairs)) {
    return new Error('There is a wrong format of the key pairs');
  }

  const {
    [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: encryptionKeyPair,
    [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: dataSignKeyPair,
  }: TCACryptoKeyPairs = keyPairs;
  const publicKeys = {
    [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME]:
      encryptionKeyPair.publicKey,
    [CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME]: dataSignKeyPair.publicKey,
  };

  if (checkIsPublicKeys(publicKeys)) {
    return publicKeys;
  }
  return new Error(
    'Failed to receive a valid public keys from the encryption key pairs'
  );
};
