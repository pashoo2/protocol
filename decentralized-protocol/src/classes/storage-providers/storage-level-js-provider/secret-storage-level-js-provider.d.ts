import { StorageProvider, IStorageProviderOptions } from '../storage-providers.types';
export declare class SecretStorageProviderLevelJS implements StorageProvider {
    static isBufferSupported: boolean;
    private levelStorage?;
    private dbName;
    private options?;
    private isDisconnected;
    connect(options?: IStorageProviderOptions): Promise<true | Error>;
    disconnect(): Promise<true | Error>;
    set(key: string, value?: string): Promise<Error | true>;
    unset(key: string): Promise<Error | true>;
    clearDb(): Promise<Error | boolean>;
    setUInt8Array(key: string, value?: Uint8Array): Promise<Error | true>;
    get(key: string): Promise<Error | string | undefined>;
    getUInt8Array(key: string): Promise<Error | Uint8Array | undefined>;
    protected setOptions(options?: IStorageProviderOptions): void;
    protected setIsDisconnected(): void;
    protected checkIsReady(): void | Error;
    protected createInstanceOfLevelDB(): Promise<void | Error>;
}
//# sourceMappingURL=secret-storage-level-js-provider.d.ts.map