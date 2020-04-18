import levelup, { LevelUp } from 'levelup';
import leveljs from 'level-js';
import {
  StorageProvider,
  IStorageProviderOptions,
} from '../storage-providers.types';
import { SECRET_STORAGE_LEVELJS_PROVIDER_DEFAULTS_DB_NAME } from './secret-storage-level-js-provider.const';

export class SecretStorageProviderLevelJS implements StorageProvider {
  public static isBufferSupported = true;

  private levelStorage?: LevelUp;

  private dbName: string = SECRET_STORAGE_LEVELJS_PROVIDER_DEFAULTS_DB_NAME;

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

      const res = await this.createInstanceOfLevelDB();

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
      const { levelStorage, isDisconnected } = this;

      if (isDisconnected) {
        return true;
      }
      this.setIsDisconnected();
      if (levelStorage) {
        await levelStorage.close();
      }
    } catch (err) {
      console.error(err);
      return err;
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

      const { levelStorage } = this;

      if (!levelStorage) {
        return new Error('There is no storage connected');
      }
      if (!value) {
        return this.unset(key);
      } else {
        await levelStorage.put(key, value);
      }
      return true;
    } catch (err) {
      return err;
    }
  }

  public async unset(key: string): Promise<Error | true> {
    try {
      const isDisconnected = this.checkIsReady();

      if (isDisconnected instanceof Error) {
        return isDisconnected;
      }

      const { levelStorage } = this;

      if (!levelStorage) {
        return new Error('There is no storage connected');
      }
      await levelStorage.del(key);
      return true;
    } catch (err) {
      return err;
    }
  }

  public async clearDb(): Promise<Error | boolean> {
    try {
      const isDisconnected = this.checkIsReady();
      const { levelStorage } = this;

      if (isDisconnected instanceof Error) {
        return isDisconnected;
      }
      if (!levelStorage) {
        return new Error('There is no connection to the local forage');
      }
      if (this.dbName === SECRET_STORAGE_LEVELJS_PROVIDER_DEFAULTS_DB_NAME) {
        return new Error("The DEFAULT database can't be removed");
      }
      if (!(levelStorage as any).clear) {
        return new Error(
          'The version of the library does not supports for a db clearing'
        );
      }
      await (levelStorage as any).clear();
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

      const { levelStorage } = this;

      if (!levelStorage) {
        return new Error('There is no storage connected');
      }
      if (!value) {
        return this.unset(key);
      }
      await levelStorage.put(key, value);
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

      const { levelStorage } = this;
      const item = await levelStorage!.get(key, { asBuffer: false });

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

      const { levelStorage } = this;
      // TODO - the custom patch used to return
      // Uint8Array instead of Buffer
      const item = await levelStorage!.get(key, { asBuffer: true });

      return new Uint8Array(item);
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
    const { isDisconnected, levelStorage } = this;

    if (isDisconnected) {
      return new Error('The StorageProvider instance is disconnected');
    }
    if (!levelStorage) {
      return new Error('There is no storage connected');
    }
  }

  protected async createInstanceOfLevelDB(): Promise<void | Error> {
    const { dbName } = this;
    const levelStorage = levelup(leveljs(dbName));

    try {
      await levelStorage.open();
    } catch (err) {
      return err;
    }
    this.levelStorage = levelStorage;
  }
}
