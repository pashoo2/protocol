import { getUserIdentityByCryptoCredentials } from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import { validateAuthProviderIdentity } from './../../../central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import { TCentralAuthorityUserIdentity } from './../../../central-authority-class-types/central-authority-class-types-common';
import {
  exportCryptoCredentialsToString,
  importCryptoCredentialsFromAString,
} from './../../../central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import { ICAUserUniqueIdentifierDescription } from './../../../central-authority-class-user-identity/central-authority-class-user-identity.types';
import { CentralAuthorityIdentity } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import { checkIsValidCryptoCredentials } from './../../../central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';
import { TCentralAuthorityUserCryptoCredentials } from './../../../central-authority-class-types/central-authority-class-types-crypto-credentials';
import { ISecretStoreCredentials } from 'classes/secret-storage-class/secret-storage-class.types';
import {
  CA_STORAGE_CURRENT_USER_CREDENTIALS_SECRET_STORAGE_CONFIGURATION,
  CA_STORAGE_CURRENT_USER_CREDENTIALS_SECRET_STORAGE_DATABASE_NAME,
  CA_STORAGE_CURRENT_USER_CREDENTIALS_SECRET_STORAGE_OPTIONS,
} from './central-authority-storage-current-user-credentials.const';
import { SecretStorage } from 'classes/secret-storage-class';
import {
  ICAStorageCurrentUserCredentials,
  ICAStorageCurrentUserCredentialsOptions,
} from './central-authority-storage-current-user-credentials.types';

/**
 * This storage is used to store the user's
 * public and private keys along with the
 * user's identity
 */
