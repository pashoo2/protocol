import { IStorageCommon } from '../../types/storage.types';
import {
  IStorageProviderOptions,
  TStorageProviderName,
} from './../storage-providers/storage-providers.types';

export interface IOpenStorageConfiguration {
  options?: IStorageProviderOptions;
  storageProviderName?: TStorageProviderName;
}

export abstract class OpenStorageClass implements IStorageCommon {
  public isActive: boolean = false;

  public isBufferSupported: boolean = false;

  public abstract connect(
    configuration?: IOpenStorageConfiguration
  ): Promise<void | Error>;
  public abstract disconnect(): Promise<void | Error>;
  public abstract set(key: string, value?: string): Promise<boolean | Error>;

  public abstract setUInt8Array(
    key: string,
    value: Uint8Array
  ): Promise<boolean | Error>;
  public abstract get(key: string): Promise<string | undefined | Error>;

  public abstract getUInt8Array(
    key: string
  ): Promise<Uint8Array | undefined | Error>;
  public abstract clearDb(): Promise<boolean | Error>;
}

export type TOpenStorage = typeof OpenStorageClass;

/**
 * static isBufferSupported {boolean} - whether the class
 * supports operations with the Int8Array
 *
 * @export
 * @interface IStorageProvider
 */
export interface IOpenStorage {
  new (): OpenStorageClass;
}
