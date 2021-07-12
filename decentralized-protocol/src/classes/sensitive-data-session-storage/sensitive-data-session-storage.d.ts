import { ISensitiveDataSessionStorage, ISensitiveDataSessionStorageOptions } from './sensitive-data-session-storage.types';
export declare class SensitiveDataSessionStorage implements ISensitiveDataSessionStorage {
    protected isConnected: boolean;
    protected connectingPromise: undefined | Promise<void>;
    protected _temp: Record<string, unknown>;
    private get _tempStringified();
    private set _tempStringified(value);
    private __tempStringified;
    private k?;
    private storagePrefix;
    private get storageKeyValue();
    private get storageKeySalt();
    connect: (options?: ISensitiveDataSessionStorageOptions) => Promise<void>;
    close(): Promise<void>;
    getItem: (key: string) => Promise<unknown>;
    setItem: (key: string, v: unknown) => Promise<void>;
    private connectToStorage;
    private readSalt;
    private generateSalt;
    toString(): string;
    private beforeunloadHandler;
    private subscribeOnWindowUnload;
    private unsubscribeOnWindowUnload;
    private readFromStorage;
    protected clearSaltStorage(): void;
    protected clearValueStorage(): void;
    protected resetState(): void;
    private stringifyTemp;
}
//# sourceMappingURL=sensitive-data-session-storage.d.ts.map