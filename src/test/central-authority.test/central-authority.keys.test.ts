import { generateKeyPairs } from 'classes/central-authority-class/central-authority-utils/central-authority-util-crypto-keys/central-authority-util-crypto-keys-generate';
import {
  getPublicKeysFromCryptoKeyPairs,
  checkIsCryptoKeyPairs,
  exportKeyPairsAsString,
  importKeyPairsFromString,
  CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME,
} from 'classes/central-authority-class/central-authority-utils/central-authority-util-crypto-keys/central-authority-util-crypto-keys';
import {
  encryptNative,
  decryptNative,
} from 'utils/encryption-utils/encryption-utils';
import { decode, encode } from 'base64-arraybuffer';
import { TCACryptoKeyPairs } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';

export const runTestEncryptData = async (
  keyPairs: TCACryptoKeyPairs
): Promise<undefined | true> => {
  const dataToEncode = 'data to encode';
  const {
    [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: encryptionKeyPair,
  } = keyPairs;
  const encryptedData = await encryptNative(
    encryptionKeyPair.publicKey,
    decode(btoa(dataToEncode))
  );

  if (encryptedData instanceof Error) {
    console.error('Cant encrypt data with the key pair generated');
    console.error(encryptedData);
    return;
  }

  const decryptedData = await decryptNative(
    encryptionKeyPair.privateKey,
    decode(encode(encryptedData))
  );

  if (decryptedData instanceof Error) {
    console.error('Cant decrypt data encrypted with a generated key pairs');
    console.error(decryptedData);
    return;
  }

  const decryptedString = atob(encode(decryptedData));

  if (decryptedString !== dataToEncode) {
    console.error(
      `Decrypted data is invalid. Expected: ${dataToEncode}, but ${decryptedString} was received`
    );
    return;
  }
  return true;
};

export const runTestKeys = async () => {
  console.warn('Central authority keys tests start');

  const keyPairs = await generateKeyPairs();

  if (keyPairs instanceof Error) {
    console.error('Cant generate a crypto key pair');
    console.error(keyPairs);
    return keyPairs;
  }

  if ((await runTestEncryptData(keyPairs)) !== true) {
    return;
  }

  const exportedKeyPairs = await exportKeyPairsAsString(keyPairs);

  if (exportedKeyPairs instanceof Error) {
    console.error('failed to export the key pair');
    console.error(exportedKeyPairs);
    return exportedKeyPairs;
  }
  if (typeof exportedKeyPairs !== 'string') {
    console.error('exportedKeyPairs does not exported in a string format');
    return;
  }

  const importedKeyPairs = await importKeyPairsFromString(exportedKeyPairs);

  if (importedKeyPairs instanceof Error) {
    console.error('Failed to import key pairs from string');
    return;
  }
  console.log('run tests for the imported from the exported string key pairs');
  if ((await runTestEncryptData(importedKeyPairs)) !== true) {
    console.error(
      'failed tests for the imported from the exported string key pairs'
    );
    return;
  }
  console.log(
    'run tests for the imported from the exported string key pairs: use public key from the imported key pairs and the private key from the originally generated key pairs'
  );
  if (
    (await runTestEncryptData({
      ...importedKeyPairs,
      [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: {
        ...importedKeyPairs[CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME],
        privateKey:
          keyPairs[CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME].privateKey,
      },
    })) !== true
  ) {
    console.error(
      'failed tests for the imported from the exported string key pairs: use public key from the imported key pairs and the private key from the originally generated key pairs'
    );
    return;
  }
  console.log(
    'run tests for the imported from the exported string key pairs: use private key from the imported key pairs and the public key from the originally generated key pairs'
  );
  if (
    (await runTestEncryptData({
      ...importedKeyPairs,
      [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: {
        ...importedKeyPairs[CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME],
        publicKey:
          keyPairs[CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME].publicKey,
      },
    })) !== true
  ) {
    console.log(
      'failed tests for the imported from the exported string key pairs: use private key from the imported key pairs and the public key from the originally generated key pairs'
    );
    return;
  }
  // TODO - do the same tests for a sign keys

  const publicKeys = getPublicKeysFromCryptoKeyPairs(keyPairs);

  if (publicKeys instanceof Error) {
    console.error('Cant get public keys from crypto key pairs');
    console.error(publicKeys);
    return publicKeys;
  }
  console.warn('Central authority keys tests are succeed');
};
