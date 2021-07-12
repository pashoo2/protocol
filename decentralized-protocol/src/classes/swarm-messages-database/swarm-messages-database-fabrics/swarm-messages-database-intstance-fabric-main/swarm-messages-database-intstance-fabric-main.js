import { __awaiter } from "tslib";
import { SwarmMessagesDatabase } from '../../swarm-messages-database';
import { ESwarmStoreConnector } from "../../../swarm-store-class/swarm-store-class.const";
export function swarmMessagesDatabaseConnectedFabricMain(options, SwarmMessagesDatabaseClassBase = SwarmMessagesDatabase) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = new SwarmMessagesDatabaseClassBase();
        yield db.connect(options);
        return db;
    });
}
//# sourceMappingURL=swarm-messages-database-intstance-fabric-main.js.map