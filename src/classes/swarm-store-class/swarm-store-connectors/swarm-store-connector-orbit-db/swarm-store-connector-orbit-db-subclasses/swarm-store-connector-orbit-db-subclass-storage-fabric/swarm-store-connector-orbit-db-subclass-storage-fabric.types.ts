import Cache from 'orbit-db-cache';

export interface ISwarmStoreConnectorOrbitDBSubclassStorageFabric {
    createStore(path: string): Cache
}