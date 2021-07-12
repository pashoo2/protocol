import { IStorageProviderOptions, TStorageProviderName } from './../storage-providers/storage-providers.types';
import { ISensitiveDataSessionStorage } from 'classes/sensitive-data-session-storage/sensitive-data-session-storage.types';
import { IStorageCommon } from '../../types/storage.types';
export * from 'classes/storage-providers/storage-providers.types';
export interface ISecretStoreConfiguration {
    storageProviderName: TStorageProviderName;
}
export interface IISecretStorageOptions extends IStorageProviderOptions {
}
export interface ISecretStorageSessionInfoStored {
    login: string;
    key: string;
}
export interface ISecretStorageSessionInfo {
    login: string;
    key: CryptoKey;
}
export declare type TSecretStorageProviderName = string;
export interface ISecretStoreCredentialsSession {
    session: ISensitiveDataSessionStorage;
}
export interface ISecretStoreCredentialsPassword {
    login: string;
    password: string;
}
export interface ISecretStoreCredentials extends ISecretStoreCredentialsPassword {
}
export interface ISecretStoreCredentialsCryptoKey {
    key: CryptoKey;
}
export declare type TSecretStorageAuthOptionsCredentials = ISecretStoreCredentials | ISecretStoreCredentialsSession;
export declare type TSecretStorageAuthOptions = TSecretStorageAuthOptionsCredentials | ISecretStoreCredentialsCryptoKey;
export declare type TSecretStorageAuthorizazionOptions = ISecretStoreCredentials | ISecretStoreCredentialsSession | ISecretStoreCredentialsCryptoKey;
export interface ISecretStorage extends IStorageCommon {
    isActive: boolean;
    connect(options?: IISecretStorageOptions): Promise<boolean | Error>;
    authorize(credentials: ISecretStoreCredentials, options?: IISecretStorageOptions): Promise<boolean | Error>;
    authorize(sessionOptions: ISecretStoreCredentialsSession, options?: IISecretStorageOptions): Promise<boolean | Error>;
    authorize(cryptoKey: ISecretStoreCredentialsCryptoKey, options?: IISecretStorageOptions): Promise<boolean | Error>;
    authorize(credentials: TSecretStorageAuthorizazionOptions, options?: IISecretStorageOptions): Promise<boolean | Error>;
    authorizeByKey(credentials: ISecretStoreCredentialsCryptoKey, options?: IStorageProviderOptions): Promise<boolean | Error>;
    disconnect(): Promise<boolean | Error>;
    set(key: string, value: string | null): Promise<boolean | Error>;
    insert(key: string, value: string | null): Promise<boolean | Error>;
    get(key: string): Promise<string | undefined | null | Error>;
    has(key: string): Promise<boolean | Error>;
    unset(key: string | string[]): Promise<Error | void>;
    generateCryptoKey(credentialsOrSession: TSecretStorageAuthorizazionOptions): Promise<CryptoKey | Error>;
    clearDb(): Promise<Error | boolean>;
}
//# sourceMappingURL=secret-storage-class.types.d.ts.map