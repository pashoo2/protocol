import { generateKeyPair as generateKeyPairDataEncryption } from 'utils/encryption-utils';
import { generateKeyPair as generateKeyPairSignData } from 'utils/data-sign-utils';
import { isCryptoKeyPair } from 'utils/encryption-keys-utils/encryption-keys-utils';
import { TCACryptoKeyPairs } from '../../central-authority-class-types/central-authority-class-types';
import {
  CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME,
  CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME,
} from './central-authority-util-crypto-keys.const';

/**
 * generate a key pair, used for data encryption
 */
export const generateEncryptKeyPair = async (): Promise<
  CryptoKeyPair | Error
> => {
  const keyPair = await generateKeyPairDataEncryption();
  const isKeyPair = await isCryptoKeyPair(keyPair);

  if (!isKeyPair) {
    return new Error('Failed to generate a key pair');
  }
  return keyPair;
};

/**
 * generate a key pair, used for data signing
 */
export const generateSignKeyPair = async (): Promise<CryptoKeyPair | Error> => {
  const keyPair = await generateKeyPairSignData();
  const isKeyPair = await isCryptoKeyPair(keyPair);

  if (!isKeyPair) {
    return new Error('Failed to generate a key pair');
  }
  return keyPair;
};

/**
 * generate a two key pairs
 * one is used to sign a data
 * second is used to encrypt a data
 */
export const generateKeyPairs = async (): Promise<
  TCACryptoKeyPairs | Error
> => {
  const [encryptionKeyPair, signDataKeyPair] = await Promise.all([
    generateEncryptKeyPair(),
    generateSignKeyPair(),
  ]);

  if (encryptionKeyPair instanceof Error) {
    return encryptionKeyPair;
  }
  if (signDataKeyPair instanceof Error) {
    return signDataKeyPair;
  }
  return {
    [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: encryptionKeyPair,
    [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: signDataKeyPair,
  };
};
