import { ILocalStorageProviderTable } from './secret-storage-class.types';
import { SecretStorageProviderLocalStorage } from './secret_storage_providers/secret-storage-local-storage-provider';
import { ownValueOf } from 'types/helper.types';

export const SECRET_STORAGE_PROVIDERS_NAME = {
  LOCAL_STORAGE: 'LOCAL_STORAGE',
};

export const SECRET_STORAGE_PROVIDERS: ILocalStorageProviderTable = {
  [SECRET_STORAGE_PROVIDERS_NAME.LOCAL_STORAGE]: SecretStorageProviderLocalStorage,
};

export const SECRET_STORAGE_PROVIDERS_NAMES = Object.values(
  SECRET_STORAGE_PROVIDERS_NAME
);
