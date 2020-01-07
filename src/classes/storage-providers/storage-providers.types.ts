import { ownValueOf } from './../../types/helper.types';
import { STORAGE_PROVIDERS_NAME } from './storage-providers.const';
export interface IStorageProviderOptions {
  dbName?: string;
}

export abstract class StorageProvider {
  public abstract connect(
    options?: IStorageProviderOptions
  ): Promise<boolean | Error>;
  public abstract disconnect(): Promise<boolean | Error>;
  public abstract set(key: string, value?: string): Promise<boolean | Error>;

  public abstract setUInt8Array?(
    key: string,
    value: Uint8Array
  ): Promise<boolean | Error>;
  public abstract get(key: string): Promise<string | undefined | Error>;

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
export interface IStorageProvider {
  isBufferSupported?: boolean;
  isDbNameSupported?: boolean;
  new (): StorageProvider;
}

export type TInstanceofStorageProvider = InstanceType<IStorageProvider>;

export interface ILocalStorageProviderTable {
  [providerName: string]: IStorageProvider;
}

export type TStorageProviderName = ownValueOf<typeof STORAGE_PROVIDERS_NAME>;
