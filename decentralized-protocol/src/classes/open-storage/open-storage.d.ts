import { StorageProvider, IStorageProviderOptions } from 'classes/storage-providers/storage-providers.types';
import { OpenStorageClass, IOpenStorageConfiguration } from './open-storage.types';
export declare class OpenStorage implements OpenStorageClass {
    get isActive(): boolean;
    get isBufferSupported(): boolean;
    protected get isDbNameSupported(): boolean;
    protected storageProvider?: StorageProvider;
    protected dbName?: string;
    protected connectingPromise: Promise<void> | undefined;
    connect: (configuration?: IOpenStorageConfiguration) => Promise<void | Error>;
    disconnect: () => Promise<Error | void>;
    set: (key: string, value?: string) => Promise<boolean | Error>;
    setUInt8Array: (key: string, value: Uint8Array) => Promise<boolean | Error>;
    get: (key: string) => Promise<string | undefined | Error>;
    getUInt8Array: (key: string) => Promise<Uint8Array | undefined | Error>;
    clearDb: () => Promise<boolean | Error>;
    protected keyNameInStorage(key: string): string;
    protected setOptions(options?: IStorageProviderOptions): void;
    protected unsetOptions(): void;
    protected setStorageProviderConnection(storageProviderConnection: StorageProvider): void;
    protected unsetStorageProviderConnection(): void;
    protected connectToStore(configuration?: IOpenStorageConfiguration): Promise<void>;
    protected setConnectingPromise(connectingPromise: Promise<void>): void;
    protected unsetConnectingPromise(): void;
    protected waitTillConnecting(): Promise<void>;
}
//# sourceMappingURL=open-storage.d.ts.map