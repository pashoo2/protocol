import { __awaiter } from "tslib";
import { commonUtilsArrayUniq, createPromisePendingRejectable } from "../../../../utils";
import assert from 'assert';
import { SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_ATTEMPTS_TO_SAVE_ON_FAIL } from './swarm-store-connector-databases-persistent-list.const';
import { SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_DEFAULT_DATABASE_LIST, SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_STORAGE_KEY_PREFIX_DATABASE_NAME_DELIMITER, SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_STORAGE_KEY_DATABASES_NAMES, SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_STORAGE_KEY_PREFIX_DATABASES_NAMES_DELIMITER, } from './swarm-store-connector-databases-persistent-list.const';
import { ConcurrentAsyncQueueWithAutoExecution, } from '../../../basic-classes/async-queue-class-base';
export class SwarmStoreConnectorPersistentList {
    constructor(params) {
        this._maxFailsOfersistentStorageOperation = SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_ATTEMPTS_TO_SAVE_ON_FAIL;
        this._validateParams(params);
        this._setParams(params);
        this._initializeAsyncQueue();
    }
    get databasesKnownOptionsList() {
        return this._databasesList;
    }
    get _databasesUniqNamesList() {
        const databasesList = this._databasesList;
        if (!databasesList) {
            return undefined;
        }
        return Object.keys(databasesList);
    }
    loadDatabasesListFromPersistentStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            this._checkInstanceIsNotClosed();
            const dbsList = yield this._loadDatabasesListFromStorageIfExists();
            if (!dbsList) {
                this._setDefaultDatabasesList();
            }
            else {
                this._setDatabasesList(dbsList);
            }
            return this._getDatabasesListClone();
        });
    }
    getDatabaseOptions(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            this._checkInstanceIsNotClosed();
            yield this._loadDatabasesListIfNotLoaded();
            return this._getDatabasesListClone()[dbName];
        });
    }
    addDatabase(dbName, dbOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            this._checkInstanceIsNotClosed();
            yield this._loadDatabasesListIfNotLoaded();
            yield this._waitQueueAndRunOperationInTransaction(this._createAddDatabaseToTheListInStorageOperation(dbName, dbOptions));
        });
    }
    addDatabaseSerializedOptions(dbName, dbOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            this._checkInstanceIsNotClosed();
            yield this._loadDatabasesListIfNotLoaded();
        });
    }
    removeDatabase(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            this._checkInstanceIsNotClosed();
            yield this._loadDatabasesListIfNotLoaded();
            yield this._waitQueueAndRunOperationInTransaction(this._createRemoveDatabaseFromTheListAndStorageOperation(dbName));
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            this._checkInstanceIsNotClosed();
            this._setInstanceClosed();
            yield this._waitAllPendingAsyncEndedAndExecute(() => __awaiter(this, void 0, void 0, function* () {
                yield this._destroyAsyncOperationsQueue();
                this._resetTheInstance();
            }));
        });
    }
    _validateParams(params) {
        assert(params, 'Parameters should be defined');
        assert(params.keyPrefixForDatabasesLisInPersistentStorage, 'Key prefix in storage which should be used for storing the serialized list of databases ("databasesLisPersistantKey") should be defined in the params');
        assert(params.persistentStorage, 'Persistent storage for storing the list of a databases should be defined');
        assert(params.serializer, 'A serializer should be passed in params');
        return true;
    }
    _setParams(params) {
        this._databaseListPersistentStorage = params.persistentStorage;
        this._keyPrefixInStorageForSerializedDbList = params.keyPrefixForDatabasesLisInPersistentStorage;
        this._serializer = params.serializer;
    }
    _initializeAsyncQueue() {
        this._asyncOperationsQueue = new ConcurrentAsyncQueueWithAutoExecution(createPromisePendingRejectable);
    }
    _setInstanceClosed() {
        this._wasClosed = true;
    }
    _unsetParams() {
        this._databaseListPersistentStorage = undefined;
        this._keyPrefixInStorageForSerializedDbList = undefined;
        this._serializer = undefined;
    }
    _unsetAsyncQueue() {
        this._asyncOperationsQueue = undefined;
    }
    _resetTheInstance() {
        this._unsetAsyncQueue();
        this._unsetParams();
    }
    _checkInstanceIsNotClosed() {
        if (this._wasClosed) {
            throw new Error('The instance was closed and can not perform any operations');
        }
    }
    _getAsyncOperationsQueue() {
        if (!this._asyncOperationsQueue) {
            throw new Error('Failed to initialize the async queue instance');
        }
        return this._asyncOperationsQueue;
    }
    _destroyAsyncOperationsQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._getAsyncOperationsQueue().destroy(new Error('The database persistent list was closed'));
        });
    }
    _getDatabasesListClone() {
        const databasesList = this._databasesList;
        if (!databasesList) {
            throw new Error('Databases list is not defined');
        }
        return Object.assign({}, databasesList);
    }
    _getDatabaseListPersistentStorage() {
        const databaseListPersistentStorage = this._databaseListPersistentStorage;
        if (!databaseListPersistentStorage) {
            throw new Error('There is no persistant storage instance');
        }
        return databaseListPersistentStorage;
    }
    _getKeyPrefixForSerializedDbListInStorage() {
        const keyInStorageForSerializedDbList = this._keyPrefixInStorageForSerializedDbList;
        if (!keyInStorageForSerializedDbList) {
            throw new Error('There is no a storage key prefix for the value of a databases list serialized');
        }
        return keyInStorageForSerializedDbList;
    }
    _getSerializer() {
        const databasesListSerializer = this._serializer;
        if (!databasesListSerializer) {
            throw new Error('Databases list serializer is not defined');
        }
        return databasesListSerializer;
    }
    _getStorageKeyForDatabasesNamesList() {
        return `${this._getKeyPrefixForSerializedDbListInStorage()}//${SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_STORAGE_KEY_PREFIX_DATABASES_NAMES_DELIMITER}${SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_STORAGE_KEY_DATABASES_NAMES}`;
    }
    _getStorageKeyForDatabase(dbName) {
        return `${this._getKeyPrefixForSerializedDbListInStorage()}${SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_STORAGE_KEY_PREFIX_DATABASE_NAME_DELIMITER}${dbName}`;
    }
    _isTheLastFailedOperationAllowed(attempt) {
        return attempt > this._maxFailsOfersistentStorageOperation;
    }
    _readValueForKeyFromStore(keyInStore) {
        return __awaiter(this, void 0, void 0, function* () {
            const valueReadResult = yield this._getDatabaseListPersistentStorage().get(keyInStore);
            if (valueReadResult instanceof Error) {
                throw valueReadResult;
            }
            return valueReadResult !== null && valueReadResult !== void 0 ? valueReadResult : undefined;
        });
    }
    _setValueForKeyInStorage(keyInStore, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const valueSetResult = yield this._getDatabaseListPersistentStorage().set(keyInStore, value);
            if (valueSetResult instanceof Error) {
                throw valueSetResult;
            }
        });
    }
    _addValueForKeyInStorage(keyInStore, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._setValueForKeyInStorage(keyInStore, value);
        });
    }
    _removeValueForKeyFromStorage(keyInStore) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._setValueForKeyInStorage(keyInStore, undefined);
        });
    }
    _loadDatabasesListNamesSerializedFromStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const keyInStorageForDatabasesNamesList = this._getStorageKeyForDatabasesNamesList();
            return yield this._readValueForKeyFromStore(keyInStorageForDatabasesNamesList);
        });
    }
    _loadDatabasesListNamesFromStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const databasesNamesListSerialized = yield this._loadDatabasesListNamesSerializedFromStorage();
            if (databasesNamesListSerialized) {
                return this._getSerializer().parse(databasesNamesListSerialized);
            }
        });
    }
    _loadDatabaseOptionsSerializedOrUndefinedFromStorage(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._readValueForKeyFromStore(this._getStorageKeyForDatabase(dbName));
        });
    }
    _parseDatabaseOptions(dbOptionsSerialized) {
        return this._getSerializer().parse(dbOptionsSerialized);
    }
    _serializeDatabaseOptions(dbOptionsUnserialized) {
        return this._getSerializer().stringify(dbOptionsUnserialized);
    }
    _loadDatabaseOptionsParsedOrUndefinedFromStorage(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbOptionsSerialized = yield this._loadDatabaseOptionsSerializedOrUndefinedFromStorage(dbName);
            if (!dbOptionsSerialized) {
                return;
            }
            return this._parseDatabaseOptions(dbOptionsSerialized);
        });
    }
    _loadDatabaseOptionsParsedFromStorage(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbOptions = yield this._loadDatabaseOptionsParsedOrUndefinedFromStorage(dbName);
            if (!dbOptions) {
                throw new Error(`Thereis no options for the database ${dbName} in the persistent storage`);
            }
            return dbOptions;
        });
    }
    _loadDatabasesOptionsFromStorage(dbsNames) {
        return __awaiter(this, void 0, void 0, function* () {
            const databasesOptionsParsed = yield Promise.all(dbsNames.map((dbName) => __awaiter(this, void 0, void 0, function* () { return [dbName, yield this._loadDatabaseOptionsParsedFromStorage(dbName)]; })));
            return databasesOptionsParsed;
        });
    }
    _loadDatabasesListFromStorage(dbsNames) {
        return __awaiter(this, void 0, void 0, function* () {
            const uniqDatabasesNames = commonUtilsArrayUniq(dbsNames);
            const databasesOptions = yield this._loadDatabasesOptionsFromStorage(uniqDatabasesNames);
            return databasesOptions.reduce((databasesList, [dbName, dbOptions]) => {
                databasesList[dbName] = dbOptions;
                return databasesList;
            }, {});
        });
    }
    _loadDatabasesListFromStorageIfExists() {
        return __awaiter(this, void 0, void 0, function* () {
            const databasesNamesList = yield this._loadDatabasesListNamesFromStorage();
            if (!databasesNamesList) {
                return;
            }
            return yield this._loadDatabasesListFromStorage(databasesNamesList);
        });
    }
    _setDatabasesList(databasesList) {
        this._databasesList = databasesList;
    }
    _setDefaultDatabasesList() {
        this._setDatabasesList(SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_DEFAULT_DATABASE_LIST);
    }
    _loadDatabasesListIfNotLoaded() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this._databasesList) !== null && _a !== void 0 ? _a : (yield this.loadDatabasesListFromPersistentStorage());
        });
    }
    _getDatabasesNamesListStringified() {
        const databasesNamesListNotSerialized = this._databasesUniqNamesList;
        if (!databasesNamesListNotSerialized) {
            throw new Error('There is no databases names list');
        }
        return this._getSerializer().stringify(databasesNamesListNotSerialized);
    }
    _saveDatabasesNamesListInPersistentStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const keyInStorageForDatabasesNamesList = this._getStorageKeyForDatabasesNamesList();
            yield this._addValueForKeyInStorage(keyInStorageForDatabasesNamesList, this._getDatabasesNamesListStringified());
        });
    }
    _removeDatabaseOptionsFromStorage(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._removeValueForKeyFromStorage(this._getStorageKeyForDatabase(dbName));
        });
    }
    _addDatabaseOptionsSerializedToStorage(dbName, dbOptionsSerialized) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._addValueForKeyInStorage(this._getStorageKeyForDatabase(dbName), dbOptionsSerialized);
        });
    }
    _addDatabaseOptionsToStorage(dbName, dbOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._addDatabaseOptionsSerializedToStorage(dbName, this._serializeDatabaseOptions(dbOptions));
        });
    }
    _setDatabasesListValue(databaseList) {
        this._databasesList = databaseList;
    }
    _removeDatabaseFromTheCacheList(dbName) {
        const databasesListCloned = this._getDatabasesListClone();
        delete databasesListCloned[dbName];
        this._setDatabasesListValue(databasesListCloned);
    }
    _addDatabaseToTheCacheList(dbName, dbOptions) {
        const databasesListCloned = this._getDatabasesListClone();
        databasesListCloned[dbName] = dbOptions;
        this._setDatabasesListValue(databasesListCloned);
    }
    _removeDatabaseFromListAndSaveInStorage(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            this._removeDatabaseFromTheCacheList(dbName);
            yield this._saveDatabasesNamesListInPersistentStorage();
        });
    }
    _addDatabaseToTheListAndSaveInStorage(dbName, dbOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            this._addDatabaseToTheCacheList(dbName, dbOptions);
            yield Promise.all([this._addDatabaseOptionsToStorage(dbName, dbOptions), this._saveDatabasesNamesListInPersistentStorage()]);
        });
    }
    _setDatabasesListValueAndSaveDatabasesNamesListInStorage(databasesList, attempt = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            this._setDatabasesListValue(databasesList);
            try {
                yield this._saveDatabasesNamesListInPersistentStorage();
            }
            catch (err) {
                if (this._isTheLastFailedOperationAllowed((attempt += 1))) {
                    throw err;
                }
                console.log(err);
                yield this._setDatabasesListValueAndSaveDatabasesNamesListInStorage(databasesList, attempt + 1);
            }
        });
    }
    _runStorageOperationInTransaction(runOperationInTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const databasesListCurrentValueClone = this._getDatabasesListClone();
            let attempt = 0;
            let operationResultError;
            while (!this._isTheLastFailedOperationAllowed((attempt += 1))) {
                try {
                    const operationResult = yield runOperationInTransaction();
                    operationResultError = undefined;
                    return operationResult;
                }
                catch (err) {
                    console.error(err);
                    operationResultError = err;
                }
            }
            yield this._setDatabasesListValueAndSaveDatabasesNamesListInStorage(databasesListCurrentValueClone);
            throw operationResultError;
        });
    }
    _waitAllPendingAsyncEndedAndExecute(runAsyncOperation) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._getAsyncOperationsQueue().executeQueued(runAsyncOperation);
        });
    }
    _waitQueueAndRunOperationInTransaction(runOperationInTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._waitAllPendingAsyncEndedAndExecute(() => __awaiter(this, void 0, void 0, function* () { return yield this._runStorageOperationInTransaction(runOperationInTransaction); }));
        });
    }
    _createRemoveDatabaseFromTheListAndStorageOperation(dbName, attempt = 1) {
        return () => __awaiter(this, void 0, void 0, function* () { return yield this._removeDatabaseFromListAndSaveInStorage(dbName); });
    }
    _createAddDatabaseToTheListInStorageOperation(dbName, dbOptions) {
        return () => __awaiter(this, void 0, void 0, function* () { return yield this._addDatabaseToTheListAndSaveInStorage(dbName, dbOptions); });
    }
}
//# sourceMappingURL=swarm-store-connector-databases-persistent-list.js.map