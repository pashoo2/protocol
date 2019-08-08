import { SecretStorage } from 'classes/secret-storage-class';
import { getStatusClass } from 'classes/basic-classes/status-class-base/status-class-base';
import { TCentralAuthorityCredentialsStorageCredentials } from './central-authority-storage-credentials.types';
import { CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS } from './central-authority-storage-credentials.const';
import { TCentralAuthorityUserMainCredentials } from 'classes/central-authority-class/central-authority-class.types';

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

  createSecretStorageInstance() {
    this.secretStorageConnection = new SecretStorage();
  }

  /**
   * authorize to the storage with a credentials given
   * @param {object} credentials
   */
  authorizeWithCredentials(
    credentials: TCentralAuthorityCredentialsStorageCredentials
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
    credentials?: TCentralAuthorityCredentialsStorageCredentials
  ): Promise<boolean | Error> | Error {
    if (credentials) {
      return this.authorizeWithCredentials(credentials);
    }
    return this.connectToStorageWithoutCredentials();
  }

  async connect(
    credentials?: TCentralAuthorityCredentialsStorageCredentials
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

  // validateUserCredentials(c: any): c is TCentralAuthorityUserMainCredentials {
  //   if (typeof c === 'object') {
  //   }
  // }

  setUserCredentialsToTheCache() {}

  async getUserCredentialsFromTheCache() {}

  async readUserCredentialsFromStorage() {}

  // async getUserCredentials(): Promise<
  //   Error | TCentralAuthorityUserMainCredentials
  // > {}

  async setUserCredentials() {}
}
