import { __awaiter } from "tslib";
import { SwarmMessagesDatabaseCache } from '../swarm-messages-database-cache/swarm-messages-database-cache';
import { SWARM_MESSAGES_DATABASE_CACHE_WITH_ENTITIES_COUNT_READ_COUNT_FAULT_DEFAULT } from './swarm-messages-database-cache-with-entities-count.const';
export class SwarmMessagesDatabaseCacheWithEntitiesCount extends SwarmMessagesDatabaseCache {
    constructor(_options) {
        super(_options);
        this.__itemsToReadCountFault = SWARM_MESSAGES_DATABASE_CACHE_WITH_ENTITIES_COUNT_READ_COUNT_FAULT_DEFAULT;
        this._whetherToStopMessagesReading = (expectedMessagesOverallToReadAtTheBatchCount, expectedNewMessagesToReadAtTheBatchCount, resultedNewMessagesReadAtTheBatchCount) => __awaiter(this, void 0, void 0, function* () {
            const messagesInStoreCount = yield this._getOverallMessagesInStoreCount();
            return (messagesInStoreCount <= resultedNewMessagesReadAtTheBatchCount ||
                this._checkWheterTheCountHasReadMoreThanEntitiesStoredCount(messagesInStoreCount, expectedMessagesOverallToReadAtTheBatchCount));
        });
        this._setReadItemsCountFault(_options);
    }
    _setReadItemsCountFault(opts) {
        if (opts.itemsToReadCountFault) {
            this.__itemsToReadCountFault = opts.itemsToReadCountFault;
        }
    }
    _getMessagesStoreMeta() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const dbName = (_a = this._options) === null || _a === void 0 ? void 0 : _a.dbName;
            if (!dbName) {
                throw new Error('Database name should be defined in the options');
            }
            const swarmMessagesCollector = this._getSwarmMessagesCollector();
            if (typeof swarmMessagesCollector.getStoreMeta !== 'function') {
                throw new Error('swarmMessagesCollector doesnt support meta information');
            }
            return yield swarmMessagesCollector.getStoreMeta(dbName);
        });
    }
    _getOverallMessagesInStoreCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._getMessagesStoreMeta()).messagesStoredCount;
        });
    }
    _checkWheterTheCountHasReadMoreThanEntitiesStoredCount(messagesInStoreCount, expectedMessagesOverallToReadAtTheBatchCount) {
        return expectedMessagesOverallToReadAtTheBatchCount > messagesInStoreCount + this.__itemsToReadCountFault;
    }
}
//# sourceMappingURL=swarm-messages-database-cache-with-entities-count.js.map