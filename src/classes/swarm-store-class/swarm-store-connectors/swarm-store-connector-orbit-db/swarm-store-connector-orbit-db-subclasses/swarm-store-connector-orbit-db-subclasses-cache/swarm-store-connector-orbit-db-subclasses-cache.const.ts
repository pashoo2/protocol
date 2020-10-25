import { ISecretStoreConfiguration } from '../../../../../secret-storage-class';
import { STORAGE_PROVIDERS_NAME } from '../../../../../storage-providers';

export enum SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_OPEN_STORAGE_ADAPTER_STATUS {
  OPEN = 'open',
  CLOSE = 'close',
}

export const SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_STORAGE_ADAPTER_DEFAULT_OPTIONS_STORAGE: Required<ISecretStoreConfiguration> = {
  storageProviderName: STORAGE_PROVIDERS_NAME.LOCAL_FORAGE,
};
