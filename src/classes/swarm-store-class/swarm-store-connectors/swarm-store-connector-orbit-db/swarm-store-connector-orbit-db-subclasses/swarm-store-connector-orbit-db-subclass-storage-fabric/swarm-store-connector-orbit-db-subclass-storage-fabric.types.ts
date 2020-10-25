import { IStore } from 'orbit-db-cache';
import { ISecretStoreCredentials } from '../../../../../secret-storage-class/secret-storage-class.types';

export interface ISwarmStoreConnectorOrbitDBSubclassStorageFabric {
  /**
   * create cache store for the path
   *
   * @param {string} path
   * @returns {Promise<IStore>}
   * @memberof ISwarmStoreConnectorOrbitDBSubclassStorageFabric
   */
  createStore(path: string): Promise<IStore>;
  /**
   * create cache store for the database
   *
   * @param {string} dbName
   * @returns {Promise<IStore>}
   * @memberof ISwarmStoreConnectorOrbitDBSubclassStorageFabric
   */
  createStoreForDb(dbName: string): Promise<IStore>;
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
