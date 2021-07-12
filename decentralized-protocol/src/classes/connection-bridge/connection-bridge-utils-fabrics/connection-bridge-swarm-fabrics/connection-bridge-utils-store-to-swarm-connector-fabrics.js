import { ESwarmStoreConnector, SwarmStoreConnectorOrbitDB, swarmStoreConnectorOrbitDBWithEntriesCountInstanceFabric, } from '../../../swarm-store-class';
const getMainConnectorFabricForOrbitDBWithEntriesCount = (swarmStoreConnectorOrbitDBConstructorOptions, options) => {
    return swarmStoreConnectorOrbitDBWithEntriesCountInstanceFabric(swarmStoreConnectorOrbitDBConstructorOptions);
};
const getMainConnectorFabricForOrbitDB = (swarmStoreConnectorOrbitDBConstructorOptions, options) => {
    const swarmMessageStoreWithEntriesCount = new SwarmStoreConnectorOrbitDB(swarmStoreConnectorOrbitDBConstructorOptions);
    return swarmMessageStoreWithEntriesCount;
};
export const getMainConnectorFabricDefault = (swarmStoreConnectorConstructorOptions) => {
    return (storeProviderOptions) => {
        const { provider: swarmStoreConnectorType } = storeProviderOptions;
        switch (swarmStoreConnectorType) {
            case ESwarmStoreConnector.OrbitDB:
                return getMainConnectorFabricForOrbitDB(swarmStoreConnectorConstructorOptions, storeProviderOptions);
            default:
                throw new Error('Unsupported swarm connector type');
        }
    };
};
export const getMainConnectorFabricWithEntriesCountDefault = (swarmStoreConnectorConstructorOptions) => {
    return (storeProviderOptions) => {
        const { provider: swarmStoreConnectorType } = storeProviderOptions;
        switch (swarmStoreConnectorType) {
            case ESwarmStoreConnector.OrbitDB:
                return getMainConnectorFabricForOrbitDBWithEntriesCount(swarmStoreConnectorConstructorOptions, storeProviderOptions);
            default:
                throw new Error('Unsupported swarm connector type');
        }
    };
};
//# sourceMappingURL=connection-bridge-utils-store-to-swarm-connector-fabrics.js.map