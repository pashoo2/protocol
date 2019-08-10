import { SecretStorage } from 'classes/secret-storage-class';
import { getStatusClass } from 'classes/basic-classes/status-class-base/status-class-base';
import {
  TCentralAuthorityCredentialsStorageAuthCredentials,
  TCentralAuthorityUserCryptoCredentials,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types-crypto-credentials';
import {
  CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS,
  CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_KEY_CRYPTO_CREDENTIALS,
} from './central-authority-storage-credentials.const';
import {
  checkIsValidCryptoCredentials,
  exportCryptoCredentialsToString,
} from './central-authority-storage-credentials.utils';

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

  setUserCredentialsToTheCache(
    userCryptoCredentials: TCentralAuthorityUserCryptoCredentials
  ): undefined | Error {
    if (!checkIsValidCryptoCredentials(userCryptoCredentials)) {
      return new Error('The given value is not a valid crypto credentials');
    }
    this.userCryptoCredentialsCached = userCryptoCredentials;
  }

  async setToStorage(key: string, value: any): Promise<Error | boolean> {
    const { secretStorageConnection, isConnectedToTheSecretStorage } = this;

    if (isConnectedToTheSecretStorage && secretStorageConnection) {
      return secretStorageConnection.set(key, value);
    }
    return new Error('There is no active connecion to the secret storage');
  }

  async setUserCredentialsToStorage(
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

  getCredentialsCached() {}

  async getCredentialsFromStorage() {}

  async setUserCredentials() {}
}
