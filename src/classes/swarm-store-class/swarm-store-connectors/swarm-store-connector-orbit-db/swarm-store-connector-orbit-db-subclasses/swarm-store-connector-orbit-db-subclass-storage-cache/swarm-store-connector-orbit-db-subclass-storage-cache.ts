import Cache from 'orbit-db-cache';
import { SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter } from '../swarm-store-connector-orbit-db-subclasses-cache/swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter/swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter';

export class SwarmStoreConnectorOrbitDBSubclassStorageCache
  extends SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter
  implements Cache<any>
{
  /**
   * @param {string} k
   * @param {*} v
   * @returns {Promise<void>}
   * @memberof SwarmStoreConnectorOrbitDBSubclassStorageCache
   * @throws
   */
  public async set(k: string, v: string | Buffer): Promise<void> {
    if (typeof k !== 'string') {
      throw new Error('Key must be a string');
    }
    return await super.put(k, v);
  }
}
