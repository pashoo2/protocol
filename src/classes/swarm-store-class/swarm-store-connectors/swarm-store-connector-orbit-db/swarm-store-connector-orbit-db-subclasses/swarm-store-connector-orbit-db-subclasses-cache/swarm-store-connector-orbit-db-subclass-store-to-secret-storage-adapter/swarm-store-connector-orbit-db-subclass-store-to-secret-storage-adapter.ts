import { validateCryptoKeyCredentials } from '../../../../../../secret-storage-class/secret-storage-class-utils/secret-storage-class-utils-main/secret-storage-class-utils-main';
import {
  ISecretStoreCredentials,
  ISecretStoreCredentialsCryptoKey,
} from 'classes/secret-storage-class/secret-storage-class.types';
import { SecretStorage } from 'classes/secret-storage-class/secret-storage-class';
import { SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_STORAGE_ADAPTER_DEFAULT_OPTIONS_STORAGE } from '../swarm-store-connector-orbit-db-subclasses-cache.const';
import { ISecretStorage } from '../../../../../../secret-storage-class/secret-storage-class.types';
import { ISwarmStoreConnectorOrbitDbSubclassStoreToSecretStorageAdapterConstructorOptions } from './swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter.types';
import {
  ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbKeystoreStore,
  ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore,
} from '../swarm-store-connector-orbit-db-subclasses-cache.types';
import { SwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapter } from '../swarm-store-connector-orbit-db-subclass-store-to-open-storage-adapter';

export class SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter
  extends SwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapter
  implements
    ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbKeystoreStore,
    ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore {
  protected storage?: ISecretStorage;

  private credentials?: ISecretStoreCredentials;

  private credentialsCryptoKey?: ISecretStoreCredentialsCryptoKey;

  constructor(
    options: ISwarmStoreConnectorOrbitDbSubclassStoreToSecretStorageAdapterConstructorOptions,
    credentials: ISecretStoreCredentials | ISecretStoreCredentialsCryptoKey
  ) {
    super(options);
    this.setCredentials(credentials);
    this.createSecretStorage();
  }

  /**
   * validate and set credentials with password or crypto key
   *
   * @protected
   * @param {(ISecretStoreCredentials | ISecretStoreCredentialsCryptoKey)} credentials
   * @memberof SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter
   * @throws
   */
  protected setCredentials(
    credentials: ISecretStoreCredentials | ISecretStoreCredentialsCryptoKey
  ) {
    if (!credentials) {
      throw new Error('Credentials must be specified');
    }
    if (typeof credentials !== 'object') {
      throw new Error('Credentials must be an object');
    }

    if ((credentials as ISecretStoreCredentialsCryptoKey).key) {
      const credentialsValidationResult = validateCryptoKeyCredentials(
        credentials as ISecretStoreCredentialsCryptoKey
      );

      if (credentialsValidationResult instanceof Error) {
        console.error(credentialsValidationResult);
        throw new Error('setCredentials::crypto credentials not valid');
      }
      this.credentialsCryptoKey = credentials as ISecretStoreCredentialsCryptoKey;
    }
    this.credentials = credentials as ISecretStoreCredentials;
  }

  protected unsetCredentials() {
    this.credentials = undefined;
  }

  private createSecretStorage() {
    const secretStorage = new SecretStorage(
      SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_STORAGE_ADAPTER_DEFAULT_OPTIONS_STORAGE
    );

    this.storage = secretStorage;
  }

  protected async startStorage(): Promise<Error | boolean> {
    const {
      options,
      credentials,
      storage: secretStorage,
      credentialsCryptoKey,
    } = this;

    if (secretStorage) {
      if (credentialsCryptoKey) {
        return secretStorage.authorizeByKey(credentialsCryptoKey, options);
      } else if (credentials) {
        return secretStorage.authorize(credentials, options);
      }
      return new Error('Credentials was not provided');
    }
    return new Error('Secret storage is not defined');
  }
}
