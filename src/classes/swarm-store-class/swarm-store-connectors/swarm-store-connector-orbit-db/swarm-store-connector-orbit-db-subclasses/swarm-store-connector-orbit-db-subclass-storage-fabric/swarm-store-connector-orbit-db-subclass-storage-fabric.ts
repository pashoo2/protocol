import { IStore } from 'orbit-db-cache';
import { ISecretStoreCredentials } from 'classes/secret-storage-class/secret-storage-class.types';
import { SecretStorage } from 'classes/secret-storage-class/secret-storage-class';
import { ISwarmStoreConnectorOrbitDBSubclassStorageFabric } from './swarm-store-connector-orbit-db-subclass-storage-fabric.types';
import { SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter } from '../swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter/swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter';
import Storage from 'orbit-db-storage-adapter';
import OrbitDB from 'orbit-db';

export class SwarmStoreConnectorOrbitDBSubclassStorageFabric
  implements ISwarmStoreConnectorOrbitDBSubclassStorageFabric {
  private key?: CryptoKey;

  private ready?: Promise<void>;

  // names of databases which must be encrypted
  protected secretDatabasesNames: string[] = [];

  protected storage: any;

  constructor(credentials: ISecretStoreCredentials) {
    this.applyCredentials(credentials);
    this.storage = Storage();
  }

  public addSecretDatabaseName = (dbName: string) => {
    if (!this.secretDatabasesNames.includes(dbName)) {
      this.secretDatabasesNames.push(dbName);
    }
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
  public async createStore(path: string): Promise<IStore> {
    await this.ready;
    if (!this.isSecretPath(path)) {
      return this.storage.createStore(path);
    }

    const { key } = this;

    if (!key) {
      throw new Error('A CryptoKey is not exists');
    }
    if (!(key instanceof CryptoKey)) {
      throw new Error('The key must be an instance of CryptoKey');
    }

    const cache = new SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter(
      { key },
      { dbName: path }
    );

    await cache.open();
    return cache;
  }

  protected getValidPath(path: string): string {
    return path.startsWith('/') ? path : `/${path}`;
  }

  protected getDBNameByAddress(path: string): undefined | string {
    try {
      return OrbitDB.parseAddress(this.getValidPath(path)).path;
    } catch (err) {
      console.error('Cant parse the path', err);
    }
  }

  protected getDBNameByPath(path: string): undefined | string {
    const dbName = this.getDBNameByAddress(path);

    if (dbName) {
      return dbName;
    }

    let idx = 0;
    let matches = 0;
    while (matches < 2 && idx < path.length) {
      if (path[idx++] === '/') {
        matches++;
      }
      if (matches === 2) {
        return path.slice(idx);
      }
    }
  }

  protected isSecretPath(path: string): boolean {
    const dbName = this.getDBNameByPath(path);
    return !!dbName && this.secretDatabasesNames.includes(dbName);
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
  protected async createKey(
    credentials: ISecretStoreCredentials
  ): Promise<void> {
    const secretStorage = new SecretStorage();
    const cryptoKey = await secretStorage.generateCryptoKey(credentials);

    if (cryptoKey instanceof Error) {
      console.error(`createKey::${cryptoKey}`);
      throw new Error('Failed to generate a key');
    }
    if (!(cryptoKey instanceof CryptoKey)) {
      throw new Error(
        'createKey::the key generated by a password string must be a CryptoKey'
      );
    }
    this.key = cryptoKey;
  }
}
