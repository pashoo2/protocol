export interface ISensitiveDataSessionStorageOptions {
    pinCode?: string;
    storagePrefix?: string;
    clearStorageAfterConnect?: boolean;
}
export interface ISensitiveDataSessionStorage {
    connect(options: ISensitiveDataSessionStorageOptions): Promise<void>;
    close(): Promise<void>;
    setItem(key: string, value: any): Promise<void>;
    getItem(key: string): Promise<any>;
}
//# sourceMappingURL=sensitive-data-session-storage.types.d.ts.map