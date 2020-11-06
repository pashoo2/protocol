import { STORAGE_PROVIDERS } from './storage-providers.const';
import { StorageProvider, IStorageProvider, TStorageProviderName } from './storage-providers.types';

export const getStorageProviderClassByName = (storageProviderName: TStorageProviderName): undefined | IStorageProvider => {
  return STORAGE_PROVIDERS[storageProviderName];
};

export const getStorageProviderByName = (storageProviderName: TStorageProviderName): undefined | StorageProvider => {
  const StorageProviderClass = getStorageProviderClassByName(storageProviderName);

  if (StorageProviderClass) {
    return new StorageProviderClass();
  }
};
