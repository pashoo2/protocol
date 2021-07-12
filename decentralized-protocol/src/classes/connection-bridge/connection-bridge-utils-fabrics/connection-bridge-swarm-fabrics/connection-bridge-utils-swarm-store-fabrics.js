import { getClassSwarmMessageStoreWithEntriesCountAndOptionsSerializer } from '../../../swarm-message-store/swarm-message-store-extended/swarm-message-store-with-entries-count-and-options-serializer';
import { getSwarmMessageStoreWithDatabaseOptionsConstructorExtended } from '../../../swarm-message-store/swarm-message-store-extended/swarm-message-store-with-database-options-constructor-mixin/swarm-message-store-with-database-options-constructor-mixin';
import { createSwarmMessageStoreDBOWithOptionsExtenderFabric } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-connector-db-options-with-options-extender-class-fabric/swarm-message-store-connector-db-options-with-options-extender-class-fabric';
import { createSwarmMessageStoreUtilsExtenderOrbitDBDatabaseOptionsWithAccessControlAndGrandAccessCallbackBoundToContext } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-conector-db-options-grand-access-utils/swarm-store-connector-db-options-helpers-access-control-extend-with-common-checks/swarm-store-connector-db-options-helpers-access-control-extend-with-common-checks';
import { getMessageValidatorForGrandAccessCallbackBound } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-conector-db-options-grand-access-utils/swarm-message-store-conector-db-options-grand-access-utils-common-grand-access-checker/swarm-message-store-conector-db-options-grand-access-utils-common-grand-access-checker';
import { swarmStoreOptionsClassFabric } from '../../../swarm-store-class/swarm-store-class-helpers/swarm-store-options-helpers/swarm-store-options-class-fabric/swarm-store-options-class-fabric';
export function swarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializer() {
    const SwarmStoreOptionsClass = swarmStoreOptionsClassFabric();
    const SwarmMessageStoreWithEntriesCount = getClassSwarmMessageStoreWithEntriesCountAndOptionsSerializer(SwarmStoreOptionsClass);
    return new SwarmMessageStoreWithEntriesCount();
}
export function getSwarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializerAndDatabaseOptionsExtendedConstructor(SwarmStoreDatabaseOptionsClass, databaseOptionsExtenderFabric) {
    const DatabaseOptionsConstructorWithExtender = createSwarmMessageStoreDBOWithOptionsExtenderFabric(SwarmStoreDatabaseOptionsClass, databaseOptionsExtenderFabric);
    const SwarmStoreOptionsClass = swarmStoreOptionsClassFabric();
    const SwarmMessageStoreWithEntriesCount = getClassSwarmMessageStoreWithEntriesCountAndOptionsSerializer(SwarmStoreOptionsClass);
    const SwarmMessageStoreWithDbOptionsConstructor = getSwarmMessageStoreWithDatabaseOptionsConstructorExtended(SwarmMessageStoreWithEntriesCount, DatabaseOptionsConstructorWithExtender);
    return new SwarmMessageStoreWithDbOptionsConstructor();
}
export function getSwarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializerAndDatabaseOptionsExtendedConstructorWithDefaultParams(ContextBaseClass, swarmMessageStoreDBOGrandAccessCallbackContextFabric, databaseOptionsClassFabric, swarmMessageValidatorFabric = getMessageValidatorForGrandAccessCallbackBound) {
    const DatabaseOptionsClass = databaseOptionsClassFabric(ContextBaseClass, swarmMessageStoreDBOGrandAccessCallbackContextFabric);
    const dboExtender = (options) => createSwarmMessageStoreUtilsExtenderOrbitDBDatabaseOptionsWithAccessControlAndGrandAccessCallbackBoundToContext(options, swarmMessageValidatorFabric);
    const swarmMessagesStoreInstance = getSwarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializerAndDatabaseOptionsExtendedConstructor(DatabaseOptionsClass, dboExtender);
    return swarmMessagesStoreInstance;
}
//# sourceMappingURL=connection-bridge-utils-swarm-store-fabrics.js.map