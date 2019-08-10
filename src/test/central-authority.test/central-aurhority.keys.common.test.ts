import { signToString, verifyFromString } from 'utils/data-sign-utils';
import { generateKeyPairs } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys-generate';
import {
  getPublicKeysFromCryptoKeyPairs,
  checkIsCryptoKeyPairs,
  exportKeyPairsAsString,
  importKeyPairsFromString,
  CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME,
  CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME,
  CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME,
  CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME,
} from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';
import {
  encryptNative,
  decryptNative,
} from 'utils/encryption-utils/encryption-utils';
import { decode, encode } from 'base64-arraybuffer';
import {
  TCACryptoKeyPairs,
  TCACryptoPubilicKeys,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';

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

export const runTestDataSign = async (
  keyPairs: TCACryptoKeyPairs
): Promise<undefined | boolean> => {
  const dataToSign = {
    hello: 'test hello',
  };
  const { [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: signKeyPair } = keyPairs;
  const signString = await signToString(signKeyPair, dataToSign);

  if (signString instanceof Error) {
    console.error('Failed to sign the string');
    console.error(signString);
    return;
  }
  if (typeof signString !== 'string') {
    console.error('Failed to sign the data as a string');
    return;
  }

  const verifyDataResult = await verifyFromString(
    signKeyPair,
    dataToSign,
    signString
  );

  if (verifyDataResult instanceof Error) {
    console.error('Failed to verify the data signed');
    console.error(verifyDataResult);
    return;
  }
  if (verifyDataResult !== true) {
    console.error('The wrong result was given by the verifyFromString');
    console.error(verifyDataResult);
    return;
  }

  const wrongDataVerifyResult = await verifyFromString(
    signKeyPair,
    'Wrong data',
    signString
  );

  if (wrongDataVerifyResult instanceof Error) {
    console.error('Failed to verify a non original string data');
    console.error(wrongDataVerifyResult);
    return;
  }
  if (wrongDataVerifyResult !== false) {
    console.error('The wrong result of non origin string verification');
    return;
  }
  return true;
};

export const runTestForKeyPairs = async (
  keyPairs: any
): Promise<undefined | boolean> => {
  if (keyPairs instanceof Error) {
    console.error('Cant generate a crypto key pair');
    console.error(keyPairs);
    return;
  }

  if ((await runTestEncryptData(keyPairs)) !== true) {
    return;
  }
  if ((await runTestDataSign(keyPairs)) !== true) {
    return;
  }

  const exportedKeyPairs = await exportKeyPairsAsString(keyPairs);

  if (exportedKeyPairs instanceof Error) {
    console.error('failed to export the key pair');
    console.error(exportedKeyPairs);
    return;
  }
  if (typeof exportedKeyPairs !== 'string') {
    console.error('exportedKeyPairs does not exported in a string format');
    return;
  }

  const importedKeyPairs = await importKeyPairsFromString(exportedKeyPairs);

  if (!checkIsCryptoKeyPairs(importedKeyPairs)) {
    console.error('A wrong format of the imported key pairs');
    return;
  }
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
    'run tests for the imported from the exported string key pairs fot data sign'
  );
  if ((await runTestDataSign(keyPairs)) !== true) {
    console.error(
      'failed tests for the imported from the exported string key pairs fot data sign'
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
  /** data sign test-- */
  console.log(
    'run tests data sign for the imported from the exported string key pairs: use private key from the imported key pairs and the private key from the originally generated key pairs'
  );
  if (
    (await runTestDataSign({
      ...importedKeyPairs,
      [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: {
        ...importedKeyPairs[CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME],
        privateKey: keyPairs[CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME].privateKey,
      },
    })) !== true
  ) {
    console.error(
      'failed tests data sign for the imported from the exported string key pairs: use private key from the imported key pairs and the private key from the originally generated key pairs'
    );
    return;
  }
  /** --data sign test */
  console.log(
    'run tests encrypt for the imported from the exported string key pairs: use private key from the imported key pairs and the public key from the originally generated key pairs'
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
  /** data sign test-- */
  console.log(
    'run tests data sign for the imported from the exported string key pairs: use public key from the imported key pairs and the private key from the originally generated key pairs'
  );
  if (
    (await runTestDataSign({
      ...importedKeyPairs,
      [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: {
        ...importedKeyPairs[CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME],
        publicKey: keyPairs[CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME].publicKey,
      },
    })) !== true
  ) {
    console.error(
      'failed tests data sign for the imported from the exported string key pairs: use public key from the imported key pairs and the private key from the originally generated key pairs'
    );
    return;
  }
  console.log(
    'run tests data sign for the imported from the exported string key pairs: use private key from the imported key pairs and the public key from the originally generated key pairs'
  );
  /** --data sign test */

  const publicKeys = getPublicKeysFromCryptoKeyPairs(keyPairs);

  if (publicKeys instanceof Error) {
    console.error('Cant get public keys from crypto key pairs');
    console.error(publicKeys);
    return;
  }

  console.log(
    'run tests public keys encrypt for the imported from the exported string key pairs: use private key from the imported key pairs and the public key from the originally generated key pairs'
  );
  if (
    (await runTestEncryptData({
      ...importedKeyPairs,
      [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: {
        ...importedKeyPairs[CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME],
        publicKey: (publicKeys as TCACryptoPubilicKeys)[
          CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME
        ],
      },
    })) !== true
  ) {
    console.log(
      'failed tests public keys for the imported from the exported string key pairs: use private key from the imported key pairs and the public key from the originally generated key pairs'
    );
    return;
  }
  /** data sign test-- */
  console.log(
    'run tests public keys data sign for the imported from the exported string key pairs: use public key from the imported key pairs and the private key from the originally generated key pairs'
  );
  if (
    (await runTestDataSign({
      ...importedKeyPairs,
      [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: {
        ...importedKeyPairs[CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME],
        publicKey: (publicKeys as TCACryptoPubilicKeys)[
          CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME
        ],
      },
    })) !== true
  ) {
    console.error(
      'failed tests public keys data sign for the imported from the exported string key pairs: use public key from the imported key pairs and the private key from the originally generated key pairs'
    );
    return;
  }
  console.log(
    'run tests public keys data sign for the imported from the exported string key pairs: use private key from the imported key pairs and the public key from the originally generated key pairs'
  );
  /** --data sign test */

  console.warn('Central authority keys tests are succeed');
  return true;
};
