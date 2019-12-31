import {
  TInstanceofStorageProvider,
  TSecretStoreConfiguration,
  IStorageProvider,
  ISecretStoreCredentials,
  ISecretStorage,
  ISecretStorageOptions,
  ISecretStoreCredentialsCryptoKey,
} from './secret-storage-class.types';
import {
  SECRET_STORAGE_PROVIDERS,
  SECRET_STORAGE_PROVIDERS_NAME,
  SECRET_STORAGE_PROVIDERS_NAMES,
  SECRET_STORAGE_STATUS,
  SECRET_STORAGE_PASSWORD_MIN_LENGTH,
} from './secret-storage-class.const';
import { ownValueOf, ownKeyOf } from 'types/helper.types';
import {
  importPasswordKey,
  exportPasswordKeyAsString,
  importPasswordKeyFromString,
  generatePasswordKeyByPasswordString,
} from 'utils/password-utils/derive-key.password-utils';
import { TPASSWORD_ENCRYPTION_KEY_IMPORT_NATIVE_SUPPORTED_TYPES } from 'utils/password-utils/password-utils.types';
import {
  decryptDataWithKey,
  decryptDataWithKeyFromUint8Array,
} from 'utils/password-utils/decrypt.password-utils';
import {
  encryptDataToString,
  encryptDataToUInt8Array,
} from 'utils/password-utils/encrypt.password-utils';
import { getStatusClass } from 'classes/basic-classes/status-class-base/status-class-base';

