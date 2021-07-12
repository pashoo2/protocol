import { IStorageCommon } from '../../types/storage.types';
import { IStorageProviderOptions, TStorageProviderName } from './../storage-providers/storage-providers.types';
export interface IOpenStorageConfiguration {
    options?: IStorageProviderOptions;
    storageProviderName?: TStorageProviderName;
}
export declare abstract class OpenStorageClass implements IStorageCommon {
    isActive: boolean;
    isBufferSupported: boolean;
    abstract connect(configuration?: IOpenStorageConfiguration): Promise<void | Error>;
    abstract disconnect(): Promise<void | Error>;
    abstract set(key: string, value?: string): Promise<boolean | Error>;
    abstract setUInt8Array(key: string, value: Uint8Array): Promise<boolean | Error>;
    abstract get(key: string): Promise<string | undefined | Error>;
    abstract getUInt8Array(key: string): Promise<Uint8Array | undefined | Error>;
    abstract clearDb(): Promise<boolean | Error>;
}
export declare type TOpenStorage = typeof OpenStorageClass;
export interface IOpenStorage {
    new (): OpenStorageClass;
}
//# sourceMappingURL=open-storage.types.d.ts.map