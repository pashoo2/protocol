import { ownValueOf } from 'types/helper.types';
import { STORAGE_PROVIDERS_NAME } from './storage-providers.const';
import { IStorage, IStorageCommon } from '../../types/storage.types';
export interface IStorageProviderOptions {
    dbName?: string;
    storageImplementation?: IStorageCommon;
}
export declare abstract class StorageProvider<V = string> implements IStorage<V> {
    abstract connect(options?: IStorageProviderOptions): Promise<boolean | Error>;
    abstract disconnect(): Promise<boolean | Error>;
    abstract clearDb(): Promise<boolean | Error>;
    abstract set(key: string, value?: V): Promise<boolean | Error>;
    abstract unset(key: string): Promise<boolean | Error>;
    abstract setUInt8Array?(key: string, value: Uint8Array): Promise<boolean | Error>;
    abstract get(key: string): Promise<V | undefined | Error>;
    abstract getUInt8Array?(key: string): Promise<Uint8Array | undefined | Error>;
}
export declare type TStorageProvider = typeof StorageProvider;
export interface IStorageProvider<V = string> {
    isBufferSupported?: boolean;
    isDbNameSupported?: boolean;
    new (): StorageProvider<V>;
}
export declare type TInstanceofStorageProvider = InstanceType<IStorageProvider>;
export interface ILocalStorageProviderTable {
    [providerName: string]: IStorageProvider;
}
export declare type TStorageProviderName = ownValueOf<typeof STORAGE_PROVIDERS_NAME>;
//# sourceMappingURL=storage-providers.types.d.ts.map