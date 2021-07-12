import { __awaiter } from "tslib";
import { DEFAULT_INTERVAL_MS } from "../basic-classes/queue-manager-class-base/queue-manager-class-base.const";
import { SecretStorage } from "../secret-storage-class/secret-storage-class";
import { SAFE_STORAGE_DUMP_PROVIDER_DEFAULT, ESAFE_STORAGE_PROVIDER_STATUS, SAFE_STORAGE_STORAGE_NAME_COMMON_PREFIX, ESAFE_STORAGE_STORAGE_TYPE, SAFE_STORAGE_MAX_ITEMS_APPEND_LOG, SAFE_STORAGE_KEY_VALUE_INITIAL_VALUE, SAFE_STORAGE_APPEND_LOG_INITIAL_VALUE, SAFE_STORAGE_APPEND_LOG_APPEND_DATA_INITIAL_VALUE, SAFE_STORAGE_KEY_VALUE_APPEND_DATA_INITIAL_VALUE, SAFE_STORAGE_STORAGE_APPEND_LOG_COMMON_POSTFIX, SAFE_STORAGE_ATTEMPTS_TO_SAVE_DATA_TO_STORAGE, SAFE_STORAGE_DEFAULT_STORAGE_BUSY_TIMEOUT_MS, } from './safe-storage-class.const';
import { getStatusClass, STATUS_EVENT } from "../basic-classes/status-class-base/status-class-base";
export class SafeStorage extends getStatusClass({
    errorStatus: ESAFE_STORAGE_PROVIDER_STATUS.ERROR,
    instanceName: 'SafeStorage',
}) {
    constructor(options) {
        super();
        this.storageName = '';
        this.storageNameAppendLog = '';
        this.tableData = [];
        this.appendData = [];
        this.appendDataTemp = [];
        this.mergeData = (result, dataToAppend) => {
            const { storageType } = this;
            const isAppendLogStorage = storageType === ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG;
            if (result instanceof Error) {
                return result;
            }
            const dataObj = typeof dataToAppend === 'string' ? this.parseDataFromStorage(dataToAppend) : dataToAppend;
            const dataCastedToStorageType = this.castDataToStorageType(dataObj);
            if (dataCastedToStorageType instanceof Error) {
                return this.setErrorStatus(dataCastedToStorageType);
            }
            return (isAppendLogStorage
                ? [
                    ...result,
                    ...dataCastedToStorageType,
                ]
                : Object.assign(Object.assign({}, result), dataCastedToStorageType));
        };
        this.dumpData = () => __awaiter(this, void 0, void 0, function* () {
            const { storageType, appendData, status } = this;
            if (this.isStorageBusy) {
                return true;
            }
            if (this.checkIfEmptyData(appendData)) {
                return true;
            }
            let resultWritingDump;
            if (storageType === ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE) {
                resultWritingDump = yield this.dumpDataKeyValueStorage();
            }
            else {
                resultWritingDump = yield this.dumpDataAppendLog();
            }
            if (resultWritingDump === true) {
                return true;
            }
            return this.setErrorStatus('An unknown error has occurred while writing the dump of the data to the SecretStorage');
        });
        const setOptionsResult = this.setOptions(options);
        if (setOptionsResult instanceof Error) {
            throw setOptionsResult;
        }
        this.setStatus(ESAFE_STORAGE_PROVIDER_STATUS.NEW);
        if (options.storageType === ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG) {
            this.appendData = [];
            this.appendDataTemp = [];
        }
        else {
            this.appendData = {};
            this.appendDataTemp = {};
        }
    }
    static checkIfNameIsExists(storageName) {
        const { storagesNames } = SafeStorage;
        return storagesNames.includes(storageName);
    }
    static addStorageName(storageName) {
        const { storagesNames } = SafeStorage;
        storagesNames.push(storageName);
    }
    get secretStorageOptions() {
        const { options } = this;
        const { storageDumpProvider } = options;
        return {
            storageProviderName: storageDumpProvider || SAFE_STORAGE_DUMP_PROVIDER_DEFAULT,
        };
    }
    get isStorageBusy() {
        const { status } = this;
        return status === ESAFE_STORAGE_PROVIDER_STATUS.WORKING_WITH_STORAGE;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, options } = this;
            if (status !== ESAFE_STORAGE_PROVIDER_STATUS.CONNECTING_TO_STORAGE) {
                const { credentials } = options;
                const connectionToTheSecretStorage = this.createSecretStorageInstance();
                if (connectionToTheSecretStorage instanceof Error) {
                    return connectionToTheSecretStorage;
                }
                this.setStatus(ESAFE_STORAGE_PROVIDER_STATUS.CONNECTING_TO_STORAGE);
                const connectionToSecretStorageResult = yield connectionToTheSecretStorage.authorize(credentials);
                if (connectionToSecretStorageResult instanceof Error) {
                    return this.setErrorStatus(connectionToSecretStorageResult);
                }
                this.setStatus(ESAFE_STORAGE_PROVIDER_STATUS.CONNECTED_TO_STORAGE);
                const preloadDataResult = yield this.reloadOverallTableData();
                if (preloadDataResult instanceof Error) {
                    return preloadDataResult;
                }
                const startIntervalResult = this.startInterval();
                if (startIntervalResult instanceof Error) {
                    return this.setErrorStatus(startIntervalResult);
                }
                this.setStatus(ESAFE_STORAGE_PROVIDER_STATUS.READY);
                return true;
            }
            return false;
        });
    }
    checkOptionsAreValid(options) {
        const { name, credentials } = options;
        if (typeof credentials !== 'object' || !credentials || !credentials.password) {
            return this.setErrorStatus('SafeStorage: a storage with the name is already exists');
        }
        if (SafeStorage.checkIfNameIsExists(name)) {
            return this.setErrorStatus('SafeStorage: a storage with the name is already exists');
        }
        return true;
    }
    setOptions(options) {
        const { name, dumpIntervalMs, storageType } = options;
        const checkOptionsResult = this.checkOptionsAreValid(options);
        const dumpInterval = typeof dumpIntervalMs === 'number' ? dumpIntervalMs : DEFAULT_INTERVAL_MS;
        const storageTypeResolved = storageType && Object.values(ESAFE_STORAGE_STORAGE_TYPE).includes(storageType)
            ? storageType
            : ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG;
        if (checkOptionsResult instanceof Error) {
            return checkOptionsResult;
        }
        SafeStorage.addStorageName(name);
        this.options = Object.assign(Object.assign({}, options), { dumpIntervalMs: dumpInterval, storageType: storageTypeResolved });
        this.storageType = storageTypeResolved;
        const storageName = `${SAFE_STORAGE_STORAGE_NAME_COMMON_PREFIX}${name}`;
        this.storageName = storageName;
        this.storageNameAppendLog = `${storageName}${SAFE_STORAGE_STORAGE_APPEND_LOG_COMMON_POSTFIX}`;
        this.dumpIntervalMs = dumpInterval;
        return true;
    }
    reloadOverallTableData() {
        return __awaiter(this, void 0, void 0, function* () {
            const tableData = yield this.loadOverallTable();
            if (tableData instanceof Error) {
                return this.setErrorStatus(tableData);
            }
            this.setTableData(tableData);
            return true;
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            const { dumpIntervalRunning } = this;
            if (typeof dumpIntervalRunning === 'number') {
                clearInterval(dumpIntervalRunning);
            }
            const resultDumping = yield this.dumpData();
            if (resultDumping === true) {
                this.setStatus(ESAFE_STORAGE_PROVIDER_STATUS.DISCONNECTED);
                return true;
            }
            return this.setErrorStatus("Can't dump the table's data before disconnected");
        });
    }
    waitingStorageFreed() {
        if (!this.isStorageBusy) {
            return true;
        }
        return new Promise((res) => {
            const timeout = setTimeout(res, SAFE_STORAGE_DEFAULT_STORAGE_BUSY_TIMEOUT_MS);
            const { statusEmitter } = this;
            statusEmitter.once(STATUS_EVENT, () => {
                if (!this.isStorageBusy) {
                    clearTimeout(timeout);
                    res(true);
                }
            });
        });
    }
    castDataToAppendLogType(data) {
        if (data == null) {
            return [];
        }
        if (data instanceof Array) {
            return data;
        }
        return new Error(`There is a wrong data type ${typeof data} for the append log storage`);
    }
    castDataToKeyValueType(data) {
        if (data == null) {
            return {};
        }
        if (!(data instanceof Array) && typeof data === 'object') {
            return data;
        }
        return new Error(`There is a wrong data type ${typeof data} for a key value storage`);
    }
    castDataToStorageType(data) {
        if (data instanceof Error) {
            return data;
        }
        const { storageType } = this;
        switch (storageType) {
            case ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG:
                return this.castDataToAppendLogType(data);
            default:
                return this.castDataToKeyValueType(data);
        }
    }
    parseDataFromStorage(data) {
        if (data instanceof Error) {
            return this.setErrorStatus(data);
        }
        if (data == null) {
            return undefined;
        }
        try {
            return JSON.parse(data);
        }
        catch (err) {
            return err;
        }
    }
    loadDataFromTable(storageName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { secretStorageConnection } = this;
            if (yield this.waitingStorageFreed()) {
                const setPreviousStatus = this.setStatus(ESAFE_STORAGE_PROVIDER_STATUS.WORKING_WITH_STORAGE);
                const data = yield secretStorageConnection.get(storageName);
                setPreviousStatus();
                const parsedDate = this.parseDataFromStorage(data || undefined);
                if (parsedDate instanceof Error) {
                    return this.setErrorStatus(parsedDate);
                }
                return parsedDate;
            }
            return new Error(`The storage is too busy`);
        });
    }
    loadDataFromStorageAppendLog() {
        const { storageNameAppendLog } = this;
        return this.loadDataFromTable(storageNameAppendLog);
    }
    loadAndParseDataFromAppendLogStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const tableAppendlogsArray = yield this.loadDataFromStorageAppendLog();
            if (tableAppendlogsArray instanceof Error) {
                return tableAppendlogsArray;
            }
            if (tableAppendlogsArray == null) {
                return undefined;
            }
            if (tableAppendlogsArray instanceof Array) {
                return tableAppendlogsArray
                    .map((str) => (typeof str === 'string' ? decodeURIComponent(str) : str))
                    .reduce(this.mergeData, this.castDataToStorageType(undefined));
            }
        });
    }
    loadDataFromMainStorage() {
        const { storageName } = this;
        return this.loadDataFromTable(storageName);
    }
    loadOverallData() {
        return __awaiter(this, void 0, void 0, function* () {
            const storageMainTableData = this.castDataToStorageType(yield this.loadDataFromMainStorage());
            if (storageMainTableData instanceof Error) {
                return this.setErrorStatus(storageMainTableData);
            }
            const storageDataFromAppendLogTable = this.castDataToStorageType(yield this.loadAndParseDataFromAppendLogStorage());
            if (storageDataFromAppendLogTable instanceof Error) {
                return this.setErrorStatus(storageDataFromAppendLogTable);
            }
            return this.mergeData(storageMainTableData, storageDataFromAppendLogTable);
        });
    }
    saveDataToStorage(storageName, dataStringified) {
        return __awaiter(this, void 0, void 0, function* () {
            const { secretStorageConnection, status } = this;
            if (dataStringified !== null && typeof dataStringified !== 'string') {
                const err = new Error(`The table overall data must be null or string, but ${typeof dataStringified} was given`);
                console.error(err);
                return err;
            }
            let attempt = 0;
            if (yield this.waitingStorageFreed()) {
                const setPrevStatus = this.setStatus(ESAFE_STORAGE_PROVIDER_STATUS.WORKING_WITH_STORAGE);
                while ((attempt += 1) < SAFE_STORAGE_ATTEMPTS_TO_SAVE_DATA_TO_STORAGE) {
                    if (!(secretStorageConnection.set(storageName, dataStringified || '') instanceof Error)) {
                        setPrevStatus();
                        return true;
                    }
                }
                setPrevStatus();
                return new Error(`Can't save the data to the storage ${storageName}`);
            }
            return new Error(`The storage is too busy`);
        });
    }
    stringifyDataForStorage(dataAppendLog) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.checkIfEmptyData(dataAppendLog)) {
                return null;
            }
            try {
                return JSON.stringify(dataAppendLog);
            }
            catch (err) {
                return this.setErrorStatus(err);
            }
        });
    }
    writeOverallDataToMainTable(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storageName } = this;
            let dataStringified;
            if (data && typeof data === 'object') {
                dataStringified = yield this.stringifyDataForStorage(data);
            }
            else if (data && typeof data === 'string') {
                dataStringified = data;
            }
            else if (data) {
                return new Error('Only an object data can be write to the main table key of the secret storage');
            }
            if (dataStringified instanceof Error) {
                return dataStringified;
            }
            return this.saveDataToStorage(storageName, dataStringified);
        });
    }
    writeDataToStorageAppengLog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storageNameAppendLog } = this;
            let dataStringified;
            if (data && data instanceof Array) {
                dataStringified = yield this.stringifyDataForStorage(data);
            }
            else if (data && typeof data === 'string') {
                dataStringified = data;
            }
            else if (data) {
                return new Error('Only an array data can be write to the append log key of the secret storage');
            }
            if (dataStringified instanceof Error) {
                return dataStringified;
            }
            return this.saveDataToStorage(storageNameAppendLog, dataStringified);
        });
    }
    clearAppendLogData() {
        return __awaiter(this, void 0, void 0, function* () {
            const { storageNameAppendLog } = this;
            return this.saveDataToStorage(storageNameAppendLog, null);
        });
    }
    loadOverallTable() {
        return __awaiter(this, void 0, void 0, function* () {
            const overallData = yield this.loadOverallData();
            if (overallData instanceof Error) {
                return this.setErrorStatus(overallData);
            }
            const resultSaveDataToMainStorage = yield this.writeOverallDataToMainTable(overallData);
            if (resultSaveDataToMainStorage instanceof Error) {
                this.setErrorStatus(resultSaveDataToMainStorage);
                return overallData;
            }
            const resultClearStorageAppendLogData = yield this.clearAppendLogData();
            if (resultClearStorageAppendLogData instanceof Error) {
                return this.setErrorStatus(resultClearStorageAppendLogData);
            }
            return overallData;
        });
    }
    setTableData(tableData) {
        const { storageType } = this;
        if (storageType === ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG) {
            this.tableData = (tableData ||
                SAFE_STORAGE_APPEND_LOG_INITIAL_VALUE);
            this.appendData =
                SAFE_STORAGE_APPEND_LOG_APPEND_DATA_INITIAL_VALUE;
        }
        else {
            this.tableData = (tableData ||
                SAFE_STORAGE_KEY_VALUE_INITIAL_VALUE);
            this.appendData =
                SAFE_STORAGE_KEY_VALUE_APPEND_DATA_INITIAL_VALUE;
        }
    }
    createSecretStorageInstance() {
        const { secretStorageOptions } = this;
        try {
            const connectionToTheSecretStorage = new SecretStorage(secretStorageOptions);
            this.secretStorageConnection = connectionToTheSecretStorage;
            return connectionToTheSecretStorage;
        }
        catch (err) {
            return this.setErrorStatus(err);
        }
    }
    startInterval() {
        const { dumpIntervalMs } = this;
        try {
            this.dumpIntervalRunning = setInterval(this.dumpData, dumpIntervalMs);
            return true;
        }
        catch (err) {
            return this.setErrorStatus(err);
        }
    }
    checkIfEmptyData(data) {
        if (data instanceof Array && !data.length) {
            return true;
        }
        if (typeof data === 'object' && !Object.keys(data).length) {
            return true;
        }
        return false;
    }
    writeDump(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.checkIfEmptyData(data)) {
                return true;
            }
            let dataStringified;
            try {
                dataStringified = JSON.stringify(data);
            }
            catch (err) {
                return this.setErrorStatus(err);
            }
            return this.writeDataToStorageAppengLog(dataStringified);
        });
    }
    dumpAllStorageTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            const tableOverallDataDump = yield this.loadDataFromStorageAppendLog();
            if (tableOverallDataDump instanceof Error) {
                return this.setErrorStatus(tableOverallDataDump);
            }
            const { appendData } = this;
            const appendDataString = yield this.stringifyDataForStorage(appendData);
            if (appendDataString instanceof Error) {
                return this.setErrorStatus(appendDataString);
            }
            if (tableOverallDataDump != null && !(tableOverallDataDump instanceof Array)) {
                return this.setErrorStatus('A wrong data type was read from storage');
            }
            const tableOverallData = [...(tableOverallDataDump || []), appendDataString];
            return this.writeDump(tableOverallData);
        });
    }
    dumpDataAppendLog() {
        return __awaiter(this, void 0, void 0, function* () {
            const writeDumpResult = yield this.dumpAllStorageTypes();
            if (writeDumpResult instanceof Error) {
                const { appendData } = this;
                this.appendData = [
                    ...appendData,
                    ...this.appendDataTemp,
                ];
                this.appendDataTemp = [];
                return writeDumpResult;
            }
            this.appendData = this.appendDataTemp;
            this.appendDataTemp = [];
            return true;
        });
    }
    dumpDataKeyValueStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const writeDumpResult = yield this.dumpAllStorageTypes();
            if (writeDumpResult instanceof Error) {
                const { appendData } = this;
                this.appendData = Object.assign(Object.assign({}, appendData), this.appendDataTemp);
                this.appendDataTemp = {};
                return writeDumpResult;
            }
            this.appendData = this.appendDataTemp;
            this.appendDataTemp = {};
            return true;
        });
    }
    checkIfMemoryAppendLogOverflow() {
        return __awaiter(this, void 0, void 0, function* () {
            const { appendData } = this;
            if (appendData instanceof Array && appendData.length > SAFE_STORAGE_MAX_ITEMS_APPEND_LOG) {
                yield this.dumpData();
            }
        });
    }
    getDataFromAppendLogStorage(key) {
        const { tableData } = this;
        const keyType = typeof key;
        if (keyType !== 'number') {
            const err = new Error(`For append log storage only a numeric keys are available but ${keyType} type key was given`);
            console.error(err);
            return err;
        }
        return tableData[key];
    }
    getDataFromKeyValueStorage(key) {
        const { tableData } = this;
        const keyType = typeof key;
        if (keyType !== 'string') {
            const err = new Error(`For append log storage only a string keys are available but ${keyType} type key was given`);
            console.error(err);
            return err;
        }
        return tableData[key];
    }
    get(key) {
        const { storageType } = this;
        if (storageType === ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG) {
            return this.getDataFromAppendLogStorage(key);
        }
        if (storageType === ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE) {
            return this.getDataFromKeyValueStorage(key);
        }
        const err = new Error('An unknown storage type');
        console.error(err);
        return err;
    }
    checkDataIsSafetyForSave(data) {
        try {
            JSON.stringify(data);
            return true;
        }
        catch (err) {
            return err;
        }
    }
    normilizeData(data) {
        return data != null ? JSON.parse(JSON.stringify(data)) : undefined;
    }
    setDataInAppendLogStorage(data, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key && typeof key !== 'number') {
                const err = new Error(`For append log storage only a numeric keys are available but ${typeof key} type key was given`);
                console.error(err);
                return err;
            }
            const { appendData, appendDataTemp, tableData } = this;
            const tempStorage = this.isStorageBusy ? appendDataTemp : appendData;
            const stringifiedData = this.normilizeData(data);
            if (!key) {
                tempStorage.push(stringifiedData || null);
                tableData.push(stringifiedData || null);
            }
            else {
                tempStorage[key] = stringifiedData || null;
                tableData[key] = stringifiedData || null;
            }
            return true;
        });
    }
    setDataInKeyValueStorage(data, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof key !== 'string') {
                const err = new Error(`For key value storage only a string keys are available but ${typeof key} type key was given`);
                console.error(err);
                return err;
            }
            const { appendData, appendDataTemp, tableData } = this;
            const tempStorage = this.isStorageBusy ? appendDataTemp : appendData;
            const stringifiedData = this.normilizeData(data);
            tableData[key] = stringifiedData || null;
            tempStorage[key] = stringifiedData || null;
            return true;
        });
    }
    set(data, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storageType } = this;
            const dataSafeResult = this.checkDataIsSafetyForSave(data);
            if (dataSafeResult instanceof Error) {
                return dataSafeResult;
            }
            yield this.checkIfMemoryAppendLogOverflow();
            if (storageType === ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG) {
                return this.setDataInAppendLogStorage(data, key);
            }
            if (storageType === ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE) {
                return this.setDataInKeyValueStorage(data, key);
            }
            const err = new Error('An unknown storage type');
            console.error(err);
            return err;
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!key) {
                return new Error('A key must be specified to remove a data from it');
            }
            return this.set(null, key);
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this.appendData = this.castDataToStorageType();
            this.appendDataTemp = this.castDataToStorageType();
            this.tableData = this.castDataToStorageType();
            return this.writeDataToStorageAppengLog(null);
        });
    }
}
SafeStorage.storagesNames = [];
//# sourceMappingURL=safe-storage-class.js.map