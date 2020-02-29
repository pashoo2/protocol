import { IStorageProviderOptions } from 'classes/storage-providers/storage-providers.types';
import { validateCryptoKeyCredentials } from './../../../../../secret-storage-class/secret-storage-class-utils/secret-storage-class-utils-main/secret-storage-class-utils-main';
import {
  ISecretStoreCredentials,
  ISecretStoreCredentialsCryptoKey,
} from 'classes/secret-storage-class/secret-storage-class.types';
import { SecretStorage } from 'classes/secret-storage-class/secret-storage-class';
import {
  IOrbitDbCacheStore,
  IOrbitDbKeystoreStore,
} from './swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter.types';
import {
  SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_DEFAULT_OPTIONS_SECRET_STORAGE,
  SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS,
} from './swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter.const';
import { TCallbackError, TCallbackErrorValue } from 'orbit-db-cache';

export class SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter
  implements IOrbitDbKeystoreStore, IOrbitDbCacheStore {
  public get status(): SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS {
    const { isClose } = this;

    if (isClose) {
      return SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS.CLOSE;
    }
    return SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS.OPEN;
  }

  /**
   * this is used in the Cache(orbit-db-cache) in status
   * ` get status () { return this._store.db.status } `
   *
   * @readonly
   * @type {{ status: SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS }}
   * @memberof SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter
   */
  public get db() {
    return {
      status: this.status,
    };
  }

  protected options?: IStorageProviderOptions;

  protected secretStorage?: InstanceType<typeof SecretStorage>;

  private credentials?: ISecretStoreCredentials;

  private credentialsCryptoKey?: ISecretStoreCredentialsCryptoKey;

  protected isOpen: boolean = false;

  protected isClose: boolean = false;

  constructor(
    credentials: ISecretStoreCredentials | ISecretStoreCredentialsCryptoKey,
    options: Required<IStorageProviderOptions>
  ) {
    this.setOptions(options);
    this.setCredentials(credentials);
    this.createSecretStorage();
  }

  public async open(cb?: TCallbackError): Promise<void> {
    const { isClose, isOpen } = this;

    if (isClose) {
      throw new Error('The instance was closed before');
    }
    if (isOpen) {
      return;
    }

    const result = await this.startSecretStorage();

    if (result instanceof Error) {
      throw result;
    }
    this.setIsOpen();
    if (typeof cb === 'function') {
      cb(undefined);
    }
  }

  public close = async (cb?: TCallbackError): Promise<void> => {
    if (!this.isOpen || this.isClose) {
      return;
    }
    this.setIsClose();
    const result = await this.disconnectSecretStorage();

    if (result instanceof Error) {
      console.error(result);
      throw result;
    }
    if (typeof cb === 'function') {
      cb(undefined);
    }
  };

  public async get(
    k: string,
    cb?: TCallbackErrorValue
  ): Promise<string | undefined> {
    // open connection to the secret storage
    // before any operations
    await this.openIfNecessary();

    const secretStorage = this.getSecretStorage();

    if (secretStorage instanceof Error) {
      console.error(secretStorage);
      throw secretStorage;
    }

    const result = await secretStorage.get(k);

    if (result instanceof Error) {
      console.error(result);
      throw result;
    }
    const resulted = result ? result : undefined;
    if (typeof cb === 'function') {
      cb(undefined, resulted);
    }
    return resulted;
  }

  public async put(
    k: string,
    v: string | Buffer,
    cb?: TCallbackError
  ): Promise<void> {
    await this.openIfNecessary();

    const secretStorage = this.getSecretStorage();

    if (secretStorage instanceof Error) {
      console.error(secretStorage);
      throw secretStorage;
    }

    const value = v instanceof Buffer ? v.toString() : v;
    const result = await secretStorage.set(k, value);

    if (result instanceof Error) {
      console.error(result);
      throw result;
    }
    if (typeof cb === 'function') {
      cb(undefined);
    }
  }

  public del(key: string, cb?: TCallbackError) {
    return this.put(key, '', cb);
  }

  // TODO - not implemented in ocrbit-db-cache
  public async load() {}

  // TODO - not implemented in ocrbit-db-cache
  public async destroy() {
    const { secretStorage } = this;

    if (secretStorage) {
      await this.disconnectSecretStorage();
    }
  }

  protected setIsOpen() {
    this.isOpen = true;
  }

  protected setIsClose() {
    this.isClose = true;
  }

  protected getSecretStorage(): Error | SecretStorage {
    const { secretStorage } = this;

    if (secretStorage) {
      return secretStorage;
    }
    return new Error('There is no connection to the SecretStorage');
  }

  protected setOptions(options: Required<IStorageProviderOptions>): void {
    if (!options) {
      throw new Error('Options must be provided');
    }
    if (typeof options !== 'object') {
      throw new Error('Options must be an object');
    }

    const { dbName } = options;

    if (!dbName) {
      throw new Error('A database name must be specified in the options');
    }
    if (typeof dbName !== 'string') {
      throw new Error('A database name must be a string');
    }
    this.options = options;
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
    } else if ((credentials as ISecretStoreCredentials).password) {
      const credentialsValidationResult = SecretStorage.validateCredentials(
        credentials as ISecretStoreCredentials
      );

      if (credentialsValidationResult instanceof Error) {
        console.error(credentialsValidationResult);
        throw new Error('setCredentials::credentials not valid');
      }
      this.credentials = credentials as ISecretStoreCredentials;
    }
  }

  protected unsetCredentials() {
    this.credentials = undefined;
  }

  private createSecretStorage() {
    const secretStorage = new SecretStorage(
      SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_DEFAULT_OPTIONS_SECRET_STORAGE
    );

    this.secretStorage = secretStorage;
  }

  private unsetSecretStorage() {
    this.secretStorage = undefined;
  }

  private startSecretStorage(): Promise<Error | boolean> | Error {
    const { options, credentials, secretStorage, credentialsCryptoKey } = this;

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

  private async disconnectSecretStorage(): Promise<Error | void> {
    const { secretStorage } = this;

    if (!secretStorage) {
      return new Error(
        'There is no instance of the SecretStorage connected to'
      );
    }
    try {
      const result = await secretStorage.disconnect();

      if (result instanceof Error) {
        return result;
      }
    } catch (err) {
      return err;
    }
    this.unsetSecretStorage();
  }

  protected async openIfNecessary(): Promise<void> {
    const { isOpen } = this;

    if (isOpen) {
      return;
    }
    await this.open();
  }
}
