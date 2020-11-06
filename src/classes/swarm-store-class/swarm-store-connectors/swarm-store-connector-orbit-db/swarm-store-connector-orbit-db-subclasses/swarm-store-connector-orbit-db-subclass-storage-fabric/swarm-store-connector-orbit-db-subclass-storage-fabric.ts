import Storage from 'orbit-db-storage-adapter';
import { IStore } from 'orbit-db-cache';

import { ISecretStoreCredentials } from 'classes/secret-storage-class/secret-storage-class.types';
import { SecretStorage } from 'classes/secret-storage-class/secret-storage-class';

import {
  ISwarmStoreConnectorOrbitDBSubclassStorageFabric,
  ISwarmStoreConnectorOrbitDbSubclassStorageFabricConstructorOptions,
} from './swarm-store-connector-orbit-db-subclass-storage-fabric.types';
import { SwarmStoreConnectorOrbitDBSubclassStorageCache } from '../swarm-store-connector-orbit-db-subclass-storage-cache/swarm-store-connector-orbit-db-subclass-storage-cache';
import { SwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapter } from '../swarm-store-connector-orbit-db-subclasses-cache/swarm-store-connector-orbit-db-subclass-store-to-open-storage-adapter/swarm-store-connector-orbit-db-subclass-store-to-open-storage-adapter';
import { ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore } from '../swarm-store-connector-orbit-db-subclasses-cache/swarm-store-connector-orbit-db-subclasses-cache.types';
import assert from 'assert';
import { swarmStoreConnectorOrbitDbUtilsAddressCreateOrbitDbAddressByDatabaseName } from '../../swarm-store-connector-orbit-db-utils/swarm-store-connector-orbit-db-utils-address/swarm-store-connector-orbit-db-utils-address';
import { ISwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapterConstructorOptions } from '../swarm-store-connector-orbit-db-subclasses-cache/swarm-store-connector-orbit-db-subclass-store-to-open-storage-adapter/swarm-store-connector-orbit-db-subclass-store-to-open-storage-adapter.types';
import { swarmStoreConnectorOrbitDbUtilsAddresGetHashPathFull } from '../../swarm-store-connector-orbit-db-utils';

export class SwarmStoreConnectorOrbitDBSubclassStorageFabric implements ISwarmStoreConnectorOrbitDBSubclassStorageFabric {
  private key?: CryptoKey;

  private ready?: Promise<void>;

  /**
   * names of databases which must be encrypted
   *
   * @protected
   * @type {Set<string>}
   * @memberof SwarmStoreConnectorOrbitDBSubclassStorageFabric
   */
  protected secretDatabasesNames: Set<string> = new Set();

  /**
   * paths of databases which must be encrypted
   *
   * @protected
   * @type {Set<string>}
   * @memberof SwarmStoreConnectorOrbitDBSubclassStorageFabric
   */
  protected secretDatabasesPaths: Set<string> = new Set();

  protected storage: any;

  protected rootPath?: string;

  constructor({ credentials, rootPath }: ISwarmStoreConnectorOrbitDbSubclassStorageFabricConstructorOptions) {
    if (credentials) {
      this.applyCredentials(credentials);
    }
    this.setRootPath(rootPath);
    this.createStorage();
  }

  public addSecretDatabaseName = async (dbName: string): Promise<void> => {
    const databasePath = await this.createPathForDb(dbName);

    this.secretDatabasesNames.add(dbName);
    this.secretDatabasesPaths.add(databasePath);
  };

  /**
   * create an instance of OrbitDB Cache
   * for a path provided
   *
   * @param {string} path
   * @returns {Cache}
   * @memberof SwarmStoreConnectorOrbitDBSubclassStorageFabric
   * @throws
   */
  public async createStore(path: string): Promise<ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore> {
    await this.ready;
    if (this.whetherUseSecretStorageForPath(path)) {
      return this.createSecretStorageForPath(path);
    }
    // TODO - the default cache storage created by OrbitDB
    // with the LevelUP library works incorrectly with a lot
    // of I/O operations.
    return this.createOpenStorageForPath(path);
  }

