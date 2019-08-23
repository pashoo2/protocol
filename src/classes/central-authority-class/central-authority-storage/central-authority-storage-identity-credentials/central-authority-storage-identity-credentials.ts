import { getStatusClass } from 'classes/basic-classes/status-class-base/status-class-base';
import {
  CA_IDENTITY_CREDENTIALS_STORAGE_STATUS,
  CA_IDENTITY_CREDENTIALS_STORAGE_CONFIGURATION,
} from './central-authority-storage-identity-credentials.const';
import { ICAIdentityCredentialsStorage } from './central-authority-identity-storage.types';
import { SecretStorage } from 'classes/secret-storage-class/secret-storage-class';
import { TSecretStoreCredentials } from 'classes/secret-storage-class/secret-storage-class.types';
import { threadId } from 'worker_threads';
import {
  TCentralAuthorityUserIdentity,
  TCACryptoKeyPairs,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import CentralAuthorityIdentity from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import { checkIsValidCryptoCredentials } from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';

/**
 * this is the storage for the user
 * identifier and a public keys for
 * data sign and encryption
 */

export class CentralAuthorityIdentityCredentialsStorage
  extends getStatusClass<typeof CA_IDENTITY_CREDENTIALS_STORAGE_STATUS>({
    errorStatus: CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.ERROR,
    initialStatus: CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.NEW,
    instanceName: 'CentralAuthorityIdentityCredentialsStorage',
  })
  implements ICAIdentityCredentialsStorage {
  protected secretStorageConnection?: SecretStorage;

  createConnectionToSecretStorage(): SecretStorage | Error {
    try {
      const connection = new SecretStorage(
        CA_IDENTITY_CREDENTIALS_STORAGE_CONFIGURATION
      );

      return connection;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  /**
   * connect to the SecretStorage with
   * the user's credentials
   * @param storageCredentials
   */
  async connect(
    storageCredentials: TSecretStoreCredentials
  ): Promise<boolean | Error> {
    const connection = this.createConnectionToSecretStorage();

    if (connection instanceof Error) {
      console.error(connection);
      return this.setErrorStatus(
        'Failed to create an instance of SecretStorage'
      );
    }
    this.setStatus(CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.CONNECTING);

    const connectionResult = await connection.authorize(storageCredentials);

    if (connectionResult instanceof Error) {
      console.error(connectionResult);
      this.setStatus(CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.CONNECTION_FAILED);
      return new Error('Failed to authorize');
    }
    this.setStatus(CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.CONNECTED);
    this.secretStorageConnection = connection;
    return true;
  }

  public async disconnect(): Promise<Error | boolean> {
    const { status, secretStorageConnection } = this;

    if (status === CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.DISCONNECTED) {
      console.error(
        new Error('The instance is already disconnected from the storage')
      );
      // return false cause already disconnected
      return false;
    }
    if (
      status !== CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.CONNECTED ||
      status === CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.ERROR
    ) {
      return this.setErrorStatus(
        new Error(
          "Can't disconnect cause the instance is not in the Connected state"
        )
      );
    }
    if (!(secretStorageConnection instanceof SecretStorage)) {
      return this.setErrorStatus('There is no connection to the SecretStorage');
    }

    const disconnectionResult = await secretStorageConnection.disconnect();

    if (disconnectionResult instanceof Error) {
      console.error(disconnectionResult);
      return this.setErrorStatus('SecretStorage failed to disconnect');
    }
    this.setStatus(CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.DISCONNECTED);
    return true;
  }

  async setCredentials(
    identity: TCentralAuthorityUserIdentity,
    cryptoCredentials: TCACryptoKeyPairs
  ): Promise<boolean | Error> {
    try {
      const caIdentity = new CentralAuthorityIdentity(identity);
      const { id } = caIdentity;

      if (id instanceof Error) {
        return new Error(
          'The identity value is wrong or have an unknown format'
        );
      }
      if (!checkIsValidCryptoCredentials(cryptoCredentials)) {
        return new Error('The given value is not a valid crypto credentials');
      }
    } catch (err) {
      console.error(err);
      return new Error('Failed to  store the credentials');
    }
    // TODO implement the set method
    return true;
  }

  async getCredentials(
    identity: TCentralAuthorityUserIdentity
  ): Promise<TCACryptoKeyPairs | Error | null> {
    return null;
  }
}

// TODO - add class for key - value data caching
