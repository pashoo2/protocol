import { createSwarmStoreDatabaseGrandAccessBaseContextClass } from '../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-store-to-swarm-database-grand-access-callbacks-fabrics';
import { getSwarmStoreConectorDbOptionsGrandAccessContextClass } from '../../classes/swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-conector-db-options-grand-access-utils/swarm-store-conector-db-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-classes/swarm-message-store-conector-db-options-grand-access-context-class/swarm-message-store-conector-db-options-grand-access-context-class';
import { getSwarmMessageStoreConnectorDBOClassFabric } from '../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-swarm-store-database-options-fabric';
import { getSwarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializerAndDatabaseOptionsExtendedConstructorWithDefaultParams } from '../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-swarm-store-fabrics';
export const CONNECTION_BRIDGE_WITH_DBO_CLASS_STORAGE_SPECIFIC_OPTIONS = {
    swarmMessageStoreInstanceFabric: () => {
        throw new Error('swarmMessageStoreInstanceFabric should not be implemented');
    },
    swarmMessageStoreDatabaseGrandAccessBaseContextClassFabric: createSwarmStoreDatabaseGrandAccessBaseContextClass,
    swarmMessageStoreDBOGrandAccessCallbackFabric: getSwarmStoreConectorDbOptionsGrandAccessContextClass,
    swarmMessageStoreDatabaseOptionsClassFabricOfFabric: getSwarmMessageStoreConnectorDBOClassFabric,
    swarmMessageStoreInstanceWithDBOClassFabric: getSwarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializerAndDatabaseOptionsExtendedConstructorWithDefaultParams,
};
//# sourceMappingURL=connect-to-swarm-connection-bridge-options.const.js.map