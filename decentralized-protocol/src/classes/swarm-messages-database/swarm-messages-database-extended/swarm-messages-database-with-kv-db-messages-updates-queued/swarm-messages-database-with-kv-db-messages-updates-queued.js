import { __awaiter } from "tslib";
import { SwarmMessagesDatabase } from '../../swarm-messages-database';
import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { SWARM_MESSAGES_DATABASE_WITH_KV_DB_MESSAGES_UPDATES_QUEUED_INTERVAL_UPDATING_DEFFERED_KEYS_IN_CACHE_MS } from './swarm-messages-database-with-kv-db-messages-updates-queued.const';
import { ESwarmMessageStoreEventNames } from '../../../swarm-message-store/swarm-message-store.const';
import { ESwarmMessagesDatabaseOperation } from '../../swarm-messages-database.const';
import { CONST_DATABASE_KEY_PARTS_SAFE_DELIMETER } from "../../../../const/const-database/const-database-keys";
export class SwarmMessagesDatabaseWithKvDbMessagesUpdatesQueued extends SwarmMessagesDatabase {
    constructor() {
        super(...arguments);
        this.__dbKeysForDefferedValuesUpdateInCache = new Set();
        this.__newMessagesEmitted = new Set();
        this._addMessageEventToListOfEmitted = (eventType, messageAddress, key, message) => {
            const uniqueHash = this._getUniqueHashForTheEventTypeForAMessage(eventType, messageAddress, key, message);
            this.__newMessagesEmitted.add(uniqueHash);
        };
        this._hasMessageEventAlreadyBeenEmitted = (messageType, messageAddress, key, message) => {
            const uniqueHash = this._getUniqueHashForTheEventTypeForAMessage(messageType, messageAddress, key, message);
            return this.__newMessagesEmitted.has(uniqueHash);
        };
    }
    get __dbKeysForDefferedValuesUpdateInCacheQueue() {
        return [...this.__dbKeysForDefferedValuesUpdateInCache.values()];
    }
    get _isMessagesCacheExists() {
        return Boolean(this._swarmMessagesCache);
    }
    connect(options) {
        const _super = Object.create(null, {
            connect: { get: () => super.connect }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.connect.call(this, options);
            this.__startIntervalDefferedKeysValuesUpdateInCacheRelatedToStorage();
        });
    }
    close() {
        const _super = Object.create(null, {
            close: { get: () => super.close }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.close.call(this);
            this.__stopIntervalDefferedKeysValuesUpdateInCacheRelatedToStorage();
        });
    }
    drop() {
        const _super = Object.create(null, {
            drop: { get: () => super.drop }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.drop.call(this);
            this.__stopIntervalDefferedKeysValuesUpdateInCacheRelatedToStorage();
        });
    }
    _handleDatabaseNewMessage(dbName, message, messageAddress, key) {
        const _super = Object.create(null, {
            _handleDatabaseNewMessage: { get: () => super._handleDatabaseNewMessage }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isKeyValueDatabase) {
                if (!key) {
                    throw new Error('Key should exists for a message in a KV database');
                }
                this._addKeyInMessagesDefferedReadQueue(key);
                return;
            }
            return yield _super._handleDatabaseNewMessage.call(this, dbName, message, messageAddress, key);
        });
    }
    _handleDatabaseNewMessageInKVDatabase(dbName, message, messageAddress, key) {
        if (!key) {
            throw new Error('Key should exists for a message in a KV database');
        }
        this._addKeyInMessagesDefferedReadQueue(key);
    }
    _handleDatabaseDeleteMessage(dbName, userID, messageAddress, messageDeletedAddress, keyOrHash) {
        const _super = Object.create(null, {
            _handleDatabaseDeleteMessage: { get: () => super._handleDatabaseDeleteMessage }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isKeyValueDatabase) {
                yield this._handleDatabaseDeleteMessageFromKVDatabase(dbName, userID, messageAddress, messageDeletedAddress, keyOrHash);
                return;
            }
            return yield _super._handleDatabaseDeleteMessage.call(this, dbName, userID, messageAddress, messageDeletedAddress, keyOrHash);
        });
    }
    _handleDatabaseDeleteMessageFromKVDatabase(dbName, userID, messageAddress, messageDeletedAddress, keyOrHash) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!keyOrHash) {
                throw new Error('Key should exists for a message in a KV database');
            }
            const dbKey = keyOrHash;
            this._addOperationUnderMessageToListOfHandled(ESwarmMessagesDatabaseOperation.DELETE, messageAddress, dbKey);
            try {
                if (!(yield this._whetherAMessageExistsForDbKey(dbKey))) {
                    this._emitDeleteMessageEventIfHaventBeenEmittedBefore(dbName, userID, messageAddress, messageDeletedAddress, dbKey);
                }
            }
            catch (err) {
                this._deleteOperationUnderMessageFromListOfHandled(ESwarmMessagesDatabaseOperation.DELETE, messageAddress, dbKey);
                throw err;
            }
        });
    }
    _getQueryParamsToReadValueForDbKeys(keyOrKeys) {
        return {
            [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq]: keyOrKeys,
            [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: 1,
            [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.fromCache]: true,
        };
    }
    _addKeyInMessagesDefferedReadQueue(key) {
        const dbKeysForDefferedUpdate = this.__dbKeysForDefferedValuesUpdateInCache;
        if (!dbKeysForDefferedUpdate.has(key)) {
            const dbKeysForDefferedUpdateUpdated = new Set(dbKeysForDefferedUpdate.values());
            dbKeysForDefferedUpdateUpdated.add(key);
            this.__dbKeysForDefferedValuesUpdateInCache = dbKeysForDefferedUpdateUpdated;
        }
    }
    _resetKeysQueuedForDefferedCacheUpdate() {
        this.__dbKeysForDefferedValuesUpdateInCache = new Set();
    }
    _updateFeedStoreCacheByMessageAndMeta(dbName, message, messageAddress) {
        return this._addMessageToCache(dbName, message, messageAddress);
    }
    _handleMessageForKeyInKVDatabase(key) {
        this._addKeyInMessagesDefferedReadQueue(key);
    }
    _getUniqueHashForTheEventTypeForAMessage(eventType, messageAddress, key, message) {
        const prefix = String(eventType);
        const postfix = this._getUniqueHashForMessageMetaInfo(messageAddress, key, message);
        return `${prefix}${CONST_DATABASE_KEY_PARTS_SAFE_DELIMETER}${postfix}`;
    }
    _emitNewMessageEventIfHaventBeenEmittedBefore(dbName, message, messageAddress, key) {
        const eventName = ESwarmMessageStoreEventNames.NEW_MESSAGE;
        if (this._hasMessageEventAlreadyBeenEmitted(eventName, messageAddress, key, message)) {
            return;
        }
        this._emitNewMessageEvent(dbName, message, messageAddress, key);
        this._addMessageEventToListOfEmitted(eventName, messageAddress, key, message);
    }
    _emitDeleteMessageEventIfHaventBeenEmittedBefore(dbName, userID, messageAddress, messageDeletedAddress, keyOrHash) {
        const eventName = ESwarmMessageStoreEventNames.DELETE_MESSAGE;
        if (this._hasMessageEventAlreadyBeenEmitted(eventName, messageAddress, keyOrHash)) {
            return;
        }
        this._emitDeleteMessageEvent(dbName, userID, messageAddress, messageDeletedAddress, keyOrHash);
        this._addMessageEventToListOfEmitted(eventName, messageAddress, keyOrHash);
    }
    __emitMessagesUpdatesAndUpdateCacheIfExistsByRequestResult(requestValuesWithMetadataForKeysResult) {
        return __awaiter(this, void 0, void 0, function* () {
            const promisesPending = [];
            requestValuesWithMetadataForKeysResult.forEach((requestResult) => {
                if (!requestResult) {
                    return;
                }
                try {
                    const { dbName, message, messageAddress, key } = requestResult;
                    if (messageAddress instanceof Error) {
                        throw new Error(`Swarm message addrress must be exist, but an error has been gotten: ${messageAddress.message}`);
                    }
                    if (key instanceof Error) {
                        throw new Error(`Swarm message key must be exist, but an error has been gotten: ${key.message}`);
                    }
                    if (message instanceof Error) {
                        throw new Error(`Swarm message must be exist, but an error has been gotten: ${message.message}`);
                    }
                    if (!messageAddress) {
                        throw new Error('Address must be exists for a swarm message');
                    }
                    if (this._hasSwarmMessageOperationAlreadyBeenHandled(ESwarmMessagesDatabaseOperation.ADD, messageAddress, key, message)) {
                        return;
                    }
                    this._emitNewMessageEventIfHaventBeenEmittedBefore(dbName, message, messageAddress, key);
                    this._addOperationUnderMessageToListOfHandled(ESwarmMessagesDatabaseOperation.ADD, messageAddress, key, message);
                    if (this._isMessagesCacheExists) {
                        promisesPending.push(this._createAndAddSwarmMessageWithMetaToMessagesCacheByMessageAndMetaRelatedTo(dbName, message, messageAddress, key));
                    }
                }
                catch (err) {
                    console.error('Failed to update value in cache');
                    console.error(err);
                }
            });
            if (promisesPending.length) {
                yield Promise.all(promisesPending);
            }
        });
    }
    _whetherAMessageExistsForDbKey(dbKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const databaseQueryForReadingKeys = this._getQueryParamsToReadValueForDbKeys(dbKey);
            const requestValuesWithoutMetadataForKeysResult = yield this.collect(databaseQueryForReadingKeys);
            return !(requestValuesWithoutMetadataForKeysResult === null || requestValuesWithoutMetadataForKeysResult === void 0 ? void 0 : requestValuesWithoutMetadataForKeysResult.length) || !!requestValuesWithoutMetadataForKeysResult[0];
        });
    }
    _readMessagesByDefferedKeysQueueKVStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = this.__dbKeysForDefferedValuesUpdateInCacheQueue;
            if (!keys.length) {
                return;
            }
            const databaseQueryForReadingKeys = this._getQueryParamsToReadValueForDbKeys(keys);
            this._resetKeysQueuedForDefferedCacheUpdate();
            try {
                const requestValuesWithMetadataForKeysResult = yield this.collectWithMeta(databaseQueryForReadingKeys);
                yield this.__emitMessagesUpdatesAndUpdateCacheIfExistsByRequestResult(requestValuesWithMetadataForKeysResult);
            }
            catch (err) {
                console.error('The error has occurred during updating the cache');
                console.error(err);
                keys.forEach((key) => this._addKeyInMessagesDefferedReadQueue(key));
            }
        });
    }
    __startIntervalDefferedKeysValuesUpdateInCacheRelatedToStorage() {
        this.__intervalDefferedKeysValuesUpdateInCacheRelatedToStorage = setInterval(() => this._readMessagesByDefferedKeysQueueKVStorage(), SWARM_MESSAGES_DATABASE_WITH_KV_DB_MESSAGES_UPDATES_QUEUED_INTERVAL_UPDATING_DEFFERED_KEYS_IN_CACHE_MS);
    }
    __stopIntervalDefferedKeysValuesUpdateInCacheRelatedToStorage() {
        const intervalDefferedKeysValuesUpdateInCacheRelatedToStorage = this.__intervalDefferedKeysValuesUpdateInCacheRelatedToStorage;
        if (intervalDefferedKeysValuesUpdateInCacheRelatedToStorage) {
            clearInterval(intervalDefferedKeysValuesUpdateInCacheRelatedToStorage);
        }
    }
}
//# sourceMappingURL=swarm-messages-database-with-kv-db-messages-updates-queued.js.map