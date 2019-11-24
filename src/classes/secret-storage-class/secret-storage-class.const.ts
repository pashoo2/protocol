import { ILocalStorageProviderTable } from './secret-storage-class.types';
import { SecretStorageProviderLocalStorage } from './secret_storage_providers/secret-storage-local-storage-provider';
import { SecretStorageProvideSessionStorage } from './secret_storage_providers/secret-storage-session-storage-provider';
import { SecretStorageProviderLevelJS } from './secret_storage_providers/secret-storage-level-js-provider/secret-storage-level-js-provider';
import { SecretStorageProviderLocalForage } from './secret_storage_providers/secret-storage-local-forage-provider';

export const SECRET_STORAGE_PROVIDERS_NAME = {
  LOCAL_STORAGE: 'LOCAL_STORAGE',
  SESSION_STORAGE: 'SESSION_STORAGE',
  LEVEL_JS: 'LEVEL_JS',
  LOCAL_FORAGE: 'LOCAL_FORAGE',
};

export const SECRET_STORAGE_PROVIDERS: ILocalStorageProviderTable = {
  [SECRET_STORAGE_PROVIDERS_NAME.LOCAL_STORAGE]: SecretStorageProviderLocalStorage,
  [SECRET_STORAGE_PROVIDERS_NAME.SESSION_STORAGE]: SecretStorageProvideSessionStorage,
  [SECRET_STORAGE_PROVIDERS_NAME.LEVEL_JS]: SecretStorageProviderLevelJS,
  [SECRET_STORAGE_PROVIDERS_NAME.LOCAL_FORAGE]: SecretStorageProviderLocalForage,
};

export const SECRET_STORAGE_PASSWORD_MIN_LENGTH = 6;

export const SECRET_STORAGE_PROVIDERS_NAMES = Object.values(
  SECRET_STORAGE_PROVIDERS_NAME
);

export const SECRET_STORAGE_STATUS = {
  STOPPED: undefined,
  RUNNING: 'RUNNING',
  CONNECTING: 'CONNECTING',
  ERROR: 'ERROR',
};
