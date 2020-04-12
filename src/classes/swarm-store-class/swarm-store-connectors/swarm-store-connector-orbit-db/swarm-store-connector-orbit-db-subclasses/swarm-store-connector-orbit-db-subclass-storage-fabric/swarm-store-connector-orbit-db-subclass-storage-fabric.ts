import { IStore } from 'orbit-db-cache';
import { ISecretStoreCredentials } from 'classes/secret-storage-class/secret-storage-class.types';
import { SecretStorage } from 'classes/secret-storage-class/secret-storage-class';
import { ISwarmStoreConnectorOrbitDBSubclassStorageFabric } from './swarm-store-connector-orbit-db-subclass-storage-fabric.types';
import { SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter } from '../swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter/swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter';

export class SwarmStoreConnectorOrbitDBSubclassStorageFabric
  implements ISwarmStoreConnectorOrbitDBSubclassStorageFabric {
  private key?: CryptoKey;

  private ready?: Promise<void>;

  constructor(credentials: ISecretStoreCredentials) {
    this.applyCredentials(credentials);
  }

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
