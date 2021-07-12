import { getSwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions } from '../../../../../../../swarm-messages-database/swarm-messages-database-fabrics/swarm-messages-database-instance-fabric-by-database-options';
import { getSwarmMessagesDatabaseWithKVDbMessagesUpdatesQueuedConnectedInstanceFabricByDatabaseOptions } from '../../../../../../../swarm-messages-database/swarm-messages-database-extended/swarm-messages-database-with-kv-db-messages-updates-queued/swarm-messages-database-with-kv-db-messages-updates-queued-fabrics-by-database-options';
export function getSwarmMessagesDatabaseConnectorInstanceDefaultFabric(options) {
    return getSwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions(options);
}
export function getSwarmMessagesDatabaseWithKVDbMessagesUpdatesConnectorInstanceFabric(options) {
    return getSwarmMessagesDatabaseWithKVDbMessagesUpdatesQueuedConnectedInstanceFabricByDatabaseOptions(options);
}
//# sourceMappingURL=swarm-messages-channel-v1-constructor-options-default-utils-database-connector-fabrics.js.map