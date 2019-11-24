import { IStore } from 'orbit-db-cache';

export interface ISwarmStoreConnectorOrbitDBSubclassStorageFabric {
  createStore(path: string): Promise<IStore>;
}
