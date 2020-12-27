import { IConnectionBridgeWithDatabaseOptionsClassAndDBListPeristentStorageAndSwarmMessageCountStorageOptions } from '../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-class-fabrics/connection-bridge-with-dbo-class-fabric/connection-bridge-with-dbo-class-fabric.types';
import { CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS } from './connect-to-swarm.const';
import { createSwarmStoreDatabaseGrandAccessBaseContextClass } from '../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-store-to-swarm-database-grand-access-callbacks-fabrics';
import { getSwarmStoreConectorDbOptionsGrandAccessContextClass } from '../../classes/swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-conector-db-options-grand-access-utils/swarm-store-conector-db-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-classes/swarm-message-store-conector-db-options-grand-access-context-class/swarm-message-store-conector-db-options-grand-access-context-class';
import { getSwarmMessageStoreConnectorDbOptionsValidatorSerializerClass } from '../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-swarm-store-database-options-fabric';
import { getSwarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializerAndDatabaseOptionsExtendedConstructorWithDefaultParams } from '../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-swarm-store-fabrics';
export const CONNECTION_BRIDGE_WITH_DBO_CLASS_STORAGE_OPTIONS: IConnectionBridgeWithDatabaseOptionsClassAndDBListPeristentStorageAndSwarmMessageCountStorageOptions = {
  ...CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS,
  swarmMessageStoreInstanceFabric: void undefined,
  swarmMessageStoreDatabaseGrandAccessBaseContextClassFabric: createSwarmStoreDatabaseGrandAccessBaseContextClass,
  swarmMessageStoreDBOGrandAccessCallbackFabric: getSwarmStoreConectorDbOptionsGrandAccessContextClass,
  swarmMessageStoreDatabaseOptionsClassFabric: getSwarmMessageStoreConnectorDbOptionsValidatorSerializerClass,
  swarmMessageStoreInstanceWithDBOClassFabric: getSwarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializerAndDatabaseOptionsExtendedConstructorWithDefaultParams,
};
