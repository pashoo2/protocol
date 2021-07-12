import { __awaiter } from "tslib";
import assert from 'assert';
import { isConstructor, delay } from "../../utils";
import { ESwarmStoreEventNames } from '../swarm-store-class/swarm-store-class.const';
import { getEventEmitterInstance } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmMessageStoreEventNames } from '../swarm-message-store/swarm-message-store.const';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import validateUserIdentifier from '../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier';
import { ESwarmMessagesDatabaseCacheEventsNames, SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_UPDATE_RETRY_DELAY_MS, SWARM_MESSAGES_DATABASE_MESSAGES_EMITTED_UNIQ_ID_ADDRESS_PREFIX, } from './swarm-messages-database.const';
import { SWARM_MESSAGES_DATABASE_MESSAGES_MAX_ATTEMPTS_CACHE_UPDATE, ESwarmMessagesDatabaseOperation, } from './swarm-messages-database.const';
import { CONST_DATABASE_KEY_PARTS_SAFE_DELIMETER } from "../../const/const-database/const-database-keys";
export class SwarmMessagesDatabase {
    constructor() {
        this._emitter = getEventEmitterInstance();
        this._isReady = false;
        this._messagesOperationsHashesHandled = new Set();
        this._setIsReady = () => {
            this._isReady = true;
        };
        this._unsetIsReady = () => {
            this._isReady = false;
        };
        this._setMessagesCached = (messagesCached) => {
            this._messagesCached = messagesCached;
        };
        this._handleDatabaseLoadingEvent = (dbName, percentage) => {
            if (this._dbName !== dbName)
                return;
            this._emitter.emit(ESwarmStoreEventNames.DB_LOADING, dbName, percentage);
        };
        this._handleDatabaseUpdatedEvent = (dbName) => {
            if (this._dbName !== dbName)
                return;
            this._emitter.emit(ESwarmStoreEventNames.UPDATE, dbName);
            this._updateMessagesCache();
        };
        this._getUniqueHashForMessageMetaInfo = (messageAddress, key, message) => {
            return message ? message.sig : `${SWARM_MESSAGES_DATABASE_MESSAGES_EMITTED_UNIQ_ID_ADDRESS_PREFIX}::${messageAddress}`;
        };
        this._addOperationUnderMessageToListOfHandled = (databaseOperation, messageAddress, key, message) => {
            const hash = this._getUniqueHashForMessageMetaInfoAndDatabaseOperation(databaseOperation, messageAddress, key, message);
            this._messagesOperationsHashesHandled.add(hash);
        };
        this._deleteOperationUnderMessageFromListOfHandled = (databaseOperation, messageAddress, key, message) => {
            const hash = this._getUniqueHashForMessageMetaInfoAndDatabaseOperation(databaseOperation, messageAddress, key, message);
            this._messagesOperationsHashesHandled.delete(hash);
        };
        this._hasSwarmMessageOperationAlreadyBeenHandled = (databaseOperation, messageAddress, key, message) => {
            const hash = this._getUniqueHashForMessageMetaInfoAndDatabaseOperation(databaseOperation, messageAddress, key, message);
            return this._messagesOperationsHashesHandled.has(hash);
        };
        this._handleDatabaseNewMessageIfHaventBeenHandledBefore = (dbName, message, messageAddress, key) => __awaiter(this, void 0, void 0, function* () {
            if (this._dbName !== dbName)
                return;
            if (this._hasSwarmMessageOperationAlreadyBeenHandled(ESwarmMessagesDatabaseOperation.ADD, messageAddress, key, message)) {
                return;
            }
            yield this._handleDatabaseNewMessage(dbName, message, messageAddress, key);
        });
        this._handleDatabaseDeleteMessageIfNotHaveBeenHandledBefore = (dbName, userID, messageAddress, messageDeletedAddress, keyOrHash) => __awaiter(this, void 0, void 0, function* () {
            if (this._dbName !== dbName)
                return;
            const keyForValueToCheckAlreadyHandled = this._isKeyValueDatabase ? keyOrHash : undefined;
            if (this._hasSwarmMessageOperationAlreadyBeenHandled(ESwarmMessagesDatabaseOperation.DELETE, messageAddress, keyForValueToCheckAlreadyHandled)) {
                return;
            }
            yield this._handleDatabaseDeleteMessage(dbName, userID, messageAddress, messageDeletedAddress, keyOrHash);
        });
        this._handleDatabaseMessageError = (dbName, messageSerialized, error, messageAddress, key) => {
            if (this._dbName === dbName) {
                this._emitter.emit(ESwarmMessageStoreEventNames.NEW_MESSAGE_ERROR, dbName, messageSerialized, error, messageAddress, key);
            }
        };
        this._handleDatabaseReadyEvent = (dbName) => {
            if (this._dbName !== dbName)
                return;
            this._emitter.emit(ESwarmStoreEventNames.READY, dbName);
            this._setIsReady();
        };
        this._handleDatabaseClosedEvent = (dbName) => __awaiter(this, void 0, void 0, function* () {
            if (this._dbName !== dbName)
                return;
            this._emitInstanceClosed();
            yield this._handleDatabaseClosed();
        });
        this._handleDatabaseDroppedEvent = (dbName) => __awaiter(this, void 0, void 0, function* () {
            if (this._dbName !== dbName)
                return;
            this._emitDatabaseDropped();
            yield this._handleDatabaseClosed();
        });
        this._handleCacheUpdating = () => {
            this._emitter.emit(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING_STARTED);
        };
        this._handleCacheUpdatingEnded = (messagesCached) => {
            if (!messagesCached) {
                console.warn('_handleCacheUpdated::have no messages cached been updated during the process of a full cache update');
                return;
            }
            this._setMessagesCached(messagesCached);
            this.emitter.emit(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, messagesCached);
        };
        this._handleCacheUpdated = (messagesCached) => {
            if (!messagesCached) {
                console.warn('_handleCacheUpdated::have no messages cached been updated');
                return;
            }
            this._setMessagesCached(messagesCached);
            this.emitter.emit(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, messagesCached);
        };
    }
    get dbName() {
        return this._dbName;
    }
    get dbType() {
        return this._dbType;
    }
    get isReady() {
        return this._isReady && !!this._swarmMessageStore;
    }
    get emitter() {
        return this._emitter;
    }
    get isMessagesListContainsAllMessages() {
        var _a;
        return Boolean((_a = this._swarmMessagesCache) === null || _a === void 0 ? void 0 : _a.whetherMessagesListContainsAllMessages);
    }
    get whetherMessagesListUpdateInProgress() {
        var _a;
        return Boolean((_a = this._swarmMessagesCache) === null || _a === void 0 ? void 0 : _a.isUpdating);
    }
    get swarmMessagesCache() {
        const swarmMessagesCache = this._swarmMessagesCache;
        if (!swarmMessagesCache) {
            throw new Error('There is no cache related to the database');
        }
        return swarmMessagesCache;
    }
    get cachedMessages() {
        return this._messagesCached;
    }
    get _currentUserId() {
        var _a;
        return (_a = this._currentUserOptons) === null || _a === void 0 ? void 0 : _a.userId;
    }
    get _isKeyValueDatabase() {
        return this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;
    }
    get _swarmMessagesCacheClassFromOptions() {
        var _a;
        const SwarmMessagesCacheConstructor = (_a = this._cacheOptions) === null || _a === void 0 ? void 0 : _a.cacheConstructor;
        if (!SwarmMessagesCacheConstructor) {
            throw new Error('SwarmMessagesCacheConstructor should be defined in options');
        }
        return SwarmMessagesCacheConstructor;
    }
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this._handleOptions(options);
            yield this._openDatabaseInstance();
            yield this._startSwarmMessagesCache();
            this._setListeners();
            this._setIsReady();
            this._updateMessagesCache();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isReady) {
                console.warn('SwarmMessageDatabase instance was already closed');
                return;
            }
            this._unsetIsReady();
            yield this._closeSwarmDatabaseInstance();
            yield this._closeSwarmMessagesCahceInstance();
            this._emitInstanceClosed();
            yield this._handleDatabaseClosed();
        });
    }
    drop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isReady) {
                console.warn('SwarmMessageDatabase instance was already closed');
                return;
            }
            this._unsetIsReady();
            yield this._dropSwarmDatabaseInstance();
            this._emitDatabaseDropped();
            yield this._handleDatabaseClosed();
        });
    }
    addMessage(message, key) {
        if (!this._checkIsReady()) {
            throw new Error('The instance is not ready to use');
        }
        return this._swarmMessageStore.addMessage(this._dbName, message, key);
    }
    deleteMessage(messageAddressOrKey) {
        if (!this._checkIsReady()) {
            throw new Error('The instance is not ready to use');
        }
        return this._swarmMessageStore.deleteMessage(this._dbName, messageAddressOrKey);
    }
    collect(options) {
        if (!this._checkIsReady()) {
            throw new Error('The instance is not ready to use');
        }
        return this._swarmMessageStore.collect(this._dbName, options);
    }
    collectWithMeta(options) {
        if (!this._checkIsReady()) {
            throw new Error('The instance is not ready to use');
        }
        return this._swarmMessageStore.collectWithMeta(this._dbName, options);
    }
    _checkIsReady() {
        if (!this._isReady) {
            throw new Error('The instance is not ready to use');
        }
        if (!this._swarmMessageStore) {
            throw new Error('Implementation of the SwarmMessageStore interface is not provided');
        }
        if (!this._dbName) {
            throw new Error('Database name is not defined for the instance');
        }
        if (!this._currentUserId) {
            throw new Error('Identity of the current user is not defined');
        }
        if (!this._swarmMessagesCache) {
            throw new Error('Swarm messages cahce is not exists');
        }
        return true;
    }
    _validateOptions(options) {
        assert(!!options, 'An options object must be provided');
        assert(typeof options === 'object', 'Options must be an object');
        assert(!!options.dbOptions, 'An options for database must be provided');
        assert(typeof options.dbOptions === 'object', 'An options for database must be an object');
        assert(!!options.swarmMessageStore, 'An instance implemented SwarmMessageStore interface must be provided');
        assert(options.swarmMessageStore.isReady, 'An implementation of the ISwarmMessageStore interface must be ready to use');
        assert(!!options.user, 'The current user options must be defined');
        assert(typeof options.user === 'object', 'The current user options should be an object');
        assert(options.swarmMessagesCollector, 'Swarm messages collector should be passed in options');
        validateUserIdentifier(options.user.userId);
    }
    _setDbOptions(dbOptions) {
        this._dbOptions = dbOptions;
        this._dbName = dbOptions.dbName;
        this._dbType = dbOptions.dbType;
    }
    _setUserOptions(optionsUser) {
        this._currentUserOptons = optionsUser;
    }
    _setOptions(options) {
        this._setDbOptions(options.dbOptions);
        this._swarmMessageStore = options.swarmMessageStore;
        this._swarmMessagesCollector = options.swarmMessagesCollector;
        this._setUserOptions(options.user);
    }
    _validateCacheOptions(options) {
        if (!options) {
            return;
        }
        assert(typeof options === 'object', 'Swarm messages cache options must be an object');
        if (options.cacheConstructor) {
            assert(isConstructor(options.cacheConstructor), 'cacheConstructor option should be a constructor');
        }
    }
    _setCacheOptions(options) {
        this._cacheOptions = options;
    }
    _handleOptions(options) {
        this._validateOptions(options);
        this._setOptions(options);
        if (options.cacheOptions) {
            this._validateCacheOptions(options.cacheOptions);
            this._setCacheOptions(options.cacheOptions);
        }
    }
    _checkDatabaseProps() {
        const swarmMessageStore = this._swarmMessageStore;
        if (!swarmMessageStore) {
            throw new Error('A SwarmMessageStore interface implementation is not defined');
        }
        const { _dbName } = this;
        if (!_dbName) {
            throw new Error('A database name is not defined');
        }
        return true;
    }
    _updateMessagesCache(attempt = 0) {
        if (!this._isReady) {
            console.warn(`The database ${this._dbName}:${this._dbType} is not ready`);
            return;
        }
        if (this._checkIsReady()) {
            this._swarmMessagesCache.update().catch((err) => __awaiter(this, void 0, void 0, function* () {
                if (attempt > SWARM_MESSAGES_DATABASE_MESSAGES_MAX_ATTEMPTS_CACHE_UPDATE) {
                    console.error(`Failed to update messages cache ${err.message}`);
                    yield delay(SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_UPDATE_RETRY_DELAY_MS);
                    this._updateMessagesCache(attempt++);
                }
            }));
        }
    }
    _getSwarmMessageWithMeta(dbName, message, messageAddress, key) {
        return {
            dbName,
            message,
            messageAddress,
            key,
        };
    }
    _addSwarmMessageWithMetaToMessagesCache(swarmMessageWithMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            const swarmMessgesCache = this._swarmMessagesCache;
            if (!swarmMessgesCache) {
                throw new Error('Swarm messages cache joint to the database is not exists');
            }
            yield swarmMessgesCache.addMessage(swarmMessageWithMeta);
        });
    }
    _createAndAddSwarmMessageWithMetaToMessagesCacheByMessageAndMetaRelatedTo(dbName, message, messageAddress, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const swarmMessageWithMeta = this._getSwarmMessageWithMeta(dbName, message, messageAddress, key);
            yield this._addSwarmMessageWithMetaToMessagesCache(swarmMessageWithMeta);
        });
    }
    _addMessageToCache(dbName, message, messageAddress, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._checkIsReady()) {
                yield this._createAndAddSwarmMessageWithMetaToMessagesCacheByMessageAndMetaRelatedTo(dbName, message, messageAddress, key);
                return;
            }
            throw new Error('Swarm messages cache is not ready');
        });
    }
    _removeMessageFromCache(messageAddress, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._checkIsReady()) {
                return;
            }
            if (!messageAddress && !key) {
                throw new Error('Messages address or message key requered to remove message from the cache');
            }
            return yield this.swarmMessagesCache.deleteMessage(messageAddress, key);
        });
    }
    _getUniqueHashForMessageMetaInfoAndDatabaseOperation(databaseOperation, messageAddress, key, message) {
        const prefix = String(databaseOperation);
        const postfix = this._getUniqueHashForMessageMetaInfo(messageAddress, key, message);
        return `${prefix}${CONST_DATABASE_KEY_PARTS_SAFE_DELIMETER}${postfix}`;
    }
    _emitNewMessageEvent(dbName, message, messageAddress, key) {
        this._emitter.emit(ESwarmMessageStoreEventNames.NEW_MESSAGE, dbName, message, messageAddress, key);
    }
    _handleDatabaseNewMessage(dbName, message, messageAddress, key) {
        return __awaiter(this, void 0, void 0, function* () {
            this._emitNewMessageEvent(dbName, message, messageAddress, key);
            this._addOperationUnderMessageToListOfHandled(ESwarmMessagesDatabaseOperation.ADD, messageAddress, key, message);
            yield this._handleCacheUpdateOnNewMessage(message, messageAddress, key);
        });
    }
    _emitDeleteMessageEvent(dbName, userID, messageAddress, messageDeletedAddress, keyOrHash) {
        this._emitter.emit(ESwarmMessageStoreEventNames.DELETE_MESSAGE, dbName, userID, messageAddress, messageDeletedAddress, keyOrHash);
    }
    _handleDatabaseDeleteMessage(dbName, userID, messageAddress, messageDeletedAddress, keyOrHash) {
        return __awaiter(this, void 0, void 0, function* () {
            this._emitDeleteMessageEvent(dbName, userID, messageAddress, messageDeletedAddress, keyOrHash);
            this._addOperationUnderMessageToListOfHandled(ESwarmMessagesDatabaseOperation.DELETE, messageAddress, keyOrHash);
            yield this._handleCacheUpdateOnMessageDeleteFromKVDatabase(userID, messageAddress, messageDeletedAddress, keyOrHash);
        });
    }
    _emitInstanceClosed() {
        if (!this._dbName) {
            throw new Error('SwarmMessagesDatabase::_emitInstanceClosed: failed cause there is no database name defined');
        }
        this._emitter.emit(ESwarmStoreEventNames.CLOSE_DATABASE, this._dbName);
    }
    _emitDatabaseDropped() {
        if (!this._dbName) {
            throw new Error('SwarmMessagesDatabase::_emitDatabaseDropped: failed cause there is no database name defined');
        }
        this._emitter.emit(ESwarmStoreEventNames.DROP_DATABASE, this._dbName);
    }
    _setSwarmMessagesStoreListeners(isSetListeners = true) {
        const method = isSetListeners ? 'addListener' : 'removeListener';
        const swarmMessageStore = this._swarmMessageStore;
        if (!swarmMessageStore) {
            throw new Error('A SwarmMessageStore instance is not exists');
        }
        swarmMessageStore[method](ESwarmStoreEventNames.DB_LOADING, this._handleDatabaseLoadingEvent);
        swarmMessageStore[method](ESwarmStoreEventNames.UPDATE, this._handleDatabaseUpdatedEvent);
        swarmMessageStore[method](ESwarmMessageStoreEventNames.NEW_MESSAGE, this._handleDatabaseNewMessageIfHaventBeenHandledBefore);
        swarmMessageStore[method](ESwarmMessageStoreEventNames.DELETE_MESSAGE, this._handleDatabaseDeleteMessageIfNotHaveBeenHandledBefore);
        swarmMessageStore[method](ESwarmStoreEventNames.READY, this._handleDatabaseReadyEvent);
        swarmMessageStore[method](ESwarmStoreEventNames.CLOSE_DATABASE, this._handleDatabaseClosedEvent);
        swarmMessageStore[method](ESwarmStoreEventNames.DROP_DATABASE, this._handleDatabaseDroppedEvent);
    }
    _setCacheListeners(isSetListeners = true) {
        if (!this._swarmMessagesCache) {
            throw new Error('Swarm messages cache is not defined');
        }
        const emitter = this._swarmMessagesCache.emitter;
        if (isSetListeners) {
            emitter.addListener(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING_STARTED, this._handleCacheUpdating);
            emitter.addListener(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING_OVER, this._handleCacheUpdatingEnded);
            emitter.addListener(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, this._handleCacheUpdated);
        }
        else {
            emitter.removeListener(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING_STARTED, this._handleCacheUpdating);
            emitter.removeListener(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING_OVER, this._handleCacheUpdatingEnded);
            emitter.removeListener(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, this._handleCacheUpdated);
        }
    }
    _setListeners(isSetListeners = true) {
        this._setSwarmMessagesStoreListeners(isSetListeners);
        this._setCacheListeners(isSetListeners);
    }
    _openDatabaseInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._swarmMessageStore) {
                throw new Error('Swarm message store must be provided');
            }
            if (!this._dbOptions) {
                throw new Error('There is no options provided for the database');
            }
            const result = yield this._swarmMessageStore.openDatabase(this._dbOptions);
            if (result instanceof Error) {
                console.log('Failed to open the database');
                throw result;
            }
        });
    }
    _getSwarmMessageStoreCollectMessages() {
        if (!this._swarmMessagesCollector) {
            throw new Error('Swarm messages collector should be defined');
        }
        return this._swarmMessagesCollector;
    }
    _getSwarmMessagesCacheOptions() {
        if (!this._dbType) {
            throw new Error('Failed to defined database type');
        }
        if (!this._dbName) {
            throw new Error('Database name should not be empty');
        }
        return {
            dbInstance: this._getSwarmMessageStoreCollectMessages(),
            dbType: this._dbType,
            dbName: this._dbName,
        };
    }
    _startSwarmMessagesCache() {
        return __awaiter(this, void 0, void 0, function* () {
            const SwarmMessagesCacheConstructor = this._swarmMessagesCacheClassFromOptions;
            const swarmMessagesCacheOptions = this._getSwarmMessagesCacheOptions();
            const swarmMessagesCache = new SwarmMessagesCacheConstructor(swarmMessagesCacheOptions);
            yield swarmMessagesCache.start();
            this._swarmMessagesCache = swarmMessagesCache;
        });
    }
    _unsetOptions() {
        this._dbName = undefined;
        this._dbOptions = undefined;
        this._dbType = undefined;
        this._currentUserOptons = undefined;
    }
    _unsetThisInstanceListeners() {
        this._emitter.removeAllListeners();
    }
    _unsetSwarmStoreListeners() {
        this._setListeners(false);
    }
    _unsetSwarmMessageStoreInstance() {
        this._unsetSwarmStoreListeners();
        this._swarmMessageStore = undefined;
    }
    _handleDatabaseClosed() {
        return __awaiter(this, void 0, void 0, function* () {
            this._unsetIsReady();
            this._unsetOptions();
            this._unsetThisInstanceListeners();
            this._unsetSwarmMessageStoreInstance();
        });
    }
    _closeSwarmDatabaseInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._checkDatabaseProps()) {
                throw new Error('Database props are not valid');
            }
            const dbName = this._dbName;
            const result = yield this._swarmMessageStore.closeDatabase(dbName);
            if (result instanceof Error) {
                throw new Error(`Failed to close the database ${dbName}: ${result.message}`);
            }
        });
    }
    _closeSwarmMessagesCahceInstance() {
        if (!this._swarmMessagesCache) {
            throw new Error('There is no active instance for caching swarm messages');
        }
        return this._swarmMessagesCache.close();
    }
    _dropSwarmDatabaseInstance() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._checkDatabaseProps()) {
                throw new Error('Database props are not valid');
            }
            const dbName = this._dbName;
            const result = yield ((_a = this._swarmMessageStore) === null || _a === void 0 ? void 0 : _a.dropDatabase(dbName));
            if (result instanceof Error) {
                throw new Error(`Failed to drop the database ${dbName}: ${result.message}`);
            }
        });
    }
    _handleCacheUpdateOnNewMessage(message, messageAddress, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._checkIsReady()) {
                yield this._addMessageToCache(this._dbName, message, messageAddress, key);
            }
        });
    }
    _handleCacheUpdateOnMessageDeleteFromKVDatabase(userID, messageAddress, messageDeletedAddress, keyOrHash) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._checkIsReady()) {
                yield this._removeMessageFromCache(messageDeletedAddress, keyOrHash);
            }
        });
    }
}
//# sourceMappingURL=swarm-messages-database.js.map