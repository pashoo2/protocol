import { SecretStorageProviderLocalForage } from 'classes/storage-providers/storage-local-forage-provider';
import { SecretStorageProviderLevelJS } from 'classes/storage-providers/storage-level-js-provider/secret-storage-level-js-provider';
import { SecretStorageProvideSessionStorage } from 'classes/storage-providers/storage-session-storage-provider';
import { SecretStorageProviderLocalStorage } from 'classes/storage-providers/storage-local-storage-provider';
import { ILocalStorageProviderTable } from './storage-providers.types';

export const STORAGE_PROVIDERS_NAME = {
  LOCAL_STORAGE: 'LOCAL_STORAGE',
  SESSION_STORAGE: 'SESSION_STORAGE',
  LEVEL_JS: 'LEVEL_JS',
  LOCAL_FORAGE: 'LOCAL_FORAGE',
};

export const STORAGE_PROVIDERS: ILocalStorageProviderTable = {
  [STORAGE_PROVIDERS_NAME.LOCAL_STORAGE]: SecretStorageProviderLocalStorage,
  [STORAGE_PROVIDERS_NAME.SESSION_STORAGE]: SecretStorageProvideSessionStorage,
  [STORAGE_PROVIDERS_NAME.LEVEL_JS]: SecretStorageProviderLevelJS,
  [STORAGE_PROVIDERS_NAME.LOCAL_FORAGE]: SecretStorageProviderLocalForage,
};

export const STORAGE_PROVIDERS_NAMES = Object.values(STORAGE_PROVIDERS_NAME);
