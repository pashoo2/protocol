import { generateKeyPairs } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';
import { runTestForKeyPairs } from './central-aurhority.keys.common.test';
import {
  CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME,
  CA_AUTH_CREDENTIALS_USER_PASSWORD_PROP_NAME,
} from 'classes/central-authority-class/central-authority-class-const/central-authority-class-const';
import { generateUUID } from 'utils/identity-utils/identity-utils';
import { CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_CRYPTO_KEYS_KEY_NAME } from 'classes/central-authority-class/central-authority-storage-local/central-authority-storage-current-user-auth/central-authority-storage-credentials/central-authority-storage-credentials.const';
import { CentralAuthorityCredentialsStorage } from 'classes/central-authority-class/central-authority-storage-local/central-authority-storage-current-user-auth/central-authority-storage-credentials/central-authority-storage-credentials';

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

  const credentials = await cryptoCredentialsStorage.getUserCryptoInfo();

  if (credentials instanceof Error) {
    console.error(credentials);
    console.error('Failed to reade a credentials read from the new instance');
    return;
  }
  if (credentials !== null) {
    console.error('The credentials read from the new instance must be null');
    return;
  }

  const credentialsSetResult = await cryptoCredentialsStorage.setUserCryptoInfo(
    cryptoKeyPairsGenerated
  );

  if (credentialsSetResult instanceof Error) {
    console.error(credentialsSetResult);
    console.error('Failed to set the credentials');
    return;
  }

  const credentialsCached = await cryptoCredentialsStorage.getUserCryptoInfo();

  if (credentialsCached instanceof Error) {
    console.error(credentialsCached);
    console.error('Failed to read a credentials stored');
    return;
  }
  if (credentialsCached === null) {
    console.error('The credentials stored are absent in the storage and cache');
    return;
  }

  const {
    [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeyPairsStored,
  } = credentialsCached;
  const resultTestCredentialsStored = await runTestForKeyPairs(
    cryptoKeyPairsStored
  );

  if (resultTestCredentialsStored !== true) {
    console.warn(
      'Failed tests for credentials storage keys read from stored values'
    );
    return;
  }

  const resultCryptoCredentialsStorageDisconnect = await cryptoCredentialsStorage.disconnect();

  if (resultCryptoCredentialsStorageDisconnect instanceof Error) {
    console.error(resultCryptoCredentialsStorageDisconnect);
    console.error(
      'Failed to disconnect the first instance of the resultCryptoCredentialsStorageDisconnect'
    );
    return;
  }

  const credentialsReadFromStorageDisconnected = await cryptoCredentialsStorage.getUserCryptoInfo();

  if (!(credentialsReadFromStorageDisconnected instanceof Error)) {
    console.error('Any read from the disconnected storage must cause an error');
    return;
  }

  const resultSetCredentialsReadFromStorageDisconnected = await cryptoCredentialsStorage.setUserCryptoInfo(
    cryptoKeyPairsGenerated
  );

  if (!(resultSetCredentialsReadFromStorageDisconnected instanceof Error)) {
    console.error(
      'Any write from the disconnected storage must cause an error'
    );
    return;
  }
  /**
   * create a new instance
   * to check if it works
   * and can to read a stored
   * piveousely crypto credentials.
   * Connect with the credentials
   * exactly same as used
   * for the first connection
   */

  const cryptoCredentialsStorageSecondInstance = new CentralAuthorityCredentialsStorage();
  const connectionResultSecondInstance = await cryptoCredentialsStorageSecondInstance.connect(
    storageAuthCredentials
  );

  if (connectionResultSecondInstance instanceof Error) {
    console.error(
      'Failed to connect to the secret storage with the second instance'
    );
    return;
  }

  const credentialsReadFromStorage = await cryptoCredentialsStorageSecondInstance.getUserCryptoInfo();

  if (credentialsReadFromStorage instanceof Error) {
    console.error(credentials);
    console.error('Failed to read a credentials read from the second instance');
    return;
  }
  if (credentialsReadFromStorage === null) {
    console.error('The credentials read by second instance must not be empty');
    return;
  }

  const {
    [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeyPairsStoredByTheFirstInstance,
  } = credentialsReadFromStorage;
  const resultTestCredentialsStoredByTheFirstInstance = await runTestForKeyPairs(
    cryptoKeyPairsStoredByTheFirstInstance
  );

  if (resultTestCredentialsStoredByTheFirstInstance !== true) {
    console.warn(
      'Failed tests for credentials storage keys read from stored values'
    );
    return;
  }
  console.warn('Succeed in the crypto credentials storage tests');
  return true;
};
