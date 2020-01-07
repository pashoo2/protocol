import { STORAGE_PROVIDERS_NAME } from 'classes/storage-providers/storage-providers.const';
import { ISecretStoreConfiguration } from 'classes/secret-storage-class/secret-storage-class.types';

export const SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_DEFAULT_OPTIONS_SECRET_STORAGE: Required<ISecretStoreConfiguration> = {
  storageProviderName: STORAGE_PROVIDERS_NAME.LOCAL_FORAGE,
};

export enum SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS {
  OPEN = 'open',
  CLOSE = 'close',
}