  /**
   * create an instance of OrbitDB Cache
   * for a path provided
   *
   * @param {string} dbName
   * @returns {Cache}
   * @memberof SwarmStoreConnectorOrbitDBSubclassStorageFabric
   * @throws
   */
  public async createStoreForDb(dbName: string): Promise<ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore> {
    await this.ready;
    const dbPath = await this.createPathForDb(dbName);
    if (this.whetherUseSecretStorageForDB(dbName)) {
      return this.createSecretStorageForPath(dbPath);
    }
    // TODO - the default cache storage created by OrbitDB
    // with the LevelUP library works incorrectly with a lot
    // of I/O operations.
    return this.createOpenStorageForPath(dbPath);
  }

  protected setRootPath(rootPath: string): void {
    assert(typeof rootPath === 'string', 'Root path should be a string');
    this.rootPath = rootPath;
  }

  protected createStorage(): void {
    this.storage = Storage();
  }

  protected whetherUseSecretStorageForDB(dbName: string): boolean {
    return this.secretDatabasesNames.has(dbName);
  }

  protected whetherUseSecretStorageForPath(path: string): boolean {
    return this.secretDatabasesPaths.has(path);
  }

  protected applyCredentials(credentials: ISecretStoreCredentials): void {
    this.ready = this.createKey(credentials);
  }

  /**
   *
   *
   * @protected
   * @param {ISecretStoreCredentials} credentials
   * @returns {Promise<void>}
   * @memberof SwarmStoreConnectorOrbitDBSubclassStorageFabric
   * @throws
   */
  protected async createKey(credentials: ISecretStoreCredentials): Promise<void> {
    const secretStorage = new SecretStorage();
    const cryptoKey = await secretStorage.generateCryptoKey(credentials);

    if (cryptoKey instanceof Error) {
      console.error(`createKey::${cryptoKey}`);
      throw new Error('Failed to generate a key');
    }
    if (!(cryptoKey instanceof CryptoKey)) {
      throw new Error('createKey::the key generated by a password string must be a CryptoKey');
    }
    this.key = cryptoKey;
  }

  protected createSecretStorageCacheInstance(path: string): ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore {
    const { key } = this;

    if (!key) {
      throw new Error('A CryptoKey is not exists');
    }
    if (!(key instanceof CryptoKey)) {
      throw new Error('The key must be an instance of CryptoKey');
    }

    const cache = new SwarmStoreConnectorOrbitDBSubclassStorageCache({ dbName: path }, { key });

    return cache;
  }

  protected async createSecretStorageForPath(path: string): Promise<ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore> {
    const cache = this.createSecretStorageCacheInstance(path);

    await cache.open();
    return cache;
  }

  protected async createOptionsForOpenStorageCacheInstanceConstructor(
    path: string
  ): Promise<ISwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapterConstructorOptions> {
    const dbName = await swarmStoreConnectorOrbitDbUtilsAddresGetHashPathFull(path);
    return { dbName };
  }

  protected async createOpenStorageCacheInstance(path: string): Promise<ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore> {
    const cacheStoreConstructorOptions = await this.createOptionsForOpenStorageCacheInstanceConstructor(path);
    const cacheStoreInstance = new SwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapter(cacheStoreConstructorOptions);

    return cacheStoreInstance;
  }

  protected async createOpenStorageForPath(path: string): Promise<ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore> {
    const cache = await this.createOpenStorageCacheInstance(path);

    await cache.open();
    return cache;
  }

  protected async createPathForDb(dbName: string): Promise<string> {
    if (!this.rootPath) {
      throw new Error('A root path is not defined');
    }
    return swarmStoreConnectorOrbitDbUtilsAddressCreateOrbitDbAddressByDatabaseName(this.rootPath, dbName);
  }
}