export class CentralAuthorityStorageCurrentUserCredentials
  implements ICAStorageCurrentUserCredentials {
  protected static async authorizeInStorage(
    secretStorageConnection: SecretStorage,
    cryptoKey: CryptoKey
  ): Promise<Error | void> {
    if (!(cryptoKey instanceof CryptoKey)) {
      return new Error('Crypto key must be an instance of the Crypto key');
    }
    if (!(secretStorageConnection instanceof SecretStorage)) {
      return new Error(
        'The secret storage connection must be an instance of the SecretStorage'
      );
    }

    const authorizeByKeyResult = await secretStorageConnection.authorizeByKey(
      {
        key: cryptoKey,
      },
      CA_STORAGE_CURRENT_USER_CREDENTIALS_SECRET_STORAGE_OPTIONS
    );

    if (authorizeByKeyResult instanceof Error) {
      return authorizeByKeyResult;
    }
  }

  protected get isSecretStorageActive(): boolean {
    return (
      !this.isDisconnected &&
      !!this.secretStorageConnection &&
      this.secretStorageConnection.isActive
    );
  }

  private isDisconnected: boolean = false;

  private secretStorageEncryptionKey?: CryptoKey;

  private secretStorageConnection?: SecretStorage;

  /**
   * connect to the SecretStorage
   *
   * @memberof CentralAuthorityStorageCurrentUserCredentials
   */
  public connect = async (
    options: ICAStorageCurrentUserCredentialsOptions
  ): Promise<Error | void> => {
    const { isSecretStorageActive } = this;

    if (isSecretStorageActive) {
      return new Error(
        'The instance is already connected to the secret storage'
      );
    }

    const { credentials } = options;
    const connectToSecretStorageResult = await this.createSecretStorageConnection(
      credentials
    );

    if (connectToSecretStorageResult instanceof Error) {
      return connectToSecretStorageResult;
    }
    this.unsetIsDisconnected();
  };

  public disconnect = async (): Promise<Error | void> => {
    const disconnectFromSecretStorageResult = await this.disconnectFromSecretStorage();

    if (disconnectFromSecretStorageResult instanceof Error) {
      return disconnectFromSecretStorageResult;
    }
    this.unsetSecretStorageCryptoKey();
    this.setIsDisconnected();
  };

  /**
   * set the user's crypto keys for the user identity and
   * the user auth provider identity
   *
   * @memberof CentralAuthorityStorageCurrentUserCredentials
   */
  public set = async (
    userCryptoCredentials: TCentralAuthorityUserCryptoCredentials
  ): Promise<void | Error> => {
    const connectionCheckResult = await this.checkConnectionAndReconnect();

    if (connectionCheckResult instanceof Error) {
      return connectionCheckResult;
    }

    const credentialsExportedToString = await this.exportCredentialsToString(
      userCryptoCredentials
    );

    if (credentialsExportedToString instanceof Error) {
      return credentialsExportedToString;
    }

    const [resultSetWithUserId, resultSetWithAuthProvider] = await Promise.all([
      this.setCredentialsForUserIdentity(
        userCryptoCredentials,
        credentialsExportedToString
      ),
      this.setCredentialsForAuthProvider(
        userCryptoCredentials,
        credentialsExportedToString
      ),
    ]);

    let err = false;
    if (resultSetWithUserId instanceof Error) {
      console.error(resultSetWithUserId);
      console.error(new Error('Failed to set credentials for the user id'));
      err = true;
    }
    if (resultSetWithAuthProvider instanceof Error) {
      console.error(resultSetWithAuthProvider);
      console.error(
        new Error('Failed to set credentials for the auth provider')
      );
      err = true;
    }
    if (err) {
      const resultUnsetAll = await this.unsetCredentialsForUser(
        userCryptoCredentials
      );

      if (resultUnsetAll instanceof Error) {
        console.error(resultUnsetAll);
        console.error(
          new Error('Failed to unset credentials for the user identity')
        );
      }
      return new Error('Failed to store credentials');
    }
  };

  /**
   * return credentials by the user identity
   *
   * @memberof CentralAuthorityStorageCurrentUserCredentials
   */
  public get = async (
    userIdentity: TCentralAuthorityUserIdentity
  ): Promise<TCentralAuthorityUserCryptoCredentials | Error | void> => {
    if (!this.validateUserIdentity(userIdentity)) {
      return new Error('The user identity is not valid');
    }
    return this.getCredentials(userIdentity);
  };

  /**
   * unset the user crypto credentials for the user identity
   * and the auth provider
   *
   * @memberof CentralAuthorityStorageCurrentUserCredentials
   */
  public unset = async (
    userIdentity: TCentralAuthorityUserIdentity
  ): Promise<Error | void> => {
    return this.unsetCredentialsForUser(userIdentity);
  };

  /**
   * return the credentials by the auth provider
   *
   * @memberof CentralAuthorityStorageCurrentUserCredentials
   */
  public getByAuthProvider = async (
    authProviderIdentity: string
  ): Promise<TCentralAuthorityUserCryptoCredentials | Error | void> => {
    const connectionCheckResult = await this.checkConnectionAndReconnect();

    if (connectionCheckResult instanceof Error) {
      return connectionCheckResult;
    }

    const validationResult = this.validateAuthProviderId(authProviderIdentity);

    if (validationResult instanceof Error) {
      return validationResult;
    }
    return this.getCredentials(authProviderIdentity);
  };

  protected async reconnect(): Promise<Error | void> {
    const { secretStorageEncryptionKey, isDisconnected } = this;

    if (isDisconnected) {
      return new Error(
        'The instance was disconnected from the secret storage from the outside by calling the "disconnect" method'
      );
    }
    if (!secretStorageEncryptionKey) {
      return new Error('There is no encryption key');
    }

    const disconnectResult = await this.disconnectFromSecretStorage();

    if (disconnectResult instanceof Error) {
      console.error(disconnectResult);
      return new Error('Failed to disconnect');
    }

    const secretStorageConnection = this.createConnectionToSecretStorage();
    const authToSecretStorageResult = await CentralAuthorityStorageCurrentUserCredentials.authorizeInStorage(
      secretStorageConnection,
      secretStorageEncryptionKey
    );

    if (authToSecretStorageResult instanceof Error) {
      console.error(authToSecretStorageResult);
      return new Error('Failed to authorize in the SecretStorage');
    }
  }

  /**
   * returns key with prefix of the CAStorageCurrentUserCredentials
   *
   * @protected
   * @param {string} key
   * @returns {string}
   * @memberof CentralAuthorityStorageCurrentUserCredentials
   */
  protected keyWithPrefix(key: string): string {
    return `${CA_STORAGE_CURRENT_USER_CREDENTIALS_SECRET_STORAGE_DATABASE_NAME}_${key}`;
  }

  protected async getCredentials(
    key: string
  ): Promise<TCentralAuthorityUserCryptoCredentials | Error | void> {
    const connectionCheckResult = await this.checkConnectionAndReconnect();

    if (connectionCheckResult instanceof Error) {
      return connectionCheckResult;
    }

    const { secretStorageConnection } = this;

    if (!secretStorageConnection) {
      return new Error('There is no active connection with the SecretStorage');
    }

    const keyPrefixed = this.keyWithPrefix(key);
    const val = await secretStorageConnection.get(keyPrefixed);

    if (!val) {
      return undefined;
    }
    if (val instanceof Error) {
      return val;
    }

    const credentialsImported = await importCryptoCredentialsFromAString(val);

    if (credentialsImported instanceof Error) {
      console.error(credentialsImported);
      return new Error('Failed to import the credentials');
    }
    return credentialsImported;
  }

  protected validateAuthProviderId(authProviderURL: string): Error | void {
    const validationResult = validateAuthProviderIdentity(authProviderURL);

    if (!validationResult) {
      return new Error('The auth provider identity is not valid');
    }
  }

  protected validateUserIdentity(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userIdentity: any
  ): userIdentity is TCentralAuthorityUserIdentity {
    const caUserIdentity = new CentralAuthorityIdentity(userIdentity);

    return !!caUserIdentity.isValid;
  }

  protected getAuthProviderIdentityByUserId(
    userIdentity: string
  ): Error | string {
    const caUserIdentity = new CentralAuthorityIdentity(userIdentity);

    if (!caUserIdentity.isValid) {
      return new Error('The user identity is not valid');
    }
    return (caUserIdentity.identityDescription as ICAUserUniqueIdentifierDescription)
      .authorityProviderURI;
  }

  protected async exportCredentialsToString(
    userCryptoCredentials: TCentralAuthorityUserCryptoCredentials
  ): Promise<string | Error> {
    // on export validation has occurred
    const userCredentialsExported = exportCryptoCredentialsToString(
      userCryptoCredentials
    );

    if (userCredentialsExported instanceof Error) {
      console.error(userCredentialsExported);
      return new Error('Failed to export credentials to string');
    }
    return userCredentialsExported;
  }

  protected async setCredentialsForUserIdentity(
    userCryptoCredentials: TCentralAuthorityUserCryptoCredentials,
    userCryptoCredentialsExported: string
  ): Promise<void | Error> {
    const connectionCheckResult = await this.checkConnectionAndReconnect();

    if (connectionCheckResult instanceof Error) {
      return connectionCheckResult;
    }

    const { secretStorageConnection } = this;

    if (!secretStorageConnection) {
      return new Error('There is no active connection with the SecretStorage');
    }

    const userIdentity = getUserIdentityByCryptoCredentials(
      userCryptoCredentials
    );
    const resultSetInStorage = await secretStorageConnection.set(
      this.keyWithPrefix(userIdentity as string),
      userCryptoCredentialsExported
    );

    if (resultSetInStorage instanceof Error) {
      console.error(resultSetInStorage);
      return new Error('Failed to set credentials in the storage');
    }
  }

  protected async setCredentialsForAuthProvider(
    userCryptoCredentials: TCentralAuthorityUserCryptoCredentials,
    userCryptoCredentialsExported: string
  ): Promise<Error | void> {
    const connectionCheckResult = await this.checkConnectionAndReconnect();

    if (connectionCheckResult instanceof Error) {
      return connectionCheckResult;
    }

    const { secretStorageConnection } = this;

    if (!secretStorageConnection) {
      return new Error('There is no active connection with the SecretStorage');
    }

    const userIdentity = getUserIdentityByCryptoCredentials(
      userCryptoCredentials
    );
    const authorityProviderURL = this.getAuthProviderIdentityByUserId(
      userIdentity as string
    );

    if (authorityProviderURL instanceof Error) {
      return authorityProviderURL;
    }

    const resultSetInStorage = await secretStorageConnection.set(
      this.keyWithPrefix(authorityProviderURL),
      userCryptoCredentialsExported
    );

    if (resultSetInStorage instanceof Error) {
      console.error(resultSetInStorage);
      return new Error('Failed to set credentials in the storage');
    }
  }

  protected async unsetCredentialsForUser(
    identityOrCredentials: string | TCentralAuthorityUserCryptoCredentials
  ): Promise<Error | void> {
    const connectionCheckResult = await this.checkConnectionAndReconnect();

    if (connectionCheckResult instanceof Error) {
      return connectionCheckResult;
    }

    const { secretStorageConnection } = this;

    if (!secretStorageConnection) {
      return new Error('There is no active connection with the SecretStorage');
    }

    const userIdentity =
      typeof identityOrCredentials === 'string'
        ? identityOrCredentials
        : getUserIdentityByCryptoCredentials(identityOrCredentials);

    if (userIdentity instanceof Error) {
      console.error(userIdentity);
      return new Error(
        'Failed to get the user identity by the crypto credentials value'
      );
    }

    const authorityProviderURL = this.getAuthProviderIdentityByUserId(
      userIdentity
    );

    if (authorityProviderURL instanceof Error) {
      return authorityProviderURL;
    }
    return secretStorageConnection.unset([
      this.keyWithPrefix(userIdentity),
      this.keyWithPrefix(authorityProviderURL),
    ]);
  }

  protected validateCryptoCredentials(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cryptoCredentials: any
  ): cryptoCredentials is TCentralAuthorityUserCryptoCredentials {
    return checkIsValidCryptoCredentials(cryptoCredentials);
  }

  private setIsDisconnected() {
    this.isDisconnected = true;
  }

  private unsetIsDisconnected() {
    this.isDisconnected = false;
  }

  private setSecretStorageCryptoKey(key: CryptoKey) {
    this.secretStorageEncryptionKey = key;
  }

  private unsetSecretStorageCryptoKey() {
    this.secretStorageEncryptionKey = undefined;
  }

  private setSecretStorageConnection(secretStorage: SecretStorage) {
    this.secretStorageConnection = secretStorage;
  }

  private unsetSecretStorageConnection() {
    this.secretStorageConnection = undefined;
  }

  private createConnectionToSecretStorage(): SecretStorage {
    return new SecretStorage(
      CA_STORAGE_CURRENT_USER_CREDENTIALS_SECRET_STORAGE_CONFIGURATION
    );
  }

  private async createSecretStorageConnection(
    credentials: ISecretStoreCredentials
  ): Promise<Error | void> {
    const { secretStorageEncryptionKey } = this;
    const secretStorageConnection = this.createConnectionToSecretStorage();
    const cryptoKey =
      secretStorageEncryptionKey ||
      (await secretStorageConnection.generateCryptoKey(credentials));

    if (cryptoKey instanceof Error) {
      return new Error('Failed to generate crypto key by the credentials');
    }
    this.setSecretStorageCryptoKey(cryptoKey);

    const authToSecretStorageResult = await CentralAuthorityStorageCurrentUserCredentials.authorizeInStorage(
      secretStorageConnection,
      cryptoKey
    );

    if (authToSecretStorageResult instanceof Error) {
      console.error(authToSecretStorageResult);
      return new Error('Failed to authorize in the SecretStorage');
    }
    this.setSecretStorageConnection(secretStorageConnection);
  }

  private async disconnectFromSecretStorage(): Promise<Error | void> {
    const { isSecretStorageActive, secretStorageConnection } = this;

    if (isSecretStorageActive && secretStorageConnection) {
      const disconnectResult = await secretStorageConnection.disconnect();

      if (disconnectResult instanceof Error) {
        console.error(disconnectResult);
        return new Error('Failed to disconnect from the secret storage');
      }
    }
    this.unsetSecretStorageConnection();
  }

  private async checkConnectionAndReconnect(): Promise<void | Error> {
    const { isSecretStorageActive } = this;

    if (!isSecretStorageActive) {
      const reconnect = await this.reconnect();

      if (reconnect instanceof Error) {
        console.error(reconnect);
        return new Error(
          'Connection to the SecretStorage is not active and failed to reconnect'
        );
      }
    }
  }
}