export class SecretStorage
  extends getStatusClass<typeof SECRET_STORAGE_STATUS>({
    errorStatus: SECRET_STORAGE_STATUS.ERROR,
    instanceName: 'SecretStorage',
  })
  implements ISecretStorage {
  public static validateCredentials(
    credentials?: ISecretStoreCredentials
  ): void | Error {
    if (!credentials) {
      return new Error('validateCredentials::Credentials must not be empty');
    }
    if (typeof credentials !== 'object') {
      return new Error('validateCredentials::Credentials must be an object');
    }

    const { password } = credentials;

    if (typeof password !== 'string') {
      return new Error(
        'validateCredentials::A password string must be provided to authorize'
      );
    }
    if (!password) {
      return new Error(
        'validateCredentials::A password non-empty string must be provided to authorize'
      );
    }
    if (password.length < SECRET_STORAGE_PASSWORD_MIN_LENGTH) {
      return new Error(
        `validateCredentials::The password string must be a ${SECRET_STORAGE_PASSWORD_MIN_LENGTH} characters ar least`
      );
    }
  }

  public static validateCryptoKeyCredentials(
    credentials?: ISecretStoreCredentialsCryptoKey
  ): void | Error {
    if (!credentials) {
      return new Error(
        'validateCryptoKeyCredentials::Credentials must not be empty'
      );
    }
    if (typeof credentials !== 'object') {
      return new Error(
        'validateCryptoKeyCredentials::Credentials must be an object'
      );
    }

    const { key } = credentials;

    if (!key) {
      return new Error(
        'validateCryptoKeyCredentials::A Key must be provided to authorize'
      );
    }
    if (key instanceof CryptoKey) {
      return;
    }
    return new Error(
      'validateCryptoKeyCredentials::A Key must be ab instance of CryptoKey'
    );
  }

  public static async generatePasswordKeyByPasswordString(
    password: string
  ): Promise<CryptoKey | Error> {
    if (!password) {
      return new Error();
    }

    // TODO
    return generatePasswordKeyByPasswordString(password, '');
  }

  private static checkIsStorageProviderInstance(
    storageProviderInstance: any
  ): Error | boolean {
    if (
      !storageProviderInstance ||
      typeof storageProviderInstance !== 'object'
    ) {
      return new Error('Storage provider must be an object');
    }

    const { connect, get, set, disconnect } = storageProviderInstance;

    if (
      typeof connect !== 'function' ||
      typeof get !== 'function' ||
      typeof set !== 'function' ||
      typeof disconnect !== 'function'
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

  /**
   * check whether the storage provider
   * is support operations on
   * UInt8Array values
   *
   * @private
   * @type {boolean}
   * @memberof SecretStorage
   */
  private isStorageProviderSupportUInt8Array: boolean = false;

  private authStorageProvider?: TInstanceofStorageProvider;

  private storageProviderName?: ownValueOf<
    typeof SECRET_STORAGE_PROVIDERS_NAME
  >;

  /**
   * options for the instance
   *
   * @private
   * @type {ISecretStorageOptions}
   * @memberof SecretStorage
   */
  private options?: ISecretStorageOptions;

  /**
   * name of the database
   *
   * @private
   * @type {string}
   * @memberof SecretStorage
   */
  private dbName?: string;

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

  private setSupportForUInt8Array(
    StorageProviderConstructor: IStorageProvider
  ): void {
    this.isStorageProviderSupportUInt8Array = !!StorageProviderConstructor.isBufferSupported;
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

    const authStorageProvider = this.createInstanceOfStorageProvider(
      AuthStorageProvider
    );

    if (authStorageProvider instanceof Error) {
      return authStorageProvider;
    }

    const { dbName } = this;
    const connectResult = await authStorageProvider.connect({
      dbName,
    });

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

        this.setSupportForUInt8Array(storageProviderConstructor);
        if (storageProviderConstructor) {
          const storageProvider = this.createInstanceOfStorageProvider(
            storageProviderConstructor
          );

          if (storageProvider instanceof Error) {
            return storageProvider;
          }

          const { dbName } = this;
          const storageProviderIsRunning = await storageProvider.connect({
            dbName,
          });

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

  protected setOptions(options?: ISecretStorageOptions): void {
    if (options && typeof options === 'object') {
      this.options = options;

      const { dbName } = options;

      if (dbName && typeof dbName === 'string') {
        this.dbName = dbName;
      }
    }
  }

  public async connect(
    options?: ISecretStorageOptions
  ): Promise<boolean | Error> {
    this.clearState();
    this.setStatus(SECRET_STORAGE_STATUS.CONNECTING);
    this.setOptions(options);

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
    credentials: ISecretStoreCredentials,
    options?: ISecretStorageOptions
  ): Promise<boolean | Error> {
    const credentialsValidationResult = SecretStorage.validateCredentials(
      credentials
    );

    if (credentialsValidationResult instanceof Error) {
      this.setErrorStatus(credentialsValidationResult);
      return credentialsValidationResult;
    }

    const cryptoKey = await SecretStorage.generatePasswordKeyByPasswordString(
      credentials.password
    );

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
    return this.connect(options);
  }

  public async authorizeByKey(
    credentials: ISecretStoreCredentialsCryptoKey,
    options?: ISecretStorageOptions
  ): Promise<boolean | Error> {
    const credentialsValidationResult = SecretStorage.validateCryptoKeyCredentials(
      credentials
    );

    if (credentialsValidationResult instanceof Error) {
      this.setErrorStatus(credentialsValidationResult);
      return credentialsValidationResult;
    }

    const { key: cryptoKey } = credentials;
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
    return this.connect(options);
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
        'There is a wrong value type returned by the storage provider. A string must be returned'
      );
    }
    return value;
  }

  protected async getWithStorageProviderUint8Array(
    key: string
  ): Promise<Uint8Array | Error | undefined> {
    const { storageProvider } = this;

    if (!storageProvider) {
      return new Error('There is no connection with a storage provider');
    }

    if (typeof storageProvider.getUInt8Array !== 'function') {
      return new Error(
        'The storage provider which support Uint8Array must provide the method called getUInt8Array'
      );
    }

    const value = await storageProvider.getUInt8Array(key);

    if (!value) {
      return undefined;
    }
    if (value instanceof Error) {
      return SecretStorage.error(value);
    }
    if (!(value instanceof Uint8Array) || !value.length) {
      return SecretStorage.error(
        'There is a wrong value type returned by the storage provider. An instance of Uint8Array must be returned'
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

  protected async decryptValueFromUInt8Array(
    value: Uint8Array
  ): Promise<string | Error> {
    const { k } = this;

    if (!(k instanceof CryptoKey)) {
      return SecretStorage.error(
        'There is no a valid key to decrypt the value'
      );
    }
    if (!value.length) {
      return SecretStorage.error('The value must not be empty');
    }

    const decryptedValue = await decryptDataWithKeyFromUint8Array(k, value);

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

    const { isStorageProviderSupportUInt8Array } = this;

    const valueEncrypted = await (isStorageProviderSupportUInt8Array
      ? this.getWithStorageProviderUint8Array(key)
      : this.getWithStorageProvider(key));

    if (valueEncrypted === undefined) {
      return valueEncrypted;
    }
    if (valueEncrypted instanceof Error) {
      return SecretStorage.error(valueEncrypted);
    }

    const decryptResult = await (valueEncrypted instanceof Uint8Array
      ? this.decryptValueFromUInt8Array(valueEncrypted)
      : this.decryptValue(valueEncrypted));

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

  protected async setWithStorageProviderUInt8Array(
    key: string,
    value: Uint8Array
  ): Promise<boolean | Error> {
    const { storageProvider } = this;

    if (!storageProvider) {
      return new Error(
        'There is no an active connection with storage provider'
      );
    }
    if (typeof storageProvider.setUInt8Array !== 'function') {
      return new Error(
        "The storage provider doesn't have the method setUInt8Array"
      );
    }

    const result = await storageProvider.setUInt8Array(key, value);

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

  /**
   * encrypts string to the UInt8Array
   *
   * @protected
   * @param {string} value
   * @returns {(Promise<Uint8Array | Error>)}
   * @memberof SecretStorage
   */
  protected async encryptValueAsInt8Array(
    value: string | Uint8Array
  ): Promise<Uint8Array | Error> {
    const { k } = this;

    if (!(k instanceof CryptoKey)) {
      return new Error('There is no key to encrypt the value');
    }

    const encryptedValue = await encryptDataToUInt8Array(k, value);

    if (encryptedValue instanceof Error) {
      return encryptedValue;
    }
    if (!(encryptedValue instanceof Uint8Array) || !encryptedValue.length) {
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
    const encryptedValue = this.isStorageProviderSupportUInt8Array
      ? await this.encryptValueAsInt8Array(value)
      : await this.encryptValue(value);

    if (encryptedValue instanceof Error) {
      return SecretStorage.error(encryptedValue);
    }

    const storeValueResult = await (encryptedValue instanceof Uint8Array
      ? this.setWithStorageProviderUInt8Array(key, encryptedValue)
      : this.setWithStorageProvider(key, encryptedValue));

    if (storeValueResult instanceof Error) {
      return SecretStorage.error(storeValueResult);
    }
    return storeValueResult;
  }
}
