import { ISecretStoreCredentials } from '../../../../../secret-storage-class/secret-storage-class.types';
import { ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore } from '../swarm-store-connector-orbit-db-subclasses-cache/swarm-store-connector-orbit-db-subclasses-cache.types';

export interface ISwarmStoreConnectorOrbitDBSubclassStorageFabric {
  /**
   * create cache store for the path
   *
   * @param {string} path
   * @returns {Promise<ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore>}
   * @memberof ISwarmStoreConnectorOrbitDBSubclassStorageFabric
   */
  createStore(path: string): Promise<ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore>;
  /**
   * create cache store for the database
   *
   * @param {string} dbName
   * @returns {Promise<ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore>}
   * @memberof ISwarmStoreConnectorOrbitDBSubclassStorageFabric
   */
  createStoreForDb(dbName: string): Promise<ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore>;
  /**
   * add database name to the list of database have
   * secret cache store
   *
   * @param {string} dbName
   * @memberof ISwarmStoreConnectorOrbitDBSubclassStorageFabric
   */
  addSecretDatabaseName(dbName: string): Promise<void>;
}

export interface ISwarmStoreConnectorOrbitDbSubclassStorageFabricConstructorOptions {
  credentials?: ISecretStoreCredentials;
  rootPath: string;
}
