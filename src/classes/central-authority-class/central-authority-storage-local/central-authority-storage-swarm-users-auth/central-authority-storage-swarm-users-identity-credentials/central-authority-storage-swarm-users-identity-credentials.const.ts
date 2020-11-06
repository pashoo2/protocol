import { IOpenStorageConfiguration } from './../../../../open-storage/open-storage.types';
import { STORAGE_PROVIDERS_NAME } from 'classes/storage-providers/storage-providers.const';

export const CA_IDENTITY_CREDENTIALS_STORAGE_NAME_OPTIONS_MAX_LENGTH = 30;

export const CA_IDENTITY_CREDENTIALS_STORAGE_NAME = '_CICS';

export const CA_IDENTITY_CREDENTIALS_STORAGE_VERSION = '01';

export const CA_IDENTITY_CREDENTIALS_STORAGE_FULL_NAME = `${CA_IDENTITY_CREDENTIALS_STORAGE_VERSION}${CA_IDENTITY_CREDENTIALS_STORAGE_NAME}`;

export const CA_IDENTITY_CREDENTIALS_STORAGE_STATUS = {
  NEW: 'NEW',
  CONNECTING: 'CONNECTING', // connecting to the secret storage
  CONNECTED: 'CONNECTED', // connected to the secret storage
  CONNECTION_FAILED: 'CONNECTION FAILED', // connection to the secret storage was failed by any reason
  ERROR: 'ERROR', // any error caused by a method execution
  PENDING: 'PENDING', // pending for any async operation and can't do any other operation till the current operation not ended up
  DISCONNECTED: 'disconnected', // disconnected from the storage and a state was cleared
};

export const CA_IDENTITY_CREDENTIALS_STORAGE_DATABASE_NAME = 'CA_IDENTITY_CREDENTIALS_STORAGE';

export const CA_IDENTITY_CREDENTIALS_STORAGE_CONFIGURATION: IOpenStorageConfiguration = {
  storageProviderName: STORAGE_PROVIDERS_NAME.LOCAL_FORAGE,
  options: {
    dbName: CA_IDENTITY_CREDENTIALS_STORAGE_DATABASE_NAME,
  },
};

export const CA_IDENTITY_CREDENTIALS_STORAGE_READ_CACHE_CAPACITY = 300;

export const CA_IDENTITY_CREDENTIALS_STORAGE_READ_RAW_CACHE_CAPACITY = 2000;
