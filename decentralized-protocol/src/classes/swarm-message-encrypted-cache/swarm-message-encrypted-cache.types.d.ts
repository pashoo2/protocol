import { TSwarmMessageBodyRaw, ISwarmMessageConstructor } from '../swarm-message/swarm-message-constructor.types';
import { TSecretStorageAuthOptions } from '../secret-storage-class/secret-storage-class.types';
import { TSwarmMessageConstructorOptions } from '../swarm-message/swarm-message-constructor.types';
import { IStorageCommon } from 'types/storage.types';
import { ISecretStorage, IISecretStorageOptions } from '../secret-storage-class/secret-storage-class.types';
export interface ISwarmMessageEncryptedCacheOptionsStorageProvider {
    storageProvider: ISecretStorage;
}
export interface ISwarmMessageEncryptedCacheOptionsForStorageProvider {
    dbNamePrefix?: string;
    storageProviderOptions?: IISecretStorageOptions;
    storageProviderAuthOptions: TSecretStorageAuthOptions;
}
export declare type TSwarmMessageEncryptedCacheOptions = ISwarmMessageEncryptedCacheOptionsStorageProvider | ISwarmMessageEncryptedCacheOptionsForStorageProvider;
export interface ISwarmMessageEncryptedCache extends IStorageCommon {
    isRunning: boolean;
    connect(options?: TSwarmMessageEncryptedCacheOptions): Promise<void>;
    get(sig: string): Promise<TSwarmMessageBodyRaw | null | undefined>;
    add(sig: string, message: TSwarmMessageBodyRaw): Promise<boolean>;
    set(sig: string, message: TSwarmMessageBodyRaw): Promise<void>;
    unset(sig: string): Promise<void>;
    clearDb(): Promise<void>;
}
export interface ISwarmMessageEncryptedCacheFabric {
    (storageProviderOptions?: IISecretStorageOptions): Promise<ISwarmMessageEncryptedCache>;
}
export interface ISwarmMessageConstructorWithEncryptedCacheFabric {
    (swarmMessageConstructorOptions: Partial<TSwarmMessageConstructorOptions>, storageProviderOptions?: IISecretStorageOptions): Promise<ISwarmMessageConstructor>;
}
//# sourceMappingURL=swarm-message-encrypted-cache.types.d.ts.map