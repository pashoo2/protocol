import { __awaiter } from "tslib";
import { createConnectionBridgeConnection } from '../../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-class-fabrics/connection-bridge-fabric/connection-bridge-fabric';
export function connectToSwarmUtil(options, credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        const optionsWithCredentials = Object.assign(Object.assign({}, options), { auth: Object.assign(Object.assign({}, options.auth), { credentials }) });
        const connectionBridgeInstance = yield createConnectionBridgeConnection(optionsWithCredentials, true);
        return connectionBridgeInstance;
    });
}
//# sourceMappingURL=connect-to-swarm.utils.js.map