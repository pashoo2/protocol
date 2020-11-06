import assert from 'assert';

import { isTypedArrayNative } from 'utils/typed-array-utils';

import { StorageProvider, IStorageProviderOptions } from '../storage-providers.types';
import { TStorageInMemory } from './storage-in-memory-provider.types';

export class StorageProviderInMemory<V = any> extends StorageProvider<V> {
  public static isBufferSupported = true;

  private _isConnected: boolean = false;

  private _options?: IStorageProviderOptions;

  private _storage?: TStorageInMemory<V>;

  public async connect(options?: IStorageProviderOptions): Promise<true | Error> {
    try {
      if (!this._isConnected) {
        this._storage = new Map();
        this._setOptions(options);
        this._setIsConnected();
      }
      return true;
    } catch (err) {
      console.error('SecretStorageProviderLevelJS', err);
      return err;
    }
  }

  public async disconnect(): Promise<true | Error> {
    try {
      if (this._isConnected) {
        this._unsetOptions();
        this._unsetDb();
        this._unsetIsConnected();
      }
      return true;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  /**
   * @param {string} key
   * @param {any} [value]
   * @returns {(Promise<Error | true>)}
   * @memberof SecretStorageProviderLevelJS
   */
  public async set(key: string, value?: V | Uint8Array): Promise<Error | true> {
    if (!value) {
      return this.unset(key);
    }
    try {
      this._checkIsReady();
      this._storage?.set(key, value as V);
      return true;
    } catch (err) {
      return err;
    }
  }

  public async unset(key: string): Promise<Error | true> {
    try {
      this._checkIsReady();
      this._storage?.delete(key);
      return true;
    } catch (err) {
      return err;
    }
  }

  public async clearDb(): Promise<Error | boolean> {
    try {
      this._checkIsReady();
      this._storage?.clear();
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
  public setUInt8Array(key: string, value?: Uint8Array): Promise<Error | true> {
    return this.set(key, value);
  }

  public async get(key: string): Promise<V | Error | undefined> {
    try {
      this._checkIsReady();
      return this._storage?.get(key);
    } catch (err) {
      return err;
    }
  }

  public async getUInt8Array(key: string): Promise<Error | Uint8Array | undefined> {
    try {
      this._checkIsReady();

      const item = await this.get(key);

      if (item instanceof Error) {
        throw item;
      }
      if (Array.isArray(item) || isTypedArrayNative(item)) {
        return new Uint8Array(item);
      }
      if (item) {
        throw new Error('The entiry is not related to Uint8Array');
      }
      return undefined;
    } catch (err) {
      return err;
    }
  }

  protected _setOptions(options?: IStorageProviderOptions): void {
    if (options) {
      assert(options && typeof options !== 'object', 'Options must be an object');
      this._options = options;
    }
  }

  protected _setIsConnected() {
    this._isConnected = true;
  }

  protected _unsetIsConnected() {
    this._isConnected = false;
  }

  protected _unsetOptions() {
    this._options = undefined;
  }

  protected _unsetDb() {
    this._storage = undefined;
  }

  protected _checkIsReady(): this is { _storage: TStorageInMemory<V> } {
    assert(this._isConnected, 'The instance is disconnected');
    assert(this._storage instanceof Map, 'Storage is not initialized');
    return true;
  }
}
