import { TCAUserIdentityRawTypes } from './../../../central-authority-class-user-identity/central-authority-class-user-identity.types';
import { OpenStorage } from './../../../../open-storage/open-storage';
import { getStatusClass } from 'classes/basic-classes/status-class-base/status-class-base';
import {
  CA_IDENTITY_CREDENTIALS_STORAGE_STATUS,
  CA_IDENTITY_CREDENTIALS_STORAGE_CONFIGURATION,
  CA_IDENTITY_CREDENTIALS_STORAGE_READ_CACHE_CAPACITY,
  CA_IDENTITY_CREDENTIALS_STORAGE_READ_RAW_CACHE_CAPACITY,
  CA_IDENTITY_CREDENTIALS_STORAGE_NAME_OPTIONS_MAX_LENGTH,
  CA_IDENTITY_CREDENTIALS_STORAGE_FULL_NAME,
} from './central-authority-storage-swarm-users-identity-credentials.const';
import {
  ICAIdentityCredentialsStorage,
  ICAIdentityCredentialsStorageConntionOptions,
} from './central-authority-storage-swarm-users-identity-credentials.types';
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
import { dataCachingUtilsCachingDecorator as caching } from 'utils/data-cache-utils';
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
  public get isActive(): boolean {
    const { status, storageConnection } = this;

    return status === CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.CONNECTED && !!storageConnection && storageConnection.isActive;
  }

  protected storageConnection?: OpenStorage;

  protected storageName?: string;

  /**
   * connect to the SecretStorage with
   * the user's credentials
   * @param storageCredentials
   */
  public async connect(options?: ICAIdentityCredentialsStorageConntionOptions): Promise<boolean | Error> {
    const resultSetOptions = this.setOptions(options);

    if (resultSetOptions instanceof Error) {
      console.error(resultSetOptions);
      return new Error('Failed to set options');
    }

    const connection = this.createConnectionToStorage();

    if (connection instanceof Error) {
      console.error(connection);
      return this.setErrorStatus('Failed to create an instance of SecretStorage');
    }
    this.setStatus(CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.CONNECTING);

    const connectionResult = await connection.connect(CA_IDENTITY_CREDENTIALS_STORAGE_CONFIGURATION);

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
  public async getCredentials(identity: TCentralAuthorityUserIdentity): Promise<TCentralAuthorityUserCryptoCredentials | Error | null> {
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
    const withCheckPrivateFlag = typeof args[1] === 'boolean';
    const checkPrivateKey = !withCheckPrivateFlag || args[1] !== false;

    if (argsLenght === 2 && !withCheckPrivateFlag) {
      return this.setCredentialsByIdentity(args[0], args[1], checkPrivateKey);
    } else if (argsLenght === 1 || withCheckPrivateFlag) {
      const caCryptoCredentials = args[0];

      if (checkIsValidExportedCryptoCredentialsToString(caCryptoCredentials)) {
        return this.setCredentialsByCACryptoCredentialsExportedToString(caCryptoCredentials, checkPrivateKey);
      } else if (checkIsValidCryptoCredentials(caCryptoCredentials, checkPrivateKey)) {
        return this.setCredentialsByCACryptoCredentials(caCryptoCredentials, checkPrivateKey);
      }
    }
    return new Error('An unknown arguments');
  }

  public setCredentialsNoCheckPrivateKey(cryptoCredentials: TCAUserIdentityRawTypes | string) {
    return this.setCredentials(cryptoCredentials, false);
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
      console.error(new Error('The instance is already disconnected from the storage'));
      // return false cause already disconnected
      return false;
    }
    if (status !== CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.CONNECTED || status === CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.ERROR) {
      return this.setErrorStatus(new Error("Can't disconnect cause the instance is not in the Connected state"));
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
    return `${this.storageName}_${key}`;
  }

  protected setStorageName(postfix: string = '') {
    this.storageName = `${CA_IDENTITY_CREDENTIALS_STORAGE_FULL_NAME}_${postfix}`;
  }

  protected setDefaultOptions() {
    this.setStorageName();
  }

  protected setOptions(options?: ICAIdentityCredentialsStorageConntionOptions): void | Error {
    this.setDefaultOptions();
    if (!options) {
      return;
    }
    if (options.storageName) {
      if (typeof options.storageName !== 'string') {
        return new Error('The storage name must be a string');
      }
      if (options.storageName.length > CA_IDENTITY_CREDENTIALS_STORAGE_NAME_OPTIONS_MAX_LENGTH) {
        return new Error(`The maximum length of a storage name is ${CA_IDENTITY_CREDENTIALS_STORAGE_NAME_OPTIONS_MAX_LENGTH}`);
      }
      this.setStorageName(options.storageName);
    }
  }

  protected createConnectionToStorage(): OpenStorage | Error {
    try {
      const connection = new OpenStorage();

      return connection;
    } catch (err) {
      console.error(err);
      return err;
    }
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
  protected getStorageKeyByCAIdentity(identity: TCAUserIdentityRawTypes): string | Error {
    if (!(identity instanceof CentralAuthorityIdentity)) {
      return new Error('The argument must be an instance of CentralAuthorityIdentity');
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
  protected async getCredentialsRaw(identityKey: string): Promise<string | Error | undefined> {
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
      return new Error('Failed to read a credentials for identity from the storage');
    }
  }

  protected setCredentialsByIdentity = async (
    identity: TCAUserIdentityRawTypes,
    cryptoKeyPairs: TCACryptoKeyPairs,
    checkPrivateKey: boolean = true
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

      const cryptoCredentialsExported = await getExportedCryptoCredentialsByCAIdentity(caIdentity, cryptoKeyPairs, checkPrivateKey);

      if (cryptoCredentialsExported instanceof Error) {
        console.error(cryptoCredentialsExported);
        return new Error('Failed to export the credentials to a string');
      }

      const credentialsStoredForIdentity = await this.getCredentialsRaw(caIdentityStorageKey);

      // if a credentials was already
      // stored for the identity
      // do not modify it.
      // Cause it's value
      // must be immutable
      if (credentialsStoredForIdentity && !(credentialsStoredForIdentity instanceof Error)) {
        return false;
      }

      // if the given values are valid
      // then can put it to the storage
      // connected to
      return storageConnection.set(caIdentityStorageKey, cryptoCredentialsExported);
    } catch (err) {
      console.error(err);
      return new Error('Failed to store the credentials');
    }
  };

  protected async setCredentialsByCACryptoCredentials(
    caCryptoCredentials: TCentralAuthorityUserCryptoCredentials,
    checkPrivateKey: boolean = true
  ): Promise<boolean | Error> {
    const identity = getUserIdentityByCryptoCredentials(caCryptoCredentials);

    if (identity instanceof Error) {
      console.error(identity);
      return new Error('The user identity is not valid or have an unknown format');
    }

    const cryptoKeyPairs = getCryptoKeyPairsByCryptoCredentials(caCryptoCredentials, checkPrivateKey);

    if (cryptoKeyPairs instanceof Error) {
      console.error(cryptoKeyPairs);
      return new Error('The crypto key pairs are not valid or have an unknown format');
    }

    return this.setCredentialsByIdentity(identity, cryptoKeyPairs, checkPrivateKey);
  }

  protected async setCredentialsByCACryptoCredentialsExportedToString(
    caCryptoCredentialsExportedToString: string,
    checkPrivateKey: boolean = true
  ): Promise<boolean | Error> {
    const cryptoCredentials = await importCryptoCredentialsFromAString(caCryptoCredentialsExportedToString);

    if (cryptoCredentials instanceof Error) {
      console.error(cryptoCredentials);
      return new Error('Failed to import crypto credentials from the string');
    }
    return this.setCredentialsByCACryptoCredentials(cryptoCredentials, checkPrivateKey);
  }

  @caching(CA_IDENTITY_CREDENTIALS_STORAGE_READ_CACHE_CAPACITY)
  protected async getCredentialsCached(identity: TCAUserIdentityRawTypes): Promise<TCentralAuthorityUserCryptoCredentials | Error | null> {
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

      const importedCryptoCredentials = await importCryptoCredentialsFromAString(caCryptoCredentials);

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
      const resultedValue = replaceCryptoCredentialsIdentity(importedCryptoCredentials, String(caIdentity), false);

      if (resultedValue instanceof Error) {
        console.error(resultedValue);
        return new Error('Failed to replace the identity in the credentials read from the storage');
      }
      return resultedValue;
    } catch (err) {
      console.error(err);
      return new Error('Failed to read a credentials for identity from the storage');
    }
  }
}
