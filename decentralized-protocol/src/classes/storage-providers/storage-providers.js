import { STORAGE_PROVIDERS } from './storage-providers.const';
export const getStorageProviderClassByName = (storageProviderName) => {
    return STORAGE_PROVIDERS[storageProviderName];
};
export const getStorageProviderByName = (storageProviderName) => {
    const StorageProviderClass = getStorageProviderClassByName(storageProviderName);
    if (StorageProviderClass) {
        return new StorageProviderClass();
    }
};
//# sourceMappingURL=storage-providers.js.map