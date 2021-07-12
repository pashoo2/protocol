import { __awaiter } from "tslib";
import { ConnectionBridgeWithDBOClassEntriesCount } from './connection-bridge-with-dbo-class';
export const createConnectionBridgeConnectionWithDBOClass = (options, credentials, useSessionIfExists = false) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const connectionBridge = new ConnectionBridgeWithDBOClassEntriesCount();
    let useSessionAuth = false;
    const optionsWithCredentials = credentials
        ? Object.assign(Object.assign({}, options), { auth: Object.assign(Object.assign({}, options.auth), { credentials }) }) : options;
    const optionsWithoutCredentials = Object.assign(Object.assign({}, options), { auth: Object.assign(Object.assign({}, ((_a = options.auth) !== null && _a !== void 0 ? _a : {})), { credentials: undefined }) });
    if (useSessionIfExists) {
        useSessionAuth = yield connectionBridge.checkSessionAvailable(optionsWithoutCredentials);
    }
    yield connectionBridge.connect(useSessionAuth ? optionsWithoutCredentials : optionsWithCredentials);
    return connectionBridge;
});
export const createConnectionBridgeConnectionWithDBOClassByOptions = (options, credentials, useSessionIfExists = false) => {
    return createConnectionBridgeConnectionWithDBOClass(options, credentials, useSessionIfExists);
};
//# sourceMappingURL=connection-bridge-with-dbo-class-fabric.js.map