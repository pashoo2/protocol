import { SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter } from '../swarm-store-connector-orbit-db-subclasses-cache/swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter';
import { SWARM_STORAGE_CONNECTOR_ORBIT_DB_SUBLASS_KEY_STORE_DEFAULT_DB_NAME } from './swarm-store-connector-orbit-db-subclass-keystore.const';
export const extendsOptionsWithStore = (options) => {
    if (!options) {
        throw new Error('Options must be provided');
    }
    if (typeof options !== 'object') {
        throw new Error('Options must be an object');
    }
    const { credentials } = options;
    let dbName = SWARM_STORAGE_CONNECTOR_ORBIT_DB_SUBLASS_KEY_STORE_DEFAULT_DB_NAME;
    if (typeof options.store === 'string') {
        dbName = options.store;
    }
    else if (typeof options.path === 'string') {
        dbName = options.path;
    }
    const adapterToSecretStore = new SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter({ dbName }, credentials);
    return Object.assign({}, options, { store: adapterToSecretStore });
};
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-keystore.utils.js.map