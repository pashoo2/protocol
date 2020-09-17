import { ownValueOf } from 'types/helper.types';
import { STORAGE_PROVIDERS_NAME } from './storage-providers.const';
import { IStorageCommon } from '../../types/storage.types';

export interface IStorageProviderOptions {
  dbName?: string;
}

export abstract class StorageProvider<V = string> implements IStorageCommon<V> {
  /**
   * connect to the database specified
   *
   * @abstract
   * @param {IStorageProviderOptions} [options]
   * @returns {(Promise<boolean | Error>)}
   * @memberof StorageProvider
   */
  public abstract connect(
    options?: IStorageProviderOptions
  ): Promise<boolean | Error>;
  public abstract disconnect(): Promise<boolean | Error>;
  /**
   * remove all content of the database connected to.
   * If not connected to a database, an error will be returned.
   * It may be very expensive operation, dependently on a
   * storage provider connected with.
   *
   * @abstract
   * @returns {(Promise<boolean | Error>)}
   * @memberof StorageProvider
   */
  public abstract clearDb(): Promise<boolean | Error>;
  public abstract set(key: string, value?: V): Promise<boolean | Error>;

  public abstract unset(key: string): Promise<boolean | Error>;

  public abstract setUInt8Array?(
    key: string,
    value: Uint8Array
  ): Promise<boolean | Error>;
  public abstract get(key: string): Promise<V | undefined | Error>;

  public abstract getUInt8Array?(
    key: string
  ): Promise<Uint8Array | undefined | Error>;
}

export type TStorageProvider = typeof StorageProvider;

/**
 * static isBufferSupported {boolean} - whether the class
 * supports operations with the Int8Array
 *
 * @export
 * @interface IStorageProvider
 */
export interface IStorageProvider<V = string> {
  isBufferSupported?: boolean;
  isDbNameSupported?: boolean;
  new(): StorageProvider<V>;
}

export type TInstanceofStorageProvider = InstanceType<IStorageProvider>;

export interface ILocalStorageProviderTable {
  [providerName: string]: IStorageProvider;
}

export type TStorageProviderName = ownValueOf<typeof STORAGE_PROVIDERS_NAME>;
