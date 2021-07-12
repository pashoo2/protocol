import { __awaiter } from "tslib";
import { SWARM_MESSAGE_STORE_UTILS_MESSAGES_CACHE_KEY_DB_KEY_VALUE_KEY_PREFIX, SWARM_MESSAGE_STORE_UTILS_MESSAGES_CACHE_KEY_PARTS_DELIMETER, } from './swarm-message-store-utils-messages-cache.const';
import assert from 'assert';
export class SwarmMessageStoreUtilsMessagesCache {
    constructor() {
        this._isReady = false;
        this.getMessageByAddress = (messageAddress) => __awaiter(this, void 0, void 0, function* () {
            if (this._checkIsReady()) {
                const cacheKey = this.getCacheKeyForMessageAddressAndDbName(messageAddress);
                const value = yield this._cache.get(cacheKey);
                if (value instanceof Error) {
                    throw value;
                }
                if (typeof value === 'string') {
                    throw new Error('A swarm message instance must not be a string');
                }
                return value;
            }
        });
        this.setMessageByAddress = (messageAddress, message) => __awaiter(this, void 0, void 0, function* () {
            if (this._checkIsReady()) {
                const cacheKey = this.getCacheKeyForMessageAddressAndDbName(messageAddress);
                const value = yield this._cache.set(cacheKey, message);
                if (value instanceof Error) {
                    throw value;
                }
            }
        });
        this.unsetMessageByAddress = (messageAddress) => __awaiter(this, void 0, void 0, function* () {
            if (this._checkIsReady()) {
                const cacheKey = this.getCacheKeyForMessageAddressAndDbName(messageAddress);
                const value = yield this._cache.unset(cacheKey);
                if (value instanceof Error) {
                    throw value;
                }
            }
        });
        this.getMessageAddressByKey = (dbKey) => __awaiter(this, void 0, void 0, function* () {
            if (this._checkIsReady()) {
                const cacheKey = this.getCacheKeyForDbKeyAndDbName(dbKey);
                const value = yield this._cache.get(cacheKey);
                if (value instanceof Error) {
                    throw value;
                }
                if (typeof value !== 'string') {
                    throw new Error('A swarm message address must be a string');
                }
                return value;
            }
        });
        this.setMessageAddressForKey = (dbKey, messageAddress) => __awaiter(this, void 0, void 0, function* () {
            if (this._checkIsReady()) {
                const cacheKey = this.getCacheKeyForDbKeyAndDbName(dbKey);
                const value = yield this._cache.set(cacheKey, messageAddress);
                if (value instanceof Error) {
                    throw value;
                }
            }
        });
        this.unsetMessageAddressForKey = (dbKey) => __awaiter(this, void 0, void 0, function* () {
            if (this._checkIsReady()) {
                const cacheKey = this.getCacheKeyForDbKeyAndDbName(dbKey);
                const value = yield this._cache.unset(cacheKey);
                if (value instanceof Error) {
                    throw value;
                }
            }
        });
        this.getMessageByKey = (dbKey) => __awaiter(this, void 0, void 0, function* () {
            const messageAddress = yield this.getMessageAddressByKey(dbKey);
            if (!messageAddress) {
                return;
            }
            return this.getMessageByAddress(messageAddress);
        });
        this.clear = () => __awaiter(this, void 0, void 0, function* () {
            if (this._checkIsReady()) {
                yield this._cache.clearDb();
            }
        });
    }
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isReady) {
                return;
            }
            this._validateAndSetOptions(options);
            this._isReady = true;
        });
    }
    _validateOptions(options) {
        assert(!!options, 'Options should not be empty');
        assert(typeof options === 'object', 'Options should be an object');
        assert(typeof options.dbName === 'string', 'A database name should be a string');
        assert(!!options.cache, 'A cache storage implementation should be defined');
        assert(typeof options.cache === 'object', 'Cache implementation should be an object');
        assert(typeof options.cache.get === 'function', 'Cache implementation is not related to the interface - should have the "get" method');
        assert(typeof options.cache.set === 'function', 'Cache implementation is not related to the interface - should have the "set" method');
    }
    _validateAndSetOptions(options) {
        this._validateOptions(options);
        this._cache = options.cache;
        this._dbName = options.dbName;
    }
    _checkIsReady() {
        assert(this._isReady, 'The instance is not ready');
        assert(this._cache, 'Cache is not defined for the instance');
        assert(this._dbName, 'Database name should be defined');
        return true;
    }
    getCacheKeyForMessageAddressAndDbName(messageAddress) {
        return `${this._dbName}${SWARM_MESSAGE_STORE_UTILS_MESSAGES_CACHE_KEY_PARTS_DELIMETER}${messageAddress}`;
    }
    getCacheKeyForDbKeyAndDbName(messageKey) {
        return `${SWARM_MESSAGE_STORE_UTILS_MESSAGES_CACHE_KEY_DB_KEY_VALUE_KEY_PREFIX}${this._dbName}${SWARM_MESSAGE_STORE_UTILS_MESSAGES_CACHE_KEY_PARTS_DELIMETER}${messageKey}`;
    }
    clearCache() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this._cache) === null || _a === void 0 ? void 0 : _a.clearDb());
        });
    }
}
//# sourceMappingURL=swarm-message-store-utils-messages-cache.js.map