import { TCallbackError, TCallbackErrorValue } from 'orbit-db-cache';
import { OpenStorage } from '../../../../../../open-storage/open-storage';
import { IStorageCommon } from '../../../../../../../types/storage.types';
import { SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_STORAGE_ADAPTER_DEFAULT_OPTIONS_STORAGE } from '../swarm-store-connector-orbit-db-subclasses-cache.const';
import { ISwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapterConstructorOptions } from './swarm-store-connector-orbit-db-subclass-store-to-open-storage-adapter.types';
import { SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_OPEN_STORAGE_ADAPTER_STATUS } from '../swarm-store-connector-orbit-db-subclasses-cache.const';
import {
  ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbKeystoreStore,
  ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore,
} from '../swarm-store-connector-orbit-db-subclasses-cache.types';

export class SwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapter
  implements ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbKeystoreStore, ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore {
  public get status(): SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_OPEN_STORAGE_ADAPTER_STATUS {
    const { isClose } = this;

    if (isClose) {
      return SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_OPEN_STORAGE_ADAPTER_STATUS.CLOSE;
    }
    return SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_OPEN_STORAGE_ADAPTER_STATUS.OPEN;
  }

  /**
   * this is used in the Cache(orbit-db-cache) in status
   * ` get status () { return this._store.db.status } `
   *
   * @readonly
   * @type {{ status: SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_OPEN_STORAGE_ADAPTER_STATUS }}
   * @memberof SwarmStoreConnectorOrbitDBSubclassStoreToStorageAdapter
   */
  public get db() {
    return {
      status: this.status,
    };
  }

  protected options?: ISwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapterConstructorOptions;

  protected storage?: IStorageCommon;

  protected isOpen: boolean = false;

  protected isClose: boolean = false;

  /**
   * close() method will not close the instance. It's
   * necessary when restart the database, it's cache
   * is closed by the OrbitDB API, so to prevent
   * a cache from closing and it can be resused.
   *
   * @protected
   * @type {boolean}
   * @memberof SwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapter
   */
  protected isPreventedClose: boolean = false;

  constructor(options: ISwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapterConstructorOptions) {
    this.setOptions(options);
  }

  public async open(cb?: TCallbackError): Promise<void> {
    const { isClose, isOpen } = this;

    if (!isClose && isOpen) {
      return;
    }

    const result = await this.startStorage();

    if (result instanceof Error) {
      throw result;
    }
    this.setIsOpen();
    this.unsetIsClose();
    if (typeof cb === 'function') {
      cb(undefined);
    }
  }

  public close = async (cb?: TCallbackError): Promise<void> => {
    this.throwIfClosed();
    if (this.isPreventedClose) {
      return;
    }
    this.setIsClose();
    this.unsetIsOpen();
    const result = await this.disconnectStorage();

    if (result instanceof Error) {
      console.error(result);
      throw result;
    }
    if (typeof cb === 'function') {
      cb(undefined);
    }
  };

  public async get(k: string, cb?: TCallbackErrorValue): Promise<string | undefined> {
    this.throwIfClosed();
    // open connection to the secret storage
    // before any operations
    await this.openIfNecessary();

    const storage = this.getStorage();

    if (storage instanceof Error) {
      console.error(Storage);
      throw storage;
    }

    const result = await storage.get(k);

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

  public async put(k: string, v: string | Buffer, cb?: TCallbackError): Promise<void> {
    this.throwIfClosed();
    await this.openIfNecessary();

    const storage = this.getStorage();

    if (storage instanceof Error) {
      console.error(Storage);
      throw storage;
    }

    const value = v instanceof Buffer ? v.toString() : v;
    const result = await storage.set(k, value);

    if (result instanceof Error) {
      console.error(result);
      throw result;
    }
    if (typeof cb === 'function') {
      cb(undefined);
    }
  }

  public del = async (key: string, cb?: TCallbackError) => {
    this.throwIfClosed();
    await this.openIfNecessary();

    const storage = this.getStorage();

    if (storage instanceof Error) {
      console.error(Storage);
      throw storage;
    }

    const result = await storage.set(key, undefined);

    if (result instanceof Error) {
      console.error(result);
      throw result;
    }
    if (typeof cb === 'function') {
      cb(undefined);
    }
  };

  public setPreventClose = (isPrevented: boolean): void => {
    this.throwIfClosed();
    this.isPreventedClose = Boolean(isPrevented);
  };

  public dropDb = async () => {
    await this.openIfNecessary();

    const storage = this.getStorage();

    if (Storage instanceof Error) {
      console.error(Storage);
      throw storage;
    }

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const result = await (storage as OpenStorage).clearDb?.();

    if (result instanceof Error) {
      console.error(result);
      throw new Error('Failed to drop the database');
    }
  };

  // TODO - not implemented in ocrbit-db-cache
  public async load() {}

  // TODO - not implemented in ocrbit-db-cache
  public async destroy() {
    await this.dropDb();
    await this.close();
    this.unsetStorage();
  }

  protected setIsOpen() {
    this.isOpen = true;
  }

  protected unsetIsOpen() {
    this.isOpen = false;
  }

  protected setIsClose() {
    this.isClose = true;
  }

  protected unsetIsClose() {
    this.isClose = false;
  }

  protected throwIfClosed() {
    if (this.isClose) {
      throw new Error('The instance is closed');
    }
  }

  protected getStorage(): Error | IStorageCommon {
    const { storage } = this;

    if (storage) {
      return storage;
    }
    return new Error('There is no connection to the OpenStorage');
  }

  protected setStorageImplementationToUse(storageImplementation: IStorageCommon) {
    this.storage = storageImplementation;
  }

  protected setOptions(options: ISwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapterConstructorOptions): void {
    if (!options) {
      throw new Error('Options must be provided');
    }
    if (typeof options !== 'object') {
      throw new Error('Options must be an object');
    }

    const { dbName, storageImplementation } = options;

    if (!dbName) {
      throw new Error('A database name must be specified in the options');
    }
    if (typeof dbName !== 'string') {
      throw new Error('A database name must be a string');
    }
    if (storageImplementation) {
      this.setStorageImplementationToUse(storageImplementation);
    }
    this.options = options;
  }

  private unsetStorage() {
    this.storage = undefined;
  }

  private async createDefaultStorageImplementation(): Promise<IStorageCommon> {
    const storageImplementation = new OpenStorage();
    const storageImplementationConnectionResult = await storageImplementation.connect({
      ...SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_STORAGE_ADAPTER_DEFAULT_OPTIONS_STORAGE,
      options: this.options,
    });

    if (storageImplementationConnectionResult instanceof Error) {
      console.error(storageImplementationConnectionResult);
      throw new Error(storageImplementationConnectionResult.message);
    }
    return storageImplementation;
  }

  protected async startStorage(): Promise<Error | boolean> {
    if (this.storage) {
      return true;
    }

    const storageImplementation = await this.createDefaultStorageImplementation();

    this.setStorageImplementationToUse(storageImplementation);
    return true;
  }

  private async disconnectStorage(): Promise<Error | void> {
    const { storage } = this;

    if (!Storage) {
      return new Error('There is no instance of the storage connected to');
    }
    try {
      const result = await (storage as OpenStorage).disconnect?.();

      if (result instanceof Error) {
        return result;
      }
    } catch (err) {
      return err;
    }
  }

  protected async openIfNecessary(): Promise<void> {
    const { isOpen } = this;

    if (isOpen) {
      return;
    }
    await this.open();
  }
}
