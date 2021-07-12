import { __awaiter } from "tslib";
import { delay, timeout, commonUtilsArrayUniq } from "../../../../utils";
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database';
import { ESwarmMessagesDatabaseCacheEventsNames, SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_LIMIT_DEFAULT, SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_IDLE_PERIOD_OF_50_MS, SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_MAX_PAGE_QUERY_ATTEMPTS_DEFAULT, } from '../../swarm-messages-database.const';
import { resolveOnIdleCallback, THROTTLING_UTILS_IDLE_CALLBACK_TIMEOUT_DEFAULT_MS } from "../../../../utils/throttling-utils";
import { round } from "../../../../utils/common-utils";
import { getEventEmitterInstance } from '../../../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { SWARM_MESSAGES_DATABASE_CACHE_PLANNED_CACHE_UPDATE_FAILED_RETRY_DELAY_MS, SWARM_MESSAGES_DATABASE_CACHE_PLANNED_CACHE_UPDATE_BATCH_TIMEOUT_MS, } from './swarm-messages-database-cache.const';
import { debounce } from "../../../../utils/throttling-utils";
import { SWARM_MESSAGES_DATABASE_CACHE_ADD_TO_CACHE_MESSAGES_PENDING_DEBOUNCE_MS } from './swarm-messages-database-cache.const';
import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { constructCacheStoreFabric } from '../swarm-messages-database-messages-cached-store/swarm-messages-database-messages-cached-store';
import { getMessageDescriptionForMessageWithMeta, createMessagesMetaByAddressAndKey, } from './swarm-messages-database-cache.utils';
import { getMessagesUniqIndexesByMeta, getMessageMetaByUniqIndex } from './swarm-messages-database-cache.utils';
import { ifSwarmMessagesDecryptedEqual } from '../../../swarm-message/swarm-message-utils/swarm-message-utils-common/swarm-message-utils-common-decrypted';
export class SwarmMessagesDatabaseCache {
    constructor(options) {
        this._isReady = false;
        this._emitter = getEventEmitterInstance();
        this._whetherMessagesListContainsAllMessages = false;
        this._isSwarmMessagesCacheUpdateRequested = false;
        this._messagesCacheUpdatingBatch = undefined;
        this._setMessagesCacheUpdateInProgress = (promisePending) => {
            this._pendingMessagesCacheUpdatePromise = promisePending;
        };
        this._unsetCacheUpdateInProgress = (promisePending) => {
            if (promisePending === this._pendingMessagesCacheUpdatePromise) {
                this._pendingMessagesCacheUpdatePromise = undefined;
            }
        };
        this._setNewCacheUpdatePlanned = () => {
            this._isSwarmMessagesCacheUpdateRequested = true;
        };
        this._unsetNewCacheUpdatePlanned = () => {
            this._isSwarmMessagesCacheUpdateRequested = false;
        };
        this._whetherMaxDatabaseQueriesAttemptsFailed = (queryAttemtNumber) => {
            return queryAttemtNumber >= SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_MAX_PAGE_QUERY_ATTEMPTS_DEFAULT;
        };
        this._getDatabaseMessagesToReadQueryOptionsWithMessagesToExclude = (messagesCountToQuery, messagesReadAddressesOrKeysToExclude) => {
            return {
                [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: messagesCountToQuery,
                [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.neq]: messagesReadAddressesOrKeysToExclude,
            };
        };
        this._getDatabaseMessagesToReadQueryOptionsWithMessagesToInclude = (messagesReadAddressesOrKeysToInclude) => {
            return {
                [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq]: messagesReadAddressesOrKeysToInclude,
            };
        };
        this._requestTimeBrowserIdle = () => __awaiter(this, void 0, void 0, function* () {
            const { timeRemaining, didTimeout } = yield resolveOnIdleCallback();
            if (didTimeout) {
                return 0;
            }
            return timeRemaining;
        });
        this._getItemsCountToReadForIdlePeriod = (timeAvailToRun) => {
            const percentAcordingToFreeTime = round(timeAvailToRun / THROTTLING_UTILS_IDLE_CALLBACK_TIMEOUT_DEFAULT_MS, 2);
            return round(SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_IDLE_PERIOD_OF_50_MS * percentAcordingToFreeTime, 0);
        };
        this._getMessageAddressByDescription = (message) => {
            const { messageAddress } = message;
            if (!messageAddress || messageAddress instanceof Error) {
                return undefined;
            }
            return messageAddress;
        };
        this._getMessageKeyByDescription = (message) => {
            const { key } = message;
            if (!key || key instanceof Error) {
                return undefined;
            }
            return key;
        };
        this._mapMessagesWithMetaToStorageRelatedStructure = (messagesWithMeta) => {
            if (this._isKeyValueDatabase) {
                return this._mapMessagesDescriptionsToKVStoreMap(messagesWithMeta);
            }
            return this._mapMessagesDescriptionsToFeedStore(messagesWithMeta);
        };
        this._whetherMessagesLimitReached = (messagesCount) => {
            return messagesCount > SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_LIMIT_DEFAULT;
        };
        this._createMessagesCacheUpdatingBatchPromise = () => {
            let resolve;
            this._messagesCacheUpdatingBatch = new Promise((res, rej) => {
                resolve = res;
                setTimeout(rej, SWARM_MESSAGES_DATABASE_CACHE_PLANNED_CACHE_UPDATE_BATCH_TIMEOUT_MS);
            });
            return () => {
                resolve();
                this._messagesCacheUpdatingBatch = undefined;
            };
        };
        this._whetherToStopMessagesReading = (expectedMessagesOverallToReadAtTheBatchCount, expectedNewMessagesToReadAtTheBatchCount, resultedNewMessagesReadAtTheBatchCount) => __awaiter(this, void 0, void 0, function* () {
            return (expectedMessagesOverallToReadAtTheBatchCount > 50 &&
                expectedNewMessagesToReadAtTheBatchCount > 6 &&
                !resultedNewMessagesReadAtTheBatchCount);
        });
        this._removeMessageFromCachedStoreAndEmitEvent = (messageUniqAddress, key) => __awaiter(this, void 0, void 0, function* () {
            if (!this._checkIsReady()) {
                return;
            }
            this._messagesCachedStore.remove(createMessagesMetaByAddressAndKey(messageUniqAddress, key, this._dbType));
            this._runDefferedMessagesPartialUpdateAndResetDefferedMessagesFullQueueIfNoActiveFullCahceUpdate();
            this._emitCacheUpdated();
        });
        this._runDefferedPartialCacheUpdate = (messagesMetaToUpdate) => __awaiter(this, void 0, void 0, function* () {
            if (!this._checkIsReady()) {
                return false;
            }
            return yield this._runDefferedPartialCacheUpdateForCachedMessagesStore(messagesMetaToUpdate, this._messagesCachedStore, this._dbType);
        });
        this._runDefferedPartialCacheUpdateDebounced = debounce(() => __awaiter(this, void 0, void 0, function* () {
            if (this._isDefferedMessagesUpdateActive) {
                return;
            }
            const messagesToUpdate = this._getAndResetMessagesForPartialDefferedUpdateBatch();
            if (messagesToUpdate === null || messagesToUpdate === void 0 ? void 0 : messagesToUpdate.size) {
                if (yield this._runDefferedPartialCacheUpdate(messagesToUpdate)) {
                    this._emitCacheUpdated();
                }
                this._runDefferedPartialCacheUpdateDebounced();
            }
        }), SWARM_MESSAGES_DATABASE_CACHE_ADD_TO_CACHE_MESSAGES_PENDING_DEBOUNCE_MS);
        this._setOptions(options);
    }
    get isReady() {
        return this._isReady;
    }
    get cache() {
        return this._messagesCached;
    }
    get isUpdating() {
        return !!this._pendingMessagesCacheUpdatePromise;
    }
    get emitter() {
        return this._emitter;
    }
    get whetherMessagesListContainsAllMessages() {
        return this._whetherMessagesListContainsAllMessages;
    }
    get _swarmMesssagesCollector() {
        var _a;
        return (_a = this._options) === null || _a === void 0 ? void 0 : _a.dbInstance;
    }
    get _isKeyValueDatabase() {
        return this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;
    }
    get _messagesCached() {
        var _a;
        return (_a = this._messagesCachedStore) === null || _a === void 0 ? void 0 : _a.entries;
    }
    get _isCacheUpdateActive() {
        return !!this._pendingMessagesCacheUpdatePromise;
    }
    get _isDefferedMessagesUpdateActive() {
        return !!this._defferedPartialCacheUpdatePromise;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isReady) {
                return;
            }
            this._resetTheInstance();
            this._initializeCacheStore();
            this._isReady = true;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            this._isReady = false;
            this._clearEventEmitter();
            this._resetTheInstance();
            this._unsetCacheStore();
            this._unsetOptions();
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._updateMessagesCache();
            return this._messagesCached;
        });
    }
    addMessage(swarmMessageWithMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._checkIsReady()) {
                return false;
            }
            return this._addMessageToCachedStoreRunDefferedUpdate(swarmMessageWithMeta);
        });
    }
    deleteMessage(messageUniqAddress, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._checkIsReady()) {
                return;
            }
            yield this._waitTillMessagesCacheUpateBatchOver();
            return this._removeMessageFromCachedStoreAndEmitEvent(messageUniqAddress, key);
        });
    }
    _checkIsReady() {
        if (!this._isReady) {
            throw new Error('The instance is not ready to use');
        }
        if (!this._dbName) {
            throw new Error('Database name should be defined');
        }
        if (!this._swarmMesssagesCollector) {
            throw new Error('A database instance is not set');
        }
        if (!this._messagesCachedStore) {
            throw new Error('A messages cached instance is not exists');
        }
        if (!this._dbType) {
            throw new Error('A database type should not be empty');
        }
        return true;
    }
    _setOptions(options) {
        this._dbType = options.dbType;
        this._dbName = options.dbName;
        this._options = options;
    }
    _createMessagesCachedStorage(isTemp) {
        if (!this._dbType) {
            throw new Error('Database type should be defined');
        }
        if (!this._dbName) {
            throw new Error('Database name should be defined');
        }
        return constructCacheStoreFabric(this._dbType, this._dbName, isTemp);
    }
    _initializeCacheStore() {
        this._messagesCachedStore = this._createMessagesCachedStorage(false);
    }
    _resetTheInstance() {
        this._pendingMessagesCacheUpdatePromise = undefined;
        this._isSwarmMessagesCacheUpdateRequested = false;
        this._whetherMessagesListContainsAllMessages = false;
    }
    _unsetCacheStore() {
        this._messagesCachedStore = undefined;
    }
    _unsetOptions() {
        this._options = undefined;
    }
    _clearEventEmitter() {
        this._emitter.removeAllListeners();
    }
    _checkMessagesEqual(messageFirst, messageSecond) {
        return (!messageFirst && !messageSecond) || ifSwarmMessagesDecryptedEqual(messageFirst, messageSecond);
    }
    _checkWhetherMessgeWithMetaInstancesEqual(messageWithMetaMetaInstanceFirst, messageWithMetaMetaInstanceSecond) {
        if (messageWithMetaMetaInstanceFirst === messageWithMetaMetaInstanceSecond) {
            return true;
        }
        if (!messageWithMetaMetaInstanceSecond) {
            return false;
        }
        if (messageWithMetaMetaInstanceSecond instanceof Error) {
            return false;
        }
        if (messageWithMetaMetaInstanceFirst instanceof Error) {
            return false;
        }
        return this._checkMessagesEqual(messageWithMetaMetaInstanceSecond, messageWithMetaMetaInstanceFirst);
    }
    _waitTillMessagesCacheUpateBatchOver() {
        return __awaiter(this, void 0, void 0, function* () {
            const { _messagesCacheUpdatingBatch } = this;
            if (_messagesCacheUpdatingBatch) {
                yield Promise.race([
                    _messagesCacheUpdatingBatch,
                    timeout(SWARM_MESSAGES_DATABASE_CACHE_PLANNED_CACHE_UPDATE_BATCH_TIMEOUT_MS),
                ]).catch((err) => {
                    console.error('_waitTillMessagesCacheUpateBatchOver', err);
                    throw err;
                });
            }
        });
    }
    _emitCacheUpdatingIsInProgress() {
        this._emitter.emit(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING_STARTED);
    }
    _emitCacheUpdatingIsEnded() {
        this._emitter.emit(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING_OVER, this._messagesCached);
    }
    _emitCacheUpdated() {
        this._emitter.emit(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, this._messagesCached);
    }
    _getMessageWithMeta(dbName, message, messageAddress, key) {
        return {
            message,
            dbName,
            messageAddress,
            key,
        };
    }
    _setAllStoredMessagesReadFromDatabaseToCache() {
        this._whetherMessagesListContainsAllMessages = true;
    }
    _unsetAllStoredMessagesReadFromDatabaseToCache() {
        this._whetherMessagesListContainsAllMessages = false;
    }
    _getSwarmMessagesCollector() {
        if (this._checkIsReady()) {
            const swarmMesssagesCollector = this._swarmMesssagesCollector;
            if (!swarmMesssagesCollector) {
                throw new Error('Swarm messages collector is not defined');
            }
            return swarmMesssagesCollector;
        }
        throw new Error('The store is not ready');
    }
    _performMessagesCacheCollectPageRequest(queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._checkIsReady()) {
                throw new Error('The instance is not ready');
            }
            let queryAttempt = 0;
            let messages;
            while (!messages && !this._whetherMaxDatabaseQueriesAttemptsFailed(queryAttempt)) {
                try {
                    messages = yield this._getSwarmMessagesCollector().collectWithMeta(this._dbName, queryOptions);
                }
                catch (err) {
                    console.error(new Error(`_performMessagesCachePageRequest::failed::attempt::${queryAttempt}`), err);
                    yield this._requestTimeBrowserIdle();
                }
                finally {
                    queryAttempt++;
                }
            }
            if (!messages) {
                throw new Error('Failed to read a batch of messages from the database cause of unknown reason');
            }
            return messages;
        });
    }
    _mapMessagesDescriptionsToKVStoreMap(messagesWithMeta) {
        const messagesMap = new Map();
        messagesWithMeta.forEach((messageDescription) => {
            if (!messageDescription) {
                return messageDescription;
            }
            const key = this._getMessageKeyByDescription(messageDescription);
            if (key) {
                messagesMap.set(key, messageDescription);
            }
        });
        return messagesMap;
    }
    _mapMessagesDescriptionsToFeedStore(messagesWithMeta) {
        const messagesMap = new Map();
        messagesWithMeta.forEach((messageDescription) => {
            if (!messageDescription) {
                console.warn('Swarm message description is absent');
                return;
            }
            const messageAddress = this._getMessageAddressByDescription(messageDescription);
            if (messageAddress) {
                messagesMap.set(messageAddress, messageDescription);
            }
        });
        return messagesMap;
    }
    _getMessagesReadKeys(messagesCache) {
        return Array.from(messagesCache.keys());
    }
    _getMessagesReadAddresses(messagesCache) {
        return Array.from(messagesCache.keys());
    }
    _getMessagesReadKeysOrAddresses(messagesCache) {
        if (this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE) {
            return this._getMessagesReadKeys(messagesCache);
        }
        else if (this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED) {
            return this._getMessagesReadAddresses(messagesCache);
        }
        return [];
    }
    _getItemsCountCanBeReadForCurrentIdlePeriod() {
        return __awaiter(this, void 0, void 0, function* () {
            const timeAvailToRun = yield this._requestTimeBrowserIdle();
            if (!timeAvailToRun) {
                return 0;
            }
            return this._getItemsCountToReadForIdlePeriod(timeAvailToRun);
        });
    }
    getMessagesIdentitiesToExcludeAtCacheUpdateBatch(messagesCachedStoreTemp) {
        const entriesExists = (messagesCachedStoreTemp.entries || []);
        return this._getMessagesReadKeysOrAddresses(entriesExists);
    }
    _performMessagesReadingToUpdateCache(messagesCachedStoreTemp) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let pageToQueryIndex = 0;
            let messagesReadCount = 0;
            let messagesCountToReadAtTheBatch = 0;
            let whetherMessagesLimitToReadReached = false;
            let whetherAllStoredMessagesRead = false;
            const allMessagesRead = new Map();
            while (!whetherMessagesLimitToReadReached && !whetherAllStoredMessagesRead) {
                this._checkIsReady();
                const resolveMessagesUpatingBatchPromise = this._createMessagesCacheUpdatingBatchPromise();
                const currentPageItemsToReadCount = yield this._getItemsCountCanBeReadForCurrentIdlePeriod();
                if (!currentPageItemsToReadCount) {
                    continue;
                }
                pageToQueryIndex = pageToQueryIndex + 1;
                messagesCountToReadAtTheBatch = messagesReadCount + currentPageItemsToReadCount;
                whetherMessagesLimitToReadReached = this._whetherMessagesLimitReached(messagesCountToReadAtTheBatch);
                if (whetherMessagesLimitToReadReached) {
                    messagesCountToReadAtTheBatch = messagesCountToReadAtTheBatch + 1;
                }
                const messagesIdentitiesToExclude = this.getMessagesIdentitiesToExcludeAtCacheUpdateBatch(messagesCachedStoreTemp);
                const queryOptions = this._getDatabaseMessagesToReadQueryOptionsWithMessagesToExclude(messagesCountToReadAtTheBatch, messagesIdentitiesToExclude);
                const messagesReadAtBatch = yield this._performMessagesCacheCollectPageRequest(queryOptions);
                const messagesReadAtBatchMapped = this._mapMessagesWithMetaToStorageRelatedStructure(messagesReadAtBatch);
                messagesCachedStoreTemp.update(messagesReadAtBatchMapped);
                messagesReadAtBatchMapped.forEach((value, key) => {
                    console.log('SwarmMessagesDatabaseCache::messagesReadAtBatchMapped', key, value);
                    allMessagesRead.set(key, value);
                });
                whetherAllStoredMessagesRead = yield this._whetherToStopMessagesReading(messagesCountToReadAtTheBatch, currentPageItemsToReadCount, allMessagesRead.size);
                if (allMessagesRead.size > Number((_a = messagesCachedStoreTemp === null || messagesCachedStoreTemp === void 0 ? void 0 : messagesCachedStoreTemp.entries) === null || _a === void 0 ? void 0 : _a.size)) {
                    throw new Error('Read count is not equal');
                }
                resolveMessagesUpatingBatchPromise();
                messagesReadCount = messagesCountToReadAtTheBatch;
            }
            if (whetherAllStoredMessagesRead) {
                this._setAllStoredMessagesReadFromDatabaseToCache();
            }
            else {
                this._unsetAllStoredMessagesReadFromDatabaseToCache();
            }
        });
    }
    _waitForCurrentMessagesUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._pendingMessagesCacheUpdatePromise) {
                return this._pendingMessagesCacheUpdatePromise;
            }
        });
    }
    _planNewCacheUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            this._setNewCacheUpdatePlanned();
            yield this._waitForCurrentMessagesUpdate();
            this._checkIsReady();
            if (!this._pendingMessagesCacheUpdatePromise) {
                this._unsetNewCacheUpdatePlanned();
                try {
                    return yield this._runNewCacheUpdate();
                }
                catch (err) {
                    console.error(`Failed to plan a new cache update: ${err.message}`, err);
                    yield delay(SWARM_MESSAGES_DATABASE_CACHE_PLANNED_CACHE_UPDATE_FAILED_RETRY_DELAY_MS);
                    return yield this._planNewCacheUpdate();
                }
            }
            return this._waitForCurrentMessagesUpdate();
        });
    }
    _runNextCacheUpdateIterationIfNecessary() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isSwarmMessagesCacheUpdateRequested) {
                this._unsetNewCacheUpdatePlanned();
                yield this._runNewCacheUpdate();
            }
        });
    }
    _linkTempStoreToMessagesCachedStore(messagesTempStore) {
        if (this._checkIsReady()) {
            this._messagesCachedStore.linkWithTempStore(messagesTempStore);
        }
    }
    _updateMessagesCachedStoreByLinkedTempStoreMessagesAndUnlinkTempStore() {
        if (this._checkIsReady()) {
            const hasMessagesUpdated = this._messagesCachedStore.updateByTempStore();
            this._messagesCachedStore.unlinkWithTempStore();
            return hasMessagesUpdated;
        }
        return false;
    }
    _setCurrentFullMessagesCacheUpdateInProgressAndEmitEvent(promiseMessagesCacheUpdating) {
        this._setMessagesCacheUpdateInProgress(promiseMessagesCacheUpdating);
        this._emitCacheUpdatingIsInProgress();
    }
    _unsetCurrentFullMessagesCacheUpdateInProgressAndEmitEvent(promiseMessagesCacheUpdating) {
        this._unsetCacheUpdateInProgress(promiseMessagesCacheUpdating);
        this._emitCacheUpdatingIsEnded();
    }
    _runNewCacheUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            let promiseMessagesCacheUpdating;
            try {
                const messagesCachedTempStore = this._createMessagesCachedStorage(true);
                this._linkTempStoreToMessagesCachedStore(messagesCachedTempStore);
                promiseMessagesCacheUpdating = this._performMessagesReadingToUpdateCache(messagesCachedTempStore);
                this._setCurrentFullMessagesCacheUpdateInProgressAndEmitEvent(promiseMessagesCacheUpdating);
                yield promiseMessagesCacheUpdating;
                const hasMessagesBeenUpdated = this._updateMessagesCachedStoreByLinkedTempStoreMessagesAndUnlinkTempStore();
                if (hasMessagesBeenUpdated) {
                    this._emitCacheUpdated();
                }
                const hasMessagesBeenDefferedUpdated = yield this._runDefferedPartialCacheUpdateAfterFullCacheUpdateAndResetDefferedUpdateQueue();
                if (hasMessagesBeenDefferedUpdated) {
                    this._emitCacheUpdated();
                }
            }
            catch (err) {
                console.error(`Failed to update messages cache: ${err.message}`, err);
                throw err;
            }
            finally {
                if (promiseMessagesCacheUpdating) {
                    this._unsetCurrentFullMessagesCacheUpdateInProgressAndEmitEvent(promiseMessagesCacheUpdating);
                }
                void this._runNextCacheUpdateIterationIfNecessary();
            }
        });
    }
    _updateMessagesCache() {
        return __awaiter(this, void 0, void 0, function* () {
            this._checkIsReady();
            if (this._pendingMessagesCacheUpdatePromise) {
                return yield this._planNewCacheUpdate();
            }
            this._unsetNewCacheUpdatePlanned();
            return yield this._runNewCacheUpdate();
        });
    }
    _addSwarmMessageWithMetaToCachedStore(swarmMessageWithMeta) {
        if (!this._checkIsReady()) {
            return false;
        }
        return this._messagesCachedStore.addToDeffered(getMessageDescriptionForMessageWithMeta(swarmMessageWithMeta, this._dbType));
    }
    _clearMessagesDefferedUpdateFullQueueIfNoFullCacheUpdateAcive() {
        if (this._isCacheUpdateActive) {
            this._resetMessagesDefferedFullQueue();
        }
    }
    _runDefferedMessagesPartialUpdateAndResetDefferedMessagesFullQueueIfNoActiveFullCahceUpdate() {
        this._runDefferedPartialCacheUpdateDebounced();
        this._clearMessagesDefferedUpdateFullQueueIfNoFullCacheUpdateAcive();
    }
    _addMessageToCachedStoreRunDefferedUpdate(swarmMessageWithMeta) {
        const whetherMessageHasAddedToTheCacheDefferedRead = this._addSwarmMessageWithMetaToCachedStore(swarmMessageWithMeta);
        if (whetherMessageHasAddedToTheCacheDefferedRead) {
            this._runDefferedMessagesPartialUpdateAndResetDefferedMessagesFullQueueIfNoActiveFullCahceUpdate();
        }
        return whetherMessageHasAddedToTheCacheDefferedRead;
    }
    _getMessagesDefferedUpdateWithinCacheUpdateBatch() {
        var _a;
        return (_a = this._messagesCachedStore) === null || _a === void 0 ? void 0 : _a.getDefferedReadAfterCurrentCacheUpdateBatch();
    }
    _getDefferedUpdateAfterCacheUpdateProcess() {
        var _a;
        return (_a = this._messagesCachedStore) === null || _a === void 0 ? void 0 : _a.getDefferedRead();
    }
    _resetMessagesDefferedFullQueue() {
        var _a;
        (_a = this._messagesCachedStore) === null || _a === void 0 ? void 0 : _a.resetDeffered();
    }
    _resetMessagesDefferedQueuePartial() {
        var _a;
        (_a = this._messagesCachedStore) === null || _a === void 0 ? void 0 : _a.resetDefferedAfterCurrentCacheUpdateBatch();
    }
    _getAndResetMessagesForPartialDefferedUpdateBatch() {
        const messagesMetaToUpdate = this._getMessagesDefferedUpdateWithinCacheUpdateBatch();
        this._resetMessagesDefferedQueuePartial();
        return messagesMetaToUpdate;
    }
    _getAndResetDefferedUpdateAfterCacheUpdateProcess() {
        const messagesMetaToUpdate = this._getDefferedUpdateAfterCacheUpdateProcess();
        this._resetMessagesDefferedFullQueue();
        this._resetMessagesDefferedQueuePartial();
        return messagesMetaToUpdate;
    }
    _runDefferedMessageReadBatch(messagesMetaToRead) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = this._getDatabaseMessagesToReadQueryOptionsWithMessagesToInclude(messagesMetaToRead);
            const messagesReadAtBatch = yield this._performMessagesCacheCollectPageRequest(options);
            return this._mapMessagesWithMetaToStorageRelatedStructure(messagesReadAtBatch);
        });
    }
    _getMessagesUniqIndexesToReadAtBatch(messagesMetaToRead, messagesCountReadAtPreviousBatches, messagesCountToReadAtBatch) {
        return commonUtilsArrayUniq(messagesMetaToRead.slice(messagesCountReadAtPreviousBatches, messagesCountToReadAtBatch));
    }
    _unsetMessagesNotExistsInTheStore(messagesUniqIndexesForReading, messagesReadByUniqIndexes, cacheStore, dbType) {
        let error;
        let hasMessagesRemoved = false;
        messagesUniqIndexesForReading.map((messageUniqIndex) => {
            try {
                if (!messagesReadByUniqIndexes.has(messageUniqIndex)) {
                    cacheStore.unset(getMessageMetaByUniqIndex(messageUniqIndex, dbType));
                    hasMessagesRemoved = true;
                }
            }
            catch (err) {
                error = err;
                console.error(err);
            }
        });
        if (error instanceof Error) {
            throw new Error('Failed to unset all messsages not exists');
        }
        return hasMessagesRemoved;
    }
    _runDefferedMessagesUpdateInCache(messagesForUpdateMeta, cacheStore, dbType) {
        return __awaiter(this, void 0, void 0, function* () {
            let messagesCountAlreadyRead = 0;
            let hasMessagesUpdated = false;
            const messagesMetaToRead = getMessagesUniqIndexesByMeta(messagesForUpdateMeta, dbType);
            while (messagesCountAlreadyRead < messagesMetaToRead.length) {
                const messagesCountToReadAtBatch = yield this._getItemsCountCanBeReadForCurrentIdlePeriod();
                if (!messagesCountToReadAtBatch) {
                    continue;
                }
                const messagesUniqIndexesToReadAtBatch = this._getMessagesUniqIndexesToReadAtBatch(messagesMetaToRead, messagesCountAlreadyRead, messagesCountToReadAtBatch);
                const messagesReadAtBatch = yield this._runDefferedMessageReadBatch(messagesUniqIndexesToReadAtBatch);
                const hasMessagesUpdatedAtBatch = cacheStore.update(messagesReadAtBatch);
                const hasMessagesRemovedFromStorage = this._unsetMessagesNotExistsInTheStore(messagesUniqIndexesToReadAtBatch, messagesReadAtBatch, cacheStore, dbType);
                hasMessagesUpdated = hasMessagesUpdated || hasMessagesUpdatedAtBatch || hasMessagesRemovedFromStorage;
                messagesCountAlreadyRead += messagesCountToReadAtBatch;
                console.log('swarmMessagesDatabaseCache::_runDefferedMessagesUpdateInCache::messagesCountAlreadyRead', messagesCountAlreadyRead);
            }
            return hasMessagesUpdated;
        });
    }
    _setActiveDefferedPartialCacheUpdate(activeUpdate) {
        this._defferedPartialCacheUpdatePromise = activeUpdate;
    }
    _unsetActiveDefferedPartialCacheUpdate() {
        this._defferedPartialCacheUpdatePromise = undefined;
    }
    _runDefferedPartialCacheUpdateForCachedMessagesStore(messagesMetaToUpdate, messagesCachedStore, dbType) {
        return __awaiter(this, void 0, void 0, function* () {
            const activeCachePartialUpdate = this._runDefferedMessagesUpdateInCache(messagesMetaToUpdate, messagesCachedStore, dbType);
            this._setActiveDefferedPartialCacheUpdate(activeCachePartialUpdate);
            const hasMessagesUpdated = yield activeCachePartialUpdate;
            this._unsetActiveDefferedPartialCacheUpdate();
            return hasMessagesUpdated;
        });
    }
    _runDefferedPartialCacheUpdateAfterFullCacheUpdateAndResetDefferedUpdateQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isDefferedMessagesUpdateActive) {
                yield this._defferedPartialCacheUpdatePromise;
            }
            const messagesUpdate = this._getAndResetDefferedUpdateAfterCacheUpdateProcess();
            if (messagesUpdate === null || messagesUpdate === void 0 ? void 0 : messagesUpdate.size) {
                return yield this._runDefferedPartialCacheUpdate(messagesUpdate);
            }
            return false;
        });
    }
}
//# sourceMappingURL=swarm-messages-database-cache.js.map