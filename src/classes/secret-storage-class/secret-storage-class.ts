import {
  TInstanceofStorageProvider,
  TSecretStoreConfiguration,
  TStorageProvider,
  IStorageProvider,
  TSecretStoreCredentials,
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
import { exportKeyAsString } from 'utils/encryption-utils/encryption-utils';
import { decryptDataWithKey } from 'utils/password-utils/decrypt.password-utils';

export class SecretStorage {
  private static error(err: string | Error): Error {
    let errorInstance: Error;

    if (err instanceof Error) {
      errorInstance = err;
    } else {
      errorInstance = new Error(String(err));
    }
    console.error('SecretStorage', errorInstance);
    return errorInstance;
  }

  private static KEY_IN_SESSION_STORAGE = 'uk';

  private k?: CryptoKey;

  private storageProvider?: TInstanceofStorageProvider;

  private storageProviderName?: ownValueOf<
    typeof SECRET_STORAGE_PROVIDERS_NAME
  >;

  public status: ownValueOf<typeof SECRET_STORAGE_STATUS> =
    SECRET_STORAGE_STATUS.STOPPED;

  public errorOccurred?: Error;

  /**
   * returns true if connected succesfully to
   * a storage and have a vaild crypto key
   */
  public isRunning() {
    const { status } = this;

    return status === SECRET_STORAGE_STATUS.RUNNING;
  }

  constructor(private configuration: TSecretStoreConfiguration) {}

  private clearError() {
    this.errorOccurred = undefined;
  }

  private clearStatus() {
    this.status = SECRET_STORAGE_STATUS.STOPPED;
  }

  private clearState() {
    this.clearStatus();
    this.clearError();
  }

  private setStatus(status: ownValueOf<typeof SECRET_STORAGE_STATUS>) {
    this.status = status;
  }

  private setErrorStatus(err: Error | string) {
    if (err) {
      this.errorOccurred = SecretStorage.error(err);
    }
    this.setStatus(SECRET_STORAGE_STATUS.ERROR);
  }

  private setStorageProviderName(storageProviderName: string): boolean {
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
      return new StorageProviderConstructor();
    } catch (err) {
      return err;
    }
  }

  private async runStorageProvider(): Promise<Error | boolean> {
    const { configuration } = this;

    if (configuration) {
      const { storageProviderName } = configuration;

      if (
        storageProviderName &&
        this.setStorageProviderName(storageProviderName)
      ) {
        const storageProviderConstructor =
          SECRET_STORAGE_PROVIDERS[storageProviderName];

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
    }
    throw new Error('There is no storage provider was defined');
  }

  setEncryptonKeyInStorage(key: string): boolean | Error {
    try {
      const { KEY_IN_SESSION_STORAGE } = SecretStorage;

      sessionStorage.setItem(KEY_IN_SESSION_STORAGE, key);
      return true;
    } catch (err) {
      this.setErrorStatus(err);
      return err;
    }
  }

  async readEncryptionKeyFomSessionStorage(): Promise<CryptoKey | Error> {
    try {
      const { KEY_IN_SESSION_STORAGE } = SecretStorage;
      const kFromStorage = sessionStorage.getItem(KEY_IN_SESSION_STORAGE);

      if (typeof kFromStorage !== 'string') {
        return new Error('There is no a valid key in the storage');
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

  async setEncryptionKey(
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

    const result = this.setEncryptonKeyInStorage(keyString);

    if (result instanceof Error) {
      return new Error("Can't save the key in storage");
    }
    this.k = k;
    return true;
  }

  async importCryptoKey(): Promise<boolean | Error> {
    const { k: cryptoKey } = this;

    // check if already imported
    if (cryptoKey instanceof CryptoKey) {
      return true;
    }

    const importedCryptoKey = await this.readEncryptionKeyFomSessionStorage();

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
  async checkIsAuthorized(): Promise<boolean> {
    const result = await this.importCryptoKey();

    return result === true;
  }

  async connect(): Promise<boolean | Error> {
    this.clearState();
    this.setStatus(SECRET_STORAGE_STATUS.CONNECTING);

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

  async authorize(
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

    const setKeyResult = await this.setEncryptionKey(cryptoKey);

    if (setKeyResult instanceof Error) {
      this.setErrorStatus(setKeyResult);
      return setKeyResult;
    }
    return this.connect();
  }

  async getWithStorageProvider(key: string): Promise<string | Error> {
    const { storageProvider } = this;

    if (!storageProvider) {
      return new Error('There is no connection with a storage provider');
    }

    const value = await storageProvider.get(key);

    if (value instanceof Error) {
      return SecretStorage.error(value);
    }
    if (typeof value !== 'string' || !value.length) {
      return SecretStorage.error(
        'There is a wrong value type returned by the storage provider'
      );
    }
    return value;
  }

  async decryptValue(value: string): Promise<string | Error> {
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
    if (typeof decryptedValue !== 'string' || !decryptedValue.length) {
      return SecretStorage.error('A wrong value decrypted');
    }
    return decryptedValue;
  }

  get = async (key: string): Promise<string | Error> => {
    const { isRunning } = this;

    if (!isRunning) {
      return new Error('There is no connection with storage or not authorized');
    }

    const stringEncrypted = await this.getWithStorageProvider(key);

    if (stringEncrypted instanceof Error) {
      return SecretStorage.error(stringEncrypted);
    }
    return this.decryptValue(stringEncrypted);
  };
}
