import { generateKeyPairs } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';
import { runTestForKeyPairs } from './central-aurhority.keys.common.test';
import { CentralAuthorityCredentialsStorage } from 'classes/central-authority-class/central-authority-storage/central-authority-storage-credentials/central-authority-storage-credentials';
import {
  CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME,
  CA_AUTH_CREDENTIALS_USER_PASSWORD_PROP_NAME,
} from 'classes/central-authority-class/central-authority-class-const/central-authority-class-const';
import { generateUUID } from 'utils/identity-utils/identity-utils';

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
    [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: generateUUID(),
    [CA_AUTH_CREDENTIALS_USER_PASSWORD_PROP_NAME]: 'password',
  };

  console.warn(
    'Success result in the tests for credentials storage keys generated'
  );
  const connectionResult = await cryptoCredentials.connect(
    storageAuthCredentials
  );

  if (connectionResult instanceof Error) {
    console.error('Failed to connect to the secret storage');
    return;
  }
  console.warn('Succeed in the crypto credentials storage tests');
};
