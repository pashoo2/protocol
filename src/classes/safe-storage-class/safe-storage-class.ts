import {
  ISafeStorageOptions,
  TSafeStorageStoredDataType,
  TSafeStorageStoredDataTypeKeyValue,
  TSafeStorageStoredDataTypeAppendLog,
  TSafeStorageDataTypesAvail,
  TSafeStorageKeyType,
  TSafeStorageDataType,
  TSafeStorageStorageAppendLogDataType,
} from './safe-storage-class.types';
import { DEFAULT_INTERVAL_MS } from 'classes/basic-classes/queue-manager-class-base/queue-manager-class-base.const';
import { SecretStorage } from 'classes/secret-storage-class/secret-storage-class';
import {
  SAFE_STORAGE_DUMP_PROVIDER_DEFAULT,
  ESAFE_STORAGE_PROVIDER_STATUS,
  SAFE_STORAGE_STORAGE_NAME_COMMON_PREFIX,
  ESAFE_STORAGE_STORAGE_TYPE,
  SAFE_STORAGE_MAX_ITEMS_APPEND_LOG,
  SAFE_STORAGE_KEY_VALUE_INITIAL_VALUE,
  SAFE_STORAGE_APPEND_LOG_INITIAL_VALUE,
  SAFE_STORAGE_APPEND_LOG_APPEND_DATA_INITIAL_VALUE,
  SAFE_STORAGE_KEY_VALUE_APPEND_DATA_INITIAL_VALUE,
  SAFE_STORAGE_STORAGE_APPEND_LOG_COMMON_POSTFIX,
  SAFE_STORAGE_ATTEMPTS_TO_SAVE_DATA_TO_STORAGE,
  SAFE_STORAGE_DEFAULT_STORAGE_BUSY_TIMEOUT_MS,
} from './safe-storage-class.const';
import {
  getStatusClass,
  STATUS_EVENT,
} from 'classes/basic-classes/status-class-base/status-class-base';

export class SafeStorage<
  TYPE extends ESAFE_STORAGE_STORAGE_TYPE
