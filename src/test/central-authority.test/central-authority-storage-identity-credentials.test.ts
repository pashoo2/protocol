import { CentralAuthorityIdentityCredentialsStorage } from 'classes/central-authority-class/central-authority-storage/central-authority-storage-identity-credentials/central-authority-storage-identity-credentials';
import { TSecretStoreCredentials } from 'classes/secret-storage-class/secret-storage-class.types';

export const runCACredentialsIdentityStorageTest = async () => {
  const conectionCredentials: TSecretStoreCredentials = {
    password: '11234',
  };
  const storageInstance = new CentralAuthorityIdentityCredentialsStorage();
  const connectionResult = await storageInstance.connect(conectionCredentials);
  debugger;
  if (connectionResult instanceof Error) {
    console.error(connectionResult);
    console.error(new Error('Failed to connect to the storage'));
    return;
  }
};
