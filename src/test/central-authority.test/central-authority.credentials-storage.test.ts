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

  if (cryptoKeyPairsGenerated instanceof Error) {
    console.error(cryptoKeyPairsGenerated);
    console.error('Failed to generate a new key pairs');
    return;
  }

  console.warn('Run tests for credentials storage keys generated');
  const result = await runTestForKeyPairs(cryptoKeyPairsGenerated);

  if (result !== true) {
    console.warn('Failed tests for credentials storage keys generated');
    return;
  }

  const cryptoCredentialsStorage = new CentralAuthorityCredentialsStorage();
  const storageAuthCredentials = {
    [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: generateUUID(),
    [CA_AUTH_CREDENTIALS_USER_PASSWORD_PROP_NAME]: 'password',
  };

  console.warn(
    'Success result in the tests for credentials storage keys generated'
  );
  const connectionResult = await cryptoCredentialsStorage.connect(
    storageAuthCredentials
  );

  if (connectionResult instanceof Error) {
    console.error('Failed to connect to the secret storage');
    return;
  }

  const credentials = await cryptoCredentialsStorage.getCredentials();

  if (credentials instanceof Error) {
    console.error(credentials);
    console.error('Failed to reade a credentials read from the new instance');
    return;
  }
  if (credentials !== null) {
    console.error('The credentials read from the new instance must be null');
    return;
  }

  const credentialsSetResult = await cryptoCredentialsStorage.setCredentials(
    cryptoKeyPairsGenerated
  );

  if (credentialsSetResult instanceof Error) {
    console.error(credentialsSetResult);
    console.error('Failed to set the credentials');
    return;
  }
  console.warn('Succeed in the crypto credentials storage tests');
};