> extends getStatusClass<typeof ESAFE_STORAGE_PROVIDER_STATUS>({
  errorStatus: ESAFE_STORAGE_PROVIDER_STATUS.ERROR,
  instanceName: 'SafeStorage',
}) {
  static storagesNames: string[] = []; // exists storages names, put it from constructor

  static checkIfNameIsExists(storageName: string) {
    const { storagesNames } = SafeStorage;

    return storagesNames.includes(storageName);
  }

  static addStorageName(storageName: string) {
    const { storagesNames } = SafeStorage;

    storagesNames.push(storageName);
  }

  protected storageName: string = '';

  protected storageNameAppendLog: string = '';

  protected options?: ISafeStorageOptions;

  protected dumpIntervalMs?: number;

  protected dumpIntervalRunning?: NodeJS.Timeout | number;

  protected secretStorageConnection?: InstanceType<typeof SecretStorage>;

  protected tableData: TSafeStorageStoredDataType<
    ESAFE_STORAGE_STORAGE_TYPE
  > = [] as TSafeStorageStoredDataType<ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG>;

  /**
   *
   * this is data which will be merged with the data from storage
   * and then will be write to the storage
   * @protected
   * @type {TSafeStorageStoredDataType<
   *     ESAFE_STORAGE_STORAGE_TYPE
   *   >}
   * @memberof SafeStorage
   */
  protected appendData: TSafeStorageStoredDataType<
    ESAFE_STORAGE_STORAGE_TYPE
  > = [] as TSafeStorageStoredDataType<ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG>;

  /**
   *
   * here a data will be placed if any dumping of appendData is in progress,
   * on a dumping will be ended up, data
   * from this property will be merged with the appendData property
   * @protected
   * @type {TSafeStorageStoredDataType<
   *     ESAFE_STORAGE_STORAGE_TYPE
   *   >}
   * @memberof SafeStorage
   */
  protected appendDataTemp: TSafeStorageStoredDataType<
    ESAFE_STORAGE_STORAGE_TYPE
  > = [] as TSafeStorageStoredDataType<ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG>;

  protected storageType?: ESAFE_STORAGE_STORAGE_TYPE;

  constructor(options: ISafeStorageOptions) {
    super();

    const setOptionsResult = this.setOptions(options);

    if (setOptionsResult instanceof Error) {
      throw setOptionsResult;
    }
    this.setStatus(ESAFE_STORAGE_PROVIDER_STATUS.NEW);
    if (options.storageType === ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG) {
      this.appendData = [] as TSafeStorageStoredDataType<
        ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG
      >;
      this.appendDataTemp = [] as TSafeStorageStoredDataType<
        ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG
      >;
    } else {
      this.appendData = {} as TSafeStorageStoredDataType<
        ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE
      >;
      this.appendDataTemp = {} as TSafeStorageStoredDataType<
        ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE
      >;
    }
  }

  get secretStorageOptions() {
    const { options } = this;
    const { storageDumpProvider } = options as ISafeStorageOptions;

    return {
      storageProviderName:
        storageDumpProvider || SAFE_STORAGE_DUMP_PROVIDER_DEFAULT,
    };
  }

  get isStorageBusy(): boolean {
    const { status } = this;

    return status === ESAFE_STORAGE_PROVIDER_STATUS.WORKING_WITH_STORAGE;
  }

  /**
   * connect to the secret storage
   * and preload a data dumped
   * from it
   * @returns {boolean | Error} - true on success, false if connecting is
   * already in progress, Error if an error has occurred
   */
  async connect(): Promise<boolean | Error> {
    const { status, options } = this;

    if (status !== ESAFE_STORAGE_PROVIDER_STATUS.CONNECTING_TO_STORAGE) {
      const { credentials } = options as ISafeStorageOptions;
      const connectionToTheSecretStorage = this.createSecretStorageInstance();

      if (connectionToTheSecretStorage instanceof Error) {
        return connectionToTheSecretStorage;
      }
      this.setStatus(ESAFE_STORAGE_PROVIDER_STATUS.CONNECTING_TO_STORAGE);

      const connectionToSecretStorageResult = await connectionToTheSecretStorage.authorize(
        credentials
      );

      if (connectionToSecretStorageResult instanceof Error) {
        return this.setErrorStatus(connectionToSecretStorageResult);
      }
      this.setStatus(ESAFE_STORAGE_PROVIDER_STATUS.CONNECTED_TO_STORAGE);

      const preloadDataResult = await this.reloadOverallTableData();

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
  }

  checkOptionsAreValid(options: ISafeStorageOptions): Error | true {
    const { name, credentials } = options;
    const { checkIfNameIsExists } = SafeStorage;

    if (
      typeof credentials !== 'object' ||
      !credentials ||
      !credentials.password
    ) {
      return this.setErrorStatus(
        'SafeStorage: a storage with the name is already exists'
      );
    }
    if (checkIfNameIsExists(name)) {
      return this.setErrorStatus(
        'SafeStorage: a storage with the name is already exists'
      );
    }
    return true;
  }

  setOptions(options: ISafeStorageOptions): Error | true {
    const { name, dumpIntervalMs, storageType } = options;
    const checkOptionsResult = this.checkOptionsAreValid(options);
    const { addStorageName } = SafeStorage;
    const dumpInterval =
      typeof dumpIntervalMs === 'number' ? dumpIntervalMs : DEFAULT_INTERVAL_MS;
    const storageTypeResolved =
      storageType &&
      Object.values(ESAFE_STORAGE_STORAGE_TYPE).includes(storageType)
        ? storageType
        : ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG;

    if (checkOptionsResult instanceof Error) {
      return checkOptionsResult;
    }
    addStorageName(name);
    this.options = {
      ...options,
      dumpIntervalMs: dumpInterval,
      storageType: storageTypeResolved,
    };
    this.storageType = storageTypeResolved;

    const storageName = `${SAFE_STORAGE_STORAGE_NAME_COMMON_PREFIX}${name}`;

    this.storageName = storageName;
    this.storageNameAppendLog = `${storageName}${SAFE_STORAGE_STORAGE_APPEND_LOG_COMMON_POSTFIX}`;
    this.dumpIntervalMs = dumpInterval;
    return true;
  }

  /**
   * load all the data from the secret storage
   * and put all the data to the memory table
   */
  async reloadOverallTableData(): Promise<boolean | Error> {
    // load data from the storage
    // and it's append log
    const tableData = await this.loadOverallTable();

    if (tableData instanceof Error) {
      return this.setErrorStatus(tableData);
    }
    // set all data to the memory table
    this.setTableData(tableData);
    return true;
  }

  /**
   * disconnect from the secret storage
   * and dump the data before it
   */
  async disconnect(): Promise<Error | true> {
    const { dumpIntervalRunning } = this;

    if (typeof dumpIntervalRunning === 'number') {
      clearInterval(dumpIntervalRunning);
    }

    // dump the data before disconnection
    const resultDumping = await this.dumpData();

    if (resultDumping === true) {
      this.setStatus(ESAFE_STORAGE_PROVIDER_STATUS.DISCONNECTED);
      return true;
    }
    return this.setErrorStatus(
      "Can't dump the table's data before disconnected"
    );
  }

  /**
   * @returns {boolean} - returns true if the storage is freed
   * false - on timeout
   */
  waitingStorageFreed(): Promise<boolean | undefined> | true {
    if (!this.isStorageBusy) {
      return true;
    }

    return new Promise((res) => {
      const timeout = setTimeout(
        res,
        SAFE_STORAGE_DEFAULT_STORAGE_BUSY_TIMEOUT_MS
      );
      const { statusEmitter } = this;

      statusEmitter.once(STATUS_EVENT, () => {
        if (!this.isStorageBusy) {
          clearTimeout(timeout);
          res(true);
        }
      });
    });
  }

  castDataToAppendLogType(
    data?: null | TSafeStorageStoredDataType<TYPE>
  ): TSafeStorageStoredDataTypeAppendLog | Error {
    if (data == null) {
      return [] as TSafeStorageStoredDataTypeAppendLog;
    }
    if (data instanceof Array) {
      return data as TSafeStorageStoredDataTypeAppendLog;
    }
    return new Error(
      `There is a wrong data type ${typeof data} for the append log storage`
    );
  }

  castDataToKeyValueType(
    data?: null | TSafeStorageStoredDataType<TYPE>
  ): TSafeStorageStoredDataTypeKeyValue | Error {
    if (data == null) {
      return {} as TSafeStorageStoredDataTypeKeyValue;
    }
    if (!(data instanceof Array) && typeof data === 'object') {
      return data as TSafeStorageStoredDataTypeKeyValue;
    }
    return new Error(
      `There is a wrong data type ${typeof data} for a key value storage`
    );
  }

  /**
   * check if the data given
   * is conformed to the
   * storage type and
   * return an Error if it's
   * not conformed or data in
   * storage type
   * @param data
   */
  castDataToStorageType(
    data?: Error | null | TSafeStorageStoredDataType<TYPE>
  ): TSafeStorageStoredDataType<TYPE> | Error {
    if (data instanceof Error) {
      return data;
    }

    const { storageType } = this;

    switch (storageType) {
      case ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG:
        return this.castDataToAppendLogType(data) as TSafeStorageStoredDataType<
          TYPE
        >;
      default:
        return this.castDataToKeyValueType(data) as TSafeStorageStoredDataType<
          TYPE
        >;
    }
  }

  /**
   * parse a data stringified
   * before save it to the storage
   * and read from the secret storage
   * as a string.
   * @param {string | Error | undefined} data
   */
  parseDataFromStorage<D>(
    data: string | undefined | Error
  ): Error | D | undefined {
    if (data instanceof Error) {
      return this.setErrorStatus(data);
    }
    if (data == null) {
      return undefined;
    }
    try {
      return JSON.parse(data) as D | undefined;
    } catch (err) {
      return err as Error;
    }
  }

  /**
   * merge the data and cast it to the
   * storage type
   * returns the merged data
   * casted to the storage type
   * @memberof SafeStorage
   * @param { object | array } result
   * @param { string | object | array }
   * @returns { object | array | Error }
   */
  mergeData = (
    result: TSafeStorageStoredDataType<TYPE> | Error,
    dataToAppend: string | TSafeStorageStoredDataType<TYPE>
  ): TSafeStorageStoredDataType<TYPE> | Error => {
    const { storageType } = this;
    const isAppendLogStorage =
      storageType === ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG;

    if (result instanceof Error) {
      return result;
    }

    const dataObj =
      typeof dataToAppend === 'string'
        ? this.parseDataFromStorage(dataToAppend)
        : dataToAppend;
    const dataCastedToStorageType = this.castDataToStorageType(
      dataObj as Error | TSafeStorageStoredDataType<TYPE>
    );
    if (dataCastedToStorageType instanceof Error) {
      return this.setErrorStatus(dataCastedToStorageType);
    }
    return (isAppendLogStorage
      ? [
          ...(result as TSafeStorageStoredDataTypeAppendLog),
          ...(dataCastedToStorageType as TSafeStorageStoredDataTypeAppendLog),
        ]
      : {
          ...(result as TSafeStorageStoredDataTypeKeyValue),
          ...(dataCastedToStorageType as TSafeStorageStoredDataTypeKeyValue),
        }) as TSafeStorageStoredDataType<TYPE>;
  };

  /**
   * load a data from the key
   * named as storage name param
   * of the secret storage connected
   * to and return this data
   * @param {string} storageName
   */
  async loadDataFromTable<D>(
    storageName: string
  ): Promise<D | undefined | Error> {
    const { secretStorageConnection } = this;

    if (await this.waitingStorageFreed()) {
      const setPreviousStatus = this.setStatus(
        ESAFE_STORAGE_PROVIDER_STATUS.WORKING_WITH_STORAGE
      );
      const data = await (secretStorageConnection as SecretStorage).get(
        storageName
      );

      setPreviousStatus();

      const parsedDate = this.parseDataFromStorage(data || undefined);

      if (parsedDate instanceof Error) {
        return this.setErrorStatus(parsedDate);
      }
      return parsedDate as D | undefined;
    }
    return new Error(`The storage is too busy`);
  }

  /**
   * load data from append log key
   * of the secret storage connected to
   */
  loadDataFromStorageAppendLog(): Promise<
    TSafeStorageStorageAppendLogDataType | undefined | Error
  > {
    const { storageNameAppendLog } = this;

    return this.loadDataFromTable<TSafeStorageStorageAppendLogDataType>(
      storageNameAppendLog
    );
  }

  /**
   * load data from the append log key
   * of the secret storage connected to
   * parse it as an array of data append
   * and return in a type of the storage:
   * 1) array for an APPEND LOG type storage
   * 2) object for an KEY VALUE type storage
   */
  async loadAndParseDataFromAppendLogStorage(): Promise<
    TSafeStorageStoredDataType<TYPE> | undefined | Error
  > {
    const tableAppendlogsArray = await this.loadDataFromStorageAppendLog();
    if (tableAppendlogsArray instanceof Error) {
      return tableAppendlogsArray;
    }
    if (tableAppendlogsArray == null) {
      return undefined;
    }
    if (tableAppendlogsArray instanceof Array) {
      return tableAppendlogsArray
        .map((str) => (typeof str === 'string' ? decodeURIComponent(str) : str))
        .reduce(
          this.mergeData,
          this.castDataToStorageType(undefined) as TSafeStorageStoredDataType<
            TYPE
          >
        );
    }
  }

  loadDataFromMainStorage(): Promise<
    TSafeStorageStoredDataType<TYPE> | undefined | Error
  > {
    const { storageName } = this;

    return this.loadDataFromTable<TSafeStorageStoredDataType<TYPE>>(
      storageName
    );
  }

  /**
   * loads a data from the main storage
   * and the append log
   * and merge it
   */
  async loadOverallData(): Promise<TSafeStorageStoredDataType<TYPE> | Error> {
    const storageMainTableData = this.castDataToStorageType(
      await this.loadDataFromMainStorage()
    );
    if (storageMainTableData instanceof Error) {
      return this.setErrorStatus(storageMainTableData);
    }

    const storageDataFromAppendLogTable = this.castDataToStorageType(
      await this.loadAndParseDataFromAppendLogStorage()
    );
    if (storageDataFromAppendLogTable instanceof Error) {
      return this.setErrorStatus(storageDataFromAppendLogTable);
    }
    return this.mergeData(storageMainTableData, storageDataFromAppendLogTable);
  }

  /**
   * save a data to the secret storage
   * to the key with name
   * storageName
   * @param {string} storageName
   * @param {string | null | undefined} dataStringified
   */
  async saveDataToStorage(
    storageName: string,
    dataStringified?: string | null
  ): Promise<boolean | Error> {
    const { secretStorageConnection, status } = this;

    if (dataStringified !== null && typeof dataStringified !== 'string') {
      const err = new Error(
        `The table overall data must be null or string, but ${typeof dataStringified} was given`
      );

      console.error(err);
      return err;
    }

    let attempt = 0;

    if (await this.waitingStorageFreed()) {
      const setPrevStatus = this.setStatus(
        ESAFE_STORAGE_PROVIDER_STATUS.WORKING_WITH_STORAGE
      );

      while ((attempt += 1) < SAFE_STORAGE_ATTEMPTS_TO_SAVE_DATA_TO_STORAGE) {
        if (
          !(
            (secretStorageConnection as InstanceType<typeof SecretStorage>).set(
              storageName,
              dataStringified || ''
            ) instanceof Error
          )
        ) {
          setPrevStatus();
          return true;
        }
      }
      setPrevStatus();
      return new Error(`Can't save the data to the storage ${storageName}`);
    }
    return new Error(`The storage is too busy`);
  }

  /**
   * stringify data for the
   * storage
   * @param dataAppendLog
   * @returns {Error | string | false} - sating -stringified data, falser - no data, Error - an error has occurred
   */
  async stringifyDataForStorage(
    dataAppendLog: TSafeStorageDataType[] | TSafeStorageStoredDataTypeKeyValue
  ): Promise<string | null | Error> {
    if (this.checkIfEmptyData(dataAppendLog)) {
      return null;
    }

    try {
      return JSON.stringify(dataAppendLog);
    } catch (err) {
      return this.setErrorStatus(err);
    }
  }

  async writeOverallDataToMainTable(
    data?:
      | string
      | null
      | TSafeStorageDataType[]
      | TSafeStorageStoredDataTypeKeyValue
  ): Promise<boolean | Error> {
    const { storageName } = this;
    let dataStringified;
    if (data && typeof data === 'object') {
      dataStringified = await this.stringifyDataForStorage(data);
    } else if (data && typeof data === 'string') {
      dataStringified = data;
    } else if (data) {
      return new Error(
        'Only an object data can be write to the main table key of the secret storage'
      );
    }
    if (dataStringified instanceof Error) {
      return dataStringified;
    }
    return this.saveDataToStorage(storageName, dataStringified);
  }

  /**
   * write the data to the secret storage's
   * key used as append log data for the
   * main storage key
   * @param [string[]] [undefined] data
   */
  async writeDataToStorageAppengLog(
    data?: string | null | TSafeStorageStorageAppendLogDataType
  ): Promise<Error | boolean> {
    const { storageNameAppendLog } = this;
    let dataStringified;
    if (data && data instanceof Array) {
      dataStringified = await this.stringifyDataForStorage(data);
    } else if (data && typeof data === 'string') {
      dataStringified = data;
    } else if (data) {
      return new Error(
        'Only an array data can be write to the append log key of the secret storage'
      );
    }
    if (dataStringified instanceof Error) {
      return dataStringified;
    }
    return this.saveDataToStorage(storageNameAppendLog, dataStringified);
  }

  async clearAppendLogData(): Promise<boolean | Error> {
    const { storageNameAppendLog } = this;

    return this.saveDataToStorage(storageNameAppendLog, null);
  }

  async loadOverallTable(): Promise<TSafeStorageStoredDataType<TYPE> | Error> {
    /**
     * read data from the main storage table
     * and storage append log table
     * merge it
     */
    const overallData = await this.loadOverallData();
    if (overallData instanceof Error) {
      return this.setErrorStatus(overallData);
    }

    /*
      save data from the main storage and 
      append log storage to the main storage
      table
    */
    const resultSaveDataToMainStorage = await this.writeOverallDataToMainTable(
      overallData
    );
    if (resultSaveDataToMainStorage instanceof Error) {
      this.setErrorStatus(resultSaveDataToMainStorage);
      // if an error is occurred while writing
      // an overall data on the main storage
      // set an error and return overall data
      // without clearing the storage append
      // log table
      return overallData;
    }

    const resultClearStorageAppendLogData = await this.clearAppendLogData();
    if (resultClearStorageAppendLogData instanceof Error) {
      // if an error occurred while clearing the
      // storage append log table
      // return an error occurred as the
      // result
      return this.setErrorStatus(resultClearStorageAppendLogData);
    }
    return overallData;
  }

  setTableData(tableData?: TSafeStorageStoredDataType<TYPE>) {
    const { storageType } = this;

    if (storageType === ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG) {
      this.tableData = (tableData ||
        SAFE_STORAGE_APPEND_LOG_INITIAL_VALUE) as TSafeStorageStoredDataType<
        ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG
      >;
      this.appendData = SAFE_STORAGE_APPEND_LOG_APPEND_DATA_INITIAL_VALUE as TSafeStorageStoredDataType<
        ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG
      >;
    } else {
      this.tableData = (tableData ||
        SAFE_STORAGE_KEY_VALUE_INITIAL_VALUE) as TSafeStorageStoredDataType<
        ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE
      >;
      this.appendData = SAFE_STORAGE_KEY_VALUE_APPEND_DATA_INITIAL_VALUE as TSafeStorageStoredDataType<
        ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE
      >;
    }
  }

  createSecretStorageInstance(): Error | SecretStorage {
    const { secretStorageOptions } = this;
    try {
      const connectionToTheSecretStorage = new SecretStorage(
        secretStorageOptions
      );

      this.secretStorageConnection = connectionToTheSecretStorage;
      return connectionToTheSecretStorage;
    } catch (err) {
      return this.setErrorStatus(err);
    }
  }

  startInterval(): boolean | Error {
    const { dumpIntervalMs } = this;

    try {
      this.dumpIntervalRunning = setInterval(this.dumpData, dumpIntervalMs);
      return true;
    } catch (err) {
      return this.setErrorStatus(err);
    }
  }

  checkIfEmptyData(
    data: TSafeStorageStoredDataType<
      | ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG
      | ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE
    >
  ): boolean {
    if (data instanceof Array && !data.length) {
      return true;
    }
    if (typeof data === 'object' && !Object.keys(data).length) {
      return true;
    }
    return false;
  }

  async writeDump(
    data:
      | TSafeStorageStoredDataTypeAppendLog
      | TSafeStorageStoredDataTypeKeyValue
  ): Promise<Error | boolean> {
    if (this.checkIfEmptyData(data)) {
      return true;
    }
    let dataStringified: string;

    try {
      dataStringified = JSON.stringify(data);
    } catch (err) {
      return this.setErrorStatus(err);
    }
    return this.writeDataToStorageAppengLog(dataStringified);
  }

  async dumpAllStorageTypes(): Promise<Error | boolean> {
    const tableOverallDataDump = await this.loadDataFromStorageAppendLog();
    if (tableOverallDataDump instanceof Error) {
      return this.setErrorStatus(tableOverallDataDump);
    }

    const { appendData } = this;
    const appendDataString = await this.stringifyDataForStorage(appendData);
    if (appendDataString instanceof Error) {
      return this.setErrorStatus(appendDataString);
    }
    if (
      tableOverallDataDump != null &&
      !(tableOverallDataDump instanceof Array)
    ) {
      return this.setErrorStatus('A wrong data type was read from storage');
    }

    const tableOverallData = [
      ...(tableOverallDataDump || []),
      appendDataString,
    ] as TSafeStorageStoredDataTypeAppendLog;
    return this.writeDump(tableOverallData);
  }

  async dumpDataAppendLog(): Promise<Error | true> {
    const writeDumpResult = await this.dumpAllStorageTypes();

    if (writeDumpResult instanceof Error) {
      const { appendData } = this;

      this.appendData = [
        ...(appendData as TSafeStorageStoredDataTypeAppendLog),
        ...(this.appendDataTemp as TSafeStorageStoredDataTypeAppendLog),
      ];
      this.appendDataTemp = [];
      return writeDumpResult;
    }
    this.appendData = this.appendDataTemp;
    this.appendDataTemp = [];
    return true;
  }

  async dumpDataKeyValueStorage(): Promise<Error | boolean> {
    const writeDumpResult = await this.dumpAllStorageTypes();

    if (writeDumpResult instanceof Error) {
      const { appendData } = this;

      this.appendData = {
        ...(appendData as TSafeStorageStoredDataType<
          ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE
        >),
        ...(this.appendDataTemp as TSafeStorageStoredDataType<
          ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE
        >),
      };
      this.appendDataTemp = {};
      return writeDumpResult;
    }
    this.appendData = this.appendDataTemp;
    this.appendDataTemp = {};
    return true;
  }

  /**
   * write the data from the append log
   * in-memory table to the secret storage
   * append log table. On error merge data
   * from in-memory append log and
   * in-memory temporary append log data,
   * then clear the in-memory append log data.
   * On success clear the in-memory
   * append log data table and copy data
   * from the temporary append log
   * to the in-memory append log. And
   * clear in-memory temporary append log
   */
  dumpData = async (): Promise<Error | boolean> => {
    const { storageType, appendData, status } = this;

    if (this.isStorageBusy) {
      // if already writing a dump
      return true;
    }
    if (this.checkIfEmptyData(appendData)) {
      return true;
    }

    let resultWritingDump;

    if (storageType === ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE) {
      resultWritingDump = await this.dumpDataKeyValueStorage();
    } else {
      resultWritingDump = await this.dumpDataAppendLog();
    }
    if (resultWritingDump === true) {
      // TODO - ??reload all the data from storage
      // to guarantee the data persistance
      return true;
    }
    return this.setErrorStatus(
      'An unknown error has occurred while writing the dump of the data to the SecretStorage'
    );
  };

  /**
   * check if too much data in the in-memory
   * append log storage
   * If it is, write a data from it
   * to the secret storage
   */
  checkIfMemoryAppendLogOverflow() {
    const { appendData } = this;

    if (
      appendData instanceof Array &&
      appendData.length > SAFE_STORAGE_MAX_ITEMS_APPEND_LOG
    ) {
      this.dumpData();
    }
  }

  getDataFromAppendLogStorage<D extends TSafeStorageDataTypesAvail>(
    key: TSafeStorageKeyType
  ): Error | null | undefined | D {
    const { tableData } = this;
    const keyType = typeof key;

    if (keyType !== 'number') {
      const err = new Error(
        `For append log storage only a numeric keys are available but ${keyType} type key was given`
      );

      console.error(err);
      return err;
    }
    return (tableData as TSafeStorageStoredDataTypeAppendLog)[key as number] as
      | Error
      | null
      | undefined
      | D;
  }

  getDataFromKeyValueStorage<D extends TSafeStorageDataTypesAvail>(
    key: TSafeStorageKeyType
  ): Error | null | undefined | D {
    const { tableData } = this;
    const keyType = typeof key;

    if (keyType !== 'string') {
      const err = new Error(
        `For append log storage only a string keys are available but ${keyType} type key was given`
      );

      console.error(err);
      return err;
    }
    return (tableData as TSafeStorageStoredDataTypeKeyValue)[key as string] as
      | Error
      | null
      | undefined
      | D;
  }

  /**
   * get data for the key specified
   * from the in-memory table
   * @param key
   */
  get<D extends TSafeStorageDataTypesAvail>(
    key: TSafeStorageKeyType
  ): Error | undefined | null | D {
    const { storageType } = this;

    if (storageType === ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG) {
      return this.getDataFromAppendLogStorage<D>(key);
    }
    if (storageType === ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE) {
      return this.getDataFromKeyValueStorage<D>(key);
    }
    const err = new Error('An unknown storage type');

    console.error(err);
    return err;
  }

  /**
   * try to stringify the data
   * and return true if all is
   * ok or an Error otherwise
   * @param data
   */
  checkDataIsSafetyForSave(data: any): boolean | Error {
    try {
      JSON.stringify(data);
      return true;
    } catch (err) {
      return err;
    }
  }

  /**
   * encode the data to the JSON
   * format, e.g. Date type
   * will be normalized to
   * a stringified date in ISO
   * @param data
   */
  normilizeData(
    data: TSafeStorageDataTypesAvail | undefined | null
  ): string | null | undefined {
    return data != null ? JSON.parse(JSON.stringify(data)) : undefined;
  }

  async setDataInAppendLogStorage(
    data: TSafeStorageDataTypesAvail | undefined | null,
    key?: TSafeStorageKeyType
  ): Promise<Error | boolean> {
    if (key && typeof key !== 'number') {
      const err = new Error(
        `For append log storage only a numeric keys are available but ${typeof key} type key was given`
      );

      console.error(err);
      return err;
    }

    const { appendData, appendDataTemp, tableData } = this;
    const tempStorage = this.isStorageBusy ? appendDataTemp : appendData;
    const stringifiedData = this.normilizeData(data);

    if (!key) {
      (tempStorage as TSafeStorageStoredDataTypeAppendLog).push(
        stringifiedData || null
      );
      (tableData as TSafeStorageStoredDataTypeAppendLog).push(
        stringifiedData || null
      );
    } else {
      (tempStorage as TSafeStorageStoredDataTypeAppendLog)[key as number] =
        stringifiedData || null;
      (tableData as TSafeStorageStoredDataTypeAppendLog)[key as number] =
        stringifiedData || null;
    }
    return true;
  }

  /**
   *
   * @param data
   * @param [numbder] key [undefined] - index where
   * put the data given.
   * If it's not specified
   * then set the data given
   * by the last index
   */
  async setDataInKeyValueStorage(
    data: TSafeStorageDataTypesAvail | undefined | null,
    key?: TSafeStorageKeyType
  ): Promise<Error | boolean> {
    if (typeof key !== 'string') {
      const err = new Error(
        `For key value storage only a string keys are available but ${typeof key} type key was given`
      );

      console.error(err);
      return err;
    }

    const { appendData, appendDataTemp, tableData } = this;
    const tempStorage = this.isStorageBusy ? appendDataTemp : appendData;
    const stringifiedData = this.normilizeData(data);

    (tableData as TSafeStorageStoredDataTypeKeyValue)[key] =
      stringifiedData || null;
    (tempStorage as TSafeStorageStoredDataTypeKeyValue)[key] =
      stringifiedData || null;
    return true;
  }

  /**
   * set data in the in-memory
   * table and in-memory append log
   * table or in-memory temporary
   * append-log table
   * if any operations on append log
   * in-memory table is active.
   * Also the data set into
   * the in-memory overall data
   * table for the key specified
   * @param data
   * @param key
   */
  async set(
    data: TSafeStorageDataTypesAvail | undefined | null,
    key?: TSafeStorageKeyType
  ): Promise<Error | boolean> {
    const { storageType } = this;

    const dataSafeResult = this.checkDataIsSafetyForSave(data);
    if (dataSafeResult instanceof Error) {
      return dataSafeResult;
    }
    this.checkIfMemoryAppendLogOverflow();
    if (storageType === ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG) {
      return this.setDataInAppendLogStorage(data, key);
    }
    if (storageType === ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE) {
      return this.setDataInKeyValueStorage(data, key);
    }

    const err = new Error('An unknown storage type');

    console.error(err);
    return err;
  }

  /**
   * remove a data by fot a key specified
   */
  async remove(key: TSafeStorageKeyType) {
    if (!key) {
      return new Error('A key must be specified to remove a data from it');
    }
    return this.set(null, key);
  }

  /**
   * clear the data in the storage
   */
  async clear(): Promise<Error | boolean> {
    this.appendData = this.castDataToStorageType() as TSafeStorageStoredDataType<
      TYPE
    >;
    this.appendDataTemp = this.castDataToStorageType() as TSafeStorageStoredDataType<
      TYPE
    >;
    this.tableData = this.castDataToStorageType() as TSafeStorageStoredDataType<
      TYPE
    >;
    return this.writeDataToStorageAppengLog(null);
  }
}
