import { CentralAuthorityIdentityCredentialsStorage } from 'classes/central-authority-class/central-authority-storage/central-authority-storage-identity-credentials/central-authority-storage-identity-credentials';
import { TSecretStoreCredentials } from 'classes/secret-storage-class/secret-storage-class.types';
import {
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
} from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import { generateUUID } from 'utils/identity-utils/identity-utils';
import CentralAuthorityIdentity from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import { generateKeyPairs } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';

export const runCACredentialsIdentityStorageTest = async () => {
  const conectionCredentials: TSecretStoreCredentials = {
    password: '11234',
  };
  const storageInstance = new CentralAuthorityIdentityCredentialsStorage();
  const connectionResult = await storageInstance.connect(conectionCredentials);

  if (connectionResult instanceof Error) {
    console.error(connectionResult);
    console.error(new Error('Failed to connect to the storage'));
    return;
  }

  const testIdentityDescription = {
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'https://google.com',
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: generateUUID(),
  };
  const caIdentityValueTest = new CentralAuthorityIdentity(
    testIdentityDescription
  );
  const identityTest = caIdentityValueTest.toString();

  debugger;
  if (!identityTest) {
    console.error(identityTest);
    console.error('Failed to generate test identity string');
    return;
  }

  const testKeyPairs = await generateKeyPairs();

  if (testKeyPairs instanceof Error) {
    console.error(testKeyPairs);
    console.error('Failed to generate key Pairs');
    return;
  }
};
