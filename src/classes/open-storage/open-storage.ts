import { OPEN_STORAGE_KEY_PREFIX } from './open-storage.const';
import { STORAGE_PROVIDERS_NAME } from './../storage-providers/storage-providers.const';
import {
  StorageProvider,
  IStorageProviderOptions,
} from 'classes/storage-providers/storage-providers.types';
import { getStorageProviderByName } from 'classes/storage-providers';
import {
  OpenStorageClass,
  IOpenStorageConfiguration,
} from './open-storage.types';

/**
 * This class used to store values
 * into a persistant storage by with
 * no encryption of the data saved.
 * TODO - add caching of a mostly used
 * data in the memory.
 */
export class OpenStorage implements OpenStorageClass {
  public get isActive(): boolean {
    return !!this.storageProvider;
  }

  public get isBufferSupported() {
    return (
      this.isActive &&
      !!this.storageProvider &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      !!(this.storageProvider as any).constructor.isBufferSupported
    );
  }

  protected get isDbNameSupported() {
    return (
      this.isActive &&
      !this.storageProvider &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      !!(this.storageProvider as any).constructor.isDbNameSupported
    );
  }

  protected storageProvider?: StorageProvider;

  protected dbName?: string;

  public connect = async (
    configuration?: IOpenStorageConfiguration
  ): Promise<void | Error> => {
    const { options, storageProviderName } = configuration || {};
    const storageProvider = getStorageProviderByName(
      storageProviderName || STORAGE_PROVIDERS_NAME.LOCAL_FORAGE
    );

    if (!storageProvider) {
      return new Error(
        `There is no storage provider with the name ${storageProviderName}`
      );
    }

    const connectToStorageProviderResult = await storageProvider.connect(
      options
    );

    if (connectToStorageProviderResult instanceof Error) {
      console.error(connectToStorageProviderResult);
      return new Error('Failed to connect to the storage provider');
    }
    this.setStorageProviderConnection(storageProvider);
    this.setOptions(options);
  };

  public disconnect = async (): Promise<Error | void> => {
    const { isActive, storageProvider } = this;

    if (isActive && storageProvider) {
      const disconnectResult = await storageProvider.disconnect();

      if (disconnectResult instanceof Error) {
        console.error(disconnectResult);
        return new Error('Failed to disconnect from the storage provider');
      }
    }
    this.unsetStorageProviderConnection();
    this.unsetOptions();
  };

  public set = async (
    key: string,
    value?: string
  ): Promise<boolean | Error> => {
    const { isActive, storageProvider } = this;

    if (!isActive || !storageProvider) {
      return new Error('There is no connection to a StorageProvider');
    }
    return storageProvider.set(this.keyNameInStorage(key), value);
  };

  public setUInt8Array = async (
    key: string,
    value: Uint8Array
  ): Promise<boolean | Error> => {
    const { isActive, storageProvider, isBufferSupported } = this;

    if (!isActive || !storageProvider) {
      return new Error('There is no connection to a StorageProvider');
    }
    if (
      !isBufferSupported ||
      typeof storageProvider.setUInt8Array !== 'function'
    ) {
      return new Error('The storage provider is not support this operation');
    }
    return storageProvider.setUInt8Array(this.keyNameInStorage(key), value);
  };

  public get = async (key: string): Promise<string | undefined | Error> => {
    const { isActive, storageProvider } = this;

    if (!isActive || !storageProvider) {
      return new Error('There is no connection to a StorageProvider');
    }
    return storageProvider.get(this.keyNameInStorage(key));
  };

  public getUInt8Array = async (
    key: string
  ): Promise<Uint8Array | undefined | Error> => {
    const { isActive, storageProvider, isBufferSupported } = this;

    if (!isActive || !storageProvider) {
      return new Error('There is no connection to a StorageProvider');
    }
    if (
      !isBufferSupported ||
      typeof storageProvider.getUInt8Array !== 'function'
    ) {
      return new Error('The storage provider is not support this operation');
    }
    return storageProvider.getUInt8Array(this.keyNameInStorage(key));
  };

  /**
   * added the prefix to the key
   * to work around if the StorageProvider
   * have no native support of a database name
   *
   * @protected
   * @param {string} key
   * @returns {string}
   * @memberof OpenStorage
   */
  protected keyNameInStorage(key: string): string {
    if (!this.isDbNameSupported && this.dbName) {
      return `${this.dbName}_${key}`;
    }
    return `${OPEN_STORAGE_KEY_PREFIX}_${key}`;
  }

  protected setOptions(options?: IStorageProviderOptions) {
    this.dbName = options ? options.dbName : undefined;
  }

  protected unsetOptions() {
    this.dbName = undefined;
  }

  protected setStorageProviderConnection(
    storageProviderConnection: StorageProvider
  ) {
    this.storageProvider = storageProviderConnection;
  }

  protected unsetStorageProviderConnection() {
    this.storageProvider = undefined;
  }
}
