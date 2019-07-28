import {
  TSecretStoreCredentials,
  TSecretStoreConfiguration,
  TSecretStorageProviderName,
} from 'classes/secret-storage-class/secret-storage-class.types';
import {
  ESAFE_STORAGE_STORAGE_TYPE,
  ESAFE_STORAGE_PROVIDER_STATUS,
} from './safe-storage-class.const';

export type TSafeStorageProviderName = TSecretStorageProviderName;

export type TSafeStorageStorageAppendLogDataType = string[];

export type TSafeStorageKeyType = string | number;

export type TSafeStorageDataType = string | object | number | null;

export type TSafeStorageStoredDataTypeKeyValue = {
  [keyName: string]: TSafeStorageDataType;
};

export type TSafeStorageStoredDataTypeAppendLog = Array<TSafeStorageDataType>;

export type TSafeStorageStoredDataType<
  T extends ESAFE_STORAGE_STORAGE_TYPE
> = T extends ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG
  ? TSafeStorageStoredDataTypeAppendLog
  : TSafeStorageStoredDataTypeKeyValue;

export interface ISafeStorageOptions {
  name: string; // a unique name for the storage
  credentials: TSecretStoreCredentials; // credentials for access to the secret storage
  dumpIntervalMs?: number; // how often a dump of a data must be saved in secret storage
  storageDumpProvider?: TSafeStorageProviderName; // name for the provider where the dumps will be stored
  storageType?: ESAFE_STORAGE_STORAGE_TYPE; // storage data type
}

export type TSafeStorageDataTypesAvail = string | number | object;

export type TSafeStorageEvents = {
  status: ESAFE_STORAGE_PROVIDER_STATUS;
};
