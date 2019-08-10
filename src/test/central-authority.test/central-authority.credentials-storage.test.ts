import { generateKeyPairs } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';
import { runTestForKeyPairs } from './central-aurhority.keys.common.test';
import { CentralAuthorityCredentialsStorage } from 'classes/central-authority-class/central-authority-storage/central-authority-storage-credentials/central-authority-storage-credentials';

export const runTestsCredentialsStorage = async () => {
  const cryptoKeyPairsGenerated = await generateKeyPairs();

  console.warn('Run tests for credentials storage keys generated');
  const result = await runTestForKeyPairs(cryptoKeyPairsGenerated);

  if (result !== true) {
    console.warn('Failed tests for credentials storage keys generated');
    return;
  }

  const cryptoCredentials = new CentralAuthorityCredentialsStorage();
  const storageAuthCredentials = {
    password: '123',
  };

  console.warn(
    'Success result in the tests for credentials storage keys generated'
  );
};
