import { TSecretStorageAuthorizazionOptions } from '../../../../../secret-storage-class/secret-storage-class.types';
import { ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore } from '../swarm-store-connector-orbit-db-subclasses-cache/swarm-store-connector-orbit-db-subclasses-cache.types';
export interface ISwarmStoreConnectorOrbitDBSubclassStorageFabric {
    createStore(path: string): Promise<ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore>;
    createStoreForDb(dbName: string): Promise<ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore>;
    addSecretDatabaseName(dbName: string): Promise<void>;
}
export interface ISwarmStoreConnectorOrbitDbSubclassStorageFabricConstructorOptions {
    credentials?: TSecretStorageAuthorizazionOptions;
    rootPath: string;
}
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-storage-fabric.types.d.ts.map