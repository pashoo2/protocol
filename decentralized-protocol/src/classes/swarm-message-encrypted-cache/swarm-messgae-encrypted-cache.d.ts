import { TSwarmMessageEncryptedCacheOptions, ISwarmMessageEncryptedCache } from './swarm-message-encrypted-cache.types';
import { ISecretStorage } from '../secret-storage-class/secret-storage-class.types';
import { TSwarmMessageBodyRaw } from '../swarm-message/swarm-message-constructor.types';
export declare class SwarmMessageEncryptedCache implements ISwarmMessageEncryptedCache {
    isRunning: boolean;
    protected options?: TSwarmMessageEncryptedCacheOptions;
    protected storageProvider?: ISecretStorage;
    protected get dbNamePrefix(): string;
    protected get dbName(): string;
    connect(options: TSwarmMessageEncryptedCacheOptions): Promise<void>;
    add: (sig: string, message: TSwarmMessageBodyRaw) => Promise<boolean>;
    get: (sig: string) => Promise<string>;
    unset: (sig: string) => Promise<void>;
    clearDb(): Promise<void>;
    set: (sig: string, message: TSwarmMessageBodyRaw) => Promise<void>;
    protected setOptions(options: TSwarmMessageEncryptedCacheOptions): void;
    protected setStorageProvider(provider: ISecretStorage): void;
    protected runDefaultStorageConnection(): Promise<void>;
    protected runStorageConnection(): Promise<void>;
    protected setIsRunning(): void;
    protected checkIsActive(): boolean;
    protected readValue(sig: string): Promise<TSwarmMessageBodyRaw | undefined | null>;
}
//# sourceMappingURL=swarm-messgae-encrypted-cache.d.ts.map