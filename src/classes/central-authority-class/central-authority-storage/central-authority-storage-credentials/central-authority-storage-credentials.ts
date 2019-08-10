import { SecretStorage } from 'classes/secret-storage-class';
import { getStatusClass } from 'classes/basic-classes/status-class-base/status-class-base';
import {
  TCentralAuthorityCredentialsStorageAuthCredentials,
  TCentralAuthorityUserCryptoCredentials,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types-crypto-credentials';
import {
  CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS,
  CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_KEY_CRYPTO_CREDENTIALS,
  CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_USER_ID_KEY_NAME,
  CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_CRYPTO_KEYS_KEY_NAME,
} from './central-authority-storage-credentials.const';
import {
  checkIsValidCryptoCredentials,
  exportCryptoCredentialsToString,
  getUserCredentialsByUserIdentityAndCryptoKeys,
  checkExportedCryptoCredentialsToString,
  importCryptoCredentialsFromAString,
} from './central-authority-storage-credentials.utils';
import {
  TCentralAuthorityUserIdentity,
  TCACryptoKeyPairs,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { validateUserIdentity } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-user/central-authority-validators-user';
import { checkIsCryptoKeyPairs } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';

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
export class CentralAuthorityCredentialsStorage extends getStatusClass<
  typeof CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS
>({
  errorStatus: CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS.ERROR,
  initialStatus: CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS.NEW,
  instanceName: 'CentralAuthorityCredentialsStorage',
}) {
  protected secretStorageConnection?: SecretStorage;

  protected userCryptoCredentialsCached?: TCentralAuthorityUserCryptoCredentials;

  get isConnectedToTheSecretStorage() {
    const { status } = this;

    return status === CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS.CONNECTED;
  }

  createSecretStorageInstance() {
    this.secretStorageConnection = new SecretStorage();
  }

  /**
   * authorize to the storage with a credentials given
   * @param {object} credentials
   */
  authorizeWithCredentials(
    credentials: TCentralAuthorityCredentialsStorageAuthCredentials
  ): Promise<Error | boolean> | Error {
    const { secretStorageConnection } = this;
    const { password } = credentials;

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
  connectToStorageWithoutCredentials(): Promise<Error | boolean> | Error {
    const { secretStorageConnection } = this;

    if (secretStorageConnection) {
      return secretStorageConnection.connect();
    }
    return new Error('There is no secretStorageConnection');
  }

  connectToTheStorage(
    credentials?: TCentralAuthorityCredentialsStorageAuthCredentials
  ): Promise<boolean | Error> | Error {
    if (credentials) {
      return this.authorizeWithCredentials(credentials);
    }
    return this.connectToStorageWithoutCredentials();
  }

  async connect(
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

  setUserCredentialsToCache(
    userCryptoCredentials: TCentralAuthorityUserCryptoCredentials
  ): undefined | Error {
    if (!checkIsValidCryptoCredentials(userCryptoCredentials)) {
      return new Error('The given value is not a valid crypto credentials');
    }
    this.userCryptoCredentialsCached = userCryptoCredentials;
  }

  unsetUserCredentialsInCache(): void {
    this.userCryptoCredentialsCached = undefined;
  }

  async setToStorage(key: string, value: any): Promise<Error | boolean> {
    const { secretStorageConnection, isConnectedToTheSecretStorage } = this;

    if (isConnectedToTheSecretStorage && secretStorageConnection) {
      return secretStorageConnection.set(key, value);
    }
    return new Error('There is no active connecion to the secret storage');
  }

  async readFromStorage(key: string): Promise<Error | string | undefined> {
    const { secretStorageConnection, isConnectedToTheSecretStorage } = this;

    if (isConnectedToTheSecretStorage && secretStorageConnection) {
      return secretStorageConnection.get(key);
    }
    return new Error('There is no active connecion to the secret storage');
  }

  async setCryptoCredentialsToStorage(
    userCryptoCredentials: TCentralAuthorityUserCryptoCredentials
  ): Promise<Error | boolean> {
    const { isConnectedToTheSecretStorage } = this;

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
      CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_KEY_CRYPTO_CREDENTIALS,
      exportedUserCryptoCredentials
    );
  }

  unsetCryptoCredentialsToStorage(): Promise<Error | boolean> {
    return this.setToStorage(
      CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_KEY_CRYPTO_CREDENTIALS,
      null
    );
  }

  getCredentialsCached():
    | TCentralAuthorityUserCryptoCredentials
    | Error
    | undefined {
    const { userCryptoCredentialsCached } = this;

    if (checkIsValidCryptoCredentials(userCryptoCredentialsCached)) {
      return userCryptoCredentialsCached;
    }
    return new Error('There is no a crypto credetials cached');
  }

  async readCryptoCredentialsFromStorage(): Promise<
    TCentralAuthorityUserCryptoCredentials | Error | null
  > {
    const cryptoCredentials = await this.readFromStorage(
      CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_KEY_CRYPTO_CREDENTIALS
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

  async getCredentials(): Promise<
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

  async setUserCredentials(
    userIdentity: TCentralAuthorityUserIdentity,
    cryptoKeyPairs: TCACryptoKeyPairs
  ): Promise<Error | boolean> {
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
