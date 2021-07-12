import { ESwarmStoreConnector, } from '../../../swarm-store-class';
import { SwarmStoreConnectorOrbitDbSubclassDatabaseQueuedItemsCounted } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database-classes-extended/swarm-store-connector-orbit-db-subclass-database-queued-items-counted';
export const connectorBasicFabricOrbitDBDefault = (dbOptions, orbitDb) => {
    return new SwarmStoreConnectorOrbitDbSubclassDatabaseQueuedItemsCounted(dbOptions, orbitDb);
};
export const connectorBasicFabricOrbitDBWithEntriesCount = (dbOptions, orbitDb) => {
    return new SwarmStoreConnectorOrbitDbSubclassDatabaseQueuedItemsCounted(dbOptions, orbitDb);
};
export const getSwarmStoreConnectionProviderOptionsForOrbitDb = (swarmConnection, connectorBasicFabric) => {
    return {
        ipfs: swarmConnection.getNativeConnection(),
        connectorBasicFabric,
    };
};
export const getSwarmStoreConnectionProviderOptionsForSwarmStoreConnector = (swarmStoreConnectorType, swarmConnection, connectorBasicFabric) => {
    if (swarmStoreConnectorType === ESwarmStoreConnector.OrbitDB) {
        const orbitDbOptions = getSwarmStoreConnectionProviderOptionsForOrbitDb(swarmConnection, connectorBasicFabric);
        return orbitDbOptions;
    }
    throw new Error('This swarm store connector type is not supported');
};
//# sourceMappingURL=connection-bridge-utils-store-to-swarm-database-fabrics.js.map