import { ILocalStorageProviderTable } from './secret-storage-class.types';
import { SecretStorageProviderLocalStorage } from './secret_storage_providers/secret-storage-local-storage-provider';
import { SecretStorageProvideSessionStorage } from './secret_storage_providers/secret-storage-session-storage-provider';

export const SECRET_STORAGE_PROVIDERS_NAME = {
  LOCAL_STORAGE: 'LOCAL_STORAGE',
  SESSION_STORAGE: 'SESSION_STORAGE',
};

export const SECRET_STORAGE_PROVIDERS: ILocalStorageProviderTable = {
  [SECRET_STORAGE_PROVIDERS_NAME.LOCAL_STORAGE]: SecretStorageProviderLocalStorage,
  [SECRET_STORAGE_PROVIDERS_NAME.SESSION_STORAGE]: SecretStorageProvideSessionStorage,
};

export const SECRET_STORAGE_PROVIDERS_NAMES = Object.values(
  SECRET_STORAGE_PROVIDERS_NAME
);

export const SECRET_STORAGE_STATUS = {
  STOPPED: undefined,
  RUNNING: 'RUNNING',
  CONNECTING: 'CONNECTING',
  ERROR: 'ERROR',
};
