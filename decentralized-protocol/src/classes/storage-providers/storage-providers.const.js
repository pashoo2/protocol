import { SecretStorageProviderLocalForage } from "./storage-local-forage-provider";
import { SecretStorageProviderLevelJS } from "./storage-level-js-provider/secret-storage-level-js-provider";
import { SecretStorageProvideSessionStorage } from "./storage-session-storage-provider";
import { SecretStorageProviderLocalStorage } from "./storage-local-storage-provider";
export const STORAGE_PROVIDERS_NAME = {
    LOCAL_STORAGE: 'LOCAL_STORAGE',
    SESSION_STORAGE: 'SESSION_STORAGE',
    LEVEL_JS: 'LEVEL_JS',
    LOCAL_FORAGE: 'LOCAL_FORAGE',
};
export const STORAGE_PROVIDERS = {
    [STORAGE_PROVIDERS_NAME.LOCAL_STORAGE]: SecretStorageProviderLocalStorage,
    [STORAGE_PROVIDERS_NAME.SESSION_STORAGE]: SecretStorageProvideSessionStorage,
    [STORAGE_PROVIDERS_NAME.LEVEL_JS]: SecretStorageProviderLevelJS,
    [STORAGE_PROVIDERS_NAME.LOCAL_FORAGE]: SecretStorageProviderLocalForage,
};
export const STORAGE_PROVIDERS_NAMES = Object.values(STORAGE_PROVIDERS_NAME);
//# sourceMappingURL=storage-providers.const.js.map