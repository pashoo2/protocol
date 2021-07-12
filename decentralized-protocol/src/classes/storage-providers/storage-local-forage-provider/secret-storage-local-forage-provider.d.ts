import { StorageProvider, IStorageProviderOptions } from '../storage-providers.types';
export declare class SecretStorageProviderLocalForage implements StorageProvider {
    static isBufferSupported: boolean;
    static isDbNameSupported: boolean;
    private localForage?;
    private dbName;
    private options?;
    private isDisconnected;
    connect(options?: IStorageProviderOptions): Promise<true | Error>;
    disconnect(): Promise<true | Error>;
    set(key: string, value?: string): Promise<Error | boolean>;
    setUInt8Array(key: string, value?: Uint8Array): Promise<Error | boolean>;
    get(key: string): Promise<Error | string | undefined>;
    unset(key: string): Promise<Error | boolean>;
    clearDb(): Promise<Error | boolean>;
    getUInt8Array(key: string): Promise<Error | Uint8Array | undefined>;
    protected setOptions(options?: IStorageProviderOptions): void;
    protected setIsDisconnected(): void;
    protected checkIsReady(): void | Error;
    protected createInstanceOfLocalforage(): Promise<void | Error>;
}
//# sourceMappingURL=secret-storage-local-forage-provider.d.ts.map