import { getStatusClass } from 'classes/basic-classes/status-class-base/status-class-base';
import {
  CA_IDENTITY_CREDENTIALS_STORAGE_STATUS,
  CA_IDENTITY_CREDENTIALS_STORAGE_CONFIGURATION,
  CA_IDENTITY_CREDENTIALS_STORAGE_READ_CACHE_CAPACITY,
} from './central-authority-storage-identity-credentials.const';
import { ICAIdentityCredentialsStorage } from './central-authority-identity-storage.types';
import { SecretStorage } from 'classes/secret-storage-class/secret-storage-class';
import {
  TSecretStoreCredentials,
  ISecretStorage,
} from 'classes/secret-storage-class/secret-storage-class.types';
import {
  TCentralAuthorityUserIdentity,
  TCACryptoKeyPairs,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import CentralAuthorityIdentity from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import {
  checkIsValidCryptoCredentials,
  exportCryptoCredentialsToString,
  getExportedCryptoCredentials,
  getExportedCryptoCredentialsByCAIdentity,
} from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import { dataCachingUtilsCachingDecorator as caching } from 'utils/data-cache-utils/data-cache-utils';

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
  protected secretStorageConnection?: ISecretStorage;

  protected createConnectionToSecretStorage(): SecretStorage | Error {
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

  public get isActive(): boolean {
    const { status, secretStorageConnection } = this;

    return (
      status === CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.CONNECTED &&
      !!secretStorageConnection &&
      secretStorageConnection.isActive
    );
  }

  /**
   * connect to the SecretStorage with
   * the user's credentials
   * @param storageCredentials
   */
  public async connect(
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

  public setCredentials = async (
    identity: TCentralAuthorityUserIdentity,
    cryptoCredentials: TCACryptoKeyPairs
  ): Promise<boolean | Error> => {
    const { isActive } = this;

    if (!isActive) {
      return new Error('The storage is not active');
    }

    try {
      // parse the identity
      const caIdentity = new CentralAuthorityIdentity(identity);
      const cryptoCredentialsExported = await getExportedCryptoCredentialsByCAIdentity(
        caIdentity,
        cryptoCredentials
      );

      if (cryptoCredentialsExported instanceof Error) {
        console.error(cryptoCredentialsExported);
        return new Error('Failed to export the credentials to a string');
      }

      const { id } = caIdentity;
      /**
       * id - is the unique identity
       * for the user throughout
       * the application.
       * Wich is uniquely identifies
       * the user with the
       * identity. Use it as a key
       * to store the credentials
       * */
      if (id instanceof Error) {
        return new Error(
          'The identity value is wrong or have an unknown format'
        );
      }

      // if the given values are valid
      // then can put it to the storage
      // connected to
      const { secretStorageConnection } = this;

      return secretStorageConnection!!.set(id, cryptoCredentialsExported);
    } catch (err) {
      console.error(err);
      return new Error('Failed to store the credentials');
    }
    return true;
  };

  @caching(CA_IDENTITY_CREDENTIALS_STORAGE_READ_CACHE_CAPACITY)
  public async getCredentials(
    identity: TCentralAuthorityUserIdentity
  ): Promise<TCACryptoKeyPairs | Error | null> {
    return null;
  }
}

// TODO - add class for key - value data caching
