import { IStorageProviderOptions } from './../storage-providers.types';
import { StorageProvider } from '../storage-providers.types';
export declare class SecretStorageProviderLocalStorage implements StorageProvider {
    static isDbNameSupported: boolean;
    private localStorage?;
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
//# sourceMappingURL=secret-storage-local-storage-provider.d.ts.map