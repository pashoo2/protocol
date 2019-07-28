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
} from './safe-storage-class.const';
import {
  getStatusClass,
  STATUS_EVENT,
} from 'classes/basic-classes/status-class-base/status-class-base';

export class SafeStorage<
  TYPE extends ESAFE_STORAGE_STORAGE_TYPE
> extends getStatusClass<typeof ESAFE_STORAGE_PROVIDER_STATUS>({
  errorStatus: ESAFE_STORAGE_PROVIDER_STATUS.ERROR,
  instanceName: 'SecretStorage',
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

      const preloadDataResult = await this.reloadOverallTableData();

      if (preloadDataResult instanceof Error) {
        return preloadDataResult;
      }
      this.setStatus(ESAFE_STORAGE_PROVIDER_STATUS.CONNECTED_TO_STORAGE);
      return this.startInterval();
    }
    return false;
  }

  async reloadOverallTableData(): Promise<boolean | Error> {
    const tableData = await this.loadOverallTable();

    if (tableData instanceof Error) {
      return this.setErrorStatus(tableData);
    }
    this.setTableData(tableData);
    return true;
  }

  async disconnect(): Promise<Error | true> {
    const { dumpIntervalRunning } = this;

    if (typeof dumpIntervalRunning === 'number') {
      clearInterval(dumpIntervalRunning);
    }

    let idx = 0;
    while ((idx += 1) < 3) {
      const resultDumping = await this.dumpData();

      if (resultDumping === true) {
        this.setStatus(ESAFE_STORAGE_PROVIDER_STATUS.DISCONNECTED);
        return true;
      }
    }
    return this.setErrorStatus(
      "Can't dump the table's data before disconnected"
    );
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
   * @returns {boolean} - returns true if the storage is freed
   * false - on timeout
   */
  waitingStorageFreed(): Promise<boolean | undefined> {
    return new Promise(res => {
      const timeout = setTimeout(res);
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

  castDataToStorageType(
    data?: Error | null | TSafeStorageStoredDataType<TYPE>
  ):
    | TSafeStorageStoredDataTypeKeyValue
    | TSafeStorageStoredDataTypeAppendLog
    | Error {
    if (data instanceof Error) {
      return data;
    }

    const { storageType } = this;

    switch (storageType) {
      case ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG:
        return this.castDataToAppendLogType();
      default:
        return this.castDataToKeyValueType();
    }
  }

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
      if (data instanceof Error) {
        return this.setErrorStatus(data);
      }
      if (data == null) {
        return undefined;
      }
      try {
        return JSON.parse(data) as D | undefined;
      } catch (err) {
        return this.setErrorStatus(err) as Error;
      }
    }
    return new Error(`The storage is too busy`);
  }

  loadDataFromStorageAppendLog(): Promise<
    TSafeStorageStorageAppendLogDataType | undefined | Error
  > {
    const { storageNameAppendLog } = this;

    return this.loadDataFromTable<TSafeStorageStorageAppendLogDataType>(
      storageNameAppendLog
    );
  }

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
      const { storageType } = this;
      const isAppendLogStorage =
        storageType === ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG;

      return tableAppendlogsArray.reduce(
        (result, appendLogString) => {
          try {
            const stringDecoded = decodeURIComponent(appendLogString);
            const parsedResult = (JSON.parse(stringDecoded) as unknown) as
              | TSafeStorageStoredDataTypeAppendLog
              | TSafeStorageStoredDataTypeKeyValue;

            return (isAppendLogStorage
              ? [
                  ...(result as TSafeStorageStoredDataTypeAppendLog),
                  ...(parsedResult as TSafeStorageStoredDataTypeAppendLog),
                ]
              : {
                  ...(result as TSafeStorageStoredDataTypeKeyValue),
                  ...(parsedResult as TSafeStorageStoredDataTypeKeyValue),
                }) as TSafeStorageStoredDataType<TYPE>;
          } catch (err) {
            console.error(err);
          }
          return result;
        },
        (isAppendLogStorage ? [] : {}) as TSafeStorageStoredDataType<TYPE>
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

    const { storageType } = this;

    return (storageType === ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG
      ? [
          ...(storageMainTableData as TSafeStorageStoredDataTypeAppendLog),
          ...(storageDataFromAppendLogTable as TSafeStorageStoredDataTypeAppendLog),
        ]
      : {
          ...(storageMainTableData as TSafeStorageStoredDataTypeKeyValue),
          ...(storageDataFromAppendLogTable as TSafeStorageStoredDataTypeKeyValue),
        }) as TSafeStorageStoredDataType<TYPE>;
  }

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
          return true;
        }
      }
      setPrevStatus();
      return new Error(`Can't save the data to the storage ${storageName}`);
    }
    return new Error(`The storage is too busy`);
  }

  /**
   *
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
      return encodeURIComponent(JSON.stringify(dataAppendLog));
    } catch (err) {
      return this.setErrorStatus(err);
    }
  }

  async storeOverallDataToMainTable(
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
    }
    if (dataStringified instanceof Error) {
      return dataStringified;
    }
    return this.saveDataToStorage(storageName, dataStringified);
  }

  async clearAppendLogData(): Promise<boolean | Error> {
    const { storageNameAppendLog } = this;

    return this.saveDataToStorage(storageNameAppendLog, null);
  }

  async loadOverallTable(): Promise<TSafeStorageStoredDataType<TYPE> | Error> {
    const overallData = await this.loadOverallData();

    if (overallData instanceof Error) {
      return this.setErrorStatus(overallData);
    }

    const resultSaveDataToMainStorage = await this.storeOverallDataToMainTable(
      overallData
    );

    if (resultSaveDataToMainStorage instanceof Error) {
      return this.setErrorStatus(resultSaveDataToMainStorage);
    }

    const resultClearStorageAppendLogData = await this.clearAppendLogData();

    if (resultClearStorageAppendLogData instanceof Error) {
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

  writeTableDataToStorageAppengLog(
    dataStringified: string | null
  ): Promise<Error | boolean> {
    const { storageNameAppendLog } = this;

    return this.saveDataToStorage(storageNameAppendLog, dataStringified);
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
    return this.writeTableDataToStorageAppengLog(dataStringified);
  }

  async dumpAllStorageTypes(): Promise<Error | boolean> {
    const tableOverallDataDump = await this.loadOverallTable();

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
      return writeDumpResult as Error;
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
      return writeDumpResult as Error;
    }
    this.appendData = this.appendDataTemp;
    this.appendDataTemp = {};
    return true;
  }

  dumpData = async (): Promise<Error | boolean> => {
    const { storageType, appendData, status } = this;

    if (this.isStorageBusy) {
      // if already writing a dump
      return true;
    }
    if (this.checkIfEmptyData(appendData)) {
      return true;
    }

    const setPreviousStatus = this.setStatus(
      ESAFE_STORAGE_PROVIDER_STATUS.WORKING_WITH_STORAGE
    );
    let resultWritingDump;

    if (storageType === ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE) {
      resultWritingDump = await this.dumpDataKeyValueStorage();
    } else {
      resultWritingDump = await this.dumpDataAppendLog();
    }
    if (resultWritingDump === true) {
      setPreviousStatus();
      // TODO - ??reload all the data from storage
      // to guarantee the data persistance
      return true;
    }
    return this.setErrorStatus(
      'An unknown error has occurred while writing the dump of the data to the SecretStorage'
    );
  };

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

  checkDataIsSafetyForSave(data: any): boolean | Error {
    try {
      JSON.stringify(data);
      return true;
    } catch (err) {
      return err;
    }
  }

  encodeData(
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
    const stringifiedData = this.encodeData(data);

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
    const stringifiedData = this.encodeData(data);

    (tableData as TSafeStorageStoredDataTypeKeyValue)[key as string] =
      stringifiedData || null;
    (tempStorage as TSafeStorageStoredDataTypeKeyValue)[key as string] =
      stringifiedData || null;
    return true;
  }

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

  async remove(key: TSafeStorageKeyType) {
    return this.set(null, key);
  }

  async clear(): Promise<Error | boolean> {
    return this.writeTableDataToStorageAppengLog(null);
  }
}
