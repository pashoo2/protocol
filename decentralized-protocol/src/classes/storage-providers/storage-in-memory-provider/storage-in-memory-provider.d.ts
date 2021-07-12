import { StorageProvider, IStorageProviderOptions } from '../storage-providers.types';
import { TStorageInMemory } from './storage-in-memory-provider.types';
export declare class StorageProviderInMemory<V = any> extends StorageProvider<V> {
    static isBufferSupported: boolean;
    private _isConnected;
    private _options?;
    private _storage?;
    connect(options?: IStorageProviderOptions): Promise<true | Error>;
    disconnect(): Promise<true | Error>;
    set(key: string, value?: V | Uint8Array): Promise<Error | true>;
    unset(key: string): Promise<Error | true>;
    clearDb(): Promise<Error | boolean>;
    setUInt8Array(key: string, value?: Uint8Array): Promise<Error | true>;
    get(key: string): Promise<V | Error | undefined>;
    getUInt8Array(key: string): Promise<Error | Uint8Array | undefined>;
    protected _setOptions(options?: IStorageProviderOptions): void;
    protected _setIsConnected(): void;
    protected _unsetIsConnected(): void;
    protected _unsetOptions(): void;
    protected _unsetDb(): void;
    protected _checkIsReady(): this is {
        _storage: TStorageInMemory<V>;
    };
}
//# sourceMappingURL=storage-in-memory-provider.d.ts.map