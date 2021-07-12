import { ISwarmStoreConnectorOrbitDBSubclassStorageFabric, ISwarmStoreConnectorOrbitDbSubclassStorageFabricConstructorOptions } from './swarm-store-connector-orbit-db-subclass-storage-fabric.types';
import { ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore } from '../swarm-store-connector-orbit-db-subclasses-cache/swarm-store-connector-orbit-db-subclasses-cache.types';
import { ISwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapterConstructorOptions } from '../swarm-store-connector-orbit-db-subclasses-cache/swarm-store-connector-orbit-db-subclass-store-to-open-storage-adapter/swarm-store-connector-orbit-db-subclass-store-to-open-storage-adapter.types';
import { TSecretStorageAuthorizazionOptions } from '../../../../../secret-storage-class/secret-storage-class.types';
export declare class SwarmStoreConnectorOrbitDBSubclassStorageFabric implements ISwarmStoreConnectorOrbitDBSubclassStorageFabric {
    private key?;
    private ready?;
    protected secretDatabasesNames: Set<string>;
    protected secretDatabasesPaths: Set<string>;
    protected storage: any;
    protected rootPath?: string;
    constructor({ credentials, rootPath }: ISwarmStoreConnectorOrbitDbSubclassStorageFabricConstructorOptions);
    addSecretDatabaseName: (dbName: string) => Promise<void>;
    createStore(path: string): Promise<ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore>;
    createStoreForDb(dbName: string): Promise<ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore>;
    protected setRootPath(rootPath: string): void;
    protected createStorage(): void;
    protected whetherUseSecretStorageForDB(dbName: string): boolean;
    protected whetherUseSecretStorageForPath(path: string): boolean;
    protected applyCredentials(credentials: TSecretStorageAuthorizazionOptions): void;
    protected createKey(credentials: TSecretStorageAuthorizazionOptions): Promise<void>;
    protected createSecretStorageCacheInstance(path: string): ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore;
    protected createSecretStorageForPath(path: string): Promise<ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore>;
    protected createOptionsForOpenStorageCacheInstanceConstructor(path: string): Promise<ISwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapterConstructorOptions>;
    protected createOpenStorageCacheInstance(path: string): Promise<ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore>;
    protected createOpenStorageForPath(path: string): Promise<ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore>;
    protected createPathForDb(dbName: string): Promise<string>;
}
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-storage-fabric.d.ts.map