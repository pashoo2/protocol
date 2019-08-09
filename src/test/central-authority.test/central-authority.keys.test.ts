import { generateKeyPairs } from 'classes/central-authority-class/central-authority-utils/central-authority-util-crypto-keys/central-authority-util-crypto-keys-generate';
import {
  getPublicKeysFromCryptoKeyPairs,
  checkIsCryptoKeyPairs,
} from 'classes/central-authority-class/central-authority-utils/central-authority-util-crypto-keys/central-authority-util-crypto-keys';

export const runTestKeys = async () => {
  const keyPairs = await generateKeyPairs();

  if (keyPairs instanceof Error) {
    console.error('Cant generate a crypto key pair');
    console.error(keyPairs);
    return keyPairs;
  }
  if (checkIsCryptoKeyPairs(keyPairs)) {
    console.error('The wrong format of the key pairs');
    return;
  }
  const publicKeys = getPublicKeysFromCryptoKeyPairs(keyPairs);

  if (publicKeys instanceof Error) {
    console.error('Cant get public keys from crypto key pairs');
    console.error(publicKeys);
    return publicKeys;
  }

  const {};
};
