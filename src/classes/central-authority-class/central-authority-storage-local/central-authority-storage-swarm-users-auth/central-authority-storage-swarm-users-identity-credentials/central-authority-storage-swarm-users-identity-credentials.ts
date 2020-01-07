import { OpenStorage } from './../../../../open-storage/open-storage';
import { getStatusClass } from 'classes/basic-classes/status-class-base/status-class-base';
import {
  CA_IDENTITY_CREDENTIALS_STORAGE_STATUS,
  CA_IDENTITY_CREDENTIALS_STORAGE_CONFIGURATION,
  CA_IDENTITY_CREDENTIALS_STORAGE_READ_CACHE_CAPACITY,
  CA_IDENTITY_CREDENTIALS_STORAGE_READ_RAW_CACHE_CAPACITY,
} from './central-authority-storage-swarm-users-identity-credentials.const';
import { ICAIdentityCredentialsStorage } from './central-authority-storage-swarm-users-identity-credentials.types';
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
 * This is storage to cache swarm users credentials locally.
 * To do not request it each time from the auth provider.
 */
// TODO -use open storage instead of the SecretStorage
export class CentralAuthorityIdentityCredentialsStorage
  extends getStatusClass<typeof CA_IDENTITY_CREDENTIALS_STORAGE_STATUS>({
    errorStatus: CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.ERROR,
    initialStatus: CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.NEW,
    instanceName: 'CentralAuthorityIdentityCredentialsStorage',
  })
  implements ICAIdentityCredentialsStorage {
  protected storageConnection?: OpenStorage;

  protected createConnectionToStorage(): OpenStorage | Error {
    try {
      const connection = new OpenStorage();

      return connection;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  public get isActive(): boolean {
    const { status, storageConnection } = this;

    return (
      status === CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.CONNECTED &&
      !!storageConnection &&
      storageConnection.isActive
    );
  }

  /**
   * connect to the SecretStorage with
   * the user's credentials
   * @param storageCredentials
   */
  public async connect(): Promise<boolean | Error> {
    const connection = this.createConnectionToStorage();

    if (connection instanceof Error) {
      console.error(connection);
      return this.setErrorStatus(
        'Failed to create an instance of SecretStorage'
      );
    }
    this.setStatus(CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.CONNECTING);

    const connectionResult = await connection.connect(
      CA_IDENTITY_CREDENTIALS_STORAGE_CONFIGURATION
    );

    if (connectionResult instanceof Error) {
      console.error(connectionResult);
      this.setStatus(CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.CONNECTION_FAILED);
      return new Error('Failed to authorize');
    }
    this.setStatus(CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.CONNECTED);
    this.storageConnection = connection;
    return true;
  }

  /**
   * get credentials stored for the identity
   * in the local storage
   *
   * @param {TCentralAuthorityUserIdentity} identity
   * @returns {(Promise<TCentralAuthorityUserCryptoCredentials | Error | null>)}
   * @memberof CentralAuthorityIdentityCredentialsStorage
   */
  public async getCredentials(
    identity: TCentralAuthorityUserIdentity
  ): Promise<TCentralAuthorityUserCryptoCredentials | Error | null> {
    const { isActive } = this;

    if (!isActive) {
      return new Error('The storage is not active');
    }
    return this.getCredentialsCached(identity);
  }

  /**
   * set the credentials (identity + crypto keys)
   * in the local secret storage
   *
   * @param {[]} args
   * @param {string} args[0] - CAIdentity seriazlized
   * @param {TCACryptoKeyPairs} args[1] - crypto key pairs
   * @returns {(Promise<boolean | Error>)}
   * @memberof CentralAuthorityIdentityCredentialsStorage
   */
  /**
   * @param {...any[]} args
   * @param {string | } args[1] - Crypto credentials (CAIdentity + TACryptoKeyPairs) serialized or deserialized
   * @returns {(Promise<boolean | Error>)}
   * @memberof CentralAuthorityIdentityCredentialsStorage
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  /**
   * disconnect from the local secret storage
   *
   * @returns {(Promise<Error | boolean>)}
   * @memberof CentralAuthorityIdentityCredentialsStorage
   */
  public async disconnect(): Promise<Error | boolean> {
    const { status, storageConnection } = this;

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
    if (!(storageConnection instanceof OpenStorage)) {
      return this.setErrorStatus('There is no connection to the SecretStorage');
    }

    const disconnectionResult = await storageConnection.disconnect();

    if (disconnectionResult instanceof Error) {
      console.error(disconnectionResult);
      return this.setErrorStatus('SecretStorage failed to disconnect');
    }
    this.setStatus(CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.DISCONNECTED);
    return true;
  }

  protected getKeyNameWithPrefix(key: string): string {
    return `__CICS_${key}`;
  }

  /**
   * returns a string as a key under which the
   * identity will be stored in the key-value
   * storage.
   *
   * @protected
   * @param {CentralAuthorityIdentity} identity
   * @returns {(string | Error)}
   * @memberof CentralAuthorityIdentityCredentialsStorage
   */
  protected getStorageKeyByCAIdentity(
    identity: CentralAuthorityIdentity
  ): string | Error {
    if (!(identity instanceof CentralAuthorityIdentity)) {
      return new Error(
        'The argument must be an instance of CentralAuthorityIdentity'
      );
    }
    if (!identity.isValid) {
      return new Error('The CA identity is not valid');
    }

    const { id } = identity;

    // the id - is a unique string which identifies the user
    // in the swarm
    if (id instanceof Error) {
      console.error(id);
      return new Error('Failed to get the unique identifier of the user');
    }
    return this.getKeyNameWithPrefix(id);
  }

  @caching(CA_IDENTITY_CREDENTIALS_STORAGE_READ_RAW_CACHE_CAPACITY)
  protected async getCredentialsRaw(
    identityKey: string
  ): Promise<string | Error | undefined> {
    const { isActive, storageConnection } = this;

    if (!isActive || !storageConnection) {
      return new Error('The storage is not active');
    }
    try {
      const caCryptoCredentials = await storageConnection.get(identityKey);

      if (caCryptoCredentials instanceof Error) {
        console.error(caCryptoCredentials);
        return new Error('Failed to read credentials from the storage');
      }
      return caCryptoCredentials ? caCryptoCredentials : undefined;
    } catch (err) {
      console.error(err);
      return new Error(
        'Failed to read a credentials for identity from the storage'
      );
    }
  }

  protected setCredentialsByIdentity = async (
    identity: TCentralAuthorityUserIdentity,
    cryptoKeyPairs: TCACryptoKeyPairs
  ): Promise<boolean | Error> => {
    const { isActive, storageConnection } = this;
    if (!isActive || !storageConnection) {
      return new Error('The storage is not active');
    }
    try {
      // parse the identity
      const caIdentity = new CentralAuthorityIdentity(identity);
      const caIdentityStorageKey = this.getStorageKeyByCAIdentity(caIdentity);

      if (caIdentityStorageKey instanceof Error) {
        console.error(caIdentityStorageKey);
        return new Error('The identity is not valid');
      }

      const cryptoCredentialsExported = await getExportedCryptoCredentialsByCAIdentity(
        caIdentity,
        cryptoKeyPairs
      );

      if (cryptoCredentialsExported instanceof Error) {
        console.error(cryptoCredentialsExported);
        return new Error('Failed to export the credentials to a string');
      }

      const credentialsStoredForIdentity = await this.getCredentialsRaw(
        caIdentityStorageKey
      );

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
      return storageConnection.set(
        caIdentityStorageKey,
        cryptoCredentialsExported
      );
    } catch (err) {
      console.error(err);
      return new Error('Failed to store the credentials');
    }
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

  @caching(CA_IDENTITY_CREDENTIALS_STORAGE_READ_CACHE_CAPACITY)
  protected async getCredentialsCached(
    identity: TCentralAuthorityUserIdentity
  ): Promise<TCentralAuthorityUserCryptoCredentials | Error | null> {
    try {
      // parse the identity
      const caIdentity = new CentralAuthorityIdentity(identity);
      const credentialsKey = this.getStorageKeyByCAIdentity(caIdentity);

      if (credentialsKey instanceof Error) {
        console.error(credentialsKey);
        return new Error('The identity has a wrong format');
      }

      const caCryptoCredentials = await this.getCredentialsRaw(credentialsKey);

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
}
