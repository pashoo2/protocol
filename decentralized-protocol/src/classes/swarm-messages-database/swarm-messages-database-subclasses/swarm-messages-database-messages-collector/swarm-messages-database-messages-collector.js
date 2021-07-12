import { __awaiter } from "tslib";
export class SwarmMessagesDatabaseMessagesCollector {
    constructor(_options) {
        this._options = _options;
        if (!_options.swarmMessageStore) {
            throw new Error('An instance of the SwarmMessageStore should be provided in the options');
        }
    }
    get _swarmMesssagesStore() {
        return this._options.swarmMessageStore;
    }
    collectWithMeta(dbName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._swarmMesssagesStore.collectWithMeta(dbName, options);
            return result;
        });
    }
}
export function createSwarmMessagesDatabaseMessagesCollectorInstance(options) {
    return new SwarmMessagesDatabaseMessagesCollector(options);
}
//# sourceMappingURL=swarm-messages-database-messages-collector.js.map