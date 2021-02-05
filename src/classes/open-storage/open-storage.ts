import { OPEN_STORAGE_KEY_PREFIX } from './open-storage.const';
import { STORAGE_PROVIDERS_NAME } from './../storage-providers/storage-providers.const';
import { StorageProvider, IStorageProviderOptions } from 'classes/storage-providers/storage-providers.types';
import { getStorageProviderByName } from 'classes/storage-providers';
import { OpenStorageClass, IOpenStorageConfiguration } from './open-storage.types';

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

  protected connectingPromise: Promise<void> | undefined;

  public connect = async (configuration?: IOpenStorageConfiguration): Promise<void | Error> => {
    const { connectingPromise } = this;
    if (connectingPromise) {
      return await connectingPromise;
    }
    try {
      const connectToStorePromise = this.connectToStore(configuration);
      this.setConnectingPromise(connectToStorePromise);
      return await connectToStorePromise;
    } catch (err) {
      this.unsetConnectingPromise();
      return err;
    }
  };

  public disconnect = async (): Promise<Error | void> => {
    await this.waitTillConnecting();
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
    this.unsetConnectingPromise();
    console.error(new Error('disconnect'));
    throw new Error('disconnect');
  };

  public set = async (key: string, value?: string): Promise<boolean | Error> => {
    await this.waitTillConnecting();
    const { isActive, storageProvider } = this;

    if (!isActive || !storageProvider) {
      return new Error('There is no connection to a StorageProvider');
    }
    return await storageProvider.set(this.keyNameInStorage(key), value);
  };

  public setUInt8Array = async (key: string, value: Uint8Array): Promise<boolean | Error> => {
    await this.waitTillConnecting();
    const { isActive, storageProvider, isBufferSupported } = this;

    if (!isActive || !storageProvider) {
      return new Error('There is no connection to a StorageProvider');
    }
    if (!isBufferSupported || typeof storageProvider.setUInt8Array !== 'function') {
      return new Error('The storage provider is not support this operation');
    }
    return await storageProvider.setUInt8Array(this.keyNameInStorage(key), value);
  };

  public get = async (key: string): Promise<string | undefined | Error> => {
    await this.waitTillConnecting();
    const { isActive, storageProvider } = this;

    if (!isActive || !storageProvider) {
      return new Error('There is no connection to a StorageProvider');
    }
    return await storageProvider.get(this.keyNameInStorage(key));
  };

  public getUInt8Array = async (key: string): Promise<Uint8Array | undefined | Error> => {
    await this.waitTillConnecting();
    const { isActive, storageProvider, isBufferSupported } = this;

    if (!isActive || !storageProvider) {
      return new Error('There is no connection to a StorageProvider');
    }
    if (!isBufferSupported || typeof storageProvider.getUInt8Array !== 'function') {
      return new Error('The storage provider is not support this operation');
    }
    return await storageProvider.getUInt8Array(this.keyNameInStorage(key));
  };

  public clearDb = async (): Promise<boolean | Error> => {
    await this.waitTillConnecting();
    const { isActive, storageProvider } = this;

    if (!isActive || !storageProvider) {
      return new Error('There is no connection to a StorageProvider');
    }
    const result = await this.storageProvider?.clearDb();

    if (result instanceof Error) {
      console.error(result);
      return Error('Failed to clear the database with the storage provider');
    }
    return true;
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

  protected setStorageProviderConnection(storageProviderConnection: StorageProvider) {
    this.storageProvider = storageProviderConnection;
  }

  protected unsetStorageProviderConnection() {
    this.storageProvider = undefined;
  }

  protected async connectToStore(configuration?: IOpenStorageConfiguration): Promise<void> {
    const { options, storageProviderName } = configuration || {};
    const storageProvider = getStorageProviderByName(storageProviderName || STORAGE_PROVIDERS_NAME.LOCAL_FORAGE);

    if (!storageProvider) {
      throw new Error(`There is no storage provider with the name ${storageProviderName}`);
    }

    const connectToStorageProviderResult = await storageProvider.connect(options);

    if (connectToStorageProviderResult instanceof Error) {
      console.error(connectToStorageProviderResult);
      throw new Error('Failed to connect to the storage provider');
    }
    this.setStorageProviderConnection(storageProvider);
    this.setOptions(options);
  }

  protected setConnectingPromise(connectingPromise: Promise<void>): void {
    this.connectingPromise = connectingPromise;
  }

  protected unsetConnectingPromise(): void {
    this.connectingPromise = undefined;
  }

  protected async waitTillConnecting(): Promise<void> {
    await this.connectingPromise;
  }
}
