import { __awaiter } from "tslib";
import { isDefined, createPromisePending, resolvePromisePending } from "../../../../../../utils";
import { SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_LOG_PREFIX, EOrbidDBFeedSoreEvents, SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONFIGURATION, SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ENTITIES_LOAD_COUNT_DEFAULT, SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_OPTIONS_DEFAULT, } from './swarm-store-connector-orbit-db-subclass-database.const';
import { COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_ON, COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_OFF, } from "../../../../../../const/common-values/common-values";
import { SwarmStoreConnectorOrbitDBSubclassAccessController } from '../swarm-store-connector-orbit-db-subclass-access-controller/swarm-store-connector-orbit-db-subclass-access-controller';
import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption, } from './swarm-store-connector-orbit-db-subclass-database.types';
import { EOrbitDbStoreOperation, ESwarmStoreConnectorOrbitDbDatabaseType, } from './swarm-store-connector-orbit-db-subclass-database.const';
import { ESwarmStoreEventNames } from '../../../../swarm-store-class.const';
import { SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_PRELOAD_COUNT_MIN, SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_FILTER_OPTIONS, } from './swarm-store-connector-orbit-db-subclass-database.const';
import { validateOrbitDBDatabaseOptionsV1 } from '../../swarm-store-connector-orbit-db-validators/swarm-store-connector-orbit-db-validators-db-options';
import { SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_VALUES_GETTER, ESortFileds, } from './swarm-store-connector-orbit-db-subclass-database.const';
import { PropsByAliasesGetter } from '../../../../../basic-classes/props-by-aliases-getter/props-by-aliases-getter';
import { Sorter } from '../../../../../basic-classes/sorter-class/sorter-class';
import { getEventEmitterClass } from '../../../../../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_EMIT_BATCH_INT_MS, SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_EMIT_BATCH_SIZE, } from './swarm-store-connector-orbit-db-subclass-database.const';
export class SwarmStoreConnectorOrbitDBDatabase extends getEventEmitterClass() {
    constructor(options, orbitDb) {
        super();
        this.isReady = false;
        this.isClosed = false;
        this.dbName = '';
        this.isFullyLoaded = false;
        this.preloadCount = SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ENTITIES_LOAD_COUNT_DEFAULT;
        this.newEntriesPending = [];
        this.itemsOverallCountInStorage = 0;
        this.entriesReceived = {};
        this.dbType = ESwarmStoreConnectorOrbitDbDatabaseType.FEED;
        this.parseValueStored = (e) => {
            const { payload, identity, hash } = e;
            if (payload) {
                if (payload.op === EOrbitDbStoreOperation.DELETE) {
                    return undefined;
                }
                return {
                    id: identity.id,
                    value: payload.value,
                    hash,
                    key: this.isKVStore ? payload.key : undefined,
                };
            }
            else {
                return new Error('An unknown fromat of the data stored');
            }
        };
        this._get = (keyOrHash, database) => {
            const entryRaw = this.readRawEntry(keyOrHash, database);
            if (!entryRaw || entryRaw instanceof Error) {
                return entryRaw;
            }
            try {
                if (this.isKVStore) {
                    if (entryRaw.payload.key !== keyOrHash) {
                        return undefined;
                    }
                }
                else if (entryRaw.hash !== keyOrHash) {
                    return undefined;
                }
                return entryRaw;
            }
            catch (err) {
                return err;
            }
        };
        this.readRawValueFromStorage = (keyOrHash, database) => {
            const entryRawOrStoreValue = database.get(keyOrHash);
            return entryRawOrStoreValue;
        };
        this.readRawEntry = (keyOrHash, database) => {
            try {
                const entryRawOrStoreValue = this.readRawValueFromStorage(keyOrHash, database);
                const entryRaw = (entryRawOrStoreValue && this.isKVStore
                    ?
                        this.findAddedEntryForKeyInKeyValueDbOpLog(keyOrHash, entryRawOrStoreValue, database)
                    : entryRawOrStoreValue);
                if (entryRaw instanceof Error) {
                    return new Error('An error has occurred on get the data from the key');
                }
                return entryRaw;
            }
            catch (err) {
                return new Error(`Failed to read a raw entry from the databse: ${err.message}`);
            }
        };
        this.isOplogEntry = (value) => {
            var _a;
            return Boolean(value &&
                typeof value === 'object' &&
                !(value instanceof Error) &&
                value.payload &&
                value.clock &&
                ((_a = value.identity) === null || _a === void 0 ? void 0 : _a.id) &&
                value.sig);
        };
        this._filterOplogValuesByOplogOperationConditions = (logEntriesList, filterOptions) => {
            return logEntriesList.filter((logEntry) => {
                return Object.entries(filterOptions).every(([operationCondition, operationConditionValue]) => {
                    return this._filterEntryByIteratorOperationCondition(logEntry, operationCondition, operationConditionValue);
                });
            });
        };
        this.unsetAllListenersForEvents = () => {
            if (this.database) {
                this.unsetStoreEventListeners(this.database);
            }
        };
        this.emitNewEntry = (address, entry, heads) => {
            console.log('emit new entry', {
                address,
                entry,
                heads,
                itemsCurrentlyLoaded: this.itemsCurrentlyLoaded,
                itemsOverallCount: this.itemsOverallCount,
            });
            this.emit(ESwarmStoreEventNames.NEW_ENTRY, [this.dbName, entry, address, heads, this.dbType, this]);
        };
        this.handleNewEntry = (address, entry, heads) => {
            if (!this.checkWasEntryReceived(entry)) {
                this.addMessageToEmitPending(address, entry, heads);
                this.addMessageToReceivedMessages(entry);
            }
        };
        this.handleFeedStoreReady = () => {
            this.emitFullyLoaded();
            this.setReadyState();
            this.emitEvent(ESwarmStoreEventNames.READY);
            this.emitEmtriesPending();
        };
        this.handleFeedStoreReadySilent = () => {
            this.setReadyState();
            this.emitEmtriesPending();
        };
        this.handleFeedStoreLoaded = () => {
        };
        this.handleFeedStoreLoadProgressSilent = (address, hash, entry, progress, total) => {
            this.setItemsOverallCount(total);
            this.handleNewEntry(address, entry, {});
        };
        this.handleFeedStoreLoadProgress = (address, hash, entry, progress, total) => {
            this.handleFeedStoreLoadProgressSilent(address, hash, entry, progress, total);
            this.emitEvent(ESwarmStoreEventNames.LOADING, (progress / (this.preloadCount <= 0 ? total : this.preloadCount)) * 100);
        };
        this.handleFeedStoreReplicated = () => {
            const { dbName } = this;
            console.log('REPLICATED', { dbName });
            this.emitEvent(ESwarmStoreEventNames.UPDATE, dbName);
            this.emitEmtriesPending();
        };
        this.handleFeedStoreClosed = () => __awaiter(this, void 0, void 0, function* () {
            const { isClosed } = this;
            if (!isClosed) {
                this.unsetReadyState();
                this.emitError('The instance was closed unexpected', 'handleFeedStoreClosed');
                yield this.restartStore();
            }
        });
        this.handleFeedStoreReplicateInProgress = (address, hash, entry, progress, have) => {
            console.warn(`handleFeedStoreReplicateInProgress::
      addr: ${address}
      hash: ${hash}
      progress: ${progress}
    `);
            this.handleNewEntry(address, entry, {});
        };
        this.handleWrite = (address, entry, heads) => {
            if (!this.checkWasEntryReceived(entry)) {
                this.incItemsOverallCountByOne();
            }
            this.handleNewEntry(address, entry, heads);
        };
        this.setFeedStoreEventListenersSilent = (db) => {
            this.setFeedStoreEventListeners(db, undefined, true);
        };
        this.createDbInstanceSilent = () => {
            return this.createDbInstance(true);
        };
        this.emitEntries = (batchSize = SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_EMIT_BATCH_SIZE) => {
            if (this.newEntriesPending.length) {
                console.log('newEntriesPending count', this.newEntriesPending.length, {
                    itemsCurrentlyLoaded: this.itemsCurrentlyLoaded,
                    itemsOverallCount: this.itemsOverallCount,
                });
                this.newEntriesPending.splice(0, batchSize).forEach((newEntry) => newEntry && this.emitNewEntry(...newEntry));
            }
        };
        this.emitBatch = () => {
            this.emitEntries();
        };
        this._validateOptions(options);
        this.setOptions(options);
        this.setOrbitDbInstance(orbitDb);
        this.__createSorter();
    }
    get _iteratorSorter() {
        const sorter = this.__iteratorSorter;
        if (!sorter) {
            throw new Error('A sorter is not defined');
        }
        return sorter;
    }
    get itemsCurrentlyLoaded() {
        return Object.keys(this.entriesReceived).length;
    }
    get itemsOverallCount() {
        return Math.max(this.itemsOverallCountInStorage, this.itemsCurrentlyLoaded);
    }
    get _isAllItemsLoadedFromPersistentStorageToCache() {
        return this.itemsOverallCount === this.itemsCurrentlyLoaded;
    }
    get isKVStore() {
        return this.dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;
    }
    _validateOptions(options) {
        if (!options) {
            throw new Error('Options must be specified');
        }
        validateOrbitDBDatabaseOptionsV1(options);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbStore = yield this.createDb();
            if (dbStore instanceof Error) {
                console.error(dbStore);
                return new Error('Failed to create a new database instance');
            }
            const loadDbResult = yield dbStore.load(this.preloadCount);
            if (loadDbResult instanceof Error) {
                console.error(loadDbResult);
                return yield this.onFatalError('The fatal error has occurred on databse loading', 'connect');
            }
        });
    }
    close(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._close(opt);
        });
    }
    add(addArg) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._add(addArg);
        });
    }
    get(keyOrHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const databaseInstanceForQuerying = yield this._getDatabaseInstanceForQuering();
            return this._get(keyOrHash, databaseInstanceForQuerying);
        });
    }
    remove(keyOrEntryAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._remove(keyOrEntryAddress);
        });
    }
    iterator(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const messagesToReadCountLimitFromOptions = typeof (options === null || options === void 0 ? void 0 : options.limit) !== 'number' || (options === null || options === void 0 ? void 0 : options.limit) < -1 ? undefined : options === null || options === void 0 ? void 0 : options.limit;
            const iteratorOptionsRes = Object.assign(Object.assign({}, (options || SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_OPTIONS_DEFAULT)), { limit: messagesToReadCountLimitFromOptions });
            if (messagesToReadCountLimitFromOptions && !(options === null || options === void 0 ? void 0 : options.fromCache)) {
                yield this.preloadEntitiesBeforeIterate(messagesToReadCountLimitFromOptions);
            }
            const databaseInstanceForQuerying = (options === null || options === void 0 ? void 0 : options.fromCache) ? this.database : yield this._getDatabaseInstanceForQuering();
            if (!databaseInstanceForQuerying) {
                return new Error('Failed to get a database to read values from');
            }
            return this.iteratorDbOplog(iteratorOptionsRes, databaseInstanceForQuerying);
        });
    }
    drop() {
        return __awaiter(this, void 0, void 0, function* () {
            const database = this.getDbStoreInstance();
            if (database instanceof Error) {
                return database;
            }
            this.unsetAllListenersForEvents();
            try {
                yield database.drop();
            }
            catch (err) {
                return err;
            }
        });
    }
    load(count) {
        return __awaiter(this, void 0, void 0, function* () {
            const loadResult = yield this._load(this.itemsCurrentlyLoaded + count);
            return loadResult;
        });
    }
    createDb() {
        this.unsetReadyState();
        return this.createDbInstance();
    }
    _close(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            this.unsetAllListenersForEvents();
            this.unsetReadyState();
            this.resetEntriesPending();
            this.resetEntriesReceived();
            this.unsetEmithBatchInterval();
            this.resetItemsOverall();
            this.__unsetSorter();
            this.isClosed = true;
            let result;
            try {
                const closeCurrentStoreResult = yield this.closeCurrentStore();
                if (closeCurrentStoreResult instanceof Error) {
                    result = closeCurrentStoreResult;
                }
            }
            catch (err) {
                result = err;
            }
            this.emitEvent(ESwarmStoreEventNames.CLOSE, this);
            return result;
        });
    }
    _add(addArg) {
        return __awaiter(this, void 0, void 0, function* () {
            const { value, key } = addArg;
            const database = this.getDbStoreInstance();
            if (process.env.NODE_ENV === 'development')
                debugger;
            if (database instanceof Error) {
                return database;
            }
            try {
                let hash;
                if (this.isKVStore) {
                    if (!key) {
                        return new Error('Key must be provided for the key-value storage');
                    }
                    hash = (yield database.set(key, value));
                }
                else {
                    hash = yield database.add(value);
                }
                console.log(`ADDED DATA WITH HASH -- ${hash}`);
                if (typeof hash !== 'string') {
                    return new Error('An unknown type of hash was returned for the value stored');
                }
                return hash;
            }
            catch (err) {
                console.trace(err);
                return err;
            }
        });
    }
    _remove(keyOrEntryAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (this.isKVStore ? this.removeKeyKVStore(keyOrEntryAddress) : this.removeEntry(keyOrEntryAddress));
            }
            catch (err) {
                return err;
            }
        });
    }
    restartDbInstanceSilent() {
        return __awaiter(this, void 0, void 0, function* () {
            const { database } = this;
            const cacheStore = database && this.getDatabaseCache(database);
            let methodResult = new Error('Failed to restart db instance');
            cacheStore && this.setPreventCloseDatabaseCache(cacheStore);
            try {
                this.unsetAllListenersForEvents();
                const result = yield this.closeCurrentStore();
                if (result instanceof Error) {
                    console.error('Failed to close the instance of store');
                    methodResult = result;
                    return result;
                }
                methodResult = yield this.createDbInstanceSilent();
                if (methodResult instanceof Error) {
                    return methodResult;
                }
                cacheStore && this.unsetPreventCloseDatabaseCache(cacheStore);
                return methodResult;
            }
            catch (err) {
                methodResult = err;
                return err;
            }
            finally {
                if (cacheStore && methodResult instanceof Error) {
                    yield this.closeDatabaseCache(cacheStore);
                }
            }
        });
    }
    setItemsOverallCount(total) {
        const newTotal = Math.max(this.itemsOverallCountInStorage, total);
        if (this.itemsOverallCountInStorage !== newTotal) {
            this.itemsOverallCountInStorage = newTotal;
            console.log('total number of entries', total);
        }
    }
    incItemsOverallCountByOne() {
        this.setItemsOverallCount(this.itemsOverallCountInStorage + 1);
    }
    resetItemsOverall() {
        this.itemsOverallCountInStorage = 0;
    }
    _load(count) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemsLoaded = this.itemsCurrentlyLoaded;
            if (count) {
                const result = yield this._restartCurrentDbSilentAndPreloadInQueue(count);
                if (!result) {
                    throw new Error('Failed to restart and preload the database');
                }
            }
            return {
                count: this.itemsCurrentlyLoaded - itemsLoaded,
                loadedCount: this.itemsCurrentlyLoaded,
                overallCount: this.itemsOverallCount,
            };
        });
    }
    getLogEntryHash(logEntry) {
        return logEntry.hash;
    }
    getLogEntryKey(logEntry) {
        var _a;
        return (_a = logEntry.payload) === null || _a === void 0 ? void 0 : _a.key;
    }
    _getLodEntryAddedTime(logEntry) {
        return logEntry.clock.time;
    }
    _getAllOplogEntriesOrErrors(database) {
        try {
            return database._oplog.values;
        }
        catch (err) {
            return err;
        }
    }
    findAddedEntryForKeyInKeyValueDbOpLog(key, entry, database) {
        const oplogAllValues = this._getAllOplogEntriesOrErrors(database);
        if (oplogAllValues instanceof Error) {
            return oplogAllValues;
        }
        return oplogAllValues.find((rawEntry) => {
            const pld = rawEntry === null || rawEntry === void 0 ? void 0 : rawEntry.payload;
            return (pld === null || pld === void 0 ? void 0 : pld.op) === EOrbitDbStoreOperation.PUT && pld.key === key && (pld === null || pld === void 0 ? void 0 : pld.value) === entry;
        });
    }
    getAllAddedValuesFromOpLogOrError(database) {
        const oplogAllValues = this._getAllOplogEntriesOrErrors(database);
        if (oplogAllValues instanceof Error) {
            return oplogAllValues;
        }
        return oplogAllValues
            .filter((entry) => {
            const pld = entry === null || entry === void 0 ? void 0 : entry.payload;
            return (pld === null || pld === void 0 ? void 0 : pld.op) === EOrbitDbStoreOperation.PUT;
        })
            .filter(isDefined);
    }
    _filterEntryByIteratorOperationCondition(logEntry, operationCondition, operationConditionValue) {
        const logEntryHashOrKey = this.isKVStore ? this.getLogEntryKey(logEntry) : this.getLogEntryHash(logEntry);
        const logEntryAddedTime = this._getLodEntryAddedTime(logEntry);
        switch (operationCondition) {
            case ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq:
                if (logEntryHashOrKey && operationConditionValue instanceof Array) {
                    return operationConditionValue.includes(logEntryHashOrKey);
                }
                return logEntryHashOrKey === operationConditionValue;
            case ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.neq:
                if (logEntryHashOrKey && operationConditionValue instanceof Array) {
                    return !operationConditionValue.includes(logEntryHashOrKey);
                }
                return logEntryHashOrKey !== operationConditionValue;
            case ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gt:
                return !!logEntryHashOrKey && logEntryHashOrKey > operationConditionValue;
            case ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gte:
                return !!logEntryHashOrKey && logEntryHashOrKey >= operationConditionValue;
            case ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.lt:
                return !!logEntryHashOrKey && logEntryHashOrKey < operationConditionValue;
            case ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.lte:
                return !!logEntryHashOrKey && logEntryHashOrKey <= operationConditionValue;
            case ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gtT:
                return logEntryAddedTime > operationConditionValue;
            case ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.ltT:
                return logEntryAddedTime < operationConditionValue;
            default:
                return true;
        }
    }
    _sortOplogValuesByAddedTime(logEntriesList, direction) {
        return this._sortIteratedItems(logEntriesList, {
            [ESortFileds.TIME]: direction,
        });
    }
    getValuesForEqualIteratorOption(eqOperand, database) {
        const pending = typeof eqOperand === 'string' ? [this._get(eqOperand, database)] : eqOperand.map((h) => this._get(h, database));
        return pending;
    }
    preloadEntitiesBeforeIterate(count) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isAllItemsLoadedFromPersistentStorageToCache) {
                return;
            }
            if (count === -1 || Number(count) > this.itemsCurrentlyLoaded) {
                yield this._load(count);
            }
        });
    }
    _getOnlyFilterIteratorOperatorsList(iteratorOptions) {
        return Object.keys(iteratorOptions).filter((option) => {
            return SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_FILTER_OPTIONS.includes(option);
        });
    }
    _isExistsFilterByEntryTimeAdded(iteratorOptions) {
        return Boolean(iteratorOptions.gtT) || Boolean(iteratorOptions.ltT);
    }
    _sortIteratedItems(iteratedItems, sortingOptions) {
        const errorsAndNonDefinedEntries = [];
        const logEntries = [];
        for (let index = 0; index < iteratedItems.length; index += 1) {
            const element = iteratedItems[index];
            if (element == null || element instanceof Error) {
                errorsAndNonDefinedEntries.push(element ? element : undefined);
            }
            else {
                logEntries.push(element);
            }
        }
        const orderedItems = this._iteratorSorter.sort(logEntries, sortingOptions);
        return (errorsAndNonDefinedEntries.length ? [...orderedItems, ...errorsAndNonDefinedEntries] : orderedItems);
    }
    iteratorDbOplog(iteratorOptions, database) {
        const isExistsFilterByEntryAddedTime = this._isExistsFilterByEntryTimeAdded(iteratorOptions);
        const filterOperatorsList = this._getOnlyFilterIteratorOperatorsList(iteratorOptions);
        let iteratedValues = [];
        if (iteratorOptions.eq && !isExistsFilterByEntryAddedTime && filterOperatorsList.length === 1) {
            const valuesForEqualOperator = this.getValuesForEqualIteratorOption(iteratorOptions.eq, database);
            if (valuesForEqualOperator instanceof Error) {
                return valuesForEqualOperator;
            }
            iteratedValues = valuesForEqualOperator;
        }
        else {
            let oplogEntriesOrUndefinedOrErrorsToIterate = [];
            if (isExistsFilterByEntryAddedTime) {
                const oplogAddedEntriesWithErrors = this.getAllAddedValuesFromOpLogOrError(database);
                if (oplogAddedEntriesWithErrors instanceof Error) {
                    return oplogAddedEntriesWithErrors;
                }
                oplogEntriesOrUndefinedOrErrorsToIterate = oplogAddedEntriesWithErrors;
            }
            else if (this.isKVStore) {
                oplogEntriesOrUndefinedOrErrorsToIterate = this.getValuesForEqualIteratorOption(Object.keys(database.all), database);
            }
            else {
                oplogEntriesOrUndefinedOrErrorsToIterate = database.iterator(iteratorOptions).collect();
            }
            iteratedValues = filterOperatorsList.length
                ?
                    this._filterOplogValuesByOplogOperationConditions(oplogEntriesOrUndefinedOrErrorsToIterate.filter(this.isOplogEntry), iteratorOptions)
                :
                    oplogEntriesOrUndefinedOrErrorsToIterate;
        }
        if (iteratorOptions.reverse) {
            iteratedValues = iteratedValues.reverse();
        }
        if (iteratorOptions.sortBy) {
            iteratedValues = this._sortIteratedItems(iteratedValues, iteratorOptions.sortBy);
            console.log('iteratedValues', iteratedValues);
            console.log('iteratorOptions.sortBy', iteratorOptions.sortBy);
        }
        if (Number(iteratorOptions.limit) > 0) {
            iteratedValues = iteratedValues.slice(0, iteratorOptions.limit);
        }
        return iteratedValues;
    }
    getDbStoreInstance() {
        const { isReady, database } = this;
        if (!isReady) {
            return new Error('The store is not ready to use');
        }
        if (!database) {
            return this.emitError('The database store instance is not exists');
        }
        return database;
    }
    setReadyState(isReady = true) {
        this.isReady = isReady;
    }
    unsetReadyState() {
        this.setReadyState(false);
    }
    emitError(error, mehodName, isFatal = false) {
        const err = typeof error === 'string' ? new Error() : error;
        const eventName = isFatal ? ESwarmStoreEventNames.FATAL : ESwarmStoreEventNames.ERROR;
        console.error(`${SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_LOG_PREFIX}::error${mehodName ? `::${mehodName}` : ''}`);
        console.error(error);
        this.emit(eventName, err);
        return err;
    }
    onFatalError(error, methodName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.unsetReadyState();
            this.emitError(error, methodName, true);
            const { isClosed } = this;
            if (!isClosed) {
                yield this._close();
            }
            return this.emitError('The database closed cause a fatal error', methodName, true);
        });
    }
    emitEvent(event, ...args) {
        const { options } = this;
        if (!options) {
            throw new Error('Options are not exists');
        }
        const { dbName } = options;
        this.emit(event, dbName, ...args);
    }
    getStoreOptions() {
        return SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONFIGURATION;
    }
    emitFullyLoaded() {
        if (!this.isFullyLoaded) {
            this.isFullyLoaded = true;
            this.emitEvent(ESwarmStoreEventNames.LOADING, 100);
        }
    }
    removeKeyKVStore(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const database = this.getDbStoreInstance();
            if (database instanceof Error) {
                throw database;
            }
            try {
                const hashRemoved = yield database.del(key);
                if (typeof hashRemoved !== 'string') {
                    throw new Error('An unknown type of hash was returned for the value removed');
                }
            }
            catch (err) {
                console.error(err);
                throw new Error(`Failed to remove an object by the key ${key}: ${err.message}`);
            }
        });
    }
    removeEntry(entryAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const database = this.getDbStoreInstance();
            if (database instanceof Error) {
                throw database;
            }
            try {
                yield database.remove(entryAddress);
            }
            catch (err) {
                console.error(err);
                return new Error(`Failed to remove an entry by the address ${entryAddress}: ${err.message}`);
            }
        });
    }
    emitEmtriesPending() {
        this.startEmitBatchesInterval();
    }
    checkWasEntryReceived(entry) {
        return this.entriesReceived[entry.hash] === entry.sig;
    }
    addMessageToReceivedMessages(entry) {
        if (!this.checkWasEntryReceived(entry)) {
            this.entriesReceived[entry.hash] = entry.sig;
        }
    }
    resetEntriesReceived() {
        this.entriesReceived = {};
    }
    resetEntriesPending() {
        this.newEntriesPending = [];
    }
    addMessageToEmitPending(address, entry, heads) {
        this.newEntriesPending.push([address, entry, heads]);
    }
    closeInstanceOfStore(storeInstance) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!storeInstance) {
                return new Error('An instance of the store must be specified');
            }
            this.unsetStoreEventListeners(storeInstance);
            try {
                yield storeInstance.close();
            }
            catch (err) {
                console.error(err);
                return new Error('Fatal error has occurred on close the instance of the Feed store');
            }
        });
    }
    closeCurrentStore() {
        return __awaiter(this, void 0, void 0, function* () {
            const { database } = this;
            if (database) {
                const closeStoreResult = yield this.closeInstanceOfStore(database);
                if (closeStoreResult instanceof Error) {
                    console.error(closeStoreResult);
                    return new Error('Failed to close the current instance of the Database store');
                }
                if (database === this.database) {
                    this.database = undefined;
                }
            }
        });
    }
    setPreventCloseDatabaseCache(cache) {
        cache.setPreventClose(true);
    }
    unsetPreventCloseDatabaseCache(cache) {
        cache.setPreventClose(false);
    }
    closeDatabaseCache(cache) {
        return __awaiter(this, void 0, void 0, function* () {
            yield cache.close();
        });
    }
    getDatabaseCache(database) {
        var _a;
        return (_a = this.database) === null || _a === void 0 ? void 0 : _a._cache._store;
    }
    restartStore() {
        return __awaiter(this, void 0, void 0, function* () {
            const { isClosed, database } = this;
            const cacheStore = database && this.getDatabaseCache(database);
            let result;
            if (isClosed) {
                return new Error('The store was closed previousely');
            }
            cacheStore && this.setPreventCloseDatabaseCache(cacheStore);
            try {
                const currentStoreStopResult = yield this.closeCurrentStore();
                if (currentStoreStopResult instanceof Error) {
                    console.error(currentStoreStopResult);
                    result = yield this.onFatalError('Failed to restart the Database cause failed to close the store instance', 'restartStore');
                    return result;
                }
                const connectResult = yield this.connect();
                if (connectResult instanceof Error) {
                    result = connectResult;
                }
                cacheStore && this.unsetPreventCloseDatabaseCache(cacheStore);
            }
            catch (err) {
                console.error(err);
                result = err;
            }
            finally {
                if (result instanceof Error) {
                    cacheStore && this.closeDatabaseCache(cacheStore);
                }
            }
        });
    }
    setFeedStoreEventListeners(db, isSet = true, isSilent = false) {
        if (!db) {
            return new Error('An instance of the FeedStore must be specified');
        }
        if (!db.events) {
            return new Error('An unknown API of the FeedStore');
        }
        if (typeof db.events.addListener !== 'function' || typeof db.events.removeListener !== 'function') {
            return new Error('An unknown API of the FeedStore events');
        }
        const methodName = isSet ? COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_ON : COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_OFF;
        db.events[methodName](EOrbidDBFeedSoreEvents.READY, isSilent ? this.handleFeedStoreReadySilent : this.handleFeedStoreReady);
        db.events[methodName](EOrbidDBFeedSoreEvents.LOAD_PROGRESS, isSilent ? this.handleFeedStoreLoadProgressSilent : this.handleFeedStoreLoadProgress);
        db.events[methodName](EOrbidDBFeedSoreEvents.LOAD, this.handleFeedStoreLoaded);
        db.events[methodName](EOrbidDBFeedSoreEvents.REPLICATED, this.handleFeedStoreReplicated);
        db.events[methodName](EOrbidDBFeedSoreEvents.CLOSE, this.handleFeedStoreClosed);
        db.events[methodName](EOrbidDBFeedSoreEvents.REPLICATE_PROGRESS, this.handleFeedStoreReplicateInProgress);
        db.events[methodName](EOrbidDBFeedSoreEvents.WRITE, this.handleWrite);
    }
    unsetStoreEventListeners(feedStore) {
        this.setFeedStoreEventListeners(feedStore, false);
    }
    getAccessControllerOptions() {
        const { options: dbOptions } = this;
        const resultedOptions = {
            type: SwarmStoreConnectorOrbitDBSubclassAccessController.type,
        };
        if (!dbOptions) {
            return resultedOptions;
        }
        const { isPublic, write } = dbOptions;
        if (isPublic) {
            resultedOptions.write = ['*'];
        }
        else if (write instanceof Array) {
            resultedOptions.write = write.filter((identity) => identity && typeof identity === 'string');
        }
        if (typeof dbOptions.grantAccess === 'function') {
            resultedOptions.grantAccess = dbOptions.grantAccess;
        }
        return resultedOptions;
    }
    createPendingPromiseCreatingNewDBInstance() {
        this.creatingNewDBInstancePromise = createPromisePending();
    }
    resolvePendingPromiseCreatingNewDBInstance(result) {
        const { creatingNewDBInstancePromise } = this;
        if (creatingNewDBInstancePromise) {
            resolvePromisePending(creatingNewDBInstancePromise, result);
            this.creatingNewDBInstancePromise = undefined;
        }
    }
    _waitTillCurrentDatabaseIsBeingRestarted() {
        return __awaiter(this, void 0, void 0, function* () {
            while (this._currentDatabaseRestartSilent) {
                try {
                    return yield this._currentDatabaseRestartSilent;
                }
                catch (_a) { }
            }
        });
    }
    _getDatabaseInstanceForQuering() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isClosed) {
                throw new Error('This instance has been closed');
            }
            if (this._currentDatabaseRestartSilent) {
                yield this._waitTillCurrentDatabaseIsBeingRestarted();
            }
            if (this.isClosed) {
                throw new Error('This instance has been closed');
            }
            const database = this.database;
            if (!database) {
                throw new Error('There is no acitve database instance');
            }
            return database;
        });
    }
    createDbInstance(isSilent = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const { creatingNewDBInstancePromise } = this;
            if (creatingNewDBInstancePromise) {
                return yield creatingNewDBInstancePromise;
            }
            let methodResult = new Error('createDbInstance failed for unknown reason');
            try {
                this.createPendingPromiseCreatingNewDBInstance();
                const { orbitDb, options } = this;
                if (!orbitDb) {
                    methodResult = yield this.onFatalError('There is no intance of the OrbitDb is specified', 'createDbInstance');
                    return methodResult;
                }
                if (!options) {
                    methodResult = yield this.onFatalError('Options are not defined', 'createDbInstance');
                    throw methodResult;
                }
                const { dbName, cache } = options;
                if (!dbName) {
                    methodResult = yield this.onFatalError('A name of the database must be specified', 'createDbInstance');
                    return methodResult;
                }
                const dbStoreOptions = this.getStoreOptions();
                if (dbStoreOptions instanceof Error) {
                    methodResult = yield this.onFatalError(dbStoreOptions, 'createDbInstance::getStoreOptions');
                    return methodResult;
                }
                const storeOptions = Object.assign(Object.assign({}, SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONFIGURATION), { cache, accessController: this.getAccessControllerOptions() });
                const db = this.isKVStore
                    ? yield orbitDb.keyvalue(dbName, storeOptions)
                    : yield orbitDb.feed(dbName, storeOptions);
                if (db instanceof Error) {
                    methodResult = yield this.onFatalError(db, 'createDbInstance::feed store creation');
                    return methodResult;
                }
                const setStoreListenersResult = isSilent ? this.setFeedStoreEventListenersSilent(db) : this.setFeedStoreEventListeners(db);
                if (setStoreListenersResult instanceof Error) {
                    methodResult = yield this.onFatalError(setStoreListenersResult, 'createDbInstance::set feed store listeners');
                    return methodResult;
                }
                this.database = db;
                methodResult = db;
                return db;
            }
            catch (err) {
                methodResult = yield this.onFatalError(err, 'createDbInstance');
                return methodResult;
            }
            finally {
                this.resolvePendingPromiseCreatingNewDBInstance(methodResult);
            }
        });
    }
    setOptions(options) {
        const { dbName, preloadCount, dbType } = options;
        if (typeof dbName !== 'string') {
            throw new Error('A name of the database must be specified');
        }
        if (preloadCount && typeof preloadCount !== 'number') {
            throw new Error('Preload count must be number');
        }
        if (dbType) {
            if (!Object.values(ESwarmStoreConnectorOrbitDbDatabaseType).includes(dbType)) {
                throw new Error('An unknown db store type');
            }
            this.dbType = dbType;
        }
        this.preloadCount = (preloadCount ? preloadCount : undefined) || SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_PRELOAD_COUNT_MIN;
        this.options = options;
        this.dbName = dbName;
    }
    setOrbitDbInstance(orbitDb) {
        if (!orbitDb) {
            throw new Error('An instance of orbit db must be specified');
        }
        this.orbitDb = orbitDb;
    }
    startEmitBatchesInterval() {
        this.emitBatchesInterval = setInterval(this.emitBatch, SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_EMIT_BATCH_INT_MS);
    }
    unsetEmithBatchInterval() {
        if (this.emitBatchesInterval) {
            clearInterval(this.emitBatchesInterval);
        }
    }
    _setRestartDatabaseSilent(dbRestartSilentPromise) {
        this._currentDatabaseRestartSilent = dbRestartSilentPromise;
    }
    _unsetCurrentRestartDatabaseSilent() {
        this._currentDatabaseRestartSilent = undefined;
    }
    _restartCurrentDbSilentAndPreloadInQueue(count) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._waitTillCurrentDatabaseIsBeingRestarted();
            let restartDbSilent = undefined;
            try {
                restartDbSilent = this.restartDbInstanceSilent()
                    .catch((err) => err)
                    .then((dbInstance) => __awaiter(this, void 0, void 0, function* () {
                    if (dbInstance instanceof Error) {
                        console.error('Failed to restart the database');
                        return dbInstance;
                    }
                    if (!dbInstance) {
                        return;
                    }
                    if (count) {
                        yield dbInstance.load(count);
                    }
                    return dbInstance;
                }));
                this._setRestartDatabaseSilent(restartDbSilent);
                return yield restartDbSilent;
            }
            finally {
                if (this._currentDatabaseRestartSilent === restartDbSilent) {
                    this._unsetCurrentRestartDatabaseSilent();
                }
            }
        });
    }
    __createLogEntryFieldsValuesGetter() {
        return new PropsByAliasesGetter(SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_VALUES_GETTER);
    }
    __setSorter(sorter) {
        this.__iteratorSorter = sorter;
    }
    __unsetSorter() {
        this.__iteratorSorter = undefined;
    }
    __createSorter() {
        const logEntryPropsGetter = this.__createLogEntryFieldsValuesGetter();
        const logEntriesLisetSorter = new Sorter(logEntryPropsGetter);
        this.__setSorter(logEntriesLisetSorter);
    }
}
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-database.js.map