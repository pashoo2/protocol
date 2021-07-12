import { __awaiter } from "tslib";
import { ConnectionBridge } from '../../../connection-bridge';
export const createConnectionBridgeConnection = (options, useSessionIfExists = false) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const connectionBridge = new ConnectionBridge();
    let useSessionAuth = false;
    const optionsWithoutCredentials = Object.assign(Object.assign({}, options), { auth: Object.assign(Object.assign({}, ((_a = options.auth) !== null && _a !== void 0 ? _a : {})), { credentials: undefined }) });
    if (useSessionIfExists) {
        useSessionAuth = yield connectionBridge.checkSessionAvailable(optionsWithoutCredentials);
    }
    yield connectionBridge.connect(useSessionAuth ? optionsWithoutCredentials : options);
    return connectionBridge;
});
//# sourceMappingURL=connection-bridge-fabric.js.map