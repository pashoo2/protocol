import { __awaiter } from "tslib";
import { swarmMessagesDatabaseConnectedFabricMain as swarmMessagesDatabaseConnectedInstanceFabric } from '../../../../../../../swarm-messages-database/swarm-messages-database-fabrics/swarm-messages-database-intstance-fabric-main/index';
export function getDatabaseConnectionByDatabaseOptionsFabricMain(options, swarmMessagesDatabaseConnectedFabric = swarmMessagesDatabaseConnectedInstanceFabric) {
    function swarmMessagesChannelsListDatabaseConnectionFabric(databaseOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsForSwamMessagesDatabaseConnectedFabric = Object.assign(Object.assign({}, options), { dbOptions: databaseOptions });
            return yield swarmMessagesDatabaseConnectedFabric(optionsForSwamMessagesDatabaseConnectedFabric);
        });
    }
    return swarmMessagesChannelsListDatabaseConnectionFabric;
}
//# sourceMappingURL=swarm-messages-channels-list-v1-database-connection-fabric-main.js.map