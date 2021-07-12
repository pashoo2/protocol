/// <reference types="node" />
import { ISafeStorageOptions, TSafeStorageStoredDataType, TSafeStorageStoredDataTypeKeyValue, TSafeStorageStoredDataTypeAppendLog, TSafeStorageDataTypesAvail, TSafeStorageKeyType, TSafeStorageDataType, TSafeStorageStorageAppendLogDataType } from './safe-storage-class.types';
import { SecretStorage } from 'classes/secret-storage-class/secret-storage-class';
import { ESAFE_STORAGE_PROVIDER_STATUS, ESAFE_STORAGE_STORAGE_TYPE } from './safe-storage-class.const';
declare const SafeStorage_base: {
    new (): {
        status?: ESAFE_STORAGE_PROVIDER_STATUS;
        errorOccurred?: Error;
        statusEmitter: import("../basic-classes/event-emitter-class-base").EventEmitter<{
            status: typeof ESAFE_STORAGE_PROVIDER_STATUS;
        }>;
        clearError(): void;
        clearStatus(): void;
        clearState(): void;
        setStatus: (status: ESAFE_STORAGE_PROVIDER_STATUS) => () => void;
        setErrorStatus: (err: string | Error) => Error;
    };
    error(err: string | Error): Error;
};
export declare class SafeStorage<TYPE extends ESAFE_STORAGE_STORAGE_TYPE> extends SafeStorage_base {
    static storagesNames: string[];
    static checkIfNameIsExists(storageName: string): boolean;
    static addStorageName(storageName: string): void;
    protected storageName: string;
    protected storageNameAppendLog: string;
    protected options?: ISafeStorageOptions;
    protected dumpIntervalMs?: number;
    protected dumpIntervalRunning?: NodeJS.Timeout | number;
    protected secretStorageConnection?: InstanceType<typeof SecretStorage>;
    protected tableData: TSafeStorageStoredDataType<ESAFE_STORAGE_STORAGE_TYPE>;
    protected appendData: TSafeStorageStoredDataType<ESAFE_STORAGE_STORAGE_TYPE>;
    protected appendDataTemp: TSafeStorageStoredDataType<ESAFE_STORAGE_STORAGE_TYPE>;
    protected storageType?: ESAFE_STORAGE_STORAGE_TYPE;
    constructor(options: ISafeStorageOptions);
    get secretStorageOptions(): {
        storageProviderName: string;
    };
    get isStorageBusy(): boolean;
    connect(): Promise<boolean | Error>;
    checkOptionsAreValid(options: ISafeStorageOptions): Error | true;
    setOptions(options: ISafeStorageOptions): Error | true;
    reloadOverallTableData(): Promise<boolean | Error>;
    disconnect(): Promise<Error | true>;
    waitingStorageFreed(): Promise<boolean | undefined> | true;
    castDataToAppendLogType(data?: null | TSafeStorageStoredDataType<TYPE>): TSafeStorageStoredDataTypeAppendLog | Error;
    castDataToKeyValueType(data?: null | TSafeStorageStoredDataType<TYPE>): TSafeStorageStoredDataTypeKeyValue | Error;
    castDataToStorageType(data?: Error | null | TSafeStorageStoredDataType<TYPE>): TSafeStorageStoredDataType<TYPE> | Error;
    parseDataFromStorage<D>(data: string | undefined | Error): Error | D | undefined;
    mergeData: (result: TSafeStorageStoredDataType<TYPE> | Error, dataToAppend: string | TSafeStorageStoredDataType<TYPE>) => TSafeStorageStoredDataType<TYPE> | Error;
    loadDataFromTable<D>(storageName: string): Promise<D | undefined | Error>;
    loadDataFromStorageAppendLog(): Promise<TSafeStorageStorageAppendLogDataType | undefined | Error>;
    loadAndParseDataFromAppendLogStorage(): Promise<TSafeStorageStoredDataType<TYPE> | undefined | Error>;
    loadDataFromMainStorage(): Promise<TSafeStorageStoredDataType<TYPE> | undefined | Error>;
    loadOverallData(): Promise<TSafeStorageStoredDataType<TYPE> | Error>;
    saveDataToStorage(storageName: string, dataStringified?: string | null): Promise<boolean | Error>;
    stringifyDataForStorage(dataAppendLog: TSafeStorageDataType[] | TSafeStorageStoredDataTypeKeyValue): Promise<string | null | Error>;
    writeOverallDataToMainTable(data?: string | null | TSafeStorageDataType[] | TSafeStorageStoredDataTypeKeyValue): Promise<boolean | Error>;
    writeDataToStorageAppengLog(data?: string | null | TSafeStorageStorageAppendLogDataType): Promise<Error | boolean>;
    clearAppendLogData(): Promise<boolean | Error>;
    loadOverallTable(): Promise<TSafeStorageStoredDataType<TYPE> | Error>;
    setTableData(tableData?: TSafeStorageStoredDataType<TYPE>): void;
    createSecretStorageInstance(): Error | SecretStorage;
    startInterval(): boolean | Error;
    checkIfEmptyData(data: TSafeStorageStoredDataType<ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG | ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE>): boolean;
    writeDump(data: TSafeStorageStoredDataTypeAppendLog | TSafeStorageStoredDataTypeKeyValue): Promise<Error | boolean>;
    dumpAllStorageTypes(): Promise<Error | boolean>;
    dumpDataAppendLog(): Promise<Error | true>;
    dumpDataKeyValueStorage(): Promise<Error | boolean>;
    dumpData: () => Promise<Error | boolean>;
    checkIfMemoryAppendLogOverflow(): Promise<void>;
    getDataFromAppendLogStorage<D extends TSafeStorageDataTypesAvail>(key: TSafeStorageKeyType): Error | null | undefined | D;
    getDataFromKeyValueStorage<D extends TSafeStorageDataTypesAvail>(key: TSafeStorageKeyType): Error | null | undefined | D;
    get<D extends TSafeStorageDataTypesAvail>(key: TSafeStorageKeyType): Error | undefined | null | D;
    checkDataIsSafetyForSave(data: any): boolean | Error;
    normilizeData(data: TSafeStorageDataTypesAvail | undefined | null): string | null | undefined;
    setDataInAppendLogStorage(data: TSafeStorageDataTypesAvail | undefined | null, key?: TSafeStorageKeyType): Promise<Error | boolean>;
    setDataInKeyValueStorage(data: TSafeStorageDataTypesAvail | undefined | null, key?: TSafeStorageKeyType): Promise<Error | boolean>;
    set(data: TSafeStorageDataTypesAvail | undefined | null, key?: TSafeStorageKeyType): Promise<Error | boolean>;
    remove(key: TSafeStorageKeyType): Promise<boolean | Error>;
    clear(): Promise<Error | boolean>;
}
export {};
//# sourceMappingURL=safe-storage-class.d.ts.map