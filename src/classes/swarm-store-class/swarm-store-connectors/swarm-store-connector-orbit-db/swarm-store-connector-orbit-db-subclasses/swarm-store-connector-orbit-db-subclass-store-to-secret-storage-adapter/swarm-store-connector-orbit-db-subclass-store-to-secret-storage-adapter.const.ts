import { TSecretStoreConfiguration } from 'classes/secret-storage-class/secret-storage-class.types';
import { SECRET_STORAGE_PROVIDERS_NAME } from 'classes/secret-storage-class/secret-storage-class.const';

export const SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_DEFAULT_OPTIONS_SECRET_STORAGE: Required<TSecretStoreConfiguration> = {
    storageProviderName: SECRET_STORAGE_PROVIDERS_NAME.LEVEL_JS,
}