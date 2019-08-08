import {
  generateKeyPair as generateKeyPairDataEncryption,
  exportKeyPairAsString as exportKeyPairDataEncryptAsString,
  importKeyPairFromString as importKeyPairDataEncryptionFromString,
} from 'utils/encryption-utils';
import {
  generateKeyPair as generateKeyPairSignData,
  exportKeyPairAsString as exportKeyPairDataSignAsString,
  importKeyPairFromString as importKeyPairDataSignFromString,
} from 'utils/data-sign-utils';
import { isCryptoKeyPair } from 'utils/encryption-keys-utils/encryption-keys-utils';
import {
  TCACryptoKeyPairs,
  TCACryptoPubilicKeys,
} from '../central-authority-class-types/central-authority-class-types';
import {
  CA_CRYPTO_KEY_PAIRS_STRINGIFIED_MIN_LENGTH,
  CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME,
  CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME,
  CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME,
  CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME,
} from './central-authority-util-crypto-keys.const';
import { caValidateCryptoKeyPairExportedObject } from '../central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';

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

/**
 * export two key pairs
 * (data sign and data encryption)
 * as a one string
 * @param {object} cryptoKeyPairs
 * @returns {Promise<string | Error>}
 */
export const exportKeyPairsAsString = async (
  cryptoKeyPairs: TCACryptoKeyPairs
): Promise<string | Error> => {
  if (!checkIsCryptoKeyPairs(cryptoKeyPairs)) {
    return new Error('The keypair is not valid');
  }

  const {
    [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: encryptionKeyPair,
    [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: signDataKeyPair,
  } = cryptoKeyPairs;
  const [encryptionKeyPairString, signDataKeyPairString] = await Promise.all([
    exportKeyPairDataEncryptAsString(encryptionKeyPair),
    exportKeyPairDataSignAsString(signDataKeyPair),
  ]);

  if (encryptionKeyPairString instanceof Error) {
    return encryptionKeyPairString;
  }
  if (signDataKeyPairString instanceof Error) {
    return signDataKeyPairString;
  }
  try {
    return JSON.stringify({
      [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: encryptionKeyPairString,
      [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: signDataKeyPairString,
    });
  } catch (err) {
    return err;
  }
};

/**
 * import an exported key pair
 * and returs it a crypto key pair
 * @param {string} keyPairsString
 * @returns {Promise<Error | object>}
 */
export const importKeyPairsFromString = async (
  keyPairsString: string
): Promise<TCACryptoKeyPairs | Error> => {
  if (
    typeof keyPairsString !== 'string' ||
    keyPairsString.length < CA_CRYPTO_KEY_PAIRS_STRINGIFIED_MIN_LENGTH
  ) {
    return new Error('This is a wrong type of exported crypto keys');
  }

  let parsedKeyPairsObject;

  try {
    parsedKeyPairsObject = JSON.parse(keyPairsString);
  } catch (err) {
    return err;
  }
  if (!caValidateCryptoKeyPairExportedObject(parsedKeyPairsObject)) {
    return new Error('There is a wrong format of a key pairs exported');
  }

  const {
    [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: encryptionKeyPairString,
    [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: signDataKeyPairString,
  } = parsedKeyPairsObject;
  const [encryptionKeyPair, dataSignKeyPair] = await Promise.all([
    importKeyPairDataEncryptionFromString(encryptionKeyPairString),
    importKeyPairDataSignFromString(signDataKeyPairString),
  ]);

  if (encryptionKeyPair instanceof Error) {
    return encryptionKeyPair;
  }
  if (dataSignKeyPair instanceof Error) {
    return dataSignKeyPair;
  }
  return {
    [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: encryptionKeyPair,
    [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: dataSignKeyPair,
  };
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
