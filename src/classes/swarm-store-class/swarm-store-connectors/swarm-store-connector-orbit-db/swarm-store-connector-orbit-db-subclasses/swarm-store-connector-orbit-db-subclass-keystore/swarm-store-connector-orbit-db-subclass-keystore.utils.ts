import { TOrbitDBKeystoreOptions } from 'orbit-db-keystore';
import { SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter } from '../swarm-store-connector-orbit-db-subclasses-cache/swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter';
import { SWARM_STORAGE_CONNECTOR_ORBIT_DB_SUBLASS_KEY_STORE_DEFAULT_DB_NAME } from './swarm-store-connector-orbit-db-subclass-keystore.const';
import { ISecretStoreCredentials } from '../../../../../secret-storage-class/secret-storage-class.types';

/**
 * extends the options provided to the OrbitDBKeystore by
 * the store which is an instance of the SecretStorage
 *
 * @param {TOrbitDBKeystoreOptions} options
 * @returns {TOrbitDBKeystoreOptions}
 * @throws
 */
export const extendsOptionsWithStore = (options: TOrbitDBKeystoreOptions): TOrbitDBKeystoreOptions => {
  if (!options) {
    throw new Error('Options must be provided');
  }
  if (typeof options !== 'object') {
    throw new Error('Options must be an object');
  }

  const { credentials } = options;
  let dbName: string = SWARM_STORAGE_CONNECTOR_ORBIT_DB_SUBLASS_KEY_STORE_DEFAULT_DB_NAME;

  if (typeof options.store === 'string') {
    dbName = options.store;
  } else if (typeof options.path === 'string') {
    dbName = options.path;
  }

  const adapterToSecretStore = new SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter(
    { dbName },
    credentials as ISecretStoreCredentials
  );

  return Object.assign({}, options, { store: adapterToSecretStore });
};
