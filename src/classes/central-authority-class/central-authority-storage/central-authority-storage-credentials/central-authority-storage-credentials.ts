import { SecretStorage } from 'classes/secret-storage-class';
import { getStatusClass } from 'classes/basic-classes/status-class-base/status-class-base';
import {
  TCentralAuthorityCredentialsStorageAuthCredentials,
  TCentralAuthorityUserCryptoCredentials,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types-crypto-credentials';
import {
  CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS,
  CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_KEY_CRYPTO_CREDENTIALS,
  CENTRAL_AUTHORITY_STORAGE_PROVIDER_NAME,
} from './central-authority-storage-credentials.const';
import {
  checkIsValidCryptoCredentials,
  exportCryptoCredentialsToString,
  getUserCredentialsByUserIdentityAndCryptoKeys,
  importCryptoCredentialsFromAString,
} from './central-authority-storage-credentials.utils';
import {
  TCentralAuthorityUserIdentity,
  TCACryptoKeyPairs,
  ICentralAuthorityStorageCryptoCredentials,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import {
  validateUserIdentity,
  validateAuthCredentials,
} from 'classes/central-authority-class/central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import {
  CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME,
  CA_AUTH_CREDENTIALS_USER_PASSWORD_PROP_NAME,
} from 'classes/central-authority-class/central-authority-class-const/central-authority-class-const';
import { TSecretStoreConfiguration } from 'classes/secret-storage-class/secret-storage-class.types';
import { calculateHash } from 'utils/hash-calculation-utils/hash-calculation-utils';

/**
 *
 * this is storage which is necessary
 * to save all the user keys along with the user id which
 * are necessary to communicate with another users
 * in the network in encrypted form
 * @export
 * @class CentralAuthorityCredentialsStorage
 * @extends {StatusClassBase<typeof CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS>}
 */
export class CentralAuthorityCredentialsStorage
  extends getStatusClass<typeof CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS>({
    errorStatus: CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS.ERROR,
    initialStatus: CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS.NEW,
    instanceName: 'CentralAuthorityCredentialsStorage',
  })
  implements ICentralAuthorityStorageCryptoCredentials {
  protected __userIdentity?: TCentralAuthorityUserIdentity;

  protected __userIdentityHash?: string;

  protected secretStorageConnection?: SecretStorage;

  protected userCryptoCredentialsCached?: TCentralAuthorityUserCryptoCredentials;

  protected get userIdentity(): undefined | string {
    const { __userIdentity } = this;

    if (validateUserIdentity(__userIdentity)) {
      return __userIdentity;
    }
    return undefined;
  }

  protected get userIdentityHash(): undefined | string {
    const { __userIdentityHash } = this;

    return __userIdentityHash || undefined;
  }

  protected get secretStorageCredentialsValueKey(): string {
    const { userIdentityHash } = this;

    return `${CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_KEY_CRYPTO_CREDENTIALS}__${userIdentityHash}`;
  }

  protected get isConnectedToStorage(): boolean {
    const { status } = this;

    return status === CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS.CONNECTED;
  }

  protected get secretStorageOptions(): Partial<TSecretStoreConfiguration> {
    return {
      storageProviderName: CENTRAL_AUTHORITY_STORAGE_PROVIDER_NAME,
    };
  }

  protected async setUserIdentity(userIdentity: any): Promise<Error | boolean> {
    if (validateUserIdentity(userIdentity)) {
      const userIdentityHash = await calculateHash(userIdentity);

      if (userIdentityHash instanceof Error) {
        console.error(userIdentityHash);
        return new Error("Failed to calculate the user's identity hash");
      }

      this.__userIdentity = userIdentity;
      this.__userIdentityHash = userIdentityHash;
      return true;
    }
    return new Error('The user identity is not valid');
  }

  protected createSecretStorageInstance() {
    const { secretStorageOptions: configuration } = this;

    this.secretStorageConnection = new SecretStorage(configuration);
  }

  /**
   * authorize to the storage with a credentials given
   * @param {object} credentials
   */
  protected authorizeWithCredentials(
    credentials: TCentralAuthorityCredentialsStorageAuthCredentials
  ): Promise<Error | boolean> | Error {
    const { secretStorageConnection } = this;
    const {
      [CA_AUTH_CREDENTIALS_USER_PASSWORD_PROP_NAME]: password,
    } = credentials;

    if (secretStorageConnection) {
      return secretStorageConnection.authorize({ password });
    }
    return new Error('There is no secretStorageConnection');
  }

  /**
   * connect to the SecretStorage without credentials.
   * the success will depending on the previous
   * connection with credentials - if it was succed
   * then the credentials may be stored in the session
   * storage
   */
  protected connectToStorageWithoutCredentials():
    | Promise<Error | boolean>
    | Error {
    const { secretStorageConnection } = this;

    if (secretStorageConnection) {
      return secretStorageConnection.connect();
    }
    return new Error('There is no secretStorageConnection');
  }

  protected async connectToTheStorage(
    credentials?: TCentralAuthorityCredentialsStorageAuthCredentials
  ): Promise<boolean | Error> {
    if (validateAuthCredentials(credentials)) {
      const {
        [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userIdentity,
      } = credentials;
      const resultSetUserIdentity = await this.setUserIdentity(userIdentity);

      if (resultSetUserIdentity === true) {
        return this.authorizeWithCredentials(credentials);
      }
      return new Error('A wrong user identity');
    }
    return this.connectToStorageWithoutCredentials();
  }

  public async connect(
    credentials?: TCentralAuthorityCredentialsStorageAuthCredentials
  ): Promise<boolean | Error> {
    this.setStatus(CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS.CONNECTING);
    this.createSecretStorageInstance();

    const connectionResult = await this.connectToTheStorage(credentials);

    if (connectionResult instanceof Error) {
      this.setStatus(
        CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS.CONNECTION_FAILED
      );
      CentralAuthorityCredentialsStorage.error(connectionResult);
      return connectionResult;
    }
    this.setStatus(CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS.CONNECTED);
    return true;
  }

  public async disconnect(): Promise<boolean | Error> {
    const { isConnectedToStorage, secretStorageConnection } = this;

    if (isConnectedToStorage && secretStorageConnection) {
      secretStorageConnection.disconnect();
    }
    return new Error('Not connected to the storage');
  }

  protected setUserCredentialsToCache(
    userCryptoCredentials: TCentralAuthorityUserCryptoCredentials
  ): undefined | Error {
    if (!checkIsValidCryptoCredentials(userCryptoCredentials)) {
      return new Error('The given value is not a valid crypto credentials');
    }
    this.userCryptoCredentialsCached = userCryptoCredentials;
  }

  protected unsetUserCredentialsInCache(): void {
    this.userCryptoCredentialsCached = undefined;
  }

  protected async setToStorage(
    key: string,
    value: any
  ): Promise<Error | boolean> {
    const {
      secretStorageConnection,
      isConnectedToStorage: isConnectedToTheSecretStorage,
    } = this;

    if (isConnectedToTheSecretStorage && secretStorageConnection) {
      return secretStorageConnection.set(key, value);
    }
    return new Error('There is no active connecion to the secret storage');
  }

  protected async readFromStorage(
    key: string
  ): Promise<Error | string | undefined> {
    const {
      secretStorageConnection,
      isConnectedToStorage: isConnectedToTheSecretStorage,
    } = this;

    if (isConnectedToTheSecretStorage && secretStorageConnection) {
      return secretStorageConnection.get(key);
    }
    return new Error('There is no active connecion to the secret storage');
  }

  protected async setCryptoCredentialsToStorage(
    userCryptoCredentials: TCentralAuthorityUserCryptoCredentials
  ): Promise<Error | boolean> {
    const {
      isConnectedToStorage: isConnectedToTheSecretStorage,
      secretStorageCredentialsValueKey,
    } = this;

    if (!isConnectedToTheSecretStorage) {
      return new Error('There is no active connecion to the secret storage');
    }

    const exportedUserCryptoCredentials = await exportCryptoCredentialsToString(
      userCryptoCredentials
    );

    if (exportedUserCryptoCredentials instanceof Error) {
      return exportedUserCryptoCredentials;
    }
    return this.setToStorage(
      secretStorageCredentialsValueKey,
      exportedUserCryptoCredentials
    );
  }

  protected unsetCryptoCredentialsToStorage(): Promise<Error | boolean> {
    const { secretStorageCredentialsValueKey } = this;

    return this.setToStorage(secretStorageCredentialsValueKey, null);
  }

  protected getCredentialsCached():
    | TCentralAuthorityUserCryptoCredentials
    | Error
    | undefined {
    const { userCryptoCredentialsCached } = this;

    if (!userCryptoCredentialsCached) {
      return undefined;
    }
    if (checkIsValidCryptoCredentials(userCryptoCredentialsCached)) {
      return userCryptoCredentialsCached;
    }
    return new Error('There is no a crypto credetials cached');
  }

  protected async readCryptoCredentialsFromStorage(): Promise<
    TCentralAuthorityUserCryptoCredentials | Error | null
  > {
    const { secretStorageCredentialsValueKey } = this;

    const cryptoCredentials = await this.readFromStorage(
      secretStorageCredentialsValueKey
    );

    if (cryptoCredentials instanceof Error) {
      console.error(cryptoCredentials);
      return new Error('Failed to read the credentials from the storage');
    }
    if (!cryptoCredentials) {
      console.warn('There is no crypto credentials stored');
      return null;
    }

    const importedCryptoKey = await importCryptoCredentialsFromAString(
      cryptoCredentials
    );

    if (importedCryptoKey instanceof Error) {
      console.error(importedCryptoKey);
      return new Error(
        'Failed to import a crypto credentials value from the string stored'
      );
    }

    const resultSetInCache = this.setUserCredentialsToCache(importedCryptoKey);

    if (resultSetInCache instanceof Error) {
      console.error(resultSetInCache);
      this.unsetUserCredentialsInCache();
      return new Error(
        'Failed to set the crypto credentials value in the cache'
      );
    }
    return importedCryptoKey;
  }

  public async getCredentials(): Promise<
    TCentralAuthorityUserCryptoCredentials | Error | null
  > {
    const cachedCryptoCredentials = this.getCredentialsCached();

    if (cachedCryptoCredentials instanceof Error) {
      console.error(cachedCryptoCredentials);
      console.error('Failed to read a cached value of a crypto credentials');
    }
    if (cachedCryptoCredentials) {
      return cachedCryptoCredentials;
    }

    const storedCryptoCredentials = await this.readCryptoCredentialsFromStorage();

    if (storedCryptoCredentials instanceof Error) {
      console.error(storedCryptoCredentials);
      return new Error(
        'Failed to read a crypto credentials value from the storage'
      );
    }
    if (!storedCryptoCredentials) {
      console.warn('A crypto credentials value is absent');
      return null;
    }
    return storedCryptoCredentials;
  }

  public async setCredentials(
    cryptoKeyPairs: TCACryptoKeyPairs
  ): Promise<Error | boolean> {
    const { userIdentity } = this;

    if (!userIdentity) {
      return new Error('A user identity value was not set');
    }

    const cryptoCredentials = getUserCredentialsByUserIdentityAndCryptoKeys(
      userIdentity,
      cryptoKeyPairs
    );

    if (cryptoCredentials instanceof Error) {
      console.error(cryptoCredentials);
      return new Error(
        'Failed to create a valid crypro credentials from the given crypto keys and the user identity'
      );
    }

    const setCredentialsInCacheResult = this.setUserCredentialsToCache(
      cryptoCredentials
    );

    if (setCredentialsInCacheResult instanceof Error) {
      this.unsetUserCredentialsInCache();
      console.error(setCredentialsInCacheResult);
      return new Error('Failed to set the crypto credentials in the cahce');
    }

    const resultSetCryptoCredentialsToStorage = await this.setCryptoCredentialsToStorage(
      cryptoCredentials
    );

    if (resultSetCryptoCredentialsToStorage instanceof Error) {
      this.unsetUserCredentialsInCache();
      if ((await this.unsetCryptoCredentialsToStorage()) instanceof Error) {
        console.error('Failed to unset a crypto credentials in the storage');
      }
      console.error(resultSetCryptoCredentialsToStorage);
      return new Error('Failed to set the crypto credentials in the storage');
    }
    return true;
  }
}
