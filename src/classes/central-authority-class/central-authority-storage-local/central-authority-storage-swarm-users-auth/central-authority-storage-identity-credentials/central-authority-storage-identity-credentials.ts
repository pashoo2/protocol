import { getStatusClass } from 'classes/basic-classes/status-class-base/status-class-base';
import {
  CA_IDENTITY_CREDENTIALS_STORAGE_STATUS,
  CA_IDENTITY_CREDENTIALS_STORAGE_CONFIGURATION,
  CA_IDENTITY_CREDENTIALS_STORAGE_READ_CACHE_CAPACITY,
  CA_IDENTITY_CREDENTIALS_STORAGE_READ_RAW_CACHE_CAPACITY,
} from './central-authority-storage-identity-credentials.const';
import { ICAIdentityCredentialsStorage } from './central-authority-identity-storage.types';
import { SecretStorage } from 'classes/secret-storage-class/secret-storage-class';
import {
  ISecretStoreCredentials,
  ISecretStorage,
} from 'classes/secret-storage-class/secret-storage-class.types';
import {
  TCentralAuthorityUserIdentity,
  TCACryptoKeyPairs,
  TCentralAuthorityUserCryptoCredentials,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import CentralAuthorityIdentity from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import {
  getExportedCryptoCredentialsByCAIdentity,
  replaceCryptoCredentialsIdentity,
  importCryptoCredentialsFromAString,
  getUserIdentityByCryptoCredentials,
  getCryptoKeyPairsByCryptoCredentials,
} from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import { dataCachingUtilsCachingDecorator as caching } from 'utils/data-cache-utils/data-cache-utils';
import {
  checkIsValidExportedCryptoCredentialsToString,
  checkIsValidCryptoCredentials,
} from 'classes/central-authority-class/central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';

/**
 * This is the storage for the user
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
    storageCredentials?: ISecretStoreCredentials
  ): Promise<boolean | Error> {
    const connection = this.createConnectionToSecretStorage();

    if (connection instanceof Error) {
      console.error(connection);
      return this.setErrorStatus(
        'Failed to create an instance of SecretStorage'
      );
    }
    this.setStatus(CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.CONNECTING);

    let connectionResult;

    if (storageCredentials) {
      connectionResult = await connection.authorize(storageCredentials);
    } else {
      connectionResult = await connection.connect();
    }

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

  protected getKeyNameWithPrefix(key: string): string {
    return `__CA_IDENTITY_CREDENTIALS_STORAGE_FULL_NAME___${key}`;
  }

  @caching(CA_IDENTITY_CREDENTIALS_STORAGE_READ_RAW_CACHE_CAPACITY)
  protected async getCredentialsRaw(
    identity: string
  ): Promise<string | Error | undefined> {
    const { isActive } = this;

    if (!isActive) {
      return new Error('The storage is not active');
    }
    try {
      const { secretStorageConnection } = this;
      const caCryptoCredentials = await secretStorageConnection!!.get(
        this.getKeyNameWithPrefix(identity)
      );

      if (caCryptoCredentials instanceof Error) {
        console.error(caCryptoCredentials);
        return new Error('Failed to read credentials from the storage');
      }
      if (!caCryptoCredentials) {
        return undefined;
      }
      return caCryptoCredentials;
    } catch (err) {
      console.error(err);
      return new Error(
        'Failed to read a credentials for identity from the storage'
      );
    }
    return undefined;
  }

  protected setCredentialsByIdentity = async (
    identity: TCentralAuthorityUserIdentity,
    cryptoKeyPairs: TCACryptoKeyPairs
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
        cryptoKeyPairs
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

      const credentialsStoredForIdentity = await this.getCredentialsRaw(id);

      // if a credentials was already
      // stored for the identity
      // do not modify it.
      // Cause it's value
      // must be immutable
      if (
        credentialsStoredForIdentity &&
        !(credentialsStoredForIdentity instanceof Error)
      ) {
        return false;
      }

      // if the given values are valid
      // then can put it to the storage
      // connected to
      const { secretStorageConnection } = this;

      return secretStorageConnection!!.set(
        this.getKeyNameWithPrefix(id),
        cryptoCredentialsExported
      );
    } catch (err) {
      console.error(err);
      return new Error('Failed to store the credentials');
    }
    return true;
  };

  protected async setCredentialsByCACryptoCredentials(
    caCryptoCredentials: TCentralAuthorityUserCryptoCredentials
  ): Promise<boolean | Error> {
    const identity = getUserIdentityByCryptoCredentials(caCryptoCredentials);

    if (identity instanceof Error) {
      console.error(identity);
      return new Error(
        'The user identity is not valid or have an unknown format'
      );
    }

    const cryptoKeyPairs = getCryptoKeyPairsByCryptoCredentials(
      caCryptoCredentials
    );

    if (cryptoKeyPairs instanceof Error) {
      console.error(cryptoKeyPairs);
      return new Error(
        'The crypto key pairs are not valid or have an unknown format'
      );
    }

    return this.setCredentialsByIdentity(identity, cryptoKeyPairs);
  }

  protected async setCredentialsByCACryptoCredentialsExportedToString(
    caCryptoCredentialsExportedToString: string
  ): Promise<boolean | Error> {
    const cryptoCredentials = await importCryptoCredentialsFromAString(
      caCryptoCredentialsExportedToString
    );

    if (cryptoCredentials instanceof Error) {
      console.error(cryptoCredentials);
      return new Error('Failed to import crypto credentials from the string');
    }
    return this.setCredentialsByCACryptoCredentials(cryptoCredentials);
  }

  public async setCredentials(...args: any[]): Promise<boolean | Error> {
    const argsLenght = args.length;

    if (argsLenght === 2) {
      return this.setCredentialsByIdentity(args[0], args[1]);
    } else if (argsLenght === 1) {
      const caCryptoCredentials = args[0];

      if (checkIsValidExportedCryptoCredentialsToString(caCryptoCredentials)) {
        return this.setCredentialsByCACryptoCredentialsExportedToString(
          caCryptoCredentials
        );
      } else if (checkIsValidCryptoCredentials(caCryptoCredentials)) {
        return this.setCredentialsByCACryptoCredentials(caCryptoCredentials);
      }
    }
    return new Error('An unknown arguments');
  }

  @caching(CA_IDENTITY_CREDENTIALS_STORAGE_READ_CACHE_CAPACITY)
  protected async getCredentialsCached(
    identity: TCentralAuthorityUserIdentity
  ): Promise<TCentralAuthorityUserCryptoCredentials | Error | null> {
    try {
      // parse the identity
      const caIdentity = new CentralAuthorityIdentity(identity);
      const { isValid, id } = caIdentity;

      if (!isValid) {
        return new Error('The identity is not valid');
      }
      if (id instanceof Error) {
        return new Error('Failed to parse the identity and get id');
      }

      const caCryptoCredentials = await this.getCredentialsRaw(id);

      if (caCryptoCredentials instanceof Error) {
        console.error(caCryptoCredentials);
        return new Error('Failed to read credentials from the storage');
      }
      if (!caCryptoCredentials) {
        return null;
      }

      const importedCryptoCredentials = await importCryptoCredentialsFromAString(
        caCryptoCredentials
      );

      if (importedCryptoCredentials instanceof Error) {
        console.error(importedCryptoCredentials);
        return new Error('Failed to import the value read');
      }

      // replace the existing value
      // of the user identity
      // by a requested value.
      // Because the stored identity
      // version may be different
      // from the requested. It may
      // cause an unexpected issues
      const resultedValue = replaceCryptoCredentialsIdentity(
        importedCryptoCredentials,
        identity
      );

      if (resultedValue instanceof Error) {
        console.error(resultedValue);
        return new Error(
          'Failed to replace the identity in the credentials read from the storage'
        );
      }
      return resultedValue;
    } catch (err) {
      console.error(err);
      return new Error(
        'Failed to read a credentials for identity from the storage'
      );
    }
  }

  public async getCredentials(
    identity: TCentralAuthorityUserIdentity
  ): Promise<TCentralAuthorityUserCryptoCredentials | Error | null> {
    const { isActive } = this;

    if (!isActive) {
      return new Error('The storage is not active');
    }
    return this.getCredentialsCached(identity);
  }
}
