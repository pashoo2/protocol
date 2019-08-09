import { importKeyPairFromString as importKeyPairDataEncryptionFromString } from 'utils/encryption-utils';
import { importKeyPairFromString as importKeyPairDataSignFromString } from 'utils/data-sign-utils';
import { TCACryptoKeyPairs } from '../../central-authority-class-types/central-authority-class-types';
import {
  CA_CRYPTO_KEY_PAIRS_STRINGIFIED_MIN_LENGTH,
  CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME,
  CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME,
} from './central-authority-util-crypto-keys.const';
import { caValidateCryptoKeyPairExportedObject } from '../../central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';

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
