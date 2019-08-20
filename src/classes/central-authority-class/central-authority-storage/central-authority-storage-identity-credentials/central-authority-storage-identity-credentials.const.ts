import { TSecretStoreConfiguration } from 'classes/secret-storage-class/secret-storage-class.types';

export const CA_IDENTITY_CREDENTIALS_STORAGE_NAME =
  'CA_IDENTITY_CREDENTIALS_STORAGE';

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

export const CA_IDENTITY_CREDENTIALS_STORAGE_CONFIGURATION: TSecretStoreConfiguration = {
  storageProviderName: `__${CA_IDENTITY_CREDENTIALS_STORAGE_FULL_NAME}_STORAGE`,
};
