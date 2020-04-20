import {
  exportKeyPairAsString as exportKeyPairDataEncryptAsString,
  exportKeyAsString as exportPublicKeyDataEncryptAsString,
} from 'utils/encryption-utils';
import {
  dataSignExportKeyPairAsString as exportKeyPairDataSignAsString,
  dataSignExportKeyAsString as exportPublicKeyDataSignAsString,
} from 'utils/data-sign-utils';
import {
  TCACryptoKeyPairs,
  TCACryptoPubilicKeys,
} from '../../central-authority-class-types/central-authority-class-types';
import {
  CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME,
  CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME,
  CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME,
  CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME,
} from './central-authority-util-crypto-keys.const';
import {
  checkIsCryptoKeyPairs,
  getPublicKeysFromCryptoKeyPairs,
} from './central-authority-util-crypto-keys-common';
import { compressString } from 'utils/data-compression-utils/data-compression-utils-strings';
import { stringify } from 'utils/main-utils';

/**
 * export two key pairs
 * (data sign and data encryption)
 * as a one string
 * @param {object} cryptoKeyPairs
 * @returns {Promise<string | Error>}
 */
export const exportKeyPairsAsString = async (
  cryptoKeyPairs: TCACryptoKeyPairs,
  password?: string
): Promise<string | Error> => {
  if (!checkIsCryptoKeyPairs(cryptoKeyPairs)) {
    return new Error('The keypair is not valid');
  }

  const {
    [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: encryptionKeyPair,
    [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: signDataKeyPair,
  } = cryptoKeyPairs;
  const [encryptionKeyPairString, signDataKeyPairString] = await Promise.all([
    exportKeyPairDataEncryptAsString(encryptionKeyPair, password),
    exportKeyPairDataSignAsString(signDataKeyPair, password),
  ]);
  debugger;
  if (encryptionKeyPairString instanceof Error) {
    return encryptionKeyPairString;
  }
  if (signDataKeyPairString instanceof Error) {
    return signDataKeyPairString;
  }
  try {
    const stringifyResult = stringify({
      [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: encryptionKeyPairString,
      [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: signDataKeyPairString,
    });
    debugger;
    if (stringifyResult instanceof Error) {
      return stringifyResult;
    }
    return compressString(stringifyResult);
  } catch (err) {
    return err;
  }
};

/**
 * export a public keys only
 * from a keyPairs as a string
 * @param {object} keyPairs
 * @returns {string | Error}
 */
export const exportPublicKeysAsString = async (
  keyPairs: TCACryptoKeyPairs
): Promise<string | Error> => {
  const publicKeys = getPublicKeysFromCryptoKeyPairs(keyPairs);

  if (publicKeys instanceof Error) {
    return publicKeys;
  }
  const {
    [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME]: encryptionPublicKey,
    [CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME]: signPublicKey,
  } = publicKeys;

  const [
    encryptionPublicKeyExported,
    signPublicKeyExported,
  ] = await Promise.all([
    exportPublicKeyDataEncryptAsString(encryptionPublicKey),
    exportPublicKeyDataSignAsString(signPublicKey),
  ]);

  if (encryptionPublicKeyExported instanceof Error) {
    console.error('export of the encryptionPublicKey was failed');
    return encryptionPublicKeyExported;
  }
  if (signPublicKeyExported instanceof Error) {
    console.error('export of the signPublicKeyExported was failed');
    return signPublicKeyExported;
  }
  try {
    return stringify({
      [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME]: encryptionPublicKeyExported,
      [CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME]: signPublicKeyExported,
    });
  } catch (err) {
    return err;
  }
};
