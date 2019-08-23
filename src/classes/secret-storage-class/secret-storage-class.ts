import {
  TInstanceofStorageProvider,
  TSecretStoreConfiguration,
  TStorageProvider,
  IStorageProvider,
  TSecretStoreCredentials,
  ISecretStorage,
} from './secret-storage-class.types';
import {
  SECRET_STORAGE_PROVIDERS,
  SECRET_STORAGE_PROVIDERS_NAME,
  SECRET_STORAGE_PROVIDERS_NAMES,
  SECRET_STORAGE_STATUS,
} from './secret-storage-class.const';
import { ownValueOf, ownKeyOf } from 'types/helper.types';
import {
  importPasswordKey,
  exportPasswordKeyAsString,
  importPasswordKeyFromString,
  generatePasswordKeyByPasswordString,
} from 'utils/password-utils/derive-key.password-utils';
import { TPASSWORD_ENCRYPTION_KEY_IMPORT_NATIVE_SUPPORTED_TYPES } from 'utils/password-utils/password-utils.types';
import { decryptDataWithKey } from 'utils/password-utils/decrypt.password-utils';
import { encryptDataToString } from 'utils/password-utils/encrypt.password-utils';
import { getStatusClass } from 'classes/basic-classes/status-class-base/status-class-base';

