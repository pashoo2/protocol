import { ISecretStorageOptions, ISecretStoreCredentials } from 'classes/secret-storage-class/secret-storage-class.types';

export interface IOrbitDbKeystoreStore {
    open(): Promise<void>;
    close(): Promise<void>;
    get(k: string): Promise<string>;
    set(k: string, v: Buffer | string): Promise<string>;
}

export interface IOrbitDbCacheStore {
    open(): Promise<void>;
    close(): Promise<void>;
    get(k: string): Promise<string>;
    set(k: string, v: Buffer | string): Promise<string>;
}

export interface ISwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter extends IOrbitDbKeystoreStore, IOrbitDbCacheStore {
    new (
        credentials: ISecretStoreCredentials,
        options: Required<ISecretStorageOptions>,
    ): ISwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter;
}