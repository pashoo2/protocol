import {
  ISafeStorageOptions,
  TSafeStorageStoredDataType,
  TSafeStorageStoredDataTypeKeyValue,
  TSafeStorageStoredDataTypeAppendLog,
  TSafeStorageDataTypesAvail,
  TSafeStorageKeyType,
} from './safe-storage-class.types';
import { DEFAULT_INTERVAL_MS } from 'classes/basic-classes/queue-manager-class-base/queue-manager-class-base.const';
import { SecretStorage } from 'classes/secret-storage-class/secret-storage-class';
import {
  SAFE_STORAGE_DUMP_PROVIDER_DEFAULT,
  ESAFE_STORAGE_PROVIDER_STATUS,
  SAFE_STORAGE_STORAGE_NAME_COMMON_PREFIX,
  ESAFE_STORAGE_STORAGE_TYPE,
  ESAFE_STORAGE_RETURN_TYPE,
} from './safe-storage-class.const';
import { getStatusClass } from 'classes/basic-classes/status-class-base/status-class-base';

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

  protected options?: ISafeStorageOptions;

  protected dumpIntervalMs?: number;

  protected dumpIntervalRunning?: NodeJS.Timeout | number;

  protected secretStorageConnection?: InstanceType<typeof SecretStorage>;

  protected tableData: TSafeStorageStoredDataType<
    ESAFE_STORAGE_STORAGE_TYPE
  > = [] as TSafeStorageStoredDataType<ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG>;

  protected appendData: TSafeStorageStoredDataType<
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
  }

  get secretStorageOptions() {
    const { options } = this;
    const { storageDumpProvider } = options as ISafeStorageOptions;

    return {
      storageProviderName:
        storageDumpProvider || SAFE_STORAGE_DUMP_PROVIDER_DEFAULT,
    };
  }

  checkOptions(options: ISafeStorageOptions): Error | true {
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
    const checkOptionsResult = this.checkOptions(options);
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
    this.storageName = `${SAFE_STORAGE_STORAGE_NAME_COMMON_PREFIX}${name}`;
    this.dumpIntervalMs = dumpInterval;
    return true;
  }

  async loadOverallTable(): Promise<TSafeStorageStoredDataType<TYPE> | Error> {
    const { storageName, secretStorageConnection } = this;
    const data = await (secretStorageConnection as SecretStorage).get(
      storageName
    );

    if (data instanceof Error) {
      return this.setErrorStatus(data);
    }
    try {
      return JSON.parse(data) as TSafeStorageStoredDataType<TYPE>;
    } catch (err) {
      return this.setErrorStatus(err);
    }
  }

  setTableData(tableData: TSafeStorageStoredDataType<TYPE>) {
    const { storageType } = this;

    if (storageType === ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG) {
      this.tableData = tableData as TSafeStorageStoredDataType<
        ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG
      >;
      this.appendData = [] as TSafeStorageStoredDataType<
        ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG
      >;
    } else {
      this.tableData = tableData as TSafeStorageStoredDataType<
        ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE
      >;
      this.appendData = {} as TSafeStorageStoredDataType<
        ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE
      >;
    }
  }

  async reloadData(): Promise<boolean | Error> {
    const tableData = await this.loadOverallTable();

    if (tableData instanceof Error) {
      return this.setErrorStatus(tableData);
    }
    this.setTableData(tableData);
    return true;
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

  async writeOverallTableData(
    dataStringified: string | null
  ): Promise<Error | boolean> {
    const { secretStorageConnection, storageName } = this;

    if (dataStringified !== null && typeof dataStringified !== 'string') {
      const err = new Error(
        `The table overall data must be null or string, but ${typeof dataStringified} was given`
      );

      console.error(err);
      return err;
    }
    return (secretStorageConnection as InstanceType<typeof SecretStorage>).set(
      storageName,
      dataStringified
    );
  }

  async writeDump(
    data: TSafeStorageStoredDataType<TYPE>
  ): Promise<Error | boolean> {
    if (this.checkIfEmptyData(data)) {
      return true;
    }

    const { secretStorageConnection } = this;
    let dataStringified: string;

    try {
      dataStringified = JSON.stringify(data);
    } catch (err) {
      return this.setErrorStatus(err);
    }

    return this.writeOverallTableData(dataStringified);
  }

  async dumpDataAppendLog(): Promise<Error | true> {
    const tableOverallDataDump = await this.loadOverallTable();
    const { appendData } = this;

    if (tableOverallDataDump instanceof Error) {
      return this.setErrorStatus(tableOverallDataDump);
    }
    if (!(tableOverallDataDump instanceof Array)) {
      return this.setErrorStatus('A wrong data type was read from storage');
    }

    const tableOverallData = [
      ...tableOverallDataDump,
      ...(appendData as TSafeStorageStoredDataType<
        ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG
      >),
    ] as TSafeStorageStoredDataType<ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG>;
    const writeDumpResult = this.writeDump(tableOverallData);

    if (writeDumpResult instanceof Error) {
      return writeDumpResult as Error;
    }
    this.tableData = tableOverallData;
    this.appendData = [];
    return true;
  }

  async dumpDataKeyValueStorage(): Promise<Error | boolean> {
    const tableOverallDataDump = await this.loadOverallTable();
    const { appendData } = this;

    if (tableOverallDataDump instanceof Error) {
      return this.setErrorStatus(tableOverallDataDump);
    }
    if (!(tableOverallDataDump instanceof Array)) {
      return this.setErrorStatus('A wrong data type was read from storage');
    }

    const tableOverallData = {
      ...tableOverallDataDump,
      ...(appendData as TSafeStorageStoredDataType<
        ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE
      >),
    };
    const writeDumpResult = this.writeDump(tableOverallData);

    if (writeDumpResult instanceof Error) {
      return writeDumpResult as Error;
    }
    this.tableData = tableOverallData;
    this.appendData = [];
    return true;
  }

  dumpData = async (): Promise<Error | boolean> => {
    const { storageType, appendData, status } = this;

    if (status === ESAFE_STORAGE_PROVIDER_STATUS.WRITING_DUMP) {
      // if already writing a dump
      return true;
    }
    if (this.checkIfEmptyData(appendData)) {
      return true;
    }
    this.setStatus(ESAFE_STORAGE_PROVIDER_STATUS.WRITING_DUMP);

    let resultWritingDump;

    if (storageType === ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE) {
      resultWritingDump = await this.dumpDataKeyValueStorage();
    } else {
      resultWritingDump = await this.dumpDataAppendLog();
    }
    if (resultWritingDump === true) {
      this.setStatus(ESAFE_STORAGE_PROVIDER_STATUS.CONNECTED_TO_STORAGE);
      // TODO - ??reload all the data from storage
      // to guarantee the data persistance
      return true;
    }
    return this.setErrorStatus(
      'An unknown error has occurred while writing the dump of the data to the SecretStorage'
    );
  };

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

  /**
   * connect to the secret storage
   * and preload a data dumped
   * from it
   */
  async connect(): Promise<boolean | Error> {
    const { credentials } = this.options as ISafeStorageOptions;
    const connectionToTheSecretStorage = this.createSecretStorageInstance();

    if (connectionToTheSecretStorage instanceof Error) {
      return connectionToTheSecretStorage;
    }

    const connectionToSecretStorageResult = await connectionToTheSecretStorage.authorize(
      credentials
    );

    if (connectionToSecretStorageResult instanceof Error) {
      return this.setErrorStatus(connectionToSecretStorageResult);
    }

    const preloadDataResult = await this.reloadData();

    if (preloadDataResult instanceof Error) {
      return preloadDataResult;
    }
    return this.startInterval();
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
        return true;
      }
    }
    return this.setErrorStatus(
      "Can't dump the table's data before disconnected"
    );
  }

  castDataToType<D extends string | number | object>(
    data: string | null | undefined,
    dataType: ESAFE_STORAGE_RETURN_TYPE = ESAFE_STORAGE_RETURN_TYPE.STRING
  ): Error | undefined | D {
    if (data == null) {
      return undefined;
    }

    try {
      switch (dataType) {
        case ESAFE_STORAGE_RETURN_TYPE.NUMBER:
          return Number(data) as D;
        case ESAFE_STORAGE_RETURN_TYPE.OBJECT:
          return JSON.parse(data);
        default:
          return data as D;
      }
    } catch (err) {
      return err;
    }
  }

  getDataAppendLogStorage<D extends TSafeStorageDataTypesAvail>(
    key: TSafeStorageKeyType,
    dataType: ESAFE_STORAGE_RETURN_TYPE = ESAFE_STORAGE_RETURN_TYPE.STRING
  ): Error | undefined | D {
    const { tableData } = this;
    const keyType = typeof key;

    if (keyType !== 'number') {
      const err = new Error(
        `For append log storage only a numeric keys are available but ${keyType} type key was given`
      );

      console.error(err);
      return err;
    }
    return this.castDataToType(
      (tableData as TSafeStorageStoredDataTypeAppendLog)[key as number],
      dataType
    );
  }

  getDataKeyValueStorage<D extends TSafeStorageDataTypesAvail>(
    key: TSafeStorageKeyType,
    dataType: ESAFE_STORAGE_RETURN_TYPE = ESAFE_STORAGE_RETURN_TYPE.STRING
  ): Error | undefined | D {
    const { tableData } = this;
    const keyType = typeof key;

    if (keyType !== 'string') {
      const err = new Error(
        `For append log storage only a string keys are available but ${keyType} type key was given`
      );

      console.error(err);
      return err;
    }
    return this.castDataToType(
      (tableData as TSafeStorageStoredDataTypeKeyValue)[key as string],
      dataType
    );
  }

  get<D extends TSafeStorageDataTypesAvail>(
    key: TSafeStorageKeyType,
    dataType: ESAFE_STORAGE_RETURN_TYPE = ESAFE_STORAGE_RETURN_TYPE.STRING
  ): Error | undefined | D {
    const { storageType } = this;

    if (storageType === ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG) {
      return this.getDataAppendLogStorage<D>(key, dataType);
    }
    if (storageType === ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE) {
      return this.getDataKeyValueStorage<D>(key, dataType);
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

  async setDataAppendLogStorage(
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

    const { appendData, tableData } = this;

    if (!key) {
      (tableData as TSafeStorageStoredDataTypeAppendLog).push(data || null);
      (appendData as TSafeStorageStoredDataTypeAppendLog).push(data || null);
    } else {
      (tableData as TSafeStorageStoredDataTypeAppendLog)[key as number] =
        data || null;
      (appendData as TSafeStorageStoredDataTypeAppendLog)[key as number] =
        data || null;
    }
    return true;
  }

  async setDataKeyValueStorage(
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

    const { appendData, tableData } = this;

    (tableData as TSafeStorageStoredDataTypeKeyValue)[key as string] =
      data || null;
    (appendData as TSafeStorageStoredDataTypeKeyValue)[key as string] =
      data || null;
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
    if (storageType === ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG) {
      return this.setDataAppendLogStorage(data, key);
    }
    if (storageType === ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE) {
      return this.setDataKeyValueStorage(data, key);
    }
    const err = new Error('An unknown storage type');

    console.error(err);
    return err;
  }

  async remove(key: TSafeStorageKeyType) {
    return this.set(null, key);
  }

  async clear(): Promise<Error | boolean> {
    return this.writeOverallTableData(null);
  }
}
