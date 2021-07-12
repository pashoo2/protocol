import { ISecretStoreConfiguration, ISecretStorageSessionInfo } from 'classes/secret-storage-class/secret-storage-class.types';
import { TPasswordEncryptionKeyImportNativeSupportedTypes } from '@pashoo2/crypto-utilities';
import { ISecretStoreCredentials, ISecretStorage, ISecretStoreCredentialsCryptoKey } from './secret-storage-class.types';
import { IStorageProviderOptions } from 'classes/storage-providers/storage-providers.types';
import { ISensitiveDataSessionStorage } from 'classes/sensitive-data-session-storage/sensitive-data-session-storage.types';
import { TSecretStorageAuthorizazionOptions } from './secret-storage-class.types';
declare const SecretStorage_base: {
    new (): {
        status?: any;
        errorOccurred?: Error;
        statusEmitter: import("../basic-classes/event-emitter-class-base").EventEmitter<{
            status: {
                STOPPED: any;
                RUNNING: string;
                CONNECTING: string;
                ERROR: string;
            };
        }>;
        clearError(): void;
        clearStatus(): void;
        clearState(): void;
        setStatus: (status: any) => () => void;
        setErrorStatus: (err: string | Error) => Error;
    };
    error(err: string | Error): Error;
};
export declare class SecretStorage extends SecretStorage_base implements ISecretStorage {
    protected configuration: Partial<ISecretStoreConfiguration>;
    private static AuthStorageProvider;
    private static PREFIX_KEY_IN_SECRET_STORAGE;
    private static PREFIX_FOR_SALT_VALUE;
    static validatePassword(password: unknown): Error | void;
    static validateLogin(login: any): Error;
    static validateCredentials(credentials?: ISecretStoreCredentials): void | Error;
    private static saltKey;
    private keyHash;
    private k?;
    private storageProvider?;
    private isStorageProviderSupportUInt8Array;
    private authStorageProvider?;
    private storageProviderName?;
    private options?;
    private dbName?;
    private userHash?;
    protected get isRunning(): boolean;
    get isActive(): boolean;
    constructor(configuration?: Partial<ISecretStoreConfiguration>);
    connect: (options?: IStorageProviderOptions) => Promise<boolean | Error>;
    disconnect(): Promise<boolean | Error>;
    generateCryptoKey(credentialsOrSession: TSecretStorageAuthorizazionOptions): Promise<CryptoKey | Error>;
    authorize(credentials: TSecretStorageAuthorizazionOptions, options?: IStorageProviderOptions): Promise<boolean | Error>;
    authorizeByKey(credentials: ISecretStoreCredentialsCryptoKey, options?: IStorageProviderOptions): Promise<boolean | Error>;
    has: (key: string) => Promise<boolean | Error>;
    get: (key: string) => Promise<string | Error | undefined | null>;
    set(keyForValue: string, value: string | null): Promise<boolean | Error>;
    insert(keyForValue: string, value: string | null): Promise<boolean | Error>;
    unset(key: string | string[], maxAttempts?: number): Promise<Error | void>;
    clearDb(): Promise<true | Error>;
    private setStorageProviderName;
    private createInstanceOfStorageProvider;
    private setSupportForUInt8Array;
    private runAuthStorageProvider;
    protected runStorageProvider(): Promise<Error | boolean>;
    protected storageKey(key: string): string;
    protected setEncryptionKey(key: TPasswordEncryptionKeyImportNativeSupportedTypes | CryptoKey): Promise<boolean | Error>;
    protected setOptions(options?: IStorageProviderOptions): void;
    protected isNullishValue(value: any): boolean;
    protected reset(): void;
    protected storageProviderDisconnect: () => Promise<boolean | Error>;
    protected getSaltValue(credentials: ISecretStoreCredentials): Promise<Error | string>;
    protected getWithStorageProvider(key: string): Promise<string | Error | undefined>;
    protected getWithStorageProviderUint8Array(key: string): Promise<Uint8Array | Error | undefined>;
    protected decryptValue(value: string): Promise<string | Error>;
    protected decryptValueFromUInt8Array(value: Uint8Array): Promise<string | Error>;
    protected setWithStorageProvider(key: string, value: string): Promise<boolean | Error>;
    protected unsetWithStorageProvider: (key: string) => Promise<boolean | Error>;
    protected setWithStorageProviderUInt8Array(key: string, value: Uint8Array): Promise<boolean | Error>;
    protected encryptValue(value: string): Promise<string | Error>;
    protected encryptValueAsInt8Array(value: string | Uint8Array): Promise<Uint8Array | Error>;
    protected readLoginAndKeyFromSession(session: ISensitiveDataSessionStorage): Promise<ISecretStorageSessionInfo | Error | undefined>;
    protected saveLoginAndKeyToSession(session: ISensitiveDataSessionStorage, login: string, key: CryptoKey): Promise<Error | undefined>;
    protected readValueForKey: (key: string) => Promise<string | Error | Uint8Array>;
    protected isValueDefined(valueEncrypted: any): boolean;
}
export {};
//# sourceMappingURL=secret-storage-class.d.ts.map