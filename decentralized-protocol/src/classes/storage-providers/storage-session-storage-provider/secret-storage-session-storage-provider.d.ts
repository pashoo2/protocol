import { StorageProvider, IStorageProviderOptions } from '../storage-providers.types';
export declare class SecretStorageProvideSessionStorage implements StorageProvider {
    static isDbNameSupported: boolean;
    private sessionStorage?;
    protected dbName?: string;
    connect(options?: IStorageProviderOptions): Promise<true | Error>;
    disconnect(): Promise<true | Error>;
    clearDb(): Promise<any>;
    set(key: string, value?: string): Promise<Error | true>;
    unset(key: string): Promise<Error | true>;
    get(key: string): Promise<Error | string | undefined>;
    protected setOptions(options?: IStorageProviderOptions): void;
    protected resolveKey(key: string): string;
}
//# sourceMappingURL=secret-storage-session-storage-provider.d.ts.map