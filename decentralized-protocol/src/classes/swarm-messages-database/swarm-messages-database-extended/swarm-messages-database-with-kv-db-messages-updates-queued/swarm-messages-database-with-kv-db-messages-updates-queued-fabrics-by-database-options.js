import { __awaiter } from "tslib";
import { SwarmMessagesDatabaseWithKvDbMessagesUpdatesQueued } from './swarm-messages-database-with-kv-db-messages-updates-queued';
import { getSwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions } from '../../swarm-messages-database-fabrics/swarm-messages-database-instance-fabric-by-database-options';
import { swarmMessagesDatabaseConnectedFabricMain } from "../../swarm-messages-database-fabrics/swarm-messages-database-intstance-fabric-main/swarm-messages-database-intstance-fabric-main";
export function getSwarmMessagesDatabaseWithKVDbMessagesUpdatesQueuedConnectedInstanceFabricByDatabaseOptions(options) {
    return getSwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions(options, SwarmMessagesDatabaseWithKvDbMessagesUpdatesQueued);
}
export function swarmMessagesDatabaseWithKVDbMessagesUpdatesQueuedConnectedFabric(options) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield swarmMessagesDatabaseConnectedFabricMain(options, SwarmMessagesDatabaseWithKvDbMessagesUpdatesQueued);
    });
}
//# sourceMappingURL=swarm-messages-database-with-kv-db-messages-updates-queued-fabrics-by-database-options.js.map