import { __awaiter } from "tslib";
import assert from 'assert';
import { getSwarmStoreConectorDbOptionsGrandAccessContextClass } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-options/swarm-store-connector-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-base-class/swarm-store-conector-db-options-grand-access-context-class';
export function createSwarmStoreDatabaseGrandAccessBaseContextClass(params) {
    const { centralAuthority, jsonSchemaValidator } = params;
    function isUserValid(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            assert(centralAuthority.isRunning, 'Central authority instance should be running');
            return Boolean(yield centralAuthority.getSwarmUserCredentials(userId));
        });
    }
    const swarmStoreConectorDbOptionsGrandAccessContextClassFabricParams = {
        get currentUserId() {
            const currentUserId = centralAuthority.getUserIdentity();
            if (currentUserId instanceof Error) {
                throw currentUserId;
            }
            return currentUserId;
        },
        isUserValid,
        jsonSchemaValidator,
    };
    return getSwarmStoreConectorDbOptionsGrandAccessContextClass(swarmStoreConectorDbOptionsGrandAccessContextClassFabricParams);
}
//# sourceMappingURL=connection-bridge-utils-store-to-swarm-database-grand-access-callbacks-fabrics.js.map