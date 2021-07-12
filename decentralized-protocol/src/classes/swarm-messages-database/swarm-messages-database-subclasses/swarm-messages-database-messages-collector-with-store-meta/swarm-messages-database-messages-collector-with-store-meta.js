import { __awaiter } from "tslib";
import { SwarmMessagesDatabaseMessagesCollector } from '../swarm-messages-database-messages-collector';
class SwarmMessagesDatabaseMessagesCollectorWithStoreMeta extends SwarmMessagesDatabaseMessagesCollector {
    constructor(_options) {
        super(_options);
        this._options = _options;
    }
    get _swarmMesssagesStore() {
        return this._options.swarmMessageStore;
    }
    collectWithMeta(dbName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const messagesCollected = yield this._swarmMesssagesStore.collectWithMeta(dbName, options);
            return messagesCollected;
        });
    }
    getStoreMeta(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._options.getSwarmMessageStoreMeta(this._swarmMesssagesStore, dbName);
        });
    }
}
export function createSwarmMessagesDatabaseMessagesCollectorWithStoreMetaInstance(options) {
    return new SwarmMessagesDatabaseMessagesCollectorWithStoreMeta(options);
}
//# sourceMappingURL=swarm-messages-database-messages-collector-with-store-meta.js.map