export class SecretStorage
  extends getStatusClass<typeof SECRET_STORAGE_STATUS>({
    errorStatus: SECRET_STORAGE_STATUS.ERROR,
    instanceName: 'SecretStorage',
  })
  implements ISecretStorage {
  private static checkIsStorageProviderInstance(
    storageProviderInstance: any
  ): Error | boolean {
    if (
      !storageProviderInstance ||
      typeof storageProviderInstance !== 'object'
    ) {
      return new Error('Storage provider must be an object');
    }

    const { connect, get, set } = storageProviderInstance;

    if (
      typeof connect !== 'function' ||
      typeof get !== 'function' ||
      typeof set !== 'function'
    ) {
      return new Error(
        'The instance has a wrong implemntation of a StorageProvider interface'
      );
    }
    return true;
  }

  private static AuthStorageProvider: IStorageProvider =
    SECRET_STORAGE_PROVIDERS[SECRET_STORAGE_PROVIDERS_NAME.SESSION_STORAGE];

  private static KEY_IN_AUTH_STORAGE = '__SecretStorage__uk';

  private k?: CryptoKey;

  private storageProvider?: TInstanceofStorageProvider;

  private authStorageProvider?: TInstanceofStorageProvider;

  private storageProviderName?: ownValueOf<
    typeof SECRET_STORAGE_PROVIDERS_NAME
  >;

  /**
   * returns true if connected succesfully to
   * a storage and have a vaild crypto key
   */
  protected isRunning() {
    const { status } = this;

    return status === SECRET_STORAGE_STATUS.RUNNING;
  }

  public get isActive() {
    return !!this.isRunning();
  }

  /**
   * @param {object} configuration
   * @param {strig} [SECRET_STORAGE_PROVIDERS_NAME.LOCAL_STORAGE] configuration.storageProviderName
   * - provider name use to store a secret data
   */
  constructor(
    protected configuration: Partial<TSecretStoreConfiguration> = {}
  ) {
    super();
  }

  private setStorageProviderName(
    storageProviderName: string = SECRET_STORAGE_PROVIDERS_NAME.LOCAL_STORAGE
  ): boolean {
    if (SECRET_STORAGE_PROVIDERS_NAMES.includes(storageProviderName)) {
      this.storageProviderName = storageProviderName;
      return true;
    }
    return false;
  }

  private createInstanceOfStorageProvider(
    StorageProviderConstructor: IStorageProvider
  ): TInstanceofStorageProvider | Error {
    try {
      const storageProvider = new StorageProviderConstructor();
      const checkResult = SecretStorage.checkIsStorageProviderInstance(
        storageProvider
      );

      if (checkResult instanceof Error) {
        return checkResult;
      }
      return storageProvider;
    } catch (err) {
      return err;
    }
  }

  private async runAuthStorageProvider(): Promise<boolean | Error> {
    const { authStorageProvider: runningAuthStorageProvider } = this;
    const checkIsRunning = SecretStorage.checkIsStorageProviderInstance(
      runningAuthStorageProvider
    );

    /**
     * if running already
     */
    if (checkIsRunning === true) {
      return true;
    }

    const { AuthStorageProvider } = SecretStorage;

    if (!AuthStorageProvider) {
      return new Error('There is no provider for the auth storage is defined');
    }

    const authStorageProvider = await this.createInstanceOfStorageProvider(
      AuthStorageProvider
    );

    if (authStorageProvider instanceof Error) {
      return authStorageProvider;
    }

    const connectResult = await authStorageProvider.connect();

    if (connectResult instanceof Error) {
      return connectResult;
    }
    if (connectResult !== true) {
      return new Error(
        'There is a wrong result was returned by auth storage provider'
      );
    }
    this.authStorageProvider = authStorageProvider;
    return true;
  }

  protected async runStorageProvider(): Promise<Error | boolean> {
    const { configuration } = this;

    if (configuration) {
      const { storageProviderName } = configuration;

      if (this.setStorageProviderName(storageProviderName)) {
        const { storageProviderName: storageProviderChosenName } = this;

        if (!storageProviderChosenName) {
          return new Error('There is no storage provider was choosed');
        }
        const storageProviderConstructor =
          SECRET_STORAGE_PROVIDERS[storageProviderChosenName];

        if (storageProviderConstructor) {
          const storageProvider = this.createInstanceOfStorageProvider(
            storageProviderConstructor
          );

          if (storageProvider instanceof Error) {
            return storageProvider;
          }

          const storageProviderIsRunning = await storageProvider.connect();

          if (storageProviderIsRunning instanceof Error) {
            return storageProviderIsRunning;
          }
          this.storageProvider = storageProvider;
          return true;
        }
      }
      throw new Error('Failed to set the name of the storage provider');
    }
    throw new Error('There is no storage provider configuration was defined');
  }

  protected async setEncryptonKeyAuthInStorage(
    key: string
  ): Promise<boolean | Error> {
    try {
      const { KEY_IN_AUTH_STORAGE: KEY_IN_SESSION_STORAGE } = SecretStorage;
      const { authStorageProvider } = this;

      if (!authStorageProvider) {
        return new Error('There is no an auth storage running');
      }
      return authStorageProvider.set(KEY_IN_SESSION_STORAGE, key);
    } catch (err) {
      this.setErrorStatus(err);
      return err;
    }
  }

  protected async readEncryptionKeyFomAuthStorage(): Promise<
    CryptoKey | Error
  > {
    try {
      const { KEY_IN_AUTH_STORAGE: KEY_IN_SESSION_STORAGE } = SecretStorage;
      const { authStorageProvider } = this;

      if (!authStorageProvider) {
        return new Error('There is no an auth storage running');
      }

      const kFromStorage = await authStorageProvider.get(
        KEY_IN_SESSION_STORAGE
      );

      if (typeof kFromStorage !== 'string') {
        return new Error('There is no a valid user secret key was stored');
      }

      const cryptoKeyImported = await importPasswordKeyFromString(kFromStorage);

      if (!(cryptoKeyImported instanceof CryptoKey)) {
        return new Error("Can't import the key from the storage format");
      }
      return cryptoKeyImported;
    } catch (err) {
      this.setErrorStatus(err);
      return err;
    }
  }

  protected async setEncryptionKey(
    key: TPASSWORD_ENCRYPTION_KEY_IMPORT_NATIVE_SUPPORTED_TYPES | CryptoKey
  ): Promise<boolean | Error> {
    let k;

    if (key instanceof CryptoKey) {
      k = key;
    } else {
      const importedKey = await importPasswordKey(key);

      if (importedKey instanceof Error) {
        return importedKey;
      }
    }
    if (!(k instanceof CryptoKey)) {
      return new Error('Unknown type of the key');
    }

    const keyString = await exportPasswordKeyAsString(k);

    if (keyString instanceof Error) {
      return new Error("Can't convert the key to exported format");
    }

    const result = await this.setEncryptonKeyAuthInStorage(keyString);

    if (result instanceof Error) {
      return new Error("Can't save the key in storage");
    }
    this.k = k;
    return true;
  }

  protected async importCryptoKey(): Promise<boolean | Error> {
    const { k: cryptoKey } = this;

    // check if already imported
    if (cryptoKey instanceof CryptoKey) {
      return true;
    }

    const importedCryptoKey = await this.readEncryptionKeyFomAuthStorage();

    if (importedCryptoKey instanceof Error) {
      this.setErrorStatus(importedCryptoKey);
      return importedCryptoKey;
    }

    const resultSetImportKey = await this.setEncryptionKey(importedCryptoKey);

    if (resultSetImportKey instanceof Error) {
      this.setErrorStatus(resultSetImportKey);
      return resultSetImportKey;
    }
    return true;
  }

  /**
   * check if a crypto key is already exists
   * in session storage or a cached in memory
   */
  protected async checkIsAuthorized(): Promise<boolean> {
    const result = await this.importCryptoKey();

    return result === true;
  }

  protected async connect(): Promise<boolean | Error> {
    this.clearState();
    this.setStatus(SECRET_STORAGE_STATUS.CONNECTING);

    const resultRunAuthProvider = await this.runAuthStorageProvider();

    if (resultRunAuthProvider instanceof Error) {
      this.setErrorStatus(resultRunAuthProvider);
      return resultRunAuthProvider;
    }

    const isKeyExists = await this.importCryptoKey();

    if (isKeyExists instanceof Error) {
      this.setErrorStatus(isKeyExists);
      return isKeyExists;
    }

    const isStorageProviderStarted = await this.runStorageProvider();

    if (isStorageProviderStarted instanceof Error) {
      this.setErrorStatus(isStorageProviderStarted);
      return isStorageProviderStarted;
    }
    this.setStatus(SECRET_STORAGE_STATUS.RUNNING);
    return true;
  }

  protected reset() {
    this.clearError();
    this.clearStatus();
    this.clearState();
    this.k = undefined;
    this.authStorageProvider = undefined;
  }

  protected async storageProviderDisconnect(): Promise<boolean | Error> {
    const { authStorageProvider } = this;

    if (authStorageProvider) {
      return authStorageProvider.disconnect();
    }
    return new Error('There is no Auth storage provider defined');
  }

  public async disconnect(): Promise<boolean | Error> {
    const resultDisconnectFromStorageProvider = await this.storageProviderDisconnect();

    if (resultDisconnectFromStorageProvider instanceof Error) {
      console.error(resultDisconnectFromStorageProvider);
      return new Error('Failed to disconnect from the storage provider');
    }
    this.reset();
    this.setStatus(SECRET_STORAGE_STATUS.STOPPED);
    return true;
  }

  public async authorize(
    credentials: TSecretStoreCredentials
  ): Promise<boolean | Error> {
    const { password } = credentials;

    if (typeof password !== 'string') {
      const err = new Error('A password string must be provided to authorize');

      this.setErrorStatus(err);
      return err;
    }

    const cryptoKey = await generatePasswordKeyByPasswordString(password);

    if (cryptoKey instanceof Error) {
      this.setErrorStatus(cryptoKey);
      return cryptoKey;
    }

    const resultRunAuthProvider = await this.runAuthStorageProvider();

    if (resultRunAuthProvider instanceof Error) {
      this.setErrorStatus(resultRunAuthProvider);
      return resultRunAuthProvider;
    }

    const setKeyResult = await this.setEncryptionKey(cryptoKey);

    if (setKeyResult instanceof Error) {
      this.setErrorStatus(setKeyResult);
      return setKeyResult;
    }
    return this.connect();
  }

  protected async getWithStorageProvider(
    key: string
  ): Promise<string | Error | undefined> {
    const { storageProvider } = this;

    if (!storageProvider) {
      return new Error('There is no connection with a storage provider');
    }

    const value = await storageProvider.get(key);

    if (value instanceof Error) {
      return SecretStorage.error(value);
    }
    if (value === undefined) {
      return value;
    }
    if (typeof value !== 'string' || !value.length) {
      return SecretStorage.error(
        'There is a wrong value type returned by the storage provider'
      );
    }
    return value;
  }

  protected async decryptValue(value: string): Promise<string | Error> {
    const { k } = this;

    if (!(k instanceof CryptoKey)) {
      return SecretStorage.error(
        'There is no a valid key to decrypt the value'
      );
    }

    const decryptedValue = await decryptDataWithKey(k, value);

    if (decryptedValue instanceof Error) {
      return SecretStorage.error(decryptedValue);
    }
    if (typeof decryptedValue !== 'string') {
      return SecretStorage.error('A wrong value decrypted');
    }
    return decryptedValue;
  }

  public get = async (key: string): Promise<string | Error | undefined> => {
    const { isRunning } = this;

    if (!isRunning) {
      return new Error('There is no connection with storage or not authorized');
    }

    const stringEncrypted = await this.getWithStorageProvider(key);

    if (stringEncrypted === undefined) {
      return stringEncrypted;
    }
    if (stringEncrypted instanceof Error) {
      return SecretStorage.error(stringEncrypted);
    }
    const decryptResult = await this.decryptValue(stringEncrypted);

    if (decryptResult instanceof Error) {
      return decryptResult;
    }
    return decryptResult || undefined;
  };

  protected async setWithStorageProvider(
    key: string,
    value: string
  ): Promise<boolean | Error> {
    const { storageProvider } = this;

    if (!storageProvider) {
      return new Error(
        'There is no an active connection with storage provider'
      );
    }

    const result = await storageProvider.set(key, value);

    if (result instanceof Error) {
      return result;
    }
    if (result !== true) {
      return new Error(
        'A wrong result on set the value into the storage provider'
      );
    }
    return true;
  }

  protected async encryptValue(value: string): Promise<string | Error> {
    const { k } = this;

    if (!(k instanceof CryptoKey)) {
      return new Error('There is no key to encrypt the value');
    }

    const encryptedValue = await encryptDataToString(k, value);

    if (encryptedValue instanceof Error) {
      return encryptedValue;
    }
    if (typeof encryptedValue !== 'string' || !encryptedValue.length) {
      return new Error('A wrong encryption result for the value');
    }
    return encryptedValue;
  }

  public async set(key: string, value: string): Promise<boolean | Error> {
    const { isRunning } = this;

    if (!isRunning) {
      return SecretStorage.error(
        'The instance of SecretStorage is not connected to the storage provider or there is no an encryption key'
      );
    }
    //value - must be an escaped sctring
    const encryptedValue = await this.encryptValue(value);
    if (encryptedValue instanceof Error) {
      return SecretStorage.error(encryptedValue);
    }

    const storeValueResult = await this.setWithStorageProvider(
      key,
      encryptedValue
    );

    if (storeValueResult instanceof Error) {
      return SecretStorage.error(storeValueResult);
    }
    return storeValueResult;
  }
}
