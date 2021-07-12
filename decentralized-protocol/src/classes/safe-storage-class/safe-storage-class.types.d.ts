import { ISecretStoreCredentials, TSecretStorageProviderName } from 'classes/secret-storage-class/secret-storage-class.types';
import { ESAFE_STORAGE_STORAGE_TYPE, ESAFE_STORAGE_PROVIDER_STATUS } from './safe-storage-class.const';
export declare type TSafeStorageProviderName = TSecretStorageProviderName;
export declare type TSafeStorageStorageAppendLogDataType = string[];
export declare type TSafeStorageKeyType = string | number;
export declare type TSafeStorageDataType = string | object | number | null;
export declare type TSafeStorageStoredDataTypeKeyValue = {
    [keyName: string]: TSafeStorageDataType;
};
export declare type TSafeStorageStoredDataTypeAppendLog = Array<TSafeStorageDataType>;
export declare type TSafeStorageStoredDataType<T extends ESAFE_STORAGE_STORAGE_TYPE> = T extends ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG ? TSafeStorageStoredDataTypeAppendLog : TSafeStorageStoredDataTypeKeyValue;
export interface ISafeStorageOptions {
    name: string;
    credentials: ISecretStoreCredentials;
    dumpIntervalMs?: number;
    storageDumpProvider?: TSafeStorageProviderName;
    storageType?: ESAFE_STORAGE_STORAGE_TYPE;
}
export declare type TSafeStorageDataTypesAvail = string | number | object;
export declare type TSafeStorageEvents = {
    status: ESAFE_STORAGE_PROVIDER_STATUS;
};
//# sourceMappingURL=safe-storage-class.types.d.ts.map