import { __awaiter } from "tslib";
import { createConnectionBridgeConnectionWithDBOClassByOptions } from '../../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-class-fabrics/connection-bridge-with-dbo-class/connection-bridge-with-dbo-class-fabric';
import { CONNECTION_BRIDGE_WITH_DBO_CLASS_STORAGE_SPECIFIC_OPTIONS } from '../../const/connect-to-swarm-connection-bridge-options.const';
export function connectToSwarmWithDBOUtil(options, credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        const storageOptions = Object.assign(Object.assign({}, options.storage), CONNECTION_BRIDGE_WITH_DBO_CLASS_STORAGE_SPECIFIC_OPTIONS);
        const optionsResulted = Object.assign(Object.assign({}, options), { storage: storageOptions });
        const connectionBridgeInstance = yield createConnectionBridgeConnectionWithDBOClassByOptions(optionsResulted, credentials, true);
        return connectionBridgeInstance;
    });
}
//# sourceMappingURL=connect-to-swarm-with-dbo-utils.js.map