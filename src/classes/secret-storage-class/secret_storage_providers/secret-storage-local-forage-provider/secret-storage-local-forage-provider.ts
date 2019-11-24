import localforage from 'localforage';
import {
  StorageProvider,
  IStorageProviderOptions,
} from '../../secret-storage-class.types';
import {
  SECRET_STORAGE_LOCAL_FORAGE_PROVIDER_DEFAULTS_DB_NAME,
  SECRET_STORAGE_LOCAL_FORAGE_PROVIDER_DRIVER,
} from './secret-storage-local-forage-provider.const';

/**
 * The main advantage of using the LocalForage provider because
 * it can store a large binary data(such as UInt8Array) as is
 * without an issues caused unsupported encoding
 *
 * @export
 * @class SecretStorageProviderLocalForage
 * @implements {StorageProvider}
 */
export class SecretStorageProviderLocalForage implements StorageProvider {
  public static isBufferSupported = true;

  private localForage?: LocalForage;

  private dbName: string = SECRET_STORAGE_LOCAL_FORAGE_PROVIDER_DEFAULTS_DB_NAME;

  private options?: IStorageProviderOptions;

  private isDisconnected: boolean = false;

  public async connect(
    options?: IStorageProviderOptions
  ): Promise<true | Error> {
    try {
      const { isDisconnected } = this;

      if (isDisconnected) {
        return new Error(
          'The instance of the SecretStorageProvider was closed before'
        );
      }

      this.setOptions(options);

      const res = await this.createInstanceOfLocalforage();

      if (res instanceof Error) {
        console.error('SecretStorageProviderLevelJS', res);
        return res;
      }
      return true;
    } catch (err) {
      console.error('SecretStorageProviderLevelJS', err);
      return err;
    }
  }

  public async disconnect(): Promise<true | Error> {
    try {
      const { localForage, isDisconnected } = this;

      if (isDisconnected) {
        return true;
      }
      this.setIsDisconnected();
      if (localForage) {
        await localForage.ready();

        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return true;
  }

  /**
   * WARNING! If the value is empty
   * it will be removed with the leveljs.del
   *
   * @param {string} key
   * @param {string} [value]
   * @returns {(Promise<Error | true>)}
   * @memberof SecretStorageProviderLevelJS
   */
  public async set(key: string, value?: string): Promise<Error | true> {
    try {
      const isDisconnected = this.checkIsReady();

      if (isDisconnected instanceof Error) {
        return isDisconnected;
      }

      const { localForage: levelStorage } = this;

      if (!levelStorage) {
        return new Error('There is no storage connected');
      }
      if (!value) {
        await levelStorage.removeItem(key);
      } else {
        await levelStorage.setItem(key, value);
      }
      return true;
    } catch (err) {
      return err;
    }
  }

  /**
   * WARNING! If the value is empty
   * it will be removed with the leveljs.del
   *
   * @param {string} key
   * @param {string} [value]
   * @returns {(Promise<Error | true>)}
   * @memberof SecretStorageProviderLevelJS
   */
  public async setUInt8Array(
    key: string,
    value?: Uint8Array
  ): Promise<Error | true> {
    try {
      const isDisconnected = this.checkIsReady();

      if (isDisconnected instanceof Error) {
        return isDisconnected;
      }

      const { localForage: levelStorage } = this;

      if (!levelStorage) {
        return new Error('There is no storage connected');
      }
      if (!value) {
        await levelStorage.removeItem(key);
      } else {
        await levelStorage.setItem(key, value);
      }
      return true;
    } catch (err) {
      return err;
    }
  }

  public async get(key: string): Promise<Error | string | undefined> {
    try {
      const isDisconnected = this.checkIsReady();

      if (isDisconnected instanceof Error) {
        return isDisconnected;
      }

      const { localForage: levelStorage } = this;
      const item = await levelStorage!.getItem(key);

      if (typeof item !== 'string') {
        return undefined;
      }
      return item;
    } catch (err) {
      return err;
    }
  }

  public async getUInt8Array(
    key: string
  ): Promise<Error | Uint8Array | undefined> {
    try {
      const isDisconnected = this.checkIsReady();

      if (isDisconnected instanceof Error) {
        return isDisconnected;
      }

      const { localForage: levelStorage } = this;
      // TODO - the custom patch used to return
      // Uint8Array instead of Buffer
      const item = await levelStorage!.getItem(key);

      if (!item) {
        return undefined;
      }
      return new Uint8Array(item as any);
    } catch (err) {
      return err;
    }
  }

  protected setOptions(options?: IStorageProviderOptions): void {
    if (options && typeof options === 'object') {
      this.options = options;

      const { dbName } = options;

      if (dbName && typeof dbName === 'string') {
        this.dbName = dbName;
      }
    }
  }

  protected setIsDisconnected() {
    this.isDisconnected = true;
  }

  protected checkIsReady(): void | Error {
    const { isDisconnected, localForage: levelStorage } = this;

    if (isDisconnected) {
      return new Error('The StorageProvider instance is disconnected');
    }
    if (!levelStorage) {
      return new Error('There is no storage connected');
    }
  }

  protected async createInstanceOfLocalforage(): Promise<void | Error> {
    const { dbName } = this;
    const dbNameRes =
      dbName || SECRET_STORAGE_LOCAL_FORAGE_PROVIDER_DEFAULTS_DB_NAME;

    const localForage = localforage.createInstance({
      name: dbNameRes,
      storeName: dbNameRes,
      driver: SECRET_STORAGE_LOCAL_FORAGE_PROVIDER_DRIVER,
    });

    try {
      await localForage.ready();
    } catch (err) {
      return err;
    }
    this.localForage = localForage;
  }
}
