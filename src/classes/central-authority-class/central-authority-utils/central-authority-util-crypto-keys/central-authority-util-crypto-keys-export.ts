import { exportKeyPairAsString as exportKeyPairDataEncryptAsString } from 'utils/encryption-utils';
import { exportKeyPairAsString as exportKeyPairDataSignAsString } from 'utils/data-sign-utils';
import { TCACryptoKeyPairs } from '../../central-authority-class-types/central-authority-class-types';
import {
  CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME,
  CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME,
} from './central-authority-util-crypto-keys.const';
import { checkIsCryptoKeyPairs } from './central-authority-util-crypto-keys-common';

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